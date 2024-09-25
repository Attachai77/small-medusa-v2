import Payment2C2PBase from "../core/base";
import { ChannelCode, GroupCode } from "../types";

class Payment2C2PBillingProviderService extends Payment2C2PBase {
  static PROVIDER = "billing";

  get paymentIntentOptions() {
    return {
      payment_method_types: [ "billing" ],
      payment_channel: [
        GroupCode.BCTRL,
        GroupCode.OTCTR,
        GroupCode.WEBPAY
      ],
    };
  }
}

export default Payment2C2PBillingProviderService;