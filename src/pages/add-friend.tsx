import Head from "next/head"
import Script from "next/script"
import { ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog"
import { useState } from "react"
import { Input } from "@/components/ui/InputField"
import { Button } from "@/components/ui/Button"

export function AddFriendWrapper({
  name,
  image,
  children,
}: {
  name: string
  image: string
  userId: string
  children: React.ReactNode
}) {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <form>
      <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
        <AlertDialogContent className="max-w-[90%] sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-left">
              {name}
            </AlertDialogTitle>
            <AlertDialogTitle className="text-left">
              {image}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={() => {
              console.log("clicked")
            }}>
                  Add Friend
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
        <AlertDialogTrigger>
          {children}
        </AlertDialogTrigger>
      </AlertDialog>
    </form>
  )
}

export default function AddFriend() {
  const users = [
    {
      name: "Abdul",
      image: "https://avatars.githubusercontent.com/u/100000?s=460&u=8b9b7b0e9b5b9b5b9b5b9b5b9b5b9b5b9b5b9b5&v=4",
      userId: "some-id",
    },
    {
      name: "Umar",
      image: "https://avatars.githubusercontent.com/u/100000?s=460&u=8b9b7b0e9b5b9b5b9b5b9b5b9b5b9b5b9b5b9b5&v=4",
      userId: "some-id-2",
    },
    {
      name: "Abdul",
      image: "https://avatars.githubusercontent.com/u/100000?s=460&u=8b9b7b0e9b5b9b5b9b5b9b5b9b5b9b5b9b5b9b5&v=4",
      userId: "some-id",
    },
    {
      name: "Umar",
      image: "https://avatars.githubusercontent.com/u/100000?s=460&u=8b9b7b0e9b5b9b5b9b5b9b5b9b5b9b5b9b5b9b5&v=4",
      userId: "some-id-2",
    },
    {
      name: "Abdul",
      image: "https://avatars.githubusercontent.com/u/100000?s=460&u=8b9b7b0e9b5b9b5b9b5b9b5b9b5b9b5b9b5b9b5&v=4",
      userId: "some-id",
    },
    {
      name: "Umar",
      image: "https://avatars.githubusercontent.com/u/100000?s=460&u=8b9b7b0e9b5b9b5b9b5b9b5b9b5b9b5b9b5b9b5&v=4",
      userId: "some-id-2",
    },
    {
      name: "Abdul",
      image: "https://avatars.githubusercontent.com/u/100000?s=460&u=8b9b7b0e9b5b9b5b9b5b9b5b9b5b9b5b9b5b9b5&v=4",
      userId: "some-id",
    },
    {
      name: "Umar",
      image: "https://avatars.githubusercontent.com/u/100000?s=460&u=8b9b7b0e9b5b9b5b9b5b9b5b9b5b9b5b9b5b9b5&v=4",
      userId: "some-id-2",
    },
  ]
  return (
    <>
      <Head>
        <title>Whutz-App Friends</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script src="https://js.pusher.com/8.2.0/pusher.min.js" />
      <main className="flex h-screen flex-row sm:flex-row">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <ArrowLeft size={12} />
            <p>
              Add a Friend to Whutz-App
            </p>
          </div>

          <div>
            <Input type="input" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {users.map((user) => (
              <AddFriendWrapper
                key={user.userId}
                name={user.name}
                image={user.image}
                userId={user.userId}
              >
                <div key={user.userId} style={{ display: "flex" }} onClick={() => {
                  console.log("clicked")
                }}>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={user.image}
                      alt="@shadcn"
                      className="h-12 w-12 rounded-full"
                    />
                    <AvatarFallback className="h-[2rem] w-[2rem] rounded-full bg-blue-200 p-4 hover:bg-blue-300">
                      AS
                    </AvatarFallback>
                  </Avatar>
                  <p>{user.name}</p>
                </div>
              </AddFriendWrapper>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
