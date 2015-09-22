import CallPage from 'src/pages/voice/call/call_page';
import CallerPage from 'src/pages/voice/call/caller/caller_page';
import React from 'react/addons';
let testUtils = React.addons.TestUtils;


describe('CallPage', () => {
  let page, sandbox, conn, to='1234', from='4321';

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    conn = {
      isMuted : sandbox.stub(),
      accept : sandbox.stub(),
      status : sandbox.stub()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('pending', () => {
    beforeEach(() => {
      conn.status.returns('pending');
      page = testUtils.renderIntoDocument(
        <CallPage to={to} from={from} connection={conn} />
      );
    });

    it('should render reject, ignore, accept button', () => {
      let actions = testUtils.findRenderedDOMComponentWithClass(page,
        'call-page-actions');
      let btns = testUtils.scryRenderedDOMComponentsWithTag(actions, 'button');
      expect(btns.length).to.equal(3);
      expect(btns[0].props.children).to.equal('Answer');
      expect(btns[1].props.children).to.equal('Ignore');
      expect(btns[2].props.children).to.equal('Reject');
    });

  });

  describe('open', () => {
    beforeEach(() => {
      conn.status.returns('open');
      page = testUtils.renderIntoDocument(
        <CallPage to={to} from={from} connection={conn} />
      );
    });

    it('should render sound, hangup button', () => {
      let actions = testUtils.findRenderedDOMComponentWithClass(page,
        'call-page-actions');
      let btns = testUtils.scryRenderedDOMComponentsWithTag(actions, 'button');
      expect(btns.length).to.equal(2);
      expect(testUtils.isElementOfType(btns[0].props.children, 'span')).to.be.true();
      expect(btns[1].props.children).to.equal('Hangup');
    });
  });

});
