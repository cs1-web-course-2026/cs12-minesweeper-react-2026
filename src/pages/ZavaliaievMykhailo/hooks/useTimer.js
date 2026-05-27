import { useEffect, useState } from 'react'

export function useTimer(isRunning, resetKey) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    setSeconds(0)
  }, [resetKey])

  useEffect(() => {
    if (!isRunning) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setSeconds((currentSeconds) => currentSeconds + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isRunning])

  return seconds
}
