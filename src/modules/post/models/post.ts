import { model } from "@medusajs/utils";

// @ts-ignore
const PostModel = model.define("post", {
	// @ts-ignore
	id: model.id().primaryKey(),
	// @ts-ignore
	title: model.text(),
	// @ts-ignore
	short_content: model.text(),
});

export default PostModel;
