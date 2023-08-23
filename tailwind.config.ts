import defaultTheme from "tailwindcss/defaultTheme"
import { type Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Montserrat: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config
