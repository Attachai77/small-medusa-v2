import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { ContactUsForm } from "../../../types/contact-us";
import { CONTACT_US_MODULE } from "../../../modules/contact-us";
import ContactUsModuleService from "../../../modules/contact-us/service";

export const POST = async (
  req: MedusaRequest<ContactUsForm>,
  res: MedusaResponse
) => {
  const logger = req.scope.resolve("logger");
	const contactUsModuleService: ContactUsModuleService = req.scope.resolve(
    CONTACT_US_MODULE
	)
  try {
    const result = await contactUsModuleService.save(req.body);
    res.json(result);
  } catch (error) {
    logger.error("Error submit form", error);
    res.status(400).json({ success: false });
  }
};
