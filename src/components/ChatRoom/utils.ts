import { type Channel } from "pusher-js"
import { format, fromUnixTime } from "date-fns"
import { type Message } from "./ChatHistory"

export function convertTimestampToTime(timestamp: number) {
  try {
    const result = format(fromUnixTime(timestamp), "hh:mm a")
    return result
  } catch (e) {
    console.error(e)
  }
}

export function bindWithChunking(
  channel: Channel,
  event: string,
  callback: ({ data }: { data: Message[] }) => void
) {
  channel.bind("message", callback)
  const events: Record<string, unknown> = {}
  type ChunkedData = {
    id: string
    index: number
    chunk: string
    final: boolean
  }
  channel.bind("chunked-" + event, (data: ChunkedData) => {
    if (!events.hasOwnProperty(data.id)) {
      events[data.id] = { chunks: [], receivedFinal: false }
    }
    type EventChunks = {
      chunks: string[]
      receivedFinal: boolean
    }
    const ev = events[data.id] as EventChunks
    ev.chunks[data.index] = data.chunk
    if (data.final) ev.receivedFinal = true
    if (
      ev.receivedFinal &&
      ev.chunks.length === Object.keys(ev.chunks).length
    ) {
      callback({
        data: JSON.parse(ev.chunks.join("")) as unknown as Message[],
      })
      delete events[data.id]
    }
  })
}
