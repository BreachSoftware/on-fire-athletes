import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Center, Heading } from "@chakra-ui/react";

/**
 * ProtectedRoute component
 * @param {ReactNode} children - The children of the component.
 * @returns {JSX.Element} - The protected route component.
 */
function ProtectedRoute({ children }: { children: ReactNode }) {
	const [ loading, setLoading ] = useState(true);
	const [ showMessage, setShowMessage ] = useState(false);
	const { currentAuthenticatedUser } = useAuth();

	useEffect(() => {
		// eslint-disable-next-line require-jsdoc
		async function checkAuth() {
			try {
				const { username } = await currentAuthenticatedUser();
				if (username) {
					setLoading(false);
				} else {
					setShowMessage(true);
					setTimeout(() => {
						window.location.href = "/login";
					}, 2500);
				}
			} catch (error) {
				console.error("Error checking authentication:", error);
			}
		};

		checkAuth();

	}, [ currentAuthenticatedUser ]);


	if(loading && showMessage) {
		return <Center h={"100vh"} backgroundColor={"black"}><Heading>You must be signed in to access this page...</Heading></Center>;
	}

	if(loading) {
		return <></>;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
