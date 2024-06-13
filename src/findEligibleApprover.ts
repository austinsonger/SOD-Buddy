export function findEligibleApprover(committers: Set<string>, reviewers: Set<string>, codeowners: { [key: string]: number }) {
  const sortedCodeowners = Object.entries(codeowners).sort(([, a], [, b]) => a - b);

  for (const [user, priority] of sortedCodeowners) {
    if (!committers.has(user) && !reviewers.has(user)) {
      return user;
    }
  }
  return null;
}
