"use client";

import { FC, ReactNode, createContext, useContext, useState } from "react";
import TradingCardInfo from "./TradingCardInfo";

// The properties of the useCurrentCardInfo hook
export interface useCurrentCardInfoProperties {
	curCard: TradingCardInfo;
	setCurCard: (newCard: TradingCardInfo) => void; // May not even need this
}


// Props to the ProvideCurrentCardInfo component
type Props = {
    children?: ReactNode;
};

// The currentCardContext is used to provide the data to the useCurrentCardInfo hook
const currentCardContext = createContext({} as useCurrentCardInfoProperties);

/**
 * Setting the useCurrentCardInfo hook to use the currentCardContext
 * @returns The data to be used by the useCurrentCardInfo hook
 */
export function useCurrentCardInfo() {
	return useContext(currentCardContext);
}


/**
 * The useProvideCurrentCardInfo hook is used to provide the data to the useCurrentCardInfo hook
 * @returns The data to be used by the useCurrentCardInfo hook
 */
function useProvideCurrentCardInfo(): useCurrentCardInfoProperties {
	const [ card, setCard ] = useState<TradingCardInfo>(new TradingCardInfo());

	return {
		curCard: card,
		setCurCard: setCard,
	};
}


/**
 * The ProvideCurrentCardInfo component is used to provide the data to the useCurrentCardInfo hook
 * @param children The children of the component
 * @returns The data to be used by the useCurrentCardInfo hook
 */
// eslint-disable-next-line func-style
export const ProvideCurrentCardInfo: FC<Props> = ({ children }) => {
	const currentCard = useProvideCurrentCardInfo();
	return(
		<currentCardContext.Provider value={currentCard}>
			{children}
		</currentCardContext.Provider>
	);
};
