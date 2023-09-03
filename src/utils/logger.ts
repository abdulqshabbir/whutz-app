function logger({
  message,
  data,
  level,
  email,
}: {
  message: string
  data: object | null | undefined
  level: "info" | "warn" | "error"
  email: string | null | undefined
}) {
  if (process.env.NODE_ENV === "test") return
  if (process.env.NODE_ENV === "development") return
  if (!level || level === "info") {
    console.log(message, data, `\nUser email: ${email}`)
  } else if (level === "warn") {
    console.warn(message, data, `\nUser email: ${email}`)
  } else if (level === "error") {
    console.error(message, data, `\nUser email: ${email}`)
  }
}

export { logger }
