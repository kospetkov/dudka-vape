import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();

const seedProducts = async () => {
    try {
        await connectDB();
        console.log('🔄 Starting product seeding...');

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

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

        // Demo products with realistic data
        const products = [];

        // Insert products
        const createdProducts = await Product.insertMany(products);
        console.log(`✅ Created ${createdProducts.length} products`);

        console.log('\n📊 Summary:');
        console.log(`   Total products: ${createdProducts.length}`);
        console.log(`   Featured products: ${createdProducts.filter(p => p.featured).length}`);
        console.log(`   Products with discount: ${createdProducts.filter(p => p.discount).length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
