/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
/* eslint-disable func-style */
"use client";
import {
    FC,
    ReactNode,
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
} from "react";
import { Amplify } from "aws-amplify";
import config from "../app/amplifyconfiguration.json";
import {
    signUp,
    signIn,
    signOut,
    fetchAuthSession,
    getCurrentUser,
    confirmSignUp,
    AuthUser,
    resetPassword,
    confirmResetPassword,
} from "aws-amplify/auth";
import profileInfo from "@/interfaces/profileInfo";
import { apiEndpoints } from "@backend/EnvironmentManager/EnvironmentManager";
import { UserFields } from "@/types/user.types";

Amplify.configure(config);

interface Result {
    success: boolean;
    message: string;
}

export interface useAuthProps {
    isLoading: boolean;
    isAuthenticated: boolean;
    signIn: (
        username: string,
        password: string,
        profile: profileInfo,
    ) => Promise<Result>;
    signOut: () => Promise<void>;
    signUp: (email: string, password: string) => Promise<Result>;
    confirm: (username: string, confirmationCode: string) => Promise<boolean>;
    reset: (username: string) => Promise<Result>;
    confirmReset: (
        username: string,
        code: string,
        password: string,
    ) => Promise<Result>;
    currentSession: () => void;
    currentAuthenticatedUser: () => Promise<AuthUser>;
    dbUser: UserFields | null;
    refreshUser: () => Promise<void>;
    isSubscribed: boolean;
}

type Props = {
    children?: ReactNode;
};

const authContext = createContext({} as useAuthProps);

// setting the useAuth hook that will be accessed in other files to call auth functions
export const useAuth = () => {
    return useContext(authContext);
};

/**
 * The useProvideAuth hook is used to provide the data to the useAuth hook
 * @returns The data to be used by the useAuth hook
 */
