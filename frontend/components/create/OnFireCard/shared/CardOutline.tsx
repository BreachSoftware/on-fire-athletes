import React, { SVGProps } from "react";

export default function CardOutline(props: SVGProps<SVGSVGElement>) {
    const color = props.fill || props.stroke || props.color;

    return (
        <svg
            width="645"
            height="905"
            viewBox="0 0 645 905"
            xmlns="http://www.w3.org/2000/svg"
            fill={color}
            stroke={color}
            fillRule="evenodd"
        >
            <path
                d="
    M0 0
    H644
    V904
    H0
    Z
    
    M32.5 21
      C26.4 21 21.5 26.2 21.5 32
      V872
      C21.5 878.1 26.4 883 32.5 883
      H500.6
      C507.5 883 509.8 880.6 512.6 877.6
           513   877.2 513.5 876.7 514   876.2
      L617.2 778.8
           617.6 778.5 617.9 778.2 618.2 777.8
           620.7 775.3 622.5 773.5 622.5 767.4
      V32
      C622.5 25.9 617.6 21 611.5 21
      H32.5
    Z
  "
            />
        </svg>
    );
}
