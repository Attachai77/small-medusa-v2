import { ContactUsForm, Response, Status, Code } from "../../types/contact-us";
import { MedusaService } from "@medusajs/utils"
import ContactUsModel from "./models/contact-us";

// @ts-ignore
class ContactUsModuleService extends MedusaService({
  ContactUsModel,
}){
  async save(data: ContactUsForm): Promise<Response> {
    try {
      await this.createContactUsModels(data)

      return {
        status: Status.SUCCESS,
        code: Code.SUCCESS,
        message: "Contact form submitted successfully."
      };
    } catch (error) {
      return {
        status: Status.BADREQUEST,
        code: Code.BADREQUEST,
        message: error.message,
      };
    }
  }
}

export default ContactUsModuleService