export function parseCodeowners(content: string) {
  const lines = content.split('\n');
  const codeowners: { [key: string]: number } = {};

  for (const line of lines) {
    if (line.trim()) {
      const [user, priority] = line.split(',');
      codeowners[user.trim()] = parseInt(priority.trim(), 10);
    }
  }
  return codeowners;
}
