export enum PaymentMethod {
    Bypassed = "SKIPPED",
    Card = "CARD",
    GMEX = "GMEX",
}

export const DIGITAL_CARD_PRICES: Record<number, number> = {
    25: 9.99,
    50: 11.99,
    75: 13.99,
    100: 15.99,
    125: 17.99,
    150: 19.99,
    175: 21.99,
    200: 22.99,
    225: 23.99,
    250: 24.99,
    275: 25.99,
    300: 26.99,
    325: 27.99,
    350: 28.99,
    375: 29.99,
    400: 30.49,
    425: 30.99,
    450: 31.49,
    475: 31.99,
    500: 32.49,
};

export const PHYSICAL_CARD_PRICES: Record<number, number> = {
    1: 24.99,
    5: 39.99,
    10: 54.99,
    15: 69.99,
    20: 84.99,
    25: 99.99,
};

export const BAG_TAG_PRICES: Record<number, number> = {
    1: 19.99,
    2: 29.99,
    3: 37.99,
    4: 44.99,
    5: 49.99,
};
