const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export function getS3KeyPrefix(): string {
  const date = new Date(Date.now());

  return `${date.getFullYear()}/${months[date.getMonth()]}/${date.getDate()}`;
}

export function getS3Key(messageId: string, filename: string) {
  return getS3KeyPrefix().concat('/', messageId, '/', filename);
}
