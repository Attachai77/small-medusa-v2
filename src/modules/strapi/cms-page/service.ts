import StrapiBaseService from "../base";
import type { CmsPage } from "../type";

class CmsPageService extends StrapiBaseService {

    async getCmsPageBySlug(slug: string, locale: string): Promise<CmsPage | null> {
        try {
            const url = '/cms-pages';
            const params = new URLSearchParams({
                populate: '*',
                'filters[slug][$eq]': slug,
            });

            const response = await this.$http.get(`${url}?${params}`);
            const data = response?.data?.data;
            if (!data || data.length === 0) {
                return null;
            }

            if (data[0].attributes.locale === locale) {
                return data.map(this.transformItem);
            }

            const localization = data[0].attributes.localizations?.data;
            const checkLocalization = localization.find(loc => loc.attributes.locale === locale);
            return checkLocalization ? localization.map(this.transformItem) : data.map(this.transformItem);

        } catch (error) {
            this.logger.error('Failed to get CMS page', { error, slug, locale });
            return null;
        }
    }

    async getCmsPageList(locale: string): Promise<CmsPage[] | null> {
        try {
            const url = '/cms-pages';
            const params = new URLSearchParams({
                populate: '*',
                'filters[locale][$eq]': locale,
            });

            const response = await this.$http.get(`${url}?${params}`);
            const data = response?.data?.data;
            if (!data || data.length === 0) {
                return null;
            }

            return data.map(this.transformItem);

        } catch (error) {
            this.logger.error('Failed to get CMS page list', { error, locale });
            return null;
        }
    }
}

export default CmsPageService;