import { useEffect, useState } from 'react'

export function useTimer(isRunning, resetCounter) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    setElapsedSeconds(0)
  }, [resetCounter])

  useEffect(() => {
    if (!isRunning) {
      return undefined
    }

    const intervalIdentifier = setInterval(() => {
      setElapsedSeconds((previousSeconds) => previousSeconds + 1)
    }, 1000)

    return () => {
      clearInterval(intervalIdentifier)
    }
  }, [isRunning])

  return elapsedSeconds
}
