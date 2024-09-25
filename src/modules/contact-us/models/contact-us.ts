import { model } from "@medusajs/utils";

const ContactUsModel = model.define("contact_us", {
	id: model.id().primaryKey(),
	name: model.text(),
	email: model.text(),
	message: model.text(),
});

export default ContactUsModel;