function useProvideAuth(): useAuthProps {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [dbUser, setDbUser] = useState<UserFields | null>(null);

    /**
     * Uses aws-amplify sdk to get the auth session for the current user
     */
    async function currentAuthenticatedUser() {
        try {
            const { username, userId, signInDetails } = await getCurrentUser();
            return { username, userId, signInDetails };
        } catch (err) {
            if (
                (err as Error).name !== "UserUnAuthenticatedException" &&
                (err as Error).message !== "Network error"
            ) {
                console.error(err);
            }
            return { username: "", userId: "" };
        }
    }

    /**
     * Checks if a profile already exists for the given user
     * @param uuid - the uuid of the user
     */
    async function checkForPreExistingProfile(uuid: string) {
        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow",
        };

        const response = await fetch(
            `${apiEndpoints.getUser()}?uuid=${encodeURIComponent(uuid)}`,
            requestOptions,
        );

        const dbUser: UserFields = await response.json();

        setDbUser(dbUser);

        return response.ok;
    }

    async function setDbUserInContext(uuid: string) {
        if (!uuid) {
            return;
        }

        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow",
        };

        const response = await fetch(
            `${apiEndpoints.getUser()}?uuid=${encodeURIComponent(uuid)}`,
            requestOptions,
        );

        const dbUser: UserFields = await response.json();

        setDbUser(dbUser);
    }

    /**
     * Uses aws-amplify sdk to call the sign in function for the given user information
     * Handles the sign out function
     * @param void
     */
    async function handleSignOut() {
        try {
            setIsAuthenticated(false);
            await signOut();
        } catch (error) {
            console.error("error signing out: ", error);
        }
    }

    /**
     * Uses aws-amplify sdk to call the sign in function for the given user information
     * @param username 		the username for the user
     * @param password 		the password for the user
     */
    async function handleSignIn(
        username: string,
        password: string,
        profile: profileInfo,
    ): Promise<Result> {
        try {
            const { nextStep } = await signIn({ username, password });

            setIsAuthenticated(true);

            if (nextStep) {
                const userId = await currentAuthenticatedUser();

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                let profileAlreadyExists = true;
                try {
                    profileAlreadyExists = await checkForPreExistingProfile(
                        userId.userId,
                    );
                } catch (error) {
                    console.error(
                        "error checking for pre-existing profile:",
                        error,
                    );
                    return {
                        success: true,
                        message:
                            "Successful sign in but unsuccessful profile check",
                    };
                }

                if (!profileAlreadyExists) {
                    const requestOptions: RequestInit = {
                        method: "POST",
                        headers: myHeaders,
                        body: JSON.stringify({
                            uuid: userId.userId,
                            email: username,
                            team_hometown: profile.teamName,
                            socials: null,
                            position: profile.position,
                            media: [],
                            last_name: profile.lastName,
                            generated: Math.floor(Date.now() / 1000),
                            first_name: profile.firstName,
                            bio: profile.NFTDescription,
                            avatar: null,
                        }),
                        redirect: "follow",
                    };

                    const request = await fetch(
                        apiEndpoints.createUser(),
                        requestOptions,
                    );
                    if (!request.ok) {
                        console.error(
                            "error creating user profile:",
                            request.statusText,
                        );
                        return {
                            success: true,
                            message:
                                "Successful sign in but unsuccessful profile creation",
                        };
                    }
                }

                return { success: true, message: "sent code" };
            }
        } catch (error: unknown) {
            console.error("error signing in:", error);
            const code = (error as Error).name;
            console.error("code here", code);
            if (code === "NotAuthorizedException") {
                return { success: false, message: "User is not authorized" };
            } else if (code === "UserAlreadyAuthenticatedException") {
                return {
                    success: false,
                    message: "There is already a signed in user",
                };
            }
            return { success: false, message: "Unsuccessful sign in" };
        }
        return { success: false, message: "unsuccessful sign in" };
    }

    /**
     * Uses aws-amplify sdk to call the confirmSignUp function for the given user information
     * @param email
     * @param code
     */
    async function confirmEmail(
        username: string,
        confirmationCode: string,
    ): Promise<boolean> {
        try {
            const { isSignUpComplete } = await confirmSignUp({
                username,
                confirmationCode,
            });
            if (isSignUpComplete) {
                return true;
            }
        } catch (error) {
            console.error("error confirming sign up", error);
        }

        return false;
    }

    /**
     * Uses aws-amplify sdk to call the signup function for the given user information
     * Adds this user to the cognito user pool
     * @param {string}  email - the email for the new user
     * @param {string}  password - the password for the new user
     */
    async function signUpUser(
        email: string,
        password: string,
    ): Promise<Result> {
        try {
            const { isSignUpComplete, nextStep } = await signUp({
                username: email,
                password: password,
                options: {
                    userAttributes: {
                        email: email,
                    },
                    autoSignIn: true,
                },
            });
        } catch (error) {
            return { success: false, message: "account exists" };
        }
        return { success: true, message: "Message sent" };
    }

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { accessToken, idToken } =
                    (await fetchAuthSession()).tokens ?? {};
                if (accessToken && idToken) {
                    setIsAuthenticated(true);
                    await setDbUserInContext((await getCurrentUser()).userId);
                }
            } catch (err) {
                // Based on our current implementation, we can surpress these errors
                if (
                    (err as Error).name !== "NotAuthorizedException" &&
                    (err as Error).message !== "Network error"
                ) {
                    console.error(err);
                }
            }
            setIsLoading(false);
        };
        fetchSession();
    }, [isAuthenticated]);

    function checkIfSubscribed() {
        const currentUnixSeconds = Math.floor(Date.now() / 1000);
        const isSubscriptionActive =
            !!dbUser?.subscription_expires_at &&
            dbUser?.subscription_expires_at >= currentUnixSeconds;

        // TODO: check stripe subscription for automatic refresh if subscription_id on user

        return isSubscriptionActive;
    }

    const isSubscribed = useMemo(() => checkIfSubscribed(), [dbUser]);

    /**
     * Uses aws-amplify sdk to call the fetchAuthSession function for the current user
     */
    async function currentSession() {
        try {
            const { accessToken, idToken } =
                (await fetchAuthSession()).tokens ?? {};
        } catch (err) {
            console.error(err);
        }
    }

    /**
     *  Uses aws-amplify sdk to call the resetPassword function for the given user information
     * @param username
     */
    async function handleResetPassword(username: string) {
        try {
            const output = await resetPassword({ username });
            const { nextStep } = output;
            if (
                nextStep.resetPasswordStep == "CONFIRM_RESET_PASSWORD_WITH_CODE"
            ) {
                // Collect the confirmation code from the user and pass to confirmResetPassword.
                return { success: true, message: "Message sent" };
            }
            return { success: false, message: "account doesn't exists" };
        } catch (error) {
            console.error(error);
        }
        return { success: false, message: "Message not sent" };
    }

    /**
     * Uses aws-amplify sdk to call the confirmResetPassword function for the given user information
     * @param ConfirmResetPasswordInput
     */
    async function handleConfirmResetPassword(
        username: string,
        confirmationCode: string,
        newPassword: string,
    ) {
        try {
            await confirmResetPassword({
                username,
                confirmationCode,
                newPassword,
            });
        } catch (error) {
            const code = (error as Error).name;
            if (code === "CodeMismatchException") {
                return { success: false, message: "Invalid Code" };
            } else if (code === "ConfirmForgotPasswordException") {
                return { success: false, message: "Invalid Password" };
            }
        }
        return { success: true, message: "Password reset" }; // not sure about this one
    }

    return {
        isLoading,
        isAuthenticated,
        signIn: handleSignIn,
        signOut: handleSignOut,
        signUp: signUpUser,
        confirm: confirmEmail,
        reset: handleResetPassword,
        confirmReset: handleConfirmResetPassword,
        currentSession: currentSession,
        currentAuthenticatedUser: currentAuthenticatedUser,
        dbUser,
        refreshUser: () => setDbUserInContext(dbUser?.uuid || ""),
        isSubscribed: isSubscribed,
    };
}

export const ProvideAuth: FC<Props> = ({ children }) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};
