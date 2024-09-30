/**
 * The SVG that is used to mask the card
 */
export function CardMask() {
	return (
		<svg width="0" height="0">
			<defs>
				<clipPath id="cardMask">
					<path transform="scale(-0.307, 0.307) translate(-1143 -4)"
						d="M 50 1703 C 29 1703 19 1682 19 1676 C 19 1662 19 62
								19 50 C 19 25 41 18 49 18 C 69 18 1087 18 1097 18 C 1122
								18 1131 35 1131 51 C 1130 57 1130 1006 1131 1481 C 1130
								1495 1126 1498 1119 1505 L 916 1687 C 898 1704 896 1701
								885 1703 C 883 1703 64 1703 62 1703 z"/>
				</clipPath>
			</defs>
		</svg>
	);
}
