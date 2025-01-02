import SharedStack from "@/components/shared/wrappers/shared-stack";
import { Text } from "@chakra-ui/react";
import AddOn from "../selectYourPackage/addOn";

export type AddOnOptionType = {
    title: string;
    subtitle?: string;
    price: string;
    value: number;
    onChange: (value: number) => void;
    hidePriceStyling?: boolean;
};

export default function AddOnOption({
    title,
    subtitle,
    price,
    value,
    onChange,
    hidePriceStyling,
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
            zIndex={isSelected ? 0 : 1}
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
                <Text
                    fontFamily="Barlow Condensed"
                    color="green.100"
                    fontSize={{
                        base: "16px",
                        lg: "20px",
                    }}
                    textAlign={"center"}
                    transform={"skew(-5deg)"}
                >
                    {hidePriceStyling ? price : `$${price}`}
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
                price={price}
                value={value}
                onChange={(value) => {
                    onChange(value);
                }}
                hidePriceStyling={hidePriceStyling}
            />
        </SharedStack>
    );
}
