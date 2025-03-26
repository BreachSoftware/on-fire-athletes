import SharedStack from "@/components/shared/wrappers/shared-stack";
import { Text } from "@chakra-ui/react";
import AddOn from "../selectYourPackage/addOn";

export type AddOnOptionType = {
    title: string;
    subtitle?: string;
    value: number;
    onChange: (value: number) => void;
    hidePriceStyling?: boolean;
    pricingOptions: Record<number, number>;
};

export default function AddOnOption({
    title,
    subtitle,
    value,
    onChange,
    hidePriceStyling,
    pricingOptions,
}: AddOnOptionType) {
    const isSelected = value > 0;

    return (
        <SharedStack
            gap={"8px"}
            backgroundColor={"#171C1B"}
            padding={"20px"}
            flexDirection={"column"}
            borderWidth={"2px"}
            borderColor={"green.300"}
            boxShadow={isSelected ? "0 0 10px green" : "none"}
            borderRadius={"10px"}
            transition={
                "border-color 0.2s, box-shadow 0.2s, background-color 0.2s"
            }
        >
            {/* Header and Price */}
            <SharedStack row spaced alignItems={"center"}>
                <Text
                    fontFamily="Barlow Condensed"
                    color="white"
                    fontSize={{
                        base: "16px",
                        lg: "20px",
                    }}
                    textAlign={"center"}
                    transform={"skew(-5deg)"}
                >
                    {title}
                </Text>
            </SharedStack>

            {/* Subtitle */}
            {subtitle && (
                <Text
                    fontFamily={"Barlow Condensed"}
                    fontSize={"14"}
                    color={"#F8F8F8"}
                    textAlign={"left"}
                    transform={"skew(-5deg)"}
                    marginBottom={"10px"}
                >
                    {subtitle}
                </Text>
            )}

            {/* Add-Ons */}
            <AddOn
                title={title}
                value={value}
                onChange={(value) => {
                    onChange(value);
                }}
                hidePriceStyling={hidePriceStyling}
                pricingOptions={pricingOptions}
            />
        </SharedStack>
    );
}
