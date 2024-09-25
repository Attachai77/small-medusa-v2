import StrapiBaseService from "../base";
import type { Block } from "../type";
class BlockService extends StrapiBaseService {

    async getBlockBySlug(slug: string, locale: string): Promise<Block | null> {
        try {
            const url = '/blocks';
            const params = new URLSearchParams({
                'filters[slug][$eq]': slug,
                'populate': '*'
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
            this.logger.error('Failed to get block', { error, slug, locale });
            return null;
        }
    }
}

export default BlockService;