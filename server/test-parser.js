import axios from 'axios';
import * as cheerio from 'cheerio';

const CATALOG_URL = 'https://dartvaper.ua/catalog/vape-startovye-nabory/brand-vaporesso';

async function testParser() {
    console.log('🔍 Testing parser on:', CATALOG_URL);

    const response = await axios.get(CATALOG_URL, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
    });

    const $ = cheerio.load(response.data);

    console.log('\n📦 Testing selector: .fn_product');
    const products = $('.fn_product').toArray();
    console.log(`Found ${products.length} products with .fn_product`);

    if (products.length > 0) {
        console.log('\n🔍 First product details:');
        const $first = $(products[0]);

        const name = $first.find('.fn_product_name').text().trim();
        const price = $first.find('.fn_price').text().trim();
        const img = $first.find('img').first();
        const imgSrc = img.attr('src') || img.attr('data-src') || img.attr('data-lazy');
        const link = $first.find('a').first().attr('href');

        console.log('Name:', name || 'NOT FOUND');
        console.log('Price:', price || 'NOT FOUND');
        console.log('Image src:', imgSrc || 'NOT FOUND');
        console.log('Link:', link || 'NOT FOUND');
        import axios from 'axios';
        import * as cheerio from 'cheerio';

        const CATALOG_URL = 'https://dartvaper.ua/catalog/vape-startovye-nabory/brand-vaporesso';

        async function testParser() {
            console.log('🔍 Testing parser on:', CATALOG_URL);

            const response = await axios.get(CATALOG_URL, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                }
            });

            const $ = cheerio.load(response.data);

            console.log('\n📦 Testing selector: .fn_product');
            const products = $('.fn_product').toArray();
            console.log(`Found ${products.length} products with .fn_product`);

            if (products.length > 0) {
                console.log('\n� First product details:');
                const $first = $(products[0]);

                const name = $first.find('.fn_product_name').text().trim();
                const price = $first.find('.fn_price').text().trim();
                const img = $first.find('img').first();
                const imgSrc = img.attr('src') || img.attr('data-src') || img.attr('data-lazy');
                const link = $first.find('a').first().attr('href');

                console.log('Name:', name || 'NOT FOUND');
                console.log('Price:', price || 'NOT FOUND');
                console.log('Image src:', imgSrc || 'NOT FOUND');
                console.log('Link:', link || 'NOT FOUND');

                console.log('\n�📋 All classes on first product:');
                console.log($first.attr('class'));

                console.log('\n📋 HTML structure (first 500 chars):');
                console.log($first.html().substring(0, 500));

                console.log('\n\n=== FULL HTML ===');
                console.log($first.html());
            } else {
                console.log('\n❌ No products found! Testing alternative selectors...');

                console.log('\n🔍 All divs with "product" in class:');
                $('div[class*="product"]').each((i, el) => {
                    if (i < 3) console.log($(el).attr('class'));
                });
            }
        }

        testParser().catch(console.error);
