import { useEffect, useState } from 'react'

export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Check on initial load
    checkScreenSize()

    // Add event listener for resize events
    window.addEventListener('resize', checkScreenSize)

    // Clean up the event listener on unmount
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [breakpoint])

  return isMobile
}