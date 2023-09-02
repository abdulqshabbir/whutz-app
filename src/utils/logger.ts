function logger({
  message,
  data,
  level,
  email,
}: {
  message: string
  data: object | null | undefined
  level: "info" | "warn" | "error"
  email?: string | null
}) {
  if (!level || level === "info") {
    console.log(message, data, email)
  } else if (level === "warn") {
    console.warn(message, data, email)
  } else if (level === "error") {
    console.error(message, data, email)
  }
}

export { logger }
