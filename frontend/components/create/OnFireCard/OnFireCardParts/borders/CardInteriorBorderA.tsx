import React, { SVGProps } from "react";

export default function CardInteriorBorderA(props: SVGProps<SVGSVGElement>) {
    const color = props.fill || props.stroke || props.color;

    return (
        <svg
            width="644"
            height="905"
            viewBox="0 0 644 905"
            xmlns="http://www.w3.org/2000/svg"
            fill={color}
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M597 48.2087H126V856.209H488.848L597 758.233V48.2087ZM588 57.7087H135V846.709H485.57L588 754.204V57.7087Z"
            />
        </svg>
    );
}
