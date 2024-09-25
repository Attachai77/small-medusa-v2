import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  clx,
  Checkbox,
} from "@medusajs/ui"
import { PencilSquare, PlusMini } from "@medusajs/icons"
import { Link } from "react-router-dom"
import type { 
  DetailWidgetProps, 
  AdminProduct,
} from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import type { ProductVariantDTO } from "../../../../types/variants"

const ProductVariantImagesWidget = ({ 
  data,
}: DetailWidgetProps<AdminProduct>) => {
  const product_id = data.id
  const { t } = useTranslation()
  const [ variants_items, setVariantItems ] = useState<ProductVariantDTO[]>([])
  
  useEffect(() => {
    const fetchData = () => {
      fetch(`/admin/custom/products/${product_id}/variants`, {
        credentials: "include",
      })
      .then((res) => res.json())
      .then(({ variants }) => {
        setVariantItems(variants)
      })
    }
    fetchData()
  }, [product_id])

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">
          Image(s) for variants
        </Heading>
      </div>
      <div className="text-sm pb-2">
        {variants_items.map((variant, index) => {
          return (
            <div key={variant.id}>
              <h1 className="font-medium px-6 first:pt-4">
                {variant.title}
              </h1>
              <div 
                className="grid grid-cols-[repeat(auto-fill,minmax(75px,1fr))] gap-4 px-6 py-4"
              >
                {variant.images.map((image, index) => {
                  if (index < 6) {
                    return (
                      <div
                        className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]"
                        key={image.id}
                      >
                        <Link to={`variant-media/${variant.id}`} state={{ curr: index }} className="relative">
                          {index === 5 && (
                            <div className="font-[700] absolute left-[50%] top-[40%] z-[999]">
                              <div className="relative left-[-50%] top-[-50%] text-white">
                                +{ variant.images.length - index }
                              </div>
                            </div>
                          )}
                          <img
                            src={image.url}
                            // biome-ignore lint/a11y/noRedundantAlt: <explanation>
                            alt={`${variant.title} image`}
                            className={clx(
                              "size-full object-cover",
                              {
                                "blur-sm": index === 5
                              }
                            )}
                          />
                        </Link>
                      </div>
                    )
                  }
                })}
                <div
                  className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]"
                >
                  <Link to={`variant-media/${variant.id}?view=edit`} state={{ curr: index }} className="flex items-center justify-center h-[100%]">
                    {variant.images.length > 0 ? (
                      <>
                        <PencilSquare />
                        <span>Edit</span>
                      </>
                    ): (
                      <>
                        <PlusMini />
                        <span>Add</span>
                      </>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductVariantImagesWidget