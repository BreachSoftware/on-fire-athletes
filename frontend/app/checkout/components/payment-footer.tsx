import SharedStack from "@/components/shared/wrappers/shared-stack";
import GameCoinButton from "./GameCoinButton";
import { Button, Input } from "@chakra-ui/react";
import { useCurrentCheckout } from "@/hooks/useCheckout";
import { useState } from "react";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";

export default function PaymentFooter() {
    const [couponCode, setCouponCode] = useState("");
    const { checkout, setCheckout } = useCurrentCheckout();

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
            const { coupon } = couponData;

            setCheckout({
                ...checkout,
                couponCode: coupon.code,
                couponCentsOff: coupon.amount_off,
                couponPercentOff: coupon.percent_off,
            });
        } else {
            // Toast error
        }
    }

    return (
        <SharedStack
            flexDir={{ base: "column", md: "row" }}
            gap={4}
            alignItems="center"
        >
            <GameCoinButton />
            <SharedStack row gap={4}>
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
                    colorScheme="green"
                    onClick={applyCoupon}
                >
                    Apply
                </Button>
            </SharedStack>
        </SharedStack>
    );
}
