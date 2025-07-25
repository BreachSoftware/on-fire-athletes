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
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M644.25 0.254272H0.25V904.254H644.25V0.254272ZM37.75 25.2543C31.6758 25.2543 26.75 30.1792 26.75 36.2543V868.254C26.75 874.329 31.6758 879.254 37.75 879.254H494.836C499.93 879.254 501.68 877.685 503.725 875.853C504.049 875.563 504.379 875.267 504.732 874.969L613.852 771.94C616.348 769.358 617.75 767.574 617.75 762.804V36.2543C617.75 30.1792 612.824 25.2543 606.75 25.2543H37.75Z"
            />
        </svg>
    );
}
