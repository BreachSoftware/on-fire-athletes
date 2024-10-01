import { checkIfNumber } from '@/components/create/Step2'
import { useCurrentCheckout } from '@/hooks/useCheckout'
import { Flex, Input, Stack } from '@chakra-ui/react'

/**
 * This component renders the body content for the contact information step in the checkout process.
 * @returns {JSX.Element} - The rendered JSX element for the contact information body.
 */
export default function ContactInformationBody() {
    const curCheckout = useCurrentCheckout()
    const checkout = curCheckout.checkout

    /**
     * A function to add contact information to the checkout object
     * Could potentially be moved to the hook if needed elsewhere
     * @param key the key to add to the contact info object
     * @param value the value to set for the key
     */
    function addContactInformation(key: string, value: string) {
        curCheckout.setCheckout({
            ...checkout,
            contactInfo: {
                ...checkout.contactInfo,
                [key]: value,
            },
        })
    }

    return (
        <Flex flexDirection="column" gap="20px">
            <Flex gap="10px" flexDirection={'column'}>
                Name
                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    gap={{ base: 4, md: 12 }}
                >
                    <Input
                        placeholder="First Name*"
                        defaultValue={checkout.contactInfo.firstName}
                        variant={'checkout'}
                        onChange={(e) => {
                            addContactInformation('firstName', e.target.value)
                        }}
                        sx={{
                            '::placeholder': {
                                fontStyle: 'italic',
                            },
                        }}
                    />
                    <Input
                        placeholder="Last Name*"
                        defaultValue={checkout.contactInfo.lastName}
                        variant={'checkout'}
                        onChange={(e) => {
                            addContactInformation('lastName', e.target.value)
                        }}
                        sx={{
                            '::placeholder': {
                                fontStyle: 'italic',
                            },
                        }}
                    />
                </Stack>
            </Flex>
            <Flex gap="10px" flexDirection={'column'}>
                Email
                <Input
                    placeholder="Email Address*"
                    defaultValue={checkout.contactInfo.email}
                    variant={'checkout'}
                    type="email"
                    onChange={(e) => {
                        addContactInformation('email', e.target.value)
                    }}
                    sx={{
                        '::placeholder': {
                            fontStyle: 'italic',
                        },
                    }}
                />
            </Flex>
            <Flex gap="10px" flexDirection={'column'}>
                Phone Number
                <Input
                    placeholder="Phone Number"
                    defaultValue={checkout.contactInfo.phone}
                    variant={'checkout'}
                    type="tel"
                    maxLength={10}
                    onKeyDown={(event) => {
                        checkIfNumber(event)
                    }}
                    onChange={(e) => {
                        addContactInformation('phone', e.target.value)
                    }}
                    sx={{
                        '::placeholder': {
                            fontStyle: 'italic',
                        },
                    }}
                />
            </Flex>
        </Flex>
    )
}
