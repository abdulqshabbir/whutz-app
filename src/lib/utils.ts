import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}
