import axios from 'axios';
import * as cheerio from 'cheerio';

async function testProductExtraction() {
    try {
        const response = await axios.get('https://dartvaper.ua/catalog/vape-startovye-nabory/brand-vaporesso');
        const $ = cheerio.load(response.data);

        const products = $('.fn_product');
        console.log(`Found ${products.length} products`);

        // Test first 3 products
        products.slice(0, 3).each((i, el) => {
            const $el = $(el);
            const name = $el.find('.product_name a, .fn_product_name a, h3 a, .name a').text().trim();
            const price = $el.find('.product_price, .price, .fn_price').text().trim();
            const image = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');

            console.log(`\n=== Product ${i + 1} ===`);
            console.log('Name:', name);
            console.log('Price:', price);
            console.log('Image:', image);
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testProductExtraction();
