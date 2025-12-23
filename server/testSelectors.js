import axios from 'axios';
import * as cheerio from 'cheerio';

async function testSelectors() {
    try {
        const response = await axios.get('https://dartvaper.ua/catalog/vape-startovye-nabory/brand-vaporesso');
        const $ = cheerio.load(response.data);

        console.log('=== Testing selectors ===');
        console.log('Product layouts:', $('.product-layout').length);
        console.log('Product thumbs:', $('.product-thumb').length);
        console.log('Items:', $('.item').length);
        console.log('Divs with class product:', $('div[class*="product"]').length);

        console.log('\n=== First product ===');
        const first = $('.product-layout').first();
        console.log('Name:', first.find('.name a').text().trim());
        console.log('Price:', first.find('.price').text().trim());
        console.log('Image src:', first.find('img').first().attr('src'));
        console.log('Image data-src:', first.find('img').first().attr('data-src'));

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testSelectors();
