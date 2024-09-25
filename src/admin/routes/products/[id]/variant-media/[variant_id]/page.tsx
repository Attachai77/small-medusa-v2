import { useParams } from "react-router-dom"
import { RouteFocusModal } from "@medusajs/dashboard/src/components/route-modal"
import { useEffect, useState } from "react"
import type { ProductDTO } from "@medusajs/types"
import { ProductMediaView } from "./product-media/components/product-media-view"

const VariantMediaPage = () => {
  const { id } = useParams()
  const [ product, setProduct ] = useState<ProductDTO[]>([])
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    const fetchData = () => {
      fetch(`/store/custom/products/${id}`, {
        credentials: "include",
      })
      .then((res) => res.json())
      .then(({ product }) => {
        setIsLoading(false)
        setProduct(product)
      })
    }
    fetchData()
  }, [id])

  const ready = !isLoading && product

  return (
    <RouteFocusModal prev="../..">
      {ready && <ProductMediaView product={product} />}
    </RouteFocusModal>
  )
}

export default VariantMediaPage