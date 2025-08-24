export const CATALOGUE_CONFIG = {
    EXPECTED_PRODUCT_COUNT: 16,
};

export const SIZE_FILTERS_TESTS = [
    {
        size: 'XS',
        expectedProducts: ['Black Batman T-shirt']
    },
    {
        size: 'S',
        expectedProducts: ['Black Batman T-shirt', 'Blue Sweatshirt']
    }
] as const