import Payment2C2PBase from "../core/base";
import { ChannelCode } from '../types'

class Payment2C2PCreditProviderService extends Payment2C2PBase {
  static PROVIDER = "credit-card";

  get paymentIntentOptions() {
    return {
      payment_method_types: ["credit-card"],
      payment_channel: [ChannelCode.CC],
    };
  }
}

export default Payment2C2PCreditProviderService;