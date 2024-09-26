import { Stack, StackProps } from '@chakra-ui/react'
import React from 'react'

interface Props extends StackProps {
    row?: boolean
    fit?: boolean
    spaced?: boolean
}

export default function SharedStack({
    row = false,
    fit = false,
    spaced = false,
    children,
    ...props
}: Props) {
    return (
        <Stack
            w={fit ? 'fit-content' : 'full'}
            justify={spaced && row ? 'space-between' : 'flex-start'}
            align={row ? 'center' : 'flex-start'}
            direction={row ? 'row' : 'column'}
            {...props}
        >
            {children}
        </Stack>
    )
}
