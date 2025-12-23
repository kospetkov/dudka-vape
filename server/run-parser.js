import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { parseVaporessoProducts } from './services/parser.js';

dotenv.config();

async function runParser() {
    try {
        await connectDB();
        console.log('✅ Connected to MongoDB');

        console.log('🚀 Running parser...');
        const result = await parseVaporessoProducts();

        console.log('\n✅ Parser completed!');
        console.log(`   New products: ${result.parsedCount}`);
        console.log(`   Updated products: ${result.updatedCount}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

runParser();
