export async function getReviewers(octokit: any, owner: string, repo: string, pull_number: number) {
  const { data: reviews } = await octokit.rest.pulls.listReviews({
    owner,
    repo,
    pull_number,
  });

  const reviewers = new Set<string>();
  for (const review of reviews) {
    reviewers.add(review.user.login);
  }
  return reviewers;
}
