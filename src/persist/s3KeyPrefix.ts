export function getS3KeyPrefix(): string {
  const date = new Date(Date.now());

  return `${date.getFullYear()}/${date.getMonth() + 1}`;
}
