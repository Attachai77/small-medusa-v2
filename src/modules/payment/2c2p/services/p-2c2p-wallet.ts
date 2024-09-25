import Payment2C2PBase from "../core/base";
import { ChannelCode } from "../types";

class Payment2C2PWalletProviderService extends Payment2C2PBase {
  static PROVIDER = "e-wallet";

  get paymentIntentOptions() {
    return {
      payment_method_types: [ "e-wallet" ],
      payment_channel: [
        ChannelCode.TRUEMONEY,
        ChannelCode.LINE,
        ChannelCode.SHPPAY,
      ],
    };
  }
}

export default Payment2C2PWalletProviderService;