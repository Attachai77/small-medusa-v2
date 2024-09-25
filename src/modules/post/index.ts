import PostModuleService from "./service";
import { Module } from "@medusajs/utils";
import PostModel from "./models/post";

export const POST_MODULE = "postModuleService";

export default Module(POST_MODULE, {
	service: PostModuleService,
	model: PostModel,
});
