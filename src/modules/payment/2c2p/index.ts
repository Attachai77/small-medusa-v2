import { ModuleProviderExports } from "@medusajs/types";
import {
  Payment2C2PQrProviderService,
  Payment2C2PCreditProviderService,
  Payment2C2PWalletProviderService,
  Payment2C2PInternetBankingProviderService,
  Payment2C2PBillingProviderService
} from "./services";

const services = [
  Payment2C2PQrProviderService,
  Payment2C2PCreditProviderService,
  Payment2C2PWalletProviderService,
  Payment2C2PInternetBankingProviderService,
  Payment2C2PBillingProviderService
];

// @ts-ignore
const providerExport: ModuleProviderExports = {
  // @ts-ignore
  services,
};

export default providerExport;