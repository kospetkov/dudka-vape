import axios from 'axios';
import * as cheerio from 'cheerio';

async function findCorrectSelectors() {
    try {
        const response = await axios.get('https://dartvaper.ua/catalog/vape-startovye-nabory/brand-vaporesso');
        const $ = cheerio.load(response.data);

        // Find all divs with 'product' in class name
        const productDivs = $('div[class*="product"]');
        console.log(`Found ${productDivs.length} divs with 'product' in class`);

        // Get unique class names
        const classes = new Set();
        productDivs.each((i, el) => {
            const classList = $(el).attr('class');
            if (classList) {
                classList.split(' ').forEach(c => {
                    if (c.includes('product')) classes.add(c);
                });
            }
        });

        console.log('\nUnique product classes:', Array.from(classes));

        // Try to find product cards
        console.log('\n=== Trying different selectors ===');
        console.log('.product-item:', $('.product-item').length);
        console.log('.product-card:', $('.product-card').length);
        console.log('.product:', $('.product').length);

        // Get first element and analyze structure
        const first = productDivs.first();
        console.log('\n=== First product element ===');
        console.log('Class:', first.attr('class'));
        console.log('HTML preview:', first.html()?.substring(0, 300));

    } catch (error) {
        console.error('Error:', error.message);
    }
}

findCorrectSelectors();
