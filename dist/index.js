"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const fs = __importStar(require("fs"));
const parseCodeowners_1 = require("./parseCodeowners");
const getCommitters_1 = require("./getCommitters");
const getReviewers_1 = require("./getReviewers");
const findEligibleApprover_1 = require("./findEligibleApprover");
async function run() {
    var _a;
    try {
        const token = core.getInput('GITHUB_TOKEN', { required: true });
        const octokit = github.getOctokit(token);
        const context = github.context;
        const repo = context.repo.repo;
        const owner = context.repo.owner;
        const pull_number = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.number;
        if (!pull_number) {
            core.setFailed('No pull request number found.');
            return;
        }
        const codeownersContent = fs.readFileSync('CODEOWNERS', 'utf8');
        const codeowners = (0, parseCodeowners_1.parseCodeowners)(codeownersContent);
        const { data: pullRequest } = await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number
        });
        const committers = await (0, getCommitters_1.getCommitters)(octokit, owner, repo, pull_number);
        const reviewers = await (0, getReviewers_1.getReviewers)(octokit, owner, repo, pull_number);
        const eligibleApprover = (0, findEligibleApprover_1.findEligibleApprover)(committers, reviewers, codeowners);
        if (eligibleApprover) {
            core.info(`Eligible approver found: ${eligibleApprover}`);
        }
        else {
            core.setFailed('No eligible approver found.');
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
