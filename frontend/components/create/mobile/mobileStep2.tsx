import { Grid, GridItem } from "@chakra-ui/react";
import DropdownInput from "../DropdownInput";
import PositionDropdown from "../PositionDropdown";
import { SportsLevels } from "../SportsLevels";
import { SportsPositions } from "../SportsPositions";
import MobileCardCreationTextBox from "./mobileCardCreationTextBox";
import { useEffect, useState } from "react";

/**
 * Step 2 of the mobile creation process
 */
export default function MobileStep2() {

	const [ dropdownWidth, setDropdownWidth ] = useState("100%");
	window.addEventListener("resize", () => {
		const width = window.innerWidth;
		setDropdownWidth(`${width / 2 - 30}px`);
	});

	useEffect(() => {
		const width = window.innerWidth;
		setDropdownWidth(`${width / 2 - 30}px`);
	}, []);

	return (
		<Grid
			key="2"
			templateColumns="1fr 1fr"
			templateRows="1fr 1fr"
			gap={2}
			width={"100%"}>
			<GridItem>
				<DropdownInput
					title={"Sport*"}
					options={[ ...Object.keys(SportsPositions) ]}
					attribute={"sport"}
					opacity={1}
					textColor="white"
					backgroundColor={"#121212"}
					h={"40px"}
					referenceWidth={dropdownWidth}
				/>
			</GridItem>
			<GridItem>
				<PositionDropdown
					opacity={1}
					textColor="white"
					title="Position*"
					backgroundColor={"rgb(18,18,18)"}
					h={"40px"}
					mobile
					referenceWidth={dropdownWidth}
				/>
			</GridItem>
			<GridItem>
				<MobileCardCreationTextBox placeholder="Jersey Number" attribute={"number"} type="number" maxLength={2}/>
			</GridItem>
			<GridItem>
				<DropdownInput
					title={"Career Level"}
					options={SportsLevels}
					attribute="careerLevel"
					opacity={1}
					textColor="white"
					backgroundColor={"#121212"}
					h={"40px"}
					referenceWidth={dropdownWidth}
				/>
			</GridItem>
		</Grid>
	);
}
