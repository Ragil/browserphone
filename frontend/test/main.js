/**
 * Test suite entry point
 */

// Babel Polyfill
import 'babel-core/polyfill';
import './pages/contact/phone_page_test';
import './pages/sms/sms_page_test';
import './pages/voice/call/call_page_test';

describe('main', () => {
  // placeholder so karma works
  it('placeholder test', () => {});
})
