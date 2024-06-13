import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fs from 'fs'
import { parseCodeowners } from './parseCodeowners'
import { getCommitters } from './getCommitters'
import { getReviewers } from './getReviewers'
import { findEligibleApprover } from './findEligibleApprover'

async function run() {
  try {
    const token = core.getInput('GITHUB_TOKEN', { required: true })
    const octokit = github.getOctokit(token)
    const context = github.context
    const repo = context.repo.repo
    const owner = context.repo.owner
    const pull_number = context.payload.pull_request?.number

    if (!pull_number) {
      core.setFailed('No pull request number found.')
      return
    }

    const codeownersContent = fs.readFileSync('CODEOWNERS', 'utf8')
    const codeowners = parseCodeowners(codeownersContent)

    const { data: pullRequest } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number
    })

    const committers = await getCommitters(octokit, owner, repo, pull_number)
    const reviewers = await getReviewers(octokit, owner, repo, pull_number)

    const eligibleApprover = findEligibleApprover(
      committers,
      reviewers,
      codeowners
    )

    if (eligibleApprover) {
      core.info(`Eligible approver found: ${eligibleApprover}`)
    } else {
      core.setFailed('No eligible approver found.')
    }
  } catch (error) {
    core.setFailed((error as any).message)
  }
}

run()
