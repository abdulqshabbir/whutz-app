import { atom } from "jotai"
import { type Message } from "@/components/ChatHistory"

export const friendEmailAtom = atom("")
export const channelAtom = atom("")
export const messagesAtom = atom<Message[]>([])
