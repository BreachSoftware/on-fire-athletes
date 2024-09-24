import { useCurrentCardInfo } from "@/hooks/useCurrentCardInfo";
import { useCompletedSteps } from "../../../hooks/useMobileProgress";
import { useEffect } from "react";

/**
 * A logic tracker that will track the progress of the user's steps. All rules for setting things as complete should be in here.
 */
export default function StepProgressTracker() {
	const stepHook = useCompletedSteps();
	const mobileProgress = stepHook.mobileProgress;
	const cardHook = useCurrentCardInfo();

	// Get the current card info from the context


	useEffect(() => {

		// This could be rewritten to be in a for loop with an array of all the criteria
		// and then loop through the array to check if the criteria is met.

		const step1Criteria = (
			mobileProgress.conditions.get("firstName") && mobileProgress.conditions.get("lastName") && mobileProgress.conditions.get("teamName")
		);
		const step2Criteria = cardHook.curCard.sport !== "" && cardHook.curCard.position !== "";

		// Step 1: First Name and Last Name
		// Gets set in mobileCardCreationTextBox.tsx
		if(step1Criteria && !mobileProgress.completedSteps[0]) {
			mobileProgress.completeStep(0);
		} else if(!step1Criteria && mobileProgress.completedSteps[0]) {
			mobileProgress.resetStep(0);
		}

		// Step 2: Team Name
		if(step2Criteria && !mobileProgress.completedSteps[1]) {
			mobileProgress.completeStep(1);
		} else if(!step2Criteria && mobileProgress.completedSteps[1]) {
			mobileProgress.resetStep(1);
		}

		// Step 3: Photo Upload
		// Gets set in mobileStep3.tsx

		if(mobileProgress.conditions.get("photoUpload") && !mobileProgress.completedSteps[2]) {
			mobileProgress.completeStep(2);
		} else if(!mobileProgress.conditions.get("photoUpload") && mobileProgress.completedSteps[2]) {
			mobileProgress.resetStep(2);
		}

		// Step 4: Video Upload (optional)
		if(mobileProgress.completedSteps[2] && !mobileProgress.completedSteps[3]) {
			mobileProgress.completeStep(3);
		} else if(!mobileProgress.completedSteps[2] && mobileProgress.completedSteps[3]) {
			mobileProgress.resetStep(3);
		}

		// Step 5: Signature (optional)
		if(mobileProgress.completedSteps[3] && !mobileProgress.completedSteps[4]) {
			mobileProgress.completeStep(4);
		} else if(!mobileProgress.completedSteps[3] && mobileProgress.completedSteps[4]) {
			mobileProgress.resetStep(4);
		}

		// Step 6: Colors (optional)
		if(mobileProgress.completedSteps[4] && !mobileProgress.completedSteps[5]) {
			mobileProgress.completeStep(5);
		} else if(!mobileProgress.completedSteps[4] && mobileProgress.completedSteps[5]) {
			mobileProgress.resetStep(5);
		}

		// Step 7: Text Styles (optional)
		if(mobileProgress.completedSteps[5] && !mobileProgress.completedSteps[6]) {
			mobileProgress.completeStep(6);
		} else if(!mobileProgress.completedSteps[5] && mobileProgress.completedSteps[6]) {
			mobileProgress.resetStep(6);
		}

		// Step 8: Background Patterns (optional)
		if(mobileProgress.completedSteps[6] && !mobileProgress.completedSteps[7]) {
			mobileProgress.completeStep(7);
		} else if(!mobileProgress.completedSteps[6] && mobileProgress.completedSteps[7]) {
			mobileProgress.resetStep(7);
		}

		// Step 9: Background Colors (optional)
		if(mobileProgress.completedSteps[7] && !mobileProgress.completedSteps[8]) {
			mobileProgress.completeStep(8);
		} else if(!mobileProgress.completedSteps[7] && mobileProgress.completedSteps[8]) {
			mobileProgress.resetStep(8);
		}

		// Step 10: Description (optional)
		if(mobileProgress.completedSteps[8] && !mobileProgress.completedSteps[9]) {
			mobileProgress.completeStep(9);
		} else if(!mobileProgress.completedSteps[8] && mobileProgress.completedSteps[9]) {
			mobileProgress.resetStep(9);
		}
	}, [ cardHook, mobileProgress ]);

	return null;
}
