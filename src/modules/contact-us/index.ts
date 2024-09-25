import ContactUsModuleService from "./service";
import { Module } from "@medusajs/utils";
import ContactUsModel from "./models/contact-us";

export const CONTACT_US_MODULE = "contactUsModuleService";

// @ts-ignore
export default Module(CONTACT_US_MODULE, {
	service: ContactUsModuleService,
	// @ts-ignore
	model: ContactUsModel,
});
