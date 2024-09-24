"use client";

import { FC, ReactNode, createContext, useContext, useState } from "react";
import FilterInfo from "@/hooks/FilterInfo";

// The properties of the useCurrentFilter hook
export interface useCurrentFilterProperties {
	curFilter: FilterInfo;
	setCurFilter: (newFilter: FilterInfo) => void; // May not even need this
}

type Props = {
    children?: ReactNode;
};

// The currentFilterContext is used to provide the data to the useCurrentFilterInfo hook
const currentFilterContext = createContext({} as useCurrentFilterProperties);

/**
 * Setting the useCurrentFilterInfo hook to use the currentFilterContext
 * @returns The data to be used by the useCurrentFilterInfo hook
 */
export function useCurrentFilterInfo() {
	return useContext(currentFilterContext);
}


/**
 * The useProvideCurrentFilterInfo hook is used to provide the data to the useCurrentFilterInfo hook
 * @returns The data to be used by the useCurrentFilterInfo hook
 */
function useProvideCurrentFilterInfo(): useCurrentFilterProperties {
	const [ filter, setFilter ] = useState<FilterInfo>(new FilterInfo());

	return {
		curFilter: filter,
		setCurFilter: setFilter,
	};
}


/**
 * The ProvideCurrentFilterInfo component is used to provide the data to the useCurrentFilterInfo hook
 * @param children The children of the component
 * @returns The data to be used by the useCurrentFilterInfo hook
 */
// eslint-disable-next-line func-style
export const ProvideCurrentFilterInfo: FC<Props> = ({ children }) => {
	const currentFilter = useProvideCurrentFilterInfo();
	return(
		<currentFilterContext.Provider value={currentFilter}>
			{children}
		</currentFilterContext.Provider>
	);
};
