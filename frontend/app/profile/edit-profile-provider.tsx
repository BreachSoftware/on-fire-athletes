// import { createContext, PropsWithChildren, useState } from "react";

// export interface ProfileInfo {
// 	first_name: string;
// 	last_name: string;
// 	team_hometown: string;
// 	position: string;
// 	bio: string;
// 	avatar: string;
// 	media: string[];
// 	facebookLink: string;
// 	xLink: string;
// 	instagramLink: string;
// 	youtubeLink: string;
// 	tiktokLink: string;
// 	snapchatLink: string;
// }

// type ProfileInfoContextType = {
//     // Profile info
//     profileInfo: ProfileInfo | undefined;

//     // Actions
//     handleUpdateProfile: () => void;

//     // Editable fields
//     editableFirstName: string;
//     editableLastName: string;
//     editablePosition: string;
//     editableTeamHometown: string;
//     editableBio: string;
//     editableProfilePicture: string;
//     editableFacebookLink: string;
//     editableXLink: string;
//     editableTiktokLink: string;
//     editableInstagramLink: string;
//     editableYoutubeLink: string;
//     editableSnapchatLink: string;
//     setEditableFirstName: (firstName: string) => void;
//     setEditableLastName: (lastName: string) => void;
//     setEditablePosition: (position: string) => void;
//     setEditableTeamHometown: (teamHometown: string) => void;
//     setEditableBio: (bio: string) => void;
//     setEditableProfilePicture: (profilePicture: string) => void;
//     setEditableFacebookLink: (facebookLink: string) => void;
//     setEditableXLink: (xLink: string) => void;
//     setEditableTiktokLink: (tiktokLink: string) => void;
//     setEditableInstagramLink: (instagramLink: string) => void;
//     setEditableYoutubeLink: (youtubeLink: string) => void;
//     setEditableSnapchatLink: (snapchatLink: string) => void;
// }

// const ProfileInfoContext = createContext<ProfileInfoContextType>({} as ProfileInfoContextType);

// /**
//  * EditProfileProvider
//  * Context provider to hold the state for the profile page
//  * @returns {JSX.Element} The provider component
//  */
// export function ProfileInfoProvider({ children }: PropsWithChildren) {
// 	const [ profileInfo ] = useState<ProfileInfo | undefined>();

// 	const [ editableFirstName, setEditableFirstName ] = useState(profileInfo?.first_name || "");
// 	const [ editableLastName, setEditableLastName ] = useState(profileInfo?.last_name || "");
// 	const [ editablePosition, setEditablePosition ] = useState(profileInfo?.position || "");
// 	const [ editableTeamHometown, setEditableTeamHometown ] = useState(profileInfo?.team_hometown || "");
// 	const [ editableBio, setEditableBio ] = useState(profileInfo?.bio || "No bio available.");
// 	const [ editableProfilePicture, setEditableProfilePicture ] = useState(profileInfo?.avatar || "");
// 	const [ editableFacebookLink, setEditableFacebookLink ] = useState(profileInfo?.facebookLink || "");
// 	const [ editableXLink, setEditableXLink ] = useState(profileInfo?.xLink || "");
// 	const [ editableTiktokLink, setEditableTiktokLink ] = useState(profileInfo?.tiktokLink || "");
// 	const [ editableInstagramLink, setEditableInstagramLink ] = useState(profileInfo?.instagramLink || "");
// 	const [ editableYoutubeLink, setEditableYoutubeLink ] = useState(profileInfo?.youtubeLink || "");
// 	const [ editableSnapchatLink, setEditableSnapchatLink ] = useState(profileInfo?.snapchatLink || "");

// 	return (
// 		<ProfileInfoContext.Provider value={{
//             profileInfo: profileInfo,
// 			handleUpdateProfile: () => {},

// 			editableFirstName: editableFirstName,
// 			editableLastName: editableLastName,
// 			editablePosition: editablePosition,
// 			editableTeamHometown: editableTeamHometown,
// 			editableBio: editableBio,
// 			editableProfilePicture: editableProfilePicture,
// 			editableFacebookLink: editableFacebookLink,
// 			editableXLink: editableXLink,
// 			editableTiktokLink: editableTiktokLink,
// 			editableInstagramLink: editableInstagramLink,
// 			editableYoutubeLink: editableYoutubeLink,
// 			editableSnapchatLink: editableSnapchatLink,
// 			setEditableFirstName: setEditableFirstName,
// 			setEditableLastName: setEditableLastName,
// 			setEditablePosition: setEditablePosition,
// 			setEditableTeamHometown: setEditableTeamHometown,
// 			setEditableBio: setEditableBio,
// 			setEditableProfilePicture: setEditableProfilePicture,
// 			setEditableFacebookLink: setEditableFacebookLink,
// 			setEditableXLink: setEditableXLink,
// 			setEditableTiktokLink: setEditableTiktokLink,
// 			setEditableInstagramLink: setEditableInstagramLink,
// 			setEditableYoutubeLink: setEditableYoutubeLink,
// 			setEditableSnapchatLink: setEditableSnapchatLink,
// 		}}>
// 			{children}
// 		</ProfileInfoContext.Provider>
// 	);
// }