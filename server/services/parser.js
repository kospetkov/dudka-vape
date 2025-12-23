import axios from 'axios';
import * as cheerio from 'cheerio';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// VAPORESSO products to parse
const VAPORESSO_PRODUCTS = [
    'Xros 4 mini',
    'Xros 4',
    'Xros 5 mini',
    'Xros 5',
    'Xros 3 mini',
    'Xros mini',
    'Xros Pro',
    'Xros cube',
    'Vibe se',
    'Vibe nano kit',
    'VIBE',
    'Vibe nano pro',
    'Luxe q2',
    'Luxe q2 SE',
    'Luxe qs',
    'Xros 4 Nano',
    'Eco Nano'
];

const CATALOG_URL = 'https://dartvaper.ua/catalog/vape-startovye-nabory/brand-vaporesso';
const BASE_URL = 'https://dartvaper.ua';

// HTTP headers to mimic real browser
const BROWSER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'uk-UA,uk;q=0.9,ru;q=0.8,en-US;q=0.7,en;q=0.6',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
};

// Delay between requests to avoid rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Parse detailed product page
const parseProductDetails = async (productUrl) => {
    try {
        await delay(1000); // Wait 1 second between requests

        const response = await axios.get(productUrl, { headers: BROWSER_HEADERS });
        const $ = cheerio.load(response.data);

        // Extract full description
        const description = $('.product-annotation').text().trim() ||
                          $('[itemprop="description"]').text().trim() ||
                          '';

        // Extract all images from gallery
        const images = [];
        $('.fn_images .images_item img, .fn_images_dots img').each((i, el) => {
            let imgUrl = $(el).attr('data-src') || $(el).attr('src');
            if (imgUrl) {
                if (imgUrl.startsWith('//')) {
                    imgUrl = `https:${imgUrl}`;
                } else if (!imgUrl.startsWith('http')) {
                    imgUrl = `${BASE_URL}${imgUrl}`;
                }
                // Remove duplicates and add to array
                if (!images.some(img => img.url === imgUrl)) {
                    images.push({
                        url: imgUrl,
                        alt: $('.h1').text().trim()
                    });
                }
            }
        });

        // Extract characteristics from table
        const characteristics = {
            ua: [],
            ru: [],
            en: []
        };

        $('.purchase table tr').each((i, row) => {
            const $row = $(row);
            const key = $row.find('th').text().trim();
            const value = $row.find('td').text().trim();

            if (key && value) {
                characteristics.ua.push({ key, value });
                characteristics.ru.push({ key, value });
                characteristics.en.push({ key, value });
            }
        });

        // Extract stock status
        const outOfStock = $('.outstock_button').length > 0 ||
                          $('body').text().includes('Нет на складе');
        const stock = outOfStock ? 0 : 10; // Default to 10 if in stock

        // Extract old price (discount)
        const oldPriceText = $('.old_price').text().trim();
        const oldPriceMatch = oldPriceText.match(/[\d\s]+/);
        const oldPrice = oldPriceMatch ? parseInt(oldPriceMatch[0].replace(/\s/g, '')) : null;

        return {
            description,
            images: images.slice(0, 10), // Limit to 10 images
            characteristics,
            stock,
            oldPrice
        };
    } catch (error) {
        console.error(`❌ Error parsing product details: ${error.message}`);
        return null;
    }
};

export const parseVaporessoProducts = async () => {
    try {
        console.log('🚀 Starting VAPORESSO parser...');

        // Ensure VAPORESSO category exists
        let category = await Category.findOne({ slug: 'vaporesso' });

        if (!category) {
            category = await Category.create({
                name: {
                    ua: 'VAPORESSO',
                    ru: 'VAPORESSO',
                    en: 'VAPORESSO'
                },
                slug: 'vaporesso',
                description: {
                    ua: 'Стартові набори VAPORESSO - преміум якість та інновації',
                    ru: 'Стартовые наборы VAPORESSO - премиум качество и инновации',
                    en: 'VAPORESSO Starter Kits - premium quality and innovation'
                }
            });
            console.log('✅ Created VAPORESSO category');
        }

        // Fetch catalog page with realistic browser headers
        const response = await axios.get(CATALOG_URL, { headers: BROWSER_HEADERS });

        const $ = cheerio.load(response.data);
        let parsedCount = 0;
        let updatedCount = 0;

        // Parse product cards - dartvaper.ua uses .fn_product class
        const productElements = $('.fn_product').toArray();

        console.log(`Found ${productElements.length} products on page`);

        for (const element of productElements) {
            try {
                const $el = $(element);

                // Extract product data
                const nameText = $el.find('.product_name').text().trim();
                const priceText = $el.find('.fn_price').text().trim();
                const imageUrl = $el.find('img').first().attr('data-src') || $el.find('img').first().attr('src');
                const productUrl = $el.find('a').first().attr('href');

                if (!nameText) continue;

                // Check if this product matches our target list
                const isTargetProduct = VAPORESSO_PRODUCTS.some(targetName =>
                    nameText.toLowerCase().includes(targetName.toLowerCase())
                );

                if (!isTargetProduct) continue;

                // Parse price - extract numbers only
                const priceMatch = priceText.match(/[\d\s]+/);
                const price = priceMatch ? parseInt(priceMatch[0].replace(/\s/g, '')) : 0;

                if (!price) continue;

                // Fix image URL if relative
                let finalImageUrl = imageUrl;
                if (finalImageUrl) {
                    if (finalImageUrl.startsWith('//')) {
                        finalImageUrl = `https:${finalImageUrl}`;
                    } else if (!finalImageUrl.startsWith('http')) {
                        finalImageUrl = `${BASE_URL}${finalImageUrl}`;
                    }
                }

                // Build full product URL
                let fullProductUrl = CATALOG_URL;
                if (productUrl) {
                    if (productUrl.startsWith('http')) {
                        fullProductUrl = productUrl;
                    } else {
                        // Remove leading slash if present to avoid double slashes
                        const cleanPath = productUrl.startsWith('/') ? productUrl : `/${productUrl}`;
                        fullProductUrl = `${BASE_URL}${cleanPath}`;
                    }
                }

                // Parse detailed product page
                console.log(`📄 Parsing details for: ${nameText}`);
                const details = await parseProductDetails(fullProductUrl);

                // Generate slug
                const slug = nameText.toLowerCase()
                    .replace(/[^a-z0-9а-яіїє\s-]/g, '')
                    .replace(/\s+/g, '-');

                // Prepare product data
                const productData = {
                    name: {
                        ua: nameText,
                        ru: nameText,
                        en: nameText
                    },
                    slug,
                    brand: 'VAPORESSO',
                    category: category._id,
                    price,
                    description: details?.description ? {
                        ua: details.description,
                        ru: details.description,
                        en: details.description
                    } : undefined,
                    characteristics: details?.characteristics || undefined,
                    images: details?.images?.length > 0 ? details.images : (finalImageUrl ? [{
                        url: finalImageUrl,
                        alt: nameText
                    }] : []),
                    sourceUrl: fullProductUrl,
                    stock: details?.stock ?? 10,
                    active: true,
                    featured: true
                };

                // Check if product exists
                const existingProduct = await Product.findOne({ slug });

                if (existingProduct) {
                    // Update existing product
                    await Product.findByIdAndUpdate(existingProduct._id, productData);
                    updatedCount++;
                    console.log(`✏️  Updated: ${nameText}`);
                    console.log(`   💰 Price: ${price} грн | 📦 Stock: ${productData.stock} | 🖼️  Images: ${productData.images.length}`);
                } else {
                    // Create new product
                    await Product.create(productData);
                    parsedCount++;
                    console.log(`➕ Added: ${nameText}`);
                    console.log(`   💰 Price: ${price} грн | 📦 Stock: ${productData.stock} | 🖼️  Images: ${productData.images.length}`);
                }
            } catch (error) {
                console.error(`Error parsing product:`, error.message);
            }
        }

        console.log(`✅ Parser finished: ${parsedCount} new, ${updatedCount} updated`);
        return { parsedCount, updatedCount };
    } catch (error) {
        console.error('❌ Parser error:', error.message);
        throw error;
    }
};

// Manual trigger endpoint for testing
export const triggerParser = async (req, res) => {
    try {
        const result = await parseVaporessoProducts();
        res.json({
            success: true,
            message: 'Parser completed',
            ...result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
