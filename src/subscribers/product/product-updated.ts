import { type SubscriberConfig } from "@medusajs/medusa";

export default async function productUpdateHandler() {
	console.log("A product was updated");
}

// subscriber config
export const config: SubscriberConfig = {
	event: "product.updated",
};
