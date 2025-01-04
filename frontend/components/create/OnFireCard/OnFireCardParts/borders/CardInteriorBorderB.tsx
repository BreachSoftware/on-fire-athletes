import React, { SVGProps } from "react";

export default function CardInteriorBorderB(props: SVGProps<SVGSVGElement>) {
    const color = props.fill || props.stroke || props.color;

    return (
        <svg
            width="644"
            height="904"
            viewBox="0 0 644 904"
            xmlns="http://www.w3.org/2000/svg"
            fill={color}
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M596 48H45V856H488.02L596 753.996V48ZM586.5 57H54.5V847H483.504L586.5 749.023V57Z"
            />
        </svg>
    );
}
