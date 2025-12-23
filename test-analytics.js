import { analytics } from '../src/lib/analytics';

// Test script to simulate analytics tracking
async function testAnalytics() {
  console.log('Testing Analytics Tracking...');

  // Simulate page views
  await analytics.trackPageView('/', 'Home Page');
  await analytics.trackPageView('/about', 'About Us');
  await analytics.trackPageView('/blog', 'Blog');
  await analytics.trackPageView('/portfolio', 'Portfolio');

  // Simulate events
  await analytics.trackEvent('click', 'hero_cta_button', { section: 'hero' });
  await analytics.trackEvent('click', 'contact_form_submit', { form: 'contact' });
  await analytics.trackEvent('download', 'portfolio_pdf', { file: 'portfolio.pdf' });
  await analytics.trackEvent('error', 'form_validation_error', { field: 'email', error: 'invalid_format' });

  console.log('Analytics tracking test completed!');
}

// Run the test
testAnalytics().catch(console.error);