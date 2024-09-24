/* eslint-disable func-style */

const CardDropShadow = ({ opacity = 0.59 }) => {
	return (
		<>
			<svg viewBox="0 0 665 44" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<radialGradient id="RadialGradient1">
						<stop offset="0%" stopColor="black" />
						<stop offset="100%" stopColor="rgba(00, 00, 00, 0.0)" />
					</radialGradient>
				</defs>
				<rect
					x={0}
					y={0}
					width={665}
					height={44}
					fill="url(#RadialGradient1)"
					opacity={opacity}
				/>
			</svg>
		</>
	);
};
export default CardDropShadow;
