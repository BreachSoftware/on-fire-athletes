import ChevronRightIcon from '@/components/icons/chevron-right'
import { Button } from '@chakra-ui/button'
import Link from 'next/link'

export default function StartCreatingButton() {
    return (
        <Link href="/create/card_creation">
            <Button
                h={{ base: '50px', lg: '56px', '2xl': '64px' }}
                w="fit-content"
                px={{ base: '24px', lg: '32px', '2xl': '48px' }}
                bg="green.600"
                color="white"
                fontFamily="Roboto"
                fontSize={{ base: '20px', md: '18px', '2xl': '22px' }}
                letterSpacing="1.4px"
                fontWeight="medium"
                textTransform="uppercase"
                _hover={{
                    bg: '#20A500',
                    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                    fontStyle: 'italic',
                }}
                rightIcon={
                    <ChevronRightIcon
                        fontSize={{ base: '24px', md: '22px', '2xl': '30px' }}
                    />
                }
            >
                Start Creating
            </Button>
        </Link>
    )
}
