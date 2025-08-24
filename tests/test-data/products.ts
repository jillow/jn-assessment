export const CATALOGUE_CONFIG = {
    EXPECTED_PRODUCT_COUNT: 16,
};

export interface ProductData {
    name: string;
    price: number;
    sizes: string[];
}

export const EXPECTED_PRODUCTS: ProductData[] = [
    {
        name: 'Cropped Stay Groovy off white',
        price: 10.90,
        sizes: ['L', 'XL', 'XXL']
    }
];

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