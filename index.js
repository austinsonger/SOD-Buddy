const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const path = require("path");

async function run() {
  try {
    const token = core.getInput("token");
    const repo = core.getInput("repo");
    const owner = core.getInput("owner");
    const pull_number = core.getInput("pull_number");

    const octokit = github.getOctokit(token);

    // Get committers from the pull request
    const { data: commits } = await octokit.rest.pulls.listCommits({
      owner,
      repo,
      pull_number,
    });

    const committers = new Set(commits.map((commit) => commit.author.login));

    // Read the APPROVER file
    const approverFilePath = path.join(__dirname, "APPROVER.md");
    const approvers = fs
      .readFileSync(approverFilePath, "utf-8")
      .split("\n")
      .filter((line) => line.startsWith("*"))
      .map((line) => {
        const [username, priority] = line.slice(2).split(",");
        return { username, priority: parseInt(priority, 10) };
      });

    // Remove ineligible approvers
    const eligibleApprovers = approvers.filter(
      (approver) => !committers.has(approver.username)
    );

    // Sort approvers by priority
    eligibleApprovers.sort((a, b) => a.priority - b.priority);

    if (eligibleApprovers.length === 0) {
      core.setFailed("No eligible approvers found.");
      return;
    }

    const newApprover = eligibleApprovers[0].username;
    core.setOutput("new_approver", newApprover);
    console.log(`New approver assigned: ${newApprover}`);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
