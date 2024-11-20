import { Avatar } from "@chakra-ui/avatar";
import { SkeletonCircle } from "@chakra-ui/skeleton";

import { ProfileInfo } from "@/app/profile/components/profile.client";

interface Props {
    profileInfo: ProfileInfo | undefined;
    isLoaded: boolean;
    isOnPrivateProfile: boolean;
    onOpen: () => void;
}

export default function ProfileAvatar({
    profileInfo,
    isLoaded,
    isOnPrivateProfile,
    onOpen,
}: Props) {
    return (
        <SkeletonCircle isLoaded={isLoaded} w="116px" h="116px">
            <Avatar
                width="116px"
                height="116px"
                src={profileInfo?.avatar || "/placeholderProfile.jpg"}
                _hover={
                    isOnPrivateProfile
                        ? {
                              md: {
                                  filter: "brightness(0.5)",
                                  cursor: "pointer",
                              },
                          }
                        : {}
                }
                sx={{
                    transition: "filter 0.3s ease-in-out",
                    aspectRatio: "1 / 1",
                }}
                onClick={isOnPrivateProfile ? onOpen : () => {}}
            />
        </SkeletonCircle>
    );
}
