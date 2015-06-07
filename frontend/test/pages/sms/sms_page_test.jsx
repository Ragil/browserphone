import _ from 'lodash';
import React from 'react/addons';
import ReactSpinner from 'src/common/spin/spin';
import SmsPage from 'src/pages/sms/sms_page';
import messages from 'src/pages/sms/sms_model';
import contacts from 'src/common/contacts/contacts';
let testUtils = React.addons.TestUtils;

describe('CallPage', () => {
  let page, sandbox, to='1234', from='4321';

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    messages.fetch = sandbox.stub();
    contacts.fetch = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('loader', () => {
    beforeEach(() => {
      page = testUtils.renderIntoDocument(
        <SmsPage />
      );
    });

    it('should fetch contact and messages', () => {
      expect(messages.fetch.callCount).to.equal(1);
      expect(_.isFunction(messages.fetch.firstCall.args[0].callback)).to.be.true();
      expect(contacts.fetch.callCount).to.equal(1);
      expect(_.isFunction(contacts.fetch.firstCall.args[0])).to.be.true();
    });

    it('should show spinner', () => {
      let spinner = testUtils.scryRenderedComponentsWithType(page, 'ReactSpinner');
      expect(spinner).to.be.ok();
    });

    it('should show loading sms message', () => {
      let spinner = testUtils.findRenderedDOMComponentWithClass(page, 'sms-page-loading-message');
      expect(spinner.props.children).to.equal('Loading SMS');
    });

    it('should show loading contacts message', () => {
      messages.fetch.firstCall.args[0].callback();
      let spinner = testUtils.findRenderedDOMComponentWithClass(page, 'sms-page-loading-message');
      expect(spinner.props.children).to.equal('Loading Contacts');
    });
  });
});
