import {
    FaTiktok,
    FaYoutube,
    FaSnapchat,
    FaXTwitter,
    FaFacebookF,
    FaInstagram,
} from "react-icons/fa6";
import { Icon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/button";
import { Link, Center } from "@chakra-ui/layout";

import { ProfileInfo } from "@/app/profile/components/profile.client";
import { IconType } from "react-icons/lib";
import SharedStack from "@/components/shared/wrappers/shared-stack";
import IconButtonWithTooltip from "@/components/shared/buttons/icon-button-with-tooltip";
import { FaPlusSquare } from "react-icons/fa";

interface Props {
    profileInfo: ProfileInfo | undefined;
    isOnPrivateProfile: boolean;
    onOpen: () => void;
}

export default function UserSocialLinks({
    profileInfo,
    isOnPrivateProfile,
    onOpen,
}: Props) {
    const links = [
        {
            icon: FaXTwitter,
            label: "Twitter",
            href: profileInfo?.xLink,
        },
        {
            icon: FaTiktok,
            label: "TikTok",
            href: profileInfo?.tiktokLink,
        },
        {
            icon: FaFacebookF,
            label: "Facebook",
            href: profileInfo?.facebookLink,
        },
        {
            icon: FaInstagram,
            label: "Instagram",
            href: profileInfo?.instagramLink,
        },
        {
            icon: FaYoutube,
            label: "YouTube",
            href: profileInfo?.youtubeLink,
        },
        {
            icon: FaSnapchat,
            label: "Snapchat",
            href: profileInfo?.snapchatLink,
        },
    ];

    return (
        <SharedStack row fit>
            {links.map((social, index) => {
                if (social && social.href !== undefined && social.href !== "") {
                    return (
                        <SocialLink
                            key={index}
                            icon={social.icon}
                            label={social.label}
                            href={social.href}
                        />
                    );
                }
            })}
            {isOnPrivateProfile && (
                <Center w="22px">
                    <IconButtonWithTooltip
                        variant="ghost"
                        aria-label="Add Social Media"
                        label="Add social links"
                        icon={
                            <Icon
                                as={FaPlusSquare}
                                style={{
                                    width: "18px",
                                    height: "18px",
                                }}
                            />
                        }
                        isRound
                        boxSize="16px"
                        color="green.100"
                        _hover={{
                            md: {
                                color: "white",
                            },
                        }}
                        onClick={() => {
                            onOpen();
                        }}
                    />
                </Center>
            )}
        </SharedStack>
    );
}

function SocialLink({
    icon,
    label,
    href,
}: {
    icon: IconType;
    label: string;
    href: string;
}) {
    return (
        <Center w="22px">
            <Link href={href} isExternal>
                <IconButton
                    variant="ghost"
                    aria-label={label}
                    icon={
                        <Icon
                            as={icon}
                            style={{
                                width: "18px",
                                height: "18px",
                            }}
                        />
                    }
                    isRound
                    boxSize="16px"
                    color="white"
                    _hover={{
                        md: {
                            color: "green.600",
                        },
                    }}
                />
            </Link>
        </Center>
    );
}
