import { AccountBarDropdown } from "./AccountDropdown"

export function AccountBar() {
  return (
    <div
      className={`flex min-w-[75px] flex-col items-center gap-4 bg-gray-200`}
    >
      <AccountBarDropdown />
    </div>
  )
}
