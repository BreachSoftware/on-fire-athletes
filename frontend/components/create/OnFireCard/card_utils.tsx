// Width and height in pixel of final card.
export const gameCardWidth = 1145;
export const gameCardHeight = 1720;

/**
 * Function to darken a hex string by some bit manipulation magic that nobody should understand.
 * This is needed to make the glow color darker than the exterior border
 * in order to increase contrast between the two.
 * This function does not properly handle hex strings being only 3 characters long.
 * @param hexString the hex value to darken
 * @returns the darkened hex value
 */
export function darkenHexString(hexString: string) {
    const noHashtag = hexString.replace("#", "");
    const intVal = parseInt(noHashtag, 16);
    return `#${(((intVal & 0x7e7e7e) >> 1) | (intVal & 0x808080))
        .toString(16)
        .padStart(6, "0")}`;
}

/**
 * Helper functions to convert between Hex and RGB
 * @param hex
 * @returns the rgb values of the hex color
 */
export function hexToRgb(hex: string) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

/**
 * Helper function to convert between RGB and Hex
 * @param r
 * @param g
 * @param b
 * @returns the hex string of the rgb color
 */
export function rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

/**
 * Helper function to convert between RGB and HSL
 * @param r
 * @param g
 * @param b
 * @returns the hsl values of the rgb color
 */
export function rgbToHsl(
    r: number,
    g: number,
    b: number,
): [number, number, number] {
    // eslint-disable-next-line no-param-reassign
    r = r / 255;
    // eslint-disable-next-line no-param-reassign
    g = g / 255;
    // eslint-disable-next-line no-param-reassign
    b = b / 255;
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    // eslint-disable-next-line prefer-const
    let h = 0,
        s = 0,
        l = (max + min) / 2;

    if (max != min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        // eslint-disable-next-line default-case
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h = h / 6;
    }

    return [h, s, l];
}

export function getColorAsHex(color: string) {
    if (color.startsWith("#")) {
        return color;
    }
    if (color.startsWith("rgb")) {
        const rgb = color.split("(")[1].split(")")[0].split(",");
        return rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
    }
    if (color.startsWith("hsl")) {
        const hsl = color.split("(")[1].split(")")[0].split(",");
        const h = parseFloat(hsl[0]) / 360;
        const s = parseFloat(hsl[1]) / 100;
        const l = parseFloat(hsl[2]) / 100;
        console.log({ h, s, l });
        const rgb = hslToRgb(h, s, l);
        return rgbToHex(rgb[0], rgb[1], rgb[2]);
    }
    return color;
}

/**
 * Helper function to convert between HSL and RGB
 * @param h
 * @param s
 * @param l
 * @returns the rgb values of the hsl color
 */
export function hslToRgb(
    h: number,
    s: number,
    l: number,
): [number, number, number] {
    let r = 0,
        g = 0,
        b = 0;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        // eslint-disable-next-line func-style
        const hue2rgb = (p: number, q: number, t: number): number => {
            if (t < 0) {
                // eslint-disable-next-line no-param-reassign
                t = t + 1;
            }
            if (t > 1) {
                // eslint-disable-next-line no-param-reassign
                t = t - 1;
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
            }
            if (t < 1 / 2) {
                return q;
            }
            if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6;
            }
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * A function to saturate a hex value by a given amount.
 * NOTE: ALL IGNORES WERE PUT IN PLACE TO MAKE THIS FUNCTION REFLECT WHAT MOST THINGS SAY ONLINE
 * @param hex The hex value to change
 * @param amount The amount to saturate the color by. 1 does nothing, less than 1 desaturates, more than 1 saturates.
 * @returns
 */
export function saturateHex(hex: string, amount: number = 1): string {
    // Ensure the hex string is in the correct format
    if (!/^#([0-9A-F]{6})$/i.test(hex)) {
        throw new Error("Invalid hex color format");
    }

    // Convert hex to RGB
    const [r, g, b] = hexToRgb(hex);

    // Convert RGB to HSL
    // eslint-disable-next-line prefer-const
    let [h, s, l] = rgbToHsl(r, g, b);

    // Increase saturation
    s = Math.min(1, s * amount);

    // Convert HSL back to RGB
    const [newR, newG, newB] = hslToRgb(h, s, l);

    // Convert RGB back to hex
    return rgbToHex(newR, newG, newB);
}
