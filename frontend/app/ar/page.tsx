"use client";

import dynamic from "next/dynamic";

const ARViewer = dynamic(() => {
	return import("../../components/create/OnFireCard/ar/arviewer");
}, {
	ssr: false,
});

/**
 * Renders the AR screen. So a user can view their card in AR.
 * @returns {JSX.Element} The rendered AR screen.
 */
export default function AR() {

	return (
		<>
			<ARViewer />
		</>
	);
}
