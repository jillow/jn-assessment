export const CATALOGUE_CONFIG = {
    EXPECTED_PRODUCT_COUNT: 16,
    SIZES: ['XS', 'S', 'M', 'ML', 'L', 'XL', 'XXL']
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
    },
    {
        name: 'Basic cactus White T-shirt',
        price: 13.25,
        sizes: ['ML', 'L']
    },
    {
        name: 'Skater Black Sweatshirt',
        price: 25.90,
        sizes: ['XL']
    },
    {
        name: 'Black Tule Oversized',
        price: 13.25,
        sizes: ['M', 'ML']
    },
    {
        name: 'Black Batman T-shirt',
        price: 10.90,
        sizes: ['XS', 'S']
    },
    {
        name: 'Blue T-Shirt',
        price: 9.00,
        sizes: ['L', 'XL']
    },
    {
        name: 'Loose Black T-shirt',
        price: 14.00,
        sizes: ['L', 'XL', 'XXL']
    },
    {
        name: 'Ringer Hall Pass',
        price: 10.90,
        sizes: ['L', 'XL', 'XXL']
    },
];

export function getProductsForSize(size: string): ProductData[] {
    return EXPECTED_PRODUCTS.filter(product => product.sizes.includes(size));
}

export const TEST_CARTS = {
    SINGLE_ITEM: {
        product: EXPECTED_PRODUCTS[0],
        expectedSubtotal: 10.90
    },
    DOUBLE_QUANTITY: {
        product: EXPECTED_PRODUCTS[0],
        quantity: 2,
        expectedSubtotal: 21.80
    },
    DOUBLE_ITEM_DOUBLE_QUANTITY: {
        items: [
            { product: EXPECTED_PRODUCTS[0], quantity: 2},
            { product: EXPECTED_PRODUCTS[1], quantity: 2}
        ],
        expectedSubtotal: 48.30
    } 
} as const