import { AccountBar } from "@/components/AccountBar"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { H1 } from "@/components/ui/typography/H1"
import { useAcceptFriendRequestMutation } from "@/hooks/useAcceptFriendRequestMutation"
import { usePendingInvitations } from "@/hooks/queries/usePendingFriendRequests"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import Head from "next/head"
import Script from "next/script"
import React from "react"

export default function FriendInvitations() {
  const { pendingFriends } = usePendingInvitations()
  const { acceptFriendRequest } = useAcceptFriendRequestMutation()

  const connections = [
    {
      name: "Hassan Djirdeh",
      image:
        "https://lh3.googleusercontent.com/a/AAcHTtdrt8hbeCCzrKSc8uor9FSMwbXJh-kcL1sepcXNvj0LZQ=s96-c",
    },
  ]
  return (
    <>
      <Head>
        <title>Whutz-App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script src="https://js.pusher.com/8.2.0/pusher.min.js" />
      <main className="flex h-screen sm:flex-row">
        <AccountBar />
        <div className="mx-auto mt-24 flex w-full flex-col gap-4 sm:m-0 sm:p-8">
          <H1 className="text-left text-xl lg:text-2xl">Manage invitations</H1>
          <Tabs defaultValue="invitations">
            <TabsList>
              <TabsTrigger
                value="invitations"
                className="data-[state=active]:bg-gray-200"
              >
                Pending Invitations
              </TabsTrigger>
              <TabsTrigger
                value="friends"
                className="data-[state=active]:bg-gray-200"
              >
                Friend Connections
              </TabsTrigger>
            </TabsList>
            <TabsContent value="invitations">
              {pendingFriends.map((inv, idx) => {
                const isLast = idx === pendingFriends.length - 1
                return (
                  <React.Fragment key={`${inv.pendingFriendImage}-${idx}`}>
                    <div
                      key={`${inv.pendingFriendEmail}-${idx}`}
                      className="flex items-center justify-between p-2"
                    >
                      <div className="flex items-center gap-8">
                        <Avatar className="cursor-pointer">
                          {inv.pendingFriendImage && (
                            <AvatarImage
                              src={inv.pendingFriendImage}
                              alt="@shadcn"
                              className="h-12 w-12 rounded-full"
                            />
                          )}
                          {!inv.pendingFriendImage && (
                            <AvatarFallback className="h-[2rem] w-[2rem] rounded-full bg-blue-200 p-4 hover:bg-blue-300">
                              AS
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>{inv.pendingFriendEmail}</div>
                      </div>
                      <div className="flex gap-4">
                        <Button
                          onClick={() =>
                            acceptFriendRequest({
                              senderEmail: inv.pendingFriendEmail,
                            })
                          }
                        >
                          Accept
                        </Button>
                        <Button variant={"outline"}>Reject</Button>
                      </div>
                    </div>
                    {!isLast && <Separator />}
                  </React.Fragment>
                )
              })}
            </TabsContent>
            <TabsContent value="friends">
              {connections.map((friend, idx) => {
                const isLast = idx === pendingFriends.length - 1
                return (
                  <React.Fragment key={`${friend.image}-${idx}`}>
                    <div
                      key={`${friend.image}-${idx}`}
                      className="flex items-center justify-between p-2"
                    >
                      <div className="flex items-center gap-8">
                        <Avatar className="cursor-pointer">
                          <AvatarImage
                            src={friend.image}
                            alt="@shadcn"
                            className="h-12 w-12 rounded-full"
                          />
                          <AvatarFallback className="h-[2rem] w-[2rem] rounded-full bg-blue-200 p-4 hover:bg-blue-300">
                            AS
                          </AvatarFallback>
                        </Avatar>
                        <div>{friend.name}</div>
                      </div>
                      <Button variant="outline">
                        Message {friend.name.split(" ")[0]}
                      </Button>
                    </div>
                    {!isLast && <Separator />}
                  </React.Fragment>
                )
              })}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}
