import { atom } from "jotai"
import { type Message } from "@/components/ChatRoom/ChatHistory"
import { createRef } from "react"

export const friendEmailAtom = atom("")
export const channelAtom = atom("")
export const messagesAtom = atom<Message[]>([])
export const lastMessageRefAtom = atom(createRef<HTMLDivElement>())
export const replyToIdAtom = atom<number | null>(null)
