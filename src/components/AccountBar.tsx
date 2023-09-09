import { AccountBarDropdown } from "./AccountDropdown"

export function AccountBar() {
  return (
    <div
      className={`absolute left-0 top-0 z-10 flex min-h-[80px] w-full flex-row items-center gap-4 overflow-x-scroll bg-slate-400 px-4 sm:static sm:max-w-[75px] sm:flex-col sm:bg-gray-200 sm:px-2`}
    >
      <AccountBarDropdown />
    </div>
  )
}
