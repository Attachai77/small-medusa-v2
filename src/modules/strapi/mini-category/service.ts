import StrapiBaseService from "../base";
import type { MiniCategory } from "../type";

class MiniCategoryService extends StrapiBaseService {
    async getListAll(locale: string): Promise<MiniCategory[] | null> {
        try {
            const url = "/mini-categories";
            const params = new URLSearchParams({
                populate: "*",
                sort: "rank:asc",
            });

            const response = await this.$http.get(`${url}?${params}`);
            const data = response?.data?.data;

            if (!data || data.length === 0) {
                return null;
            }

            if (locale === process.env.MEDUSA_DEFAULT_LOCALE || locale === null) {
                return data.map(this.transformItem);
            }

            return data.map((item) => {
                const localizedItem = { ...item };
                if (
                    item.attributes.locale !== locale &&
                    item.attributes.localizations.data.length > 0
                ) {
                    const localization = item.attributes.localizations.data.find(
                        (loc) => loc.attributes.locale === locale
                    );
                    if (localization) {
                        localizedItem.attributes.title = localization.attributes.title;
                    }
                }
                return this.transformItem(localizedItem);
            });
        } catch (error) {
            this.logger.error("Failed to get mini category", { error });
            return null;
        }
    }
}

export default MiniCategoryService;