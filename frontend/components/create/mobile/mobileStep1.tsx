import { Grid, GridItem } from "@chakra-ui/react";
import MobileCardCreationTextBox from "./mobileCardCreationTextBox";

/**
 * The MobileStep1 component is a UI component that displays the first step for creating
 * @returns The MobileStep1 component
 */
export default function MobileStep1() {
	return(
		<Grid
			key="2"
			templateColumns="1fr 1fr"
			templateRows="1fr 1fr"
			gap={3}
			width={"100%"}>
			<GridItem>
				<MobileCardCreationTextBox placeholder="First Name*" attribute={"firstName"}/>
			</GridItem>
			<GridItem>
				<MobileCardCreationTextBox placeholder="Last Name*" attribute={"lastName"}/>
			</GridItem>
			<GridItem colSpan={2}>
				<MobileCardCreationTextBox placeholder="Team Name or Hometown*" attribute={"teamName"} maxLength={22}/>
			</GridItem>
		</Grid>
	);
}
