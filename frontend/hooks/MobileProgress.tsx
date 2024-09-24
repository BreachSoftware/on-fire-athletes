import { mobileCardCreationSteps } from "@/components/create/mobile/mobileSteps";

export default class MobileProgress {
	completedSteps: boolean[];

	/*
		Conditions will be used to track different milestones of progress within other mobile steps.
		For example, if the user has entered a first name, the first name condition will be set to true.
		This will be used to determine if the step is complete.
		You can add more conditions as needed, and they can be checked in other components with conditions.get("firstName").
		If you add a new condition, it should be set to false by default.
	*/
	conditions: Map<string, boolean>;

	/**
	 * Constructor for the class
	 */
	constructor() {
		this.completedSteps = Array(mobileCardCreationSteps.length).fill(false);
		this.conditions = new Map<string, boolean>();
	}

	/**
	 * Sets a step to true
	 * @param stepNumber the index of the step to complete
	 */
	completeStep(stepNumber: number) {
		this.completedSteps = this.completedSteps.map((value, index) => {
			return index === stepNumber ? true : value;
		});
	}

	/**
	 * Sets a step to false
	 * @param stepNumber the index of the step to reset
	 */
	resetStep(stepNumber: number) {
		this.completedSteps = this.completedSteps.map((value, index) => {
			return index === stepNumber ? false : value;
		});
	}

	/**
	 * Resets all steps to false
	 */
	resetAllSteps() {
		this.completedSteps = Array(mobileCardCreationSteps.length).fill(false);
	}

	/**
	 * This function finds the last contiguous step that the user has completed.
	 * @returns The index of the last contiguous step that the user has completed.
	 */
	lastContiguousStep() {
		let i = 0;
		while(i < this.completedSteps.length && this.completedSteps[i]) {
			i++;
		}
		return i - 1;
	}
}
