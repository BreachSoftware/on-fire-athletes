import { SportsPositions } from "@/components/create/SportsPositions";

export default class FilterInfo {
	type: string;
	sport: {
		title: string,
		tags: { title: string, value: boolean, present: boolean }[],
	};
	position: {
		title: string,
		tags: { title: string, value: boolean, present: boolean }[],
	};
	careerLevel: {
		title: string,
		tags: { title: string, value: boolean, present: boolean }[],
	};
	yearCreated: {
		title: string,
		tags: { title: string, value: boolean, present: boolean }[],
	};

	/**
	 * Constructor for the FilterInfo class
	 */
	constructor() {

		// Type of filter. 1 - All Cards, 2 - For Sale, 3 - Trade Only
		this.type = "1";

		// Sports
		this.sport = {
			title: "Sport",
			tags: Object.keys(SportsPositions).map((sport) => {
				return {
					title: sport,
					value: false,
					present: false
				};
			})
		};

		// Position
		this.position = {
			title: "Position",
			tags: Object.values(SportsPositions).flat().map((position) => {
				return {
					title: position,
					value: false,
					present: false
				};
			})
		};

		// Career Level
		this.careerLevel = {
			title: "Career Level",
			tags: [
				{ title: "Youth", value: false, present: false },
				{ title: "High School", value: false, present: false },
				{ title: "College", value: false, present: false },
				{ title: "Professional", value: false, present: false }
			]
		};

		// Year Created
		this.yearCreated = {
			title: "Year Created",
			tags: (() => {
				const currentYear = new Date().getFullYear();
				const years = [];
				for (let year = 2024; year <= currentYear; year++) {
					years.push({ title: year.toString(), value: false, present: false });
				}
				return years;
			})(),
		};
	}

	/**
	 * Converts the FilterInfo object to a string so you can see all its attributes
	 */
	static showInfo(filterInfo: FilterInfo): string {
		return(
			`
			sport: ${filterInfo.sport}
			position: ${filterInfo.position}
			careerLevel: ${filterInfo.careerLevel}
			yearCreated: ${filterInfo.yearCreated}
			`
		);
	}
}
