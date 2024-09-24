// The max line length rule is disabled because the email body is vanilla HTML
/* eslint-disable max-len */

/**
 * This function generates the email body for the contactEmail
 * If the requester does not have a first or last name (denoted by three empty spaces), the email will be referenced as the requester
 * @param firstName
 * @param lastName
 * @param email
 * @param subject
 * @param message
 * @returns the email body
 */
export function contactEmailBody(firstName: string, lastName: string, email: string, subject: string, message: string): string {

	const messageToReturn =
		`<table id="u_content_text_10" style="font-family: Arial, sans-serif; font-size: 18px; background: #12171E; padding: 20px 0;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
		<tbody>
			<tr>
			<td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px 10px 20px;font-family: Arial, sans-serif; font-size: 18px;" align="left">
				<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
				<tr>
					<td colspan="2" style="vertical-align: top;"></td>
				</tr>
				<tr>
					<td style="vertical-align: top; padding-right: 60px;">
					<div style="color: white; background: #12171E; line-height: 150%; text-align: left; word-wrap: break-word;">
						<p style="line-height: 150%; padding-left: 15px; color: white;">Name: ${firstName} ${lastName}</p>
						<p style="line-height: 150%; padding-left: 15px; color: white;">Email: ${email}</p>
						<p style="line-height: 150%; padding-left: 15px; color: white;">${subject}</p>
						<br>
						<p style="line-height:120%;"></p>
						<p style="padding-left: 15px; color: white;">${message}</p>
						<p style="line-height:120%;"></p>
					</div>
					</td>
					<td style="vertical-align: top; text-align: right;"></td>
				</tr>
				</table>
			</td>
			</tr>
		</tbody>
		</table>
	`;

	return messageToReturn;
}
