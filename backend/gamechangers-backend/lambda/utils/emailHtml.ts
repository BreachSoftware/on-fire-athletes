// Disables eslint for this file as it is 1: A template and 2: HTML
/* eslint-disable */

/**
 *
 * Creates a template HTML email to send to a user
 *
 * @param toUUID The UUID of the user to send the email to
 * @param generatedByUUID The UUID of the user who created the card
 * @param cardUUID The UUID of the card
 * @returns The HTML for the email
 */
export function emailTemplate(body: string) {
	return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>
	<!--[if gte mso 9]>
	<xml>
	<o:OfficeDocumentSettings>
		<o:AllowPNG/>
		<o:PixelsPerInch>96</o:PixelsPerInch>
	</o:OfficeDocumentSettings>
	</xml>
	<![endif]-->
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="x-apple-disable-message-reformatting">
	<meta name="color-scheme" content="light">
	<meta name="supported-color-schemes" content="light">
	<!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
	<title></title>

	<style type="text/css">

	@media only screen and (min-width: 620px) {
		.u-row {
			width: 1000px !important;
		}
		.u-row .u-col {
			vertical-align: top;
		}

		.u-row .u-col-100 {
			width: 1000px !important;
		}

		}

		@media (max-width: 620px) {
			.u-row-container {
				max-width: 100% !important;
				padding-left: 0px !important;
				padding-right: 0px !important;
			}
			.u-row .u-col {
				min-width: 320px !important;
				max-width: 100% !important;
				display: block !important;
			}
			.u-row {
				width: 100% !important;
			}
			.u-col {
				width: 100% !important;
			}
			.u-col > div {
				margin: 0 auto;
			}
			.cardImage {
				max-width: 150px !important;
				height: auto !important;
				margin-top: 25px !important;
			}
		}

		body {
		margin: 0;
		padding: 0;
		}

		table,
		tr,
		td {
		vertical-align: top;
		border-collapse: collapse;
		}

		p {
		margin: 0;
		}

		.ie-container table,
		.mso-container table {
		table-layout: fixed;
		}

		.button {
			background-color: #28BC06; /* Green */
			border: none;
			color: white;
			padding: 10px 32px;
			margin: 15px;
			text-align: center;
			text-decoration: none;
			display: inline-block;
			font-size: 16px;
			border-radius: 30px;
			margin-top: 40px;
			margin-bottom: 40px;
			cursor: pointer;
		}
		
		.button:hover {
			background-color: #04AA6D; /* Green */
			color: white;
		}
		* {
		line-height: inherit;
		}

		a[x-apple-data-detectors='true'] {
		color: #27CE01 !important;
		text-decoration: none !important;
		}

		table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_2 .v-container-padding-padding { padding: 40px 10px 0px !important; } #u_content_image_2 .v-text-align { text-align: center !important; } #u_content_text_10 .v-container-padding-padding { padding: 10px !important; } #u_content_text_10 .v-text-align { text-align: center !important; } }
	</style>
	<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&display=swap" rel="stylesheet">
	</head>

	<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
	<!--[if IE]><div class="ie-container"><![endif]-->
	<!--[if mso]><div class="mso-container"><![endif]-->
	<table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
	<tbody>
	<tr style="vertical-align: top">
		<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
		<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
		

	<div class="u-row-container" style="padding: 0px;background-color: transparent">
	<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 1000px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
		<div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
		<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:1000px;"><tr style="background-color: #ffffff;"><![endif]-->
		
	<!--[if (mso)|(IE)]><td align="center" width="1000" style="width: 1000px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
	<div class="u-col u-col-100" style="max-width: 320px;min-width: 1000px;display: table-cell;vertical-align: top;">
	<div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
	<!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

	<table id="u_content_image_2" style="font-family:'Open Sans',sans-serif;background: #12171E" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
	<tbody>
		<tr>
		<td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:75px 10px 0px 30px;font-family:'Open Sans',sans-serif;" align="left">
			
		<table width="100%" cellpadding="0" cellspacing="0" border="0">
		<tr>
			<td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="left">
			
			<img align="left" border="0" src="https://on-fire-athletes.netlify.app/on-fire-athletes-full-logo.png" alt="image" title="image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none; width: 100%; max-width: 222px;"/>
			
			</td>
		</tr>
		</table>

		</td>
		</tr>
	</tbody>
	</table>

	${body}

	</body>

	</html>`;
}
