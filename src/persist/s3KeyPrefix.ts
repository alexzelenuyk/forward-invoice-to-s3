export function getS3KeyPrefix(): string {
    const date = new Date()

    return `${date.getFullYear()}/${date.getMonth()+1}`
}