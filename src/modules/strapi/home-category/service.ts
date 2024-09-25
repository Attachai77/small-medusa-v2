import StrapiBaseService from "../base";
import { HomeCategory } from '../type'



class HomeCategoryService extends StrapiBaseService {

    async getListAll({ locale = 'th' }: { locale?: string }): Promise<HomeCategory[]> {
        try {
            const url = '/home-categories';
            const params = new URLSearchParams({
                'populate': '*',
                'sort': 'rank:asc',
                'pagination[pageSize]': '10'
            });

            const response = await this.$http.get(`${url}?${params}`);
            const data = response?.data?.data;

            if (!data) {
                return [];
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
            this.logger.error(`Failed to get homepage banner, ${error.message}`, error);
            return [];
        }
    }
}

export default HomeCategoryService;