// index.test.ts
import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fs from 'fs'
import { parseCodeowners } from './parseCodeowners'
import { getCommitters } from './getCommitters'
import { getReviewers } from './getReviewers'
import { findEligibleApprover } from './findEligibleApprover'
import { run } from './index'

jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('fs')
jest.mock('./parseCodeowners')
jest.mock('./getCommitters')
jest.mock('./getReviewers')
jest.mock('./findEligibleApprover')

describe('run', () => {
  it('should call core.setFailed when no pull request number is found', async () => {
    github.context.payload.pull_request = null

    await run()

    expect(core.setFailed).toHaveBeenCalledWith('No pull request number found.')
  })

  // Add more tests here for other scenarios...
})
