import Payment2C2PBase from "../core/base";
import { GroupCode } from "../types";

class Payment2C2PInternetBankingProviderService extends Payment2C2PBase {
  static PROVIDER = "internet-banking";

  get paymentIntentOptions() {
    return {
      payment_method_types: [ "internet-banking" ],
      payment_channel: [
        GroupCode.IMBANK
      ],
    };
  }
}

export default Payment2C2PInternetBankingProviderService;