import { Container, Button } from "@medusajs/ui";
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Newspaper } from "@medusajs/icons";
import { useState } from "react";

const BlogsPage = () => {
  const [ isLoaded, setIsLoaded ] = useState<boolean>(false)

  const getStrapiLink = async () => {
    const collection = "blog";
    try {
      const res = await fetch(`/admin/strapi/generate-link?collection=${collection}`, {
        credentials: "include"
      });
      const { link } = await res.json();
      console.log('link', link)
      return link;
    } catch (error) {
      console.error(`Error: ${error}`);
      return null;
    }
  };

  const goToStrapi = async () => {
    if (!isLoaded) {
      const link = await getStrapiLink()
      setIsLoaded(true)
      if (link) {
        window.open(link, '_blank')
      }
    }
  }
  goToStrapi()
  
  return (
    <Container>
      <h1 style={{ fontWeight: "700", fontSize: "20px" }}>Blogs</h1>
      <p className="mt-4 mb-6">Manage content via Strapi</p>
      <div className="flex h-[400px] items-center justify-center">
        <Button
          variant="secondary"
          size="small"
          type="button"
          onClick={() => {
            setIsLoaded(false)
            goToStrapi()
          }}
        >
          <Newspaper />
          {"Open again!"}
        </Button>
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Blogs",
  icon: Newspaper,
});

export default BlogsPage;
