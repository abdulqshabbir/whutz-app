import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
  useRef,
} from "react"

export function useLoggerWithState<T>(
  initialState: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(initialState)
  const prevStateRef = useRef(initialState)

  useEffect(() => {
    console.log("prev state was: ", prevStateRef.current)
    console.log("state changed to: ", state)
    prevStateRef.current = state
  }, [state])

  return [state, setState]
}
