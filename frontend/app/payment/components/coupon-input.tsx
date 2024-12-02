import SharedStack from "@/components/shared/wrappers/shared-stack";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import { Button, Input, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function CouponInput() {
    const { checkout, setCheckout } = useCurrentCheckout();
    const [couponCode, setCouponCode] = useState("");

    async function applyCoupon() {
        const couponResponse = await fetch(apiEndpoints.applyCouponCode(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: couponCode,
            }),
        });

        if (couponResponse.status === 200) {
            const couponData = await couponResponse.json();
            const { coupon, code } = couponData;

            setCheckout({
                ...checkout,
                couponCode: code,
                couponCentsOff: coupon.amount_off,
                couponPercentOff: coupon.percent_off,
            });
        } else {
            // Toast error
        }
    }

    function getCouponDetail() {
        if (checkout.couponCentsOff) {
            return `$${checkout.couponCentsOff / 100} off`;
        } else if (checkout.couponPercentOff) {
            return `${checkout.couponPercentOff}% off`;
        }
    }

    return (
        <SharedStack>
            <SharedStack row mt={4}>
                <Input
                    variant="checkout"
                    fontSize="16px"
                    maxW="256px"
                    placeholder="Enter coupon..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button
                    w="fit-content"
                    variant="back"
                    onClick={() => applyCoupon()}
                >
                    Apply
                </Button>
            </SharedStack>
            {checkout.couponCode && (
                <Text fontSize="xs">
                    Coupon {checkout.couponCode} ({getCouponDetail()}) applied!
                </Text>
            )}
        </SharedStack>
    );
}
