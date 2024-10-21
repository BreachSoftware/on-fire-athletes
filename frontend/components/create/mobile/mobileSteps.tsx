/* eslint-disable max-len */
import CardDescription from "./cardDescription";
// eslint-disable-next-line no-use-before-define
import React from "react";
import MobileStep2 from "./mobileStep2";
import MobileStep8 from "./mobileStep8";
import MobileStep7 from "./mobileStep7";
import MobileUpload from "./MobileUpload";
import MobileStep1 from "./mobileStep1";
import MobileStep6 from "./mobileStep6";
import MobileStep9 from "./mobileStep9";

/**
 * This is a template array for all of the mobile step titles.
 */
export const mobileCardCreationStepTitles = [
    "Name / Team",
    "Player Information",
    "Front Photo",
    "Back Video (Optional)",
    "Signature",
    "Colors",
    "Text Styles",
    "Background Patterns",
    "Background Colors",
    "Description",
];

/**
 *
 * This is a template array for all of the mobile step JSX elements.
 * The MobileStepWrapper will iterate through this array when a user
 * clicks the next or back button.
 *
 * To avoid merge conflicts:
 *  - Please only modify/replace the JSX Text elements in this array
 *  - Do NOT modify the comments
 *  - Do NOT modify the array itself
 *
 */
export const mobileCardCreationSteps: React.ReactElement[] = [
    // Mobile Step 1
    <MobileStep1 key={"1"} />,

    // Mobile Step 2
    <MobileStep2 key={"2"} />,

    // Mobile Step 3
    // photo upload
    <MobileUpload type={"photo"} key={"3"} />,

    // Mobile Step 4
    // video upload
    <MobileUpload type={"video"} key={"4"} />,

    // Mobile Step 5
    // signature upload
    <MobileUpload type={"sig"} key={"5"} />,

    // Mobile Step 6
    <MobileStep6 key={"6"} />,

    // Mobile Step 7
    <MobileStep7 key={"7"} />,

    // Mobile Step 8
    <MobileStep8 key={"8"} />,

    // Mobile Step 9
    <MobileStep9 key={"9"} />,

    // Mobile Step 10
    <CardDescription key={"10"} />,
];
