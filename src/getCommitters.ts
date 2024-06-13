export async function getCommitters(octokit: any, owner: string, repo: string, pull_number: number) {
  const { data: commits } = await octokit.rest.pulls.listCommits({
    owner,
    repo,
    pull_number,
  });

  const committers = new Set<string>();
  for (const commit of commits) {
    if (commit.author) {
      committers.add(commit.author.login);
    }
  }
  return committers;
}
