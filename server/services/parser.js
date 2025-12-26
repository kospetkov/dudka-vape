import axios from 'axios';
import * as cheerio from 'cheerio';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const VAPORESSO_PRODUCTS = [
    'Xros 4 mini', 'Xros 4', 'Xros 5 mini', 'Xros 5', 'Xros 3 mini',
    'Xros mini', 'Xros Pro', 'Xros cube', 'Vibe se', 'Vibe nano kit',
    'VIBE', 'Vibe nano pro', 'Luxe q2', 'Luxe q2 SE', 'Luxe qs',
    'Xros 4 Nano', 'Eco Nano', 'Flexus'
];

const CATALOG_URL = 'https://dartvaper.ua/catalog/vape-startovye-nabory/brand-vaporesso';
const BASE_URL = 'https://dartvaper.ua';

const BROWSER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'uk-UA,uk;q=0.9,ru;q=0.8,en;q=0.6',
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Очистка HTML от мусора
const cleanHtml = (html) => {
    if (!html) return '';
    
    const $ = cheerio.load(html, { decodeEntities: false });
    
    // Удаляем мусорные элементы
    $('button').remove();
    $('script').remove();
    $('style').remove();
    $('.close').remove();
    $('[class*="close"]').remove();
    $('[class*="modal"]').remove();
    $('[class*="popup"]').remove();
    $('[data-dest]').removeAttr('data-dest');
    $('[class*="plink"]').removeClass('plink');
    
    // Удаляем пустые div обёртки но оставляем содержимое
    $('div.product-annotation-table').each((i, el) => {
        $(el).replaceWith($(el).html());
    });
    
    // Получаем чистый HTML
    let cleanedHtml = $.html();
    
    // Убираем html/head/body обёртки от cheerio
    cleanedHtml = cleanedHtml
        .replace(/<html><head><\/head><body>/gi, '')
        .replace(/<\/body><\/html>/gi, '')
        .trim();
    
    return cleanedHtml;
};

const parseProductDetails = async (productUrl) => {
    try {
        await delay(1000);
        const response = await axios.get(productUrl, { headers: BROWSER_HEADERS });
        const $ = cheerio.load(response.data);

        // ===== DESCRIPTION - берём и чистим HTML =====
        let descriptionHtml = '';
        const descSelectors = ['.product-annotation', '.product_description', '[itemprop="description"]'];
        
        for (const selector of descSelectors) {
            const el = $(selector);
            if (el.length > 0) {
                descriptionHtml = el.html()?.trim() || '';
                if (descriptionHtml) break;
            }
        }
        
        // Чистим HTML от мусора
        descriptionHtml = cleanHtml(descriptionHtml);

        // ===== IMAGES =====
        const images = [];
        $('.fn_images .images_item img, .fn_images_dots img').each((i, el) => {
            let imgUrl = $(el).attr('data-src') || $(el).attr('src');
            if (imgUrl) {
                if (imgUrl.startsWith('//')) imgUrl = `https:${imgUrl}`;
                else if (!imgUrl.startsWith('http')) imgUrl = `${BASE_URL}${imgUrl}`;
                if (!images.some(img => img.url === imgUrl)) {
                    images.push({ url: imgUrl, alt: $('.h1').text().trim() });
                }
            }
        });

        // ===== CHARACTERISTICS =====
        const characteristics = { ua: [], ru: [], en: [] };
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

        // ===== STOCK =====
        const isOutOfStock = $('.outstock_button').length > 0;
        const stock = isOutOfStock ? 0 : 10;

        // ===== OLD PRICE =====
        const oldPriceText = $('.old_price').text().trim();
        const oldPriceMatch = oldPriceText.match(/[\d\s]+/);
        const oldPrice = oldPriceMatch ? parseInt(oldPriceMatch[0].replace(/\s/g, '')) : null;

        return { descriptionHtml, images: images.slice(0, 10), characteristics, stock, oldPrice };
    } catch (error) {
        console.error(`❌ Error parsing details: ${error.message}`);
        return null;
    }
};

