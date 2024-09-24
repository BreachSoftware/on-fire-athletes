/**
* Set an item in local storage with an expiry time.
* @param value  The value to store.
* @param ttl  The time to live in hours.
*/
export function setWithExpiry(name: string, value: string, timeInHours: number) {
	const now = new Date();

	// `item` is an object which contains the original value
	// as well as the time when it's supposed to expire
	const item = {
		value: value,
		expiry: now.getTime() + (timeInHours * 60 * 60 * 1000)
	};
	localStorage.setItem(name, JSON.stringify(item));
}

/**
* Get an item from local storage with an expiry time.
* @returns The value of the item if it exists and is not expired, otherwise null.
*/
export function getWithExpiry(name: string) {
	if (typeof window === "undefined") {
		return null;
	}
	const itemStr = localStorage.getItem(name);
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null;
	}
	const item = JSON.parse(itemStr);
	const now = new Date();
	// compare the expiry time of the item with the current time
	if (now.getTime() > item.expiry) {
		// If the item is expired, delete the item from storage
		// and return null
		localStorage.removeItem(name);
		return 1;
	}
	return item.value;
}
