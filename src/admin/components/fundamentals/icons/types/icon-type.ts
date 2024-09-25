import type React from "react"

export interface IconProps extends React.SVGAttributes<SVGElement> {
  children?: never;
  color?: string;
  size?: string | number
}

export default IconProps
