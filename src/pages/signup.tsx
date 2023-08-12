import { Button } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

const SignUp = ({}) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="min-w-[500px] p-4">
        <CardHeader className="mb-4">
          <CardTitle className="text-3xl">Sign In</CardTitle>
          <CardDescription>
            Choose your preferred sign in method
          </CardDescription>
          <Separator />
        </CardHeader>
        <CardContent className="mt-4 flex flex-col gap-2">
          <Button variant={"outline"} className="w-full text-lg font-light">
            <Image
              width={15}
              height={15}
              src="/assets/google.svg"
              alt=""
              className="mr-2"
            />
            <span>Google</span>
          </Button>
          <Button variant={"outline"} className="w-full text-lg font-light">
            <Image
              width={12}
              height={12}
              src="/assets/facebook-f.svg"
              alt=""
              className="mr-2"
            />
            <span>Facebook</span>
          </Button>
          <Button variant={"outline"} className="w-full text-lg font-light">
            <Image
              width={15}
              height={15}
              src="/assets/github.svg"
              alt=""
              className="mr-2"
            />
            <span>Github</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUp
