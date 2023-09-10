import { AccountBarDropdown } from "./AccountDropdown"

export function AccountBar() {
  return (
    <div
      className={`no-scrollbar fixed left-0 top-0 z-10 flex min-h-[60px] w-full flex-row items-center gap-4 overflow-x-auto bg-slate-400 px-4 py-2 sm:static sm:flex sm:h-full sm:max-w-[75px] sm:flex-col sm:bg-gray-200 sm:px-2 sm:py-0`}
    >
      <AccountBarDropdown />
    </div>
  )
}
