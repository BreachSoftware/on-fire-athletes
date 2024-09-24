import { keyframes } from "@chakra-ui/react";

export const cardAnimationKeyframes = keyframes`
0% { transform: rotateY(0deg); }
25% { transform: rotateY(35deg); }
50% { transform: rotateY(0deg); }
75% { transform: rotateY(-35deg); }
100% { transform: rotateY(0deg); }
`;

export const cardAnimation = `${cardAnimationKeyframes} 12s ease-in-out infinite`;

// move towards the screen to give a 3D effect
export const cardTopAnimationKeyframes = keyframes`
0% { transform: translateZ(25px); }
25% { transform: translateZ(25px); }
50% { transform: translateZ(25px); }
75% { transform: translateZ(25px); }
100% { transform: translateZ(25px); }

`;

export const cardTopAnimation = `${cardTopAnimationKeyframes} 12s ease-in-out infinite`;

export const cardBackAnimationKeyframes = keyframes`
0% { transform: translateZ(-15px); }
25% { transform: translateZ(-15px); }
50% { transform: translateZ(-15px); }
75% { transform: translateZ(-15px); }
100% { transform: translateZ(-15px); }

`;

export const cardBackAnimation = `${cardBackAnimationKeyframes} 12s ease-in-out infinite`;
