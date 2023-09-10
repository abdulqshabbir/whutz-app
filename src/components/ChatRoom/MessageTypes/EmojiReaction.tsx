/* eslint-disable @next/next/no-img-element */
export function EmojiReactions({
  emojies,
  messageId,
}: {
  emojies: string | null
  messageId: number
}) {
  if (!emojies) return null

  const emojiesArray = emojies.split(",")
  return emojiesArray.map((emoji) => (
    <img
      key={`${emoji}-${messageId}`}
      src={`/assets/emojies/${emoji}.png`}
      alt=""
      width="25px"
      className="my-1 rounded-md bg-amber-800 p-1"
    />
  ))
}
