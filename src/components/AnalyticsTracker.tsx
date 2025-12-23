import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { analytics } from '@/lib/analytics'

const AnalyticsTracker = () => {
  const location = useLocation()

  useEffect(() => {
    // Track page view on route change
    const pageTitle = document.title
    analytics.trackPageView(location.pathname, pageTitle)

    // Track time on page
    const cleanup = analytics.trackTimeOnPage(location.pathname)

    return cleanup
  }, [location.pathname])

  return null
}

export default AnalyticsTracker