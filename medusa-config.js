import {loadEnv, defineConfig, Modules} from "@medusajs/utils";

loadEnv(process.env.NODE_ENV, process.cwd());

const MEDUSA_BACKEND_URL =
    process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [];

module.exports = defineConfig({
    plugins,
    admin: {
        backendUrl: MEDUSA_BACKEND_URL,
    },
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        redisUrl: REDIS_URL,
        database_extra:
            process.env.NODE_ENV === "develop"
                ? {ssl: {rejectUnauthorized: false}}
                : {},
        http: {
            storeCors: process.env.STORE_CORS,
            adminCors: process.env.ADMIN_CORS,
            authCors: process.env.AUTH_CORS,
            jwtSecret: process.env.JWT_SECRET || "supersecret",
            cookieSecret: process.env.COOKIE_SECRET || "supersecret",
        },
    },
    modules: {
        [Modules.NOTIFICATION]: {
            resolve: "@medusajs/notification",
            options: {
                providers: [
                    // ...
                    {
                        resolve: "@medusajs/notification-sendgrid",
                        id: "sendgrid",
                        options: {
                            channels: ["email"],
                            api_key: process.env.SENDGRID_API_KEY,
                            from: process.env.SENDGRID_FROM,
                        },
                    },
                ],
            },
        },
        [Modules.CACHE]: {
            resolve: "@medusajs/cache-redis",
            options: {
                redisUrl: REDIS_URL,
            },
        },
        [Modules.EVENT_BUS]: {
            resolve: "@medusajs/event-bus-redis",
            options: {
                redisUrl: REDIS_URL,
            },
        },
        [Modules.WORKFLOW_ENGINE]: {
            resolve: "@medusajs/workflow-engine-redis",
            options: {
                redis: {
                    url: REDIS_URL,
                },
            },
        },
        [Modules.FILE]: {
            resolve: "@medusajs/file",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/file-s3",
                        id: "s3",
                        options: {
                            file_url: process.env.S3_FILE_URL,
                            access_key_id: process.env.S3_ACCESS_KEY_ID,
                            secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                            region: process.env.S3_REGION,
                            bucket: process.env.S3_BUCKET,
                            endpoint: process.env.S3_ENDPOINT,
                            additional_client_config: {
                                forcePathStyle: true,
                            },
                        },
                    },
                ],
            },
        },
        [Modules.AUTH]: {
            resolve: "@medusajs/auth",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/auth-emailpass",
                        id: "emailpass",
                        options: {
                            // options...
                        },
                    },
                    {
                        resolve: "@medusajs/auth-google",
                        id: "google",
                        options: {
                            clientId: process.env.GOOGLE_CLIENT_ID,
                            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                            callbackUrl: process.env.GOOGLE_CALLBACK_URL,
                        },
                    },
                ],
            },
        },
        [Modules.PAYMENT]: {
            resolve: "@medusajs/payment",
            options: {
                providers: [
                    {
                        resolve: "./modules/payment/2c2p",
                        id: "2c2p",
                        options: {
                            host: process.env.PAYMENT_2C2P_API_URL,
                            merchantId: process.env.PAYMENT_2C2P_MERCHANT_ID,
                            secretKey: process.env.PAYMENT_2C2P_MERCHANT_SECRET_KEY,
                        },
                    }
                ],
            },
        },
        'contactUsModuleService': {
            resolve: "./modules/contact-us",
        },
        'productVariantImagesModuleService': {
            resolve: "./modules/product-variant-images",
        },
        'productCategoryStrapiModuleService': {
            resolve: "./modules/strapi/product-categories",
        },
        'homepageBannerService': {
            resolve: "./modules/strapi/homepage-banner",
        },
        'cmsPageService': {
            resolve: "./modules/strapi/cms-page",
        },
        'blockService': {
            resolve: "./modules/strapi/block",
        },
        'miniCategoryService': {
            resolve: "./modules/strapi/mini-category",
        },
        'homeCategoryService': {
            resolve: "./modules/strapi/home-category",
        },
        'adminModuleService': {
            resolve: "./modules/admin",
        },
        'configDataModuleService': {
            resolve: "./modules/config-data",
        },
        'searchLogModuleService': {
            resolve: "./modules/search-log",
            dependencies: [
                Modules.EVENT_BUS,
                Modules.PRODUCT,
            ],
        },
        'productMeiliSearchModuleService': {
            resolve: "./modules/meilisearch/product-meilisearch",
            options: {
                host: process.env.MEILISEARCH_URL,
                apiKey: process.env.MEILISEARCH_ADMIN_API_KEY,
            },
        },
        'productAttributeModuleService': {
            resolve: "./modules/product-attributes",
        },
        'productStrapiModuleService': {
            resolve: "./modules/strapi/product",
        },
    },
});