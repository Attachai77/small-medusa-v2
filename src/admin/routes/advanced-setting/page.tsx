import React from "react";
import { Container } from "@medusajs/ui";
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Adjustments, CubeSolid, MagnifyingGlass } from "@medusajs/icons";
import AdvancedSettingButton from "../../components/advanced-setting-button";

const items = [
  {
    title: "Custom Order Number",
    sub_title: "Manage your order,invoice,Shipping,Credit Memo number",
    url: "/advanced-setting/setting-running-number",
    icon: <CubeSolid/>
  },
  {
    title: "Cancel Order",
    sub_title: "Config cancel order",
    url: "#",
    icon: <MagnifyingGlass/>
  },
  {
    title: "Top Search",
    sub_title: "Config top search",
    url: "/advanced-setting/top-search",
    icon: <MagnifyingGlass/>
  },
  {
    title: "Recent Search",
    sub_title: "Config recent search",
    url: "#",
    icon: <MagnifyingGlass/>
  },
  {
    title: "Delivery method for Admin",
    sub_title: "Config top search",
    url: "#",
    icon: <MagnifyingGlass/>
  },
  {
    title: "Payment Restriction",
    sub_title: "Config top search",
    url: "#",
    icon: <MagnifyingGlass/>
  },
];

const AdvancedMenuPage = () => {
  return (
    <Container>
      <h1 style={{ fontWeight: "700", fontSize: "20px" }}>Advanced Settings</h1>
      <p className="mt-4 mb-6">Manage the advanced settings for your store</p>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <AdvancedSettingButton
              title={item.title}
              sub_title={item.sub_title}
              handleUrl={item.url}
              icon={item.icon}
            />
            {(index + 1) % 2 === 0 && <div></div>}
          </React.Fragment>
        ))}
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Advanced Setting",
  icon: Adjustments,
});

export default AdvancedMenuPage;
