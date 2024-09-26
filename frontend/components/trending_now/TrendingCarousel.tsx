import { Box } from '@chakra-ui/layout'
import SharedCarousel from '../shared/carousel'
import TrendingCard from './TrendingCard'
import SerializedTradingCard from '@/hooks/SerializedTradingCard'
import TradingCardInfo from '@/hooks/TradingCardInfo'

interface Props {
    cards: (TradingCardInfo | SerializedTradingCard)[]
}

/**
 * TrendingNowCarousel
 * A shared component for the Trending Now section carousel on mobile views.
 * @param {Props} cards
 * @returns {JSX.Element} The rendered TrendingNowCarousel component.
 */
export default function TrendingNowCarousel({ cards }: Props) {
    return (
        <SharedCarousel
            containerOverrides={{
                display: { base: 'block', lg: 'none' },
                w: '100dvw',
                px: '12px',
            }}
            hideDots
            arrowTopPosition="30%"
        >
            {cards.map((card, index) => {
                return (
                    <Box key={index} px="36px">
                        <TrendingCard
                            passedInCard={card}
                            shouldShowButton={true}
                        />
                    </Box>
                )
            })}
        </SharedCarousel>
    )
}
