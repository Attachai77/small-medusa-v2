import { Container } from "@medusajs/ui";
import { ChevronRight } from "@medusajs/icons";
import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'

type Param = {
  title: string,
  sub_title: string
  handleUrl: string
  icon: ReactElement<any, any>
}

const AdvancedSettingButton = ({ title, sub_title, handleUrl, icon }: Param) => {
  return (
    <Link to={handleUrl}>
      <Container className="grid grid-cols-12 gap-4 items-center p-4 min-h-24">
        <>
          {icon}
          <div className="col-span-10">
            <h2 style={{ fontWeight: "700" }}>
              {title}
            </h2>
            <p className="text-sm text-gray-500">{sub_title}</p>
          </div>
          <ChevronRight/>
        </>
      </Container>
    </Link>
  );
};

export default AdvancedSettingButton;
