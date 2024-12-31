// This file is auto-generated. Do not edit it manually.

/**
 * Array of all available API endpoints.
 * These are automatically generated from the serverless.yml file.
 * Nested paths are converted by replacing slashes with underscores.
 */
export const API_ENDPOINTS = [
	"sharpresize",
	"sharptint",
	"sharprecolor",
	"createCard",
	"createUser",
	"deleteCard",
	"getCard",
	"getAllCards",
	"media_generatePresignedURL",
	"getUser",
	"getUUID",
	"getToken",
	"users_username",
	"getCreatedCards",
	"users_updateUserProfile",
	"renameMedia",
	"assignCard",
	"reassignCard",
	"assignCardEmail",
	"addToCollectionEmail",
	"contactEmail",
	"createPaymentIntent",
	"retrievePaymentStatus",
	"updatePaymentStatus",
	"createSetupIntent",
	"retrievePaymentMethod",
	"applyCouponCode",
	"createOrder",
	"getOrder",
	"assignOrder",
	"createSerializedCard",
	"updateTotalCards",
	"updateCardPrice",
	"createCustomer",
	"requestNILVerification",
	"authenticate",
	"users_disconnect",
	"users_media",
	"users_images",
	"users_images_updates",
	"addSubscription",
] as const;

/**
 * Type representing valid API endpoints.
 * This type is automatically updated when new endpoints are added to API_ENDPOINTS.
 */
export type ApiEndpoint = (typeof API_ENDPOINTS)[number];
