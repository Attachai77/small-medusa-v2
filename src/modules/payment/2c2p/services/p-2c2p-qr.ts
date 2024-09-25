import Payment2C2PBase from "../core/base";
import { ChannelCode } from "../types";

class Payment2C2PQrProviderService extends Payment2C2PBase {
  static PROVIDER = "qr-payment";

  get paymentIntentOptions() {
    return {
      payment_method_types: ["qr-payment"],
      payment_channel: [ChannelCode.PPQR],
    };
  }
}

export default Payment2C2PQrProviderService;