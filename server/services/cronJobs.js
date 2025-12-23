import cron from 'node-cron';
import { parseVaporessoProducts } from './parser.js';

export const initCronJobs = () => {
    // Schedule parser to run daily at 8:00 AM Kyiv time (Europe/Kiev timezone)
    // Cron format: minute hour day month weekday
    // '0 8 * * *' = At 8:00 AM every day

    cron.schedule('0 8 * * *', async () => {
        console.log('⏰ Cron job triggered: Running VAPORESSO product parser...');
        try {
            await parseVaporessoProducts();
        } catch (error) {
            console.error('❌ Cron job error:', error.message);
        }
    }, {
        scheduled: true,
        timezone: 'Europe/Kiev'
    });

    console.log('✅ Cron jobs initialized: Parser scheduled for 8:00 AM Kyiv time');
};
