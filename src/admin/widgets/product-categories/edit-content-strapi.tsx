import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, toast } from "@medusajs/ui"
import StrapiIcon from "../../components/fundamentals/icons/strapi-icon"
import type { 
  DetailWidgetProps, 
  AdminProductCategory
} from "@medusajs/types"

const ProductCategoriesEditContentStrapiWidget = ({ 
  data,
}: DetailWidgetProps<AdminProductCategory>) => {

  const getStrapiLink = async (id: string) => {
    return fetch(`/admin/strapi/generate-link?collection=product-category&collection_id=${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        return response
      }).catch((error) => {
        console.error(`Error: ${error}`)
        return null
      })
  }

  const goToStrapi = async () => {
    const { link, message } = await getStrapiLink(data.id)
    if (link) {
      window.open(link, '_blank')
    } else {
      toast.warning("Warning", {
        description: message,
        dismissLabel: "Close",
      })
    }
  }

  return (
    <>
      <div className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="font-sans font-medium h2-core">Strapi Content Manager</h2>
            <p className="font-normal font-sans txt-small text-ui-fg-subtle">Edit product categories content on strapi content manager.</p>
          </div>
        </div>
        <div className="text-ui-fg-subtle grid grid-cols-2 items-start gap-3 px-6 py-4">
          <Button 
            onClick={goToStrapi} 
            variant="secondary"
          >
            <StrapiIcon />
            Go to Strapi
          </Button>
        </div>
      </div>
    </>
  )
}

export const config = defineWidgetConfig({
  zone: "product_category.details.side.after",
})

export default ProductCategoriesEditContentStrapiWidget