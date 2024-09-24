/* eslint-disable max-params */
// The max line length rule is disabled because the email body is vanilla HTML
/* eslint-disable max-len */

/**
 * This function generates the email body for the AssignCardEmail
 * If the sender does not have a first or last name (denoted by three empty spaces), the email will be referenced as the requester
 * @param recepientUUID - the UUID of the recepient
 * @param generatedByUUID - the UUID of the user who generated the card
 * @param cardUUID - the UUID of the card
 * @param cardFirstName - the first name of the card
 * @param cardLastName - the last name of the card
 * @param cardImage - the image of the card
 * @param requesterName - the name of the sender
 * @param senderEmail - the email of the sender
 * @returns the email body
 */
export function assignCardEmailBody(recepientUUID: string, generatedByUUID: string, cardUUID: string, cardFirstName: string, cardLastName: string, cardImage: string, senderEmail: string, senderFirstName: string, fromUUID: string): string {

	return	`<table id="u_content_text_10" style="font-family: Arial, sans-serif; font-size: 18px; background: #12171E; padding: 20px 0;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
		<tbody>
			<tr>
				<td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px 10px 20px;font-family: Arial, sans-serif; font-size: 18px;" align="left">
					<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
						<tr>
							<td colspan="2" style="vertical-align: top;">
								<img border="0" src="https://gamechangers.zenithsoftware.dev/youre-on-fire-logo.png"  alt="You're On Fire" style=" width: 425px; height: 75px; padding-left: 15px; padding-top: 30px; padding-bottom: 15px">
							</td>
						</tr>
						<tr>
							<td style="vertical-align: top; padding-right: 60px;">
								<div style="color: white; background: #12171E; line-height: 140%; text-align: left; word-wrap: break-word;">
									<p style="line-height: 200%; padding-left: 15px;">Hey ${senderFirstName}!</p>
									<p style="line-height: 140%; padding-left: 15px;">
                                        <span style="color: #27CE01;">${senderEmail}</span> is sending you a copy of their "${cardFirstName} ${cardLastName}" card.
                                    </p>
									<br>
									<p style="line-height:140%;"></p>
									<p style="padding-left: 15px;">Click the link below to sign up or sign into your account to receive a copy of this card.</p>
									<a href="https://gamechangers.zenithsoftware.dev/${recepientUUID ? "login" : "signup" }?generatedByUUID=${generatedByUUID}&cardUUID=${cardUUID}&toUUID=${recepientUUID}&fromUUID=${fromUUID}">
									<button class="button" style="font-family: 'Barlow', sans-serif; letter-spacing: 2px; font-size: 20px;">CONFIRM TRADE NOW</button></a>
									<br>
									<p style="line-height: 140%; padding-left: 15px;">Thanks!</p>
									<p style="line-height: 140%; margin-bottom:75px; padding-left: 15px;">The OnFireAthletes Team</p>
								</div>
							</td>
							<td style="vertical-align: top; text-align: right;">
								<img class="cardImage" border="0" src="${cardImage}" alt="An image of your requested Gamechangers card" style="display: block; margin-top: -100px; max-width: 300px; height: auto; transform: rotate(348deg); -webkit-transform: rotate(348deg); -ms-transform: rotate(348deg); padding-bottom: 40px; padding-right: 20px;" />
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
	`;
}
