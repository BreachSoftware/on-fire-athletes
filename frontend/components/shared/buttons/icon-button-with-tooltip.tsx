import React, { forwardRef } from 'react'
import { Tooltip } from '@chakra-ui/tooltip'
import { IconButton } from '@chakra-ui/button'
import type { TooltipProps } from '@chakra-ui/tooltip'
import type { IconButtonProps } from '@chakra-ui/button'

interface Props extends Omit<IconButtonProps, 'aria-label'> {
    label: string
    tooltipOverrides?: Omit<TooltipProps, 'label' | 'children'>
}

const IconButtonWithTooltip: React.ForwardRefRenderFunction<
    HTMLButtonElement,
    Props
> = ({ label, tooltipOverrides, ...props }, ref) => {
    return (
        <Tooltip label={label} hasArrow {...tooltipOverrides}>
            <IconButton {...props} ref={ref} aria-label={label} />
        </Tooltip>
    )
}

export default forwardRef<HTMLButtonElement, Props>(IconButtonWithTooltip)
