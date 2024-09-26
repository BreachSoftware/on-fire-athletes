import { extendTheme } from '@chakra-ui/react'
import { inputTheme } from './InputBox'
import { textareaTheme } from './Textarea'
import { switchTheme } from './switch'
import { radioTheme } from './RadioPicker'
import { buttonTheme } from './Button'
import { accordionTheme } from './Accordion'
import { TooltipTheme } from './Tooltip'
import { menuTheme } from './Menu'
import { cardTheme } from './Card'
import { checkboxTheme } from './Checkbox'
import { selectTheme } from './Select'

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

export const theme = extendTheme({
    config: config,
    breakpoints: {
        base: '0em', // 0px
        xs: '26.875em', // ~430px
        sm: '30em', // ~480px
        md: '48em', // ~768px
        lg: '62em', // ~992px
        xl: '80em', // ~1280px
        '2xl': '96em', // ~1536px
        '3xl': '112em', // ~1792px
    },
    fonts: {
        heading: "'Barlow Semi Condensed', sans-serif",
        body: "'Roboto', 'Barlow', sans-serif",
    },
    fontSizes: {},
    fontWeights: {
        normal: 400,
        medium: 500,
        bold: 700,
    },
    colors: {
        green: {
            100: '#27CE00', // Main green for multiple gradients and text
            200: '#27CE00', // The color that the success toast uses.
            300: '#105208', // Gradient for "create your digital sports card" top background
            400: '#384E46', // Dark green accent
            500: '#115208', // Gradient for headline cards
            600: '#28BC06', // Green for "get in the game" buttons
            700: '#203030', // Gradient for "create your digital sports card" bottom background, "get in the game" background. Prev 31453D
            800: '#80CA47', // Green for Built for Fans and Athletes Section
            900: '#17201E', // Create card menu text boxes, Trending Now page background
            1000: '#3AB21E', // Green for checkout checkboxes
        },
        gray: {
            100: '#D5D5D5',
            200: '#303C3A', // Create card input background
            300: '#364B47', // Create card menu background
            400: '#8b8b8b', // Input box placeholder text color
            500: '#12171E', // Get in the game background
            600: '#17201E', // Input box background color
            700: '#292929', // Bottom of "Built for Fans and Athletes" gradient
            800: '#000000', // Accordion box border

            1000: '#171C1B', // Sign Up / Log In box background
            1100: '#2b2b2b', // "Buy Now" profile button background
            1200: '#0A0A0A', // Locker Room background (top)
            1300: '#121212', // Locker Room background (bottom)
            1400: '#131515', // Filter Inside Background
            1500: '#CECECE', // Trending Card Action Button Background Color
            1600: '#707070', // Filter divider color
            1700: '#31453D', // Side drawer divider color
            1800: '#515B5A', // Filter Inside Background
        },
        white: {
            100: '#FFFFFF', // White for text
        },
        orange: '#BC823E', // Sidebar dots
        red: {
            100: '#FF0000', // Red for x mark icon
        },
    },
    semanticTokens: {},
    components: {
        Button: buttonTheme,
        Input: inputTheme,
        Textarea: textareaTheme,
        Switch: switchTheme,
        Radio: radioTheme,
        Accordion: accordionTheme,
        Tooltip: TooltipTheme,
        Menu: menuTheme,
        Card: cardTheme,
        Select: selectTheme,
        Checkbox: checkboxTheme,
    },
    shadows: {
        outline: '0 0 0 3px green	', // Default green focus ring
        accessibleFocus: '0 0 0 3px green',
    },
})
