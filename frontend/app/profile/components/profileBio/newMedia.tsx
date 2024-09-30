import { Icon } from '@chakra-ui/icons'
import { Spinner } from '@chakra-ui/spinner'
import { FaCirclePlus } from 'react-icons/fa6'
import { Text, Center, AspectRatio } from '@chakra-ui/layout'

interface Props {
    isLoading: boolean
    handleClick: () => void
}

/**
 * ProfileNewMedia component
 * This component is responsible for rendering the new media button of the profile bio.
 * @returns {JSX.Element}
 */
export default function ProfileNewMedia({ isLoading, handleClick }: Props) {
    return (
        <AspectRatio ratio={1} w="full" h="full">
            <Center
                flexDir="column"
                onClick={handleClick}
                cursor="pointer"
                w="full"
                h="full"
                color="white"
                bgColor="#151515"
                _hover={{ bgColor: '#222222', color: 'green.100' }}
                transition="all 0.2s ease-out"
            >
                {isLoading ? (
                    <Spinner
                        size="xl"
                        color="green.100"
                        emptyColor="gray.200"
                        opacity={'0.75'}
                    />
                ) : (
                    <>
                        <Icon
                            as={FaCirclePlus}
                            fontSize="32px"
                            opacity="0.75"
                        />
                        <Text textAlign="center" fontSize="sm" mt={2}>
                            Add a new image or video
                        </Text>
                    </>
                )}
            </Center>
        </AspectRatio>
    )
}