export const parseVaporessoProducts = async () => {
    try {
        console.log('🚀 Starting VAPORESSO parser...');

        let category = await Category.findOne({ slug: 'vaporesso' });
        if (!category) {
            category = await Category.create({
                name: { ua: 'VAPORESSO', ru: 'VAPORESSO', en: 'VAPORESSO' },
                slug: 'vaporesso',
                description: {
                    ua: 'Стартові набори VAPORESSO',
                    ru: 'Стартовые наборы VAPORESSO',
                    en: 'VAPORESSO Starter Kits'
                }
            });
        }

        const response = await axios.get(CATALOG_URL, { headers: BROWSER_HEADERS });
        const $ = cheerio.load(response.data);
        let parsedCount = 0, updatedCount = 0;

        const productElements = $('.fn_product').toArray();
        console.log(`Found ${productElements.length} products`);

        for (const element of productElements) {
            try {
                const $el = $(element);
                const nameText = $el.find('.product_name').text().trim();
                const priceText = $el.find('.fn_price').text().trim();
                const imageUrl = $el.find('img').first().attr('data-src') || $el.find('img').first().attr('src');
                const productUrl = $el.find('a').first().attr('href');

                if (!nameText) continue;

                const isTargetProduct = VAPORESSO_PRODUCTS.some(t => 
                    nameText.toLowerCase().includes(t.toLowerCase())
                );
                if (!isTargetProduct) continue;

                const priceMatch = priceText.match(/[\d\s]+/);
                const price = priceMatch ? parseInt(priceMatch[0].replace(/\s/g, '')) : 0;
                if (!price) continue;

                let finalImageUrl = imageUrl;
                if (finalImageUrl?.startsWith('//')) finalImageUrl = `https:${finalImageUrl}`;
                else if (finalImageUrl && !finalImageUrl.startsWith('http')) finalImageUrl = `${BASE_URL}${finalImageUrl}`;

                const fullProductUrl = productUrl?.startsWith('http') 
                    ? productUrl 
                    : `${BASE_URL}${productUrl?.startsWith('/') ? productUrl : '/' + productUrl}`;

                console.log(`📄 Parsing: ${nameText}`);
                const details = await parseProductDetails(fullProductUrl);

                const slug = nameText.toLowerCase()
                    .replace(/[^a-z0-9а-яіїє\s-]/g, '')
                    .replace(/\s+/g, '-');

                const productData = {
                    name: { ua: nameText, ru: nameText, en: nameText },
                    slug,
                    brand: 'VAPORESSO',
                    category: category._id,
                    price,
                    oldPrice: details?.oldPrice || null,
                    description: details?.descriptionHtml ? {
                        ua: details.descriptionHtml,
                        ru: details.descriptionHtml,
                        en: details.descriptionHtml
                    } : undefined,
                    characteristics: details?.characteristics || undefined,
                    images: details?.images?.length > 0 ? details.images : 
                           (finalImageUrl ? [{ url: finalImageUrl, alt: nameText }] : []),
                    sourceUrl: fullProductUrl,
                    stock: 10,  // Принудительно 10
                    active: true,
                    featured: true
                };

                const existingProduct = await Product.findOne({ slug });

                if (existingProduct) {
                    // Используем updateOne для гарантированного обновления
                    await Product.updateOne(
                        { _id: existingProduct._id },
                        { $set: productData }
                    );
                    updatedCount++;
                    console.log(`✏️  Updated: ${nameText}`);
                } else {
                    await Product.create(productData);
                    parsedCount++;
                    console.log(`➕ Added: ${nameText}`);
                }
            } catch (error) {
                console.error(`Error:`, error.message);
            }
        }

        console.log(`✅ Done: ${parsedCount} new, ${updatedCount} updated`);
        return { parsedCount, updatedCount };
    } catch (error) {
        console.error('❌ Parser error:', error.message);
        throw error;
    }
};

export const triggerParser = async (req, res) => {
    try {
        const result = await parseVaporessoProducts();
        res.json({ success: true, message: 'Parser completed', ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
