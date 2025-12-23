import { supabase } from '@/integrations/supabase/client'

class AnalyticsTracker {
  private sessionId: string
  private supabaseUrl: string

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.warn('Failed to get IP address:', error)
      return 'unknown'
    }
  }

  async trackPageView(pagePath: string, pageTitle?: string, referrer?: string) {
    try {
      const ip = await this.getClientIP()
      const userAgent = navigator.userAgent

      const response = await fetch(`${this.supabaseUrl}/functions/v1/track-analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          pagePath,
          pageTitle,
          referrer: referrer || document.referrer,
          userAgent,
          ip,
          eventType: 'page_view'
        })
      })

      const result = await response.json()
      if (!result.success) {
        console.warn('Analytics tracking failed:', result.error)
      }
    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }

  async trackEvent(eventType: 'click' | 'download' | 'error' | 'custom', eventName: string, eventData?: Record<string, any>) {
    try {
      const ip = await this.getClientIP()
      const userAgent = navigator.userAgent
      const pagePath = window.location.pathname

      const response = await fetch(`${this.supabaseUrl}/functions/v1/track-analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          pagePath,
          userAgent,
          ip,
          eventType,
          eventName,
          eventData
        })
      })

      const result = await response.json()
      if (!result.success) {
        console.warn('Event tracking failed:', result.error)
      }
    } catch (error) {
      console.warn('Event tracking error:', error)
    }
  }

  // Track time spent on page
  trackTimeOnPage(pagePath: string) {
    const startTime = Date.now()

    const trackOnUnload = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      this.trackEvent('custom', 'time_on_page', { pagePath, timeSpent })
    }

    window.addEventListener('beforeunload', trackOnUnload)
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        trackOnUnload()
      }
    })

    return () => {
      window.removeEventListener('beforeunload', trackOnUnload)
      window.removeEventListener('visibilitychange', trackOnUnload)
    }
  }
}

export const analytics = new AnalyticsTracker()