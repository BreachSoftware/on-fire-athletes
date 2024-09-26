'use client'

import { LightItUpSection } from './types'
import LightItUpCard from './light_it_up_card'
import SharedCarousel from '../shared/carousel'

interface Props {
    sections: LightItUpSection[]
}

/**
 * LightItUpCarousel
 * This is the carousel component for the Light It Up section on mobile views.
 * @param sections LightItUpSection[]
 * @returns JSX.Element
 */
export default function LightItUpCarousel({ sections }: Props) {
    return (
        <SharedCarousel
            containerOverrides={{
                display: { base: 'block', lg: 'none' },
                w: '100dvw',
                px: '24px',
            }}
            arrowTopPosition="55%"
        >
            {sections.map((section, i) => {
                return (
                    <div key={i}>
                        <LightItUpCard
                            image={section.image}
                            imageOverlayTitle={section.imageOverlayTitle}
                            imageOverlaySubtitle={section.imageOverlaySubtitle}
                            title={section.title}
                            description={section.description}
                            buttonTitle={section.buttonTitle}
                            buttonLink={section.buttonLink}
                            key={section.id}
                        />
                    </div>
                )
            })}
        </SharedCarousel>
    )
}
