import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cnfwxaexxzkepsefodso.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZnd4YWV4eHprZXBzZWZvZHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODgzNDcsImV4cCI6MjA4MTk2NDM0N30.GtvV0ttAWfiiZMSrXdpiQk98CAnq5-mRNsUUlUkVXg8'
);

// Test script to populate sample IP history data
async function populateTestData() {
  console.log('Populating test IP history data...');

  try {
    // Sample IP hashes (these would be real SHA-256 hashes in production)
    const testIPs = [
      'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
      'b77a5c561934e089f3f6e88c8c6b0c3c4e4c5d6e7f8g9h0i1j2k3l4m5n6o7p8',
      'c88b6d672045f19a428f5978f0ed5fc9b15b2f4fff2fb18f999f97f8f8b8bf4',
      'd99c7e783156g2ab539g6a89g1fe6gdac26c3g5ggg3gc29gaaa0a8g9g9c8c5',
      'e00d8f894267h3bc64ah7b9ah2gf7heb37d4h6hhh4hd3ahbb1b9hah0ada9d6'
    ];

    const sampleSessions = [
      {
        session_id: 'session_1_' + Date.now(),
        ip_hash: testIPs[0],
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        browser: 'chrome',
        device: 'desktop',
        country: 'United States',
        region: 'California',
        city: 'San Francisco',
        referrer: 'https://google.com',
        is_bot: false,
        total_page_views: 5,
        total_session_duration: 420
      },
      {
        session_id: 'session_2_' + Date.now(),
        ip_hash: testIPs[1],
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
        browser: 'safari',
        device: 'mobile',
        country: 'United Kingdom',
        region: 'England',
        city: 'London',
        referrer: 'https://facebook.com',
        is_bot: false,
        total_page_views: 3,
        total_session_duration: 180
      },
      {
        session_id: 'session_3_' + Date.now(),
        ip_hash: testIPs[2],
        user_agent: 'Mozilla/5.0 (Linux; Android 11; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        browser: 'chrome',
        device: 'mobile',
        country: 'Canada',
        region: 'Ontario',
        city: 'Toronto',
        referrer: 'https://linkedin.com',
        is_bot: false,
        total_page_views: 7,
        total_session_duration: 600
      },
      {
        session_id: 'session_4_' + Date.now(),
        ip_hash: testIPs[3],
        user_agent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        browser: 'other',
        device: 'unknown',
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        referrer: '',
        is_bot: true,
        total_page_views: 1,
        total_session_duration: 0
      },
      {
        session_id: 'session_5_' + Date.now(),
        ip_hash: testIPs[4],
        user_agent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
        browser: 'safari',
        device: 'tablet',
        country: 'Australia',
        region: 'New South Wales',
        city: 'Sydney',
        referrer: 'https://twitter.com',
        is_bot: false,
        total_page_views: 4,
        total_session_duration: 300
      }
    ];

    // Insert sessions
    for (const session of sampleSessions) {
      const { data: sessionData, error: sessionError } = await supabase
        .from('visitor_sessions')
        .upsert(session, { onConflict: 'session_id' })
        .select('id')
        .single();

      if (sessionError) {
        console.error('Error inserting session:', sessionError);
        continue;
      }

      console.log(`Inserted session for IP: ${session.ip_hash}`);

      // Add some page views for each session
      const pageViews = [
        { page_path: '/', page_title: 'Home', session_id: sessionData.id },
        { page_path: '/about', page_title: 'About Us', session_id: sessionData.id },
        { page_path: '/portfolio', page_title: 'Portfolio', session_id: sessionData.id },
        { page_path: '/blog', page_title: 'Blog', session_id: sessionData.id },
        { page_path: '/contact', page_title: 'Contact', session_id: sessionData.id }
      ].slice(0, session.total_page_views);

      for (let i = 0; i < pageViews.length; i++) {
        const { error: pvError } = await supabase
          .from('page_views')
          .insert({
            ...pageViews[i],
            timestamp: new Date(Date.now() - (pageViews.length - i) * 60000).toISOString()
          });

        if (pvError) console.error('Error inserting page view:', pvError);
      }

      // Add some events for each session
      if (!session.is_bot) {
        const events = [
          { event_type: 'click', event_name: 'hero_cta', session_id: sessionData.id, page_path: '/' },
          { event_type: 'click', event_name: 'contact_form', session_id: sessionData.id, page_path: '/contact' },
          { event_type: 'download', event_name: 'portfolio.pdf', session_id: sessionData.id, page_path: '/portfolio' }
        ];

        for (const event of events) {
          const { error: eventError } = await supabase
            .from('analytics_events')
            .insert({
              ...event,
              timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
            });

          if (eventError) console.error('Error inserting event:', eventError);
        }
      }
    }

    console.log('Test data populated successfully!');
    console.log('You can now visit /admin/analytics/ip to see the IP history.');

  } catch (error) {
    console.error('Error populating test data:', error);
  }
}

// Run the script
populateTestData().catch(console.error);