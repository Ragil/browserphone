import env from 'env';
import gapi from 'src/common/gapi';
import global from 'src/common/global';
import PhonePage from 'src/pages/contact/phone_page';
import React from 'react/addons';
import Twilio from 'src/common/twilio';
let testUtils = React.addons.TestUtils;

describe('PhonePage', () => {
  let page, sandbox,
      number = '+123456789',
      access_token = 'token';

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    Twilio.Device = {
      connect : sandbox.stub()
    };
    gapi.auth = {
      getToken : sandbox.stub().returns({
        access_token : access_token
      })
    };
    page = testUtils.renderIntoDocument(
      <PhonePage number={number} />
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('callNumber', () => {
    it('should set global state', () => {
      expect(global.call.From).to.not.be.ok();
      expect(global.call.To).to.not.be.ok();

      let span = testUtils.findRenderedDOMComponentWithClass(page, 'glyphicon-phone');
      testUtils.Simulate.click(span);

      expect(global.call.From).to.equal(env.phoneNumber);
      expect(global.call.To).to.equal(number);
    })
  });
});
