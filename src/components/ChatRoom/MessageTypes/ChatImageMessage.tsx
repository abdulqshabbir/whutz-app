
export function ChatImageMessage({ imageUrl }: { imageUrl: string }) {
  return (
    <a href={imageUrl} target="_blank">
      <img alt="" src={imageUrl} width="300px" height="auto" />
    </a>
  )
}
