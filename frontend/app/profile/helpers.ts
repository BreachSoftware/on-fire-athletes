/**
 * Validates that the input link has the expected prefix.
 * @param link : The link to validate.
 * @param expectedPrefix : The expected prefix of the link.
 * @returns : Whether the link is valid.
 */
export function validateSocialLink(link: string, expectedPrefix: string) {
    const regex = new RegExp(`^${expectedPrefix}`, "i"); // 'i' for case-insensitive
    return regex.test(link);
}
