import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface TrackingData {
  sessionId: string
  pagePath: string
  pageTitle?: string
  referrer?: string
  userAgent: string
  ip: string
  eventType?: 'page_view' | 'click' | 'download' | 'error' | 'custom'
  eventName?: string
  eventData?: Record<string, any>
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

// Bot detection patterns
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /headless/i,
  /chrome-lighthouse/i,
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /slackbot/i
]

function isBot(userAgent: string): boolean {
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent))
}

function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (ua.includes('chrome') && !ua.includes('edg')) return 'chrome'
  if (ua.includes('firefox')) return 'firefox'
  if (ua.includes('safari') && !ua.includes('chrome')) return 'safari'
  if (ua.includes('edg')) return 'edge'
  if (ua.includes('opera')) return 'opera'
  return 'other'
}

function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return 'mobile'
  if (ua.includes('tablet') || ua.includes('ipad')) return 'tablet'
  return 'desktop'
}

async function getGeoLocation(ip: string) {
  try {
    // Using a free IP geolocation service
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city`)
    const data = await response.json()
    return {
      country: data.country || 'Unknown',
      region: data.regionName || 'Unknown',
      city: data.city || 'Unknown'
    }
  } catch (error) {
    console.error('Geo lookup failed:', error)
    return { country: 'Unknown', region: 'Unknown', city: 'Unknown' }
  }
}

function hashIP(ip: string): string {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + Deno.env.get('IP_SALT') || 'salt')
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const data: TrackingData = await req.json()
    const { sessionId, pagePath, pageTitle, referrer, userAgent, ip, eventType = 'page_view', eventName, eventData } = data

    // Check if bot
    const bot = isBot(userAgent)
    if (bot) {
      return new Response(JSON.stringify({ success: true, bot: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const ipHash = hashIP(ip)
    const browser = getBrowser(userAgent)
    const device = getDeviceType(userAgent)
    const geo = await getGeoLocation(ip)

    // Upsert visitor session
    const { data: session, error: sessionError } = await supabase
      .from('visitor_sessions')
      .upsert({
        session_id: sessionId,
        ip_hash: ipHash,
        user_agent: userAgent,
        browser,
        device,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        referrer,
        is_bot: false,
        last_visit_at: new Date().toISOString()
      }, {
        onConflict: 'session_id',
        ignoreDuplicates: false
      })
      .select('id')
      .single()

    if (sessionError) throw sessionError

    const sessionIdFromDb = session.id

    // Update session stats
    await supabase.rpc('increment_session_stats', { session_id: sessionIdFromDb })

    if (eventType === 'page_view') {
      // Insert page view
      const { error: pageViewError } = await supabase
        .from('page_views')
        .insert({
          session_id: sessionIdFromDb,
          page_path: pagePath,
          page_title: pageTitle,
          referrer
        })

      if (pageViewError) throw pageViewError
    } else {
      // Insert event
      const { error: eventError } = await supabase
        .from('analytics_events')
        .insert({
          session_id: sessionIdFromDb,
          event_type: eventType,
          event_name: eventName,
          event_data: eventData || {},
          page_path: pagePath
        })

      if (eventError) throw eventError
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Analytics tracking error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})