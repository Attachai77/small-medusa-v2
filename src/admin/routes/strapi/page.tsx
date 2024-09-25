import { Container, Button } from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { useEffect, useState } from 'react'

const StrapiPage = () => {

  const [productsCount, setProductsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      return
    }

    fetch("/admin/products", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then(({ count }) => {
        setProductsCount(count)
        setLoading(false)
      })
  }, [loading])


  const getStrapiLink = async () => {
    return fetch("/admin/strapi/generate-link", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then(({ link }) => {
        return link
      }).catch((error) => {
        console.error(`Error: ${error}`)
        return null
      })
  }

  const goToStrapi = async () => {
    const link = await getStrapiLink()
    if (link) window.open(link, '_blank')
  }

  return (
      <Container>
        Go to strapi page
        <div className="mt-5 mb-5">
          <Button onClick={goToStrapi}>Go...</Button>
        </div>

        {loading && <span>Loading...</span>}
        {!loading && <span>You have {productsCount} Product(s).</span>}

      </Container>
  )
}

export const config = defineRouteConfig({
  label: "Strapi",
  icon: ChatBubbleLeftRight,
})


export default StrapiPage
