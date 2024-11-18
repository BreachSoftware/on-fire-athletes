// The max line length rule is disabled because the email body is vanilla HTML
/* eslint-disable max-len */

/**
 * This function generates the email body for the AddToCollectionEmail
 * If the requester does not have a first or last name (denoted by three empty spaces), the email will be referenced as the requester
 * @param requesterUUID - the UUID of the requester
 * @param generatedByUUID - the UUID of the user who generated the card
 * @param cardUUID - the UUID of the card
 * @param cardFirstName - the first name of the card
 * @param cardLastName - the last name of the card
 * @param cardImage - the image of the card
 * @param requesterName - the name of the requester
 * @param requesterEmail - the email of the requester
 * @returns the email body
 */
export function requestNILVerificationEmailBody(
	firstName: string,
	lastName: string,
	email: string,
	schoolName: string,
	instagram: string,
	twitter: string,
): string {
	const messageToReturn = `<table id="u_content_text_10" style="font-family: Arial, sans-serif; font-size: 18px; background: #12171E; padding: 20px 0;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
		<tbody>
			<tr>
				<td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px 10px 20px;font-family: Arial, sans-serif; font-size: 18px;" align="left">
					<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
						<tr>
							<td colspan="2" style="vertical-align: top;">
								<img border="0" src="https://onfireathletes.com/youre-on-fire-logo.png"  alt="You're On Fire" style=" width: 425px; height: 75px; padding-left: 15px; padding-top: 30px; padding-bottom: 15px">
							</td>
						</tr>
						<tr>
							<td style="vertical-align: top; padding-right: 60px;">
								<div style="color: white; background: #12171E; line-height: 140%; text-align: left; word-wrap: break-word;">
									<p style="line-height: 200%; padding-left: 15px;">NIL Verification Request From ${firstName} ${lastName}!</p>
									<p style="line-height: 140%; padding-left: 15px;">
                                        <span style="color: #27CE01;">Name:</span> ${firstName} ${lastName}
                                    </p>
									<p style="line-height: 140%; padding-left: 15px;">
                                        <span style="color: #27CE01;">Email:</span> ${email}
                                    </p>
									<p style="line-height: 140%; padding-left: 15px;">
                                        <span style="color: #27CE01;">School:</span> ${schoolName}
                                    </p>
                                    <a href=${instagram}>
									<p style="line-height: 140%; padding-left: 15px;">
                                        <span style="color: #27CE01;">Instagram:</span> ${instagram}
                                    </p>
                                    </a>
                                    <a href=${twitter}>
									<p style="line-height: 140%; padding-left: 15px;">
                                        <span style="color: #27CE01;">twitter:</span> ${twitter}
                                    </p>
                                    </a>
									<br>
									<p style="line-height:140%;"></p>
								</div>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
	`;

	return messageToReturn;
}
