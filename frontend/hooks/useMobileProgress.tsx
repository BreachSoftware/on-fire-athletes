// eslint-disable-next-line no-use-before-define
import React, { createContext, useContext, useState, ReactNode } from "react";
import MobileProgress from "./MobileProgress";

// Define the shape of the context
interface CompletedMobileStepsProps {
  mobileProgress: MobileProgress;
}

// Create the context
const CompletedStepsContext = createContext<CompletedMobileStepsProps | undefined>(undefined);

/**
 * create a context provider for the completed steps
 * @param param0 children
 * @returns the context provider for the completed steps
 */
export function ProvideCompletedMobileSteps({ children }: { children: ReactNode }) {
	const [ mobileProgress ] = useState<MobileProgress>(new MobileProgress());

	return (
		<CompletedStepsContext.Provider value={{
			mobileProgress: mobileProgress
		}}>
			{children}
		</CompletedStepsContext.Provider>
	);
};

/**
 * the function to access the completed steps context
 * @returns the completed steps context
 */
export function useCompletedSteps() {
	const context = useContext(CompletedStepsContext);
	if (!context) {
		throw new Error("useCompletedSteps must be used within ProvideCompletedMobileSteps");
	}
	return context;
};
