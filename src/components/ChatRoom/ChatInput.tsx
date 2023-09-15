import { friendEmailAtom, channelAtom, replyToIdAtom } from "@/atoms"
import { useUser } from "@/hooks/useUser"
import { type RouterInputs, trpc } from "@/utils/api"
import { useAtom, useAtomValue } from "jotai"
import { Input } from "../ui/InputField"
import { useState, useRef } from "react"
import { GrAttachment } from "react-icons/gr"
import { Textarea } from "../ui/TextArea"
import { useUserIdFromEmail } from "@/hooks/useUserIdFromEmai"

export type SendMessageInput = RouterInputs["messages"]["send"]

export function ChatInput({
  sendMessage,
}: {
  sendMessage: (message: SendMessageInput) => void
}) {
  const { email } = useUser()
  const [newMessage, setNewMessage] = useState("")
  const [friendEmail] = useAtom(friendEmailAtom)
  const [channel] = useAtom(channelAtom)
  const replyToId = useAtomValue(replyToIdAtom)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const presignedPostMutation = trpc.s3.createPreSignedPostUrl.useMutation()
  const { userId } = useUserIdFromEmail()

  async function uploadToS3(file: File | undefined) {
    if (!file) return

    const result = await presignedPostMutation.mutateAsync()

    if (!result.ok || !result.presignedFields || !result.presignedUrl) return

    const fields = {
      ...result.presignedFields,
      "Content-Disposition": "inline",
      "Content-Type": file.type,
      file,
    }
    const url = result.presignedUrl

    const formData = new FormData()
    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, value)
    }
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        if (email && userId) {
          sendMessage({
            fromEmail: email,
            toEmail: friendEmail,
            channel,
            content: `${url}${userId}/${result.fileId}`,
            type: "image",
          })
        }
      })
      .catch((e) => {
        console.error(e)
        return
      })
  }

  return (
    <div className="relative">
      {replyToId && (
        <div className="absolute top-[-20px] w-full rounded-t-md bg-gray-300 pl-4 text-sm text-gray-500">
          Replying to: abdulqshabbir@gmail.com
        </div>
      )}
      <Textarea
        className="m-0 h-full bg-gray-50 p-4"
        style={{ resize: "none" }}
        placeholder="Write a message"
        value={newMessage}
        onChange={(e) => {
          setNewMessage(e.target.value)
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            if (email) {
              sendMessage({
                fromEmail: email,
                toEmail: friendEmail,
                channel: channel,
                content: newMessage.trimEnd(),
                type: "text",
                replyToId: replyToId ?? undefined,
              })
              setNewMessage("")
            }
          }
        }}
      />
      <GrAttachment
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          cursor: "pointer",
        }}
        onClick={() => {
          fileInputRef.current?.click()
        }}
      />
      <Input
        type="file"
        ref={fileInputRef}
        onChange={(e) => void uploadToS3(e.target.files?.[0])}
        style={{
          display: "none",
        }}
      />
    </div>
  )
}
