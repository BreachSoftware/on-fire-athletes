import { Box } from '@chakra-ui/layout'
import type { BoxProps } from '@chakra-ui/layout'

export default function ResponsiveBlock(props: BoxProps) {
    return <Box px={{ base: '24px', md: '72px' }} {...props} />
}
