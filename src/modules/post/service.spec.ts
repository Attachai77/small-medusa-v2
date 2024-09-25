import PostModuleService from "./service";

describe("PostModuleService", () => {
	let service: PostModuleService;

	beforeEach(() => {
		service = new PostModuleService();
	});

	test('should return "Hello, world!" from getMessage', () => {
		expect(service.getMessage()).toBe("Hello, world!");
	});
});
