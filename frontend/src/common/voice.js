import $ from 'jquery';
import env from 'env';
import gapi from 'src/common/gapi';
import Twilio from 'src/common/twilio';
import global from 'src/common/global';

export default {
  call : (number) => {
    global.call.To = number;
    Twilio.Device.connect({
      To: number,
      Direction: 'outbound',
      'google-token': gapi.auth.getToken().access_token
    });
  }
}
