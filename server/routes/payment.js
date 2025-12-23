import express from 'express';
import crypto from 'crypto';

const router = express.Router();

/**
 * LiqPay Integration Routes
 * Documentation: https://www.liqpay.ua/en/doc/api/internet_acquiring/checkout
 * 
 * Required ENV variables:
 * - LIQPAY_PUBLIC_KEY
 * - LIQPAY_PRIVATE_KEY
 */

// Helper: Generate LiqPay signature
const generateSignature = (data, privateKey) => {
    const signString = privateKey + data + privateKey;
    return crypto.createHash('sha1').update(signString).digest('base64');
};

// Helper: Encode data to base64
const encodeData = (params) => {
    return Buffer.from(JSON.stringify(params)).toString('base64');
};

// @route   POST /api/payment/create
// @desc    Create payment data for LiqPay checkout
// @access  Public
router.post('/create', async (req, res) => {
    try {
        const { orderId, amount, description, customerEmail } = req.body;

        // Get keys from ENV (or use placeholders)
        const publicKey = process.env.LIQPAY_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
        const privateKey = process.env.LIQPAY_PRIVATE_KEY || 'YOUR_PRIVATE_KEY';

        // Check if keys are configured
        if (publicKey === 'YOUR_PUBLIC_KEY' || privateKey === 'YOUR_PRIVATE_KEY') {
            return res.status(503).json({
                success: false,
                message: 'Payment system not configured. Please set LIQPAY_PUBLIC_KEY and LIQPAY_PRIVATE_KEY in environment variables.',
                demo: true
            });
        }

        // LiqPay payment parameters
        const params = {
            version: '3',
            public_key: publicKey,
            action: 'pay',
            amount: amount,
            currency: 'UAH',
            description: description || `Замовлення #${orderId}`,
            order_id: orderId,
            result_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/order-success?orderId=${orderId}`,
            server_url: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/payment/callback`,
            language: 'uk'
        };

        // Add customer email if provided
        if (customerEmail) {
            params.customer = customerEmail;
        }

        // Generate data and signature
        const data = encodeData(params);
        const signature = generateSignature(data, privateKey);

        res.json({
            success: true,
            data: data,
            signature: signature,
            checkoutUrl: 'https://www.liqpay.ua/api/3/checkout'
        });

    } catch (error) {
        console.error('Payment create error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment'
        });
    }
});

// @route   POST /api/payment/callback
// @desc    LiqPay server callback (webhook)
// @access  Public (verified by signature)
router.post('/callback', async (req, res) => {
    try {
        const { data, signature } = req.body;

        const privateKey = process.env.LIQPAY_PRIVATE_KEY || 'YOUR_PRIVATE_KEY';
        
        // Verify signature
        const expectedSignature = generateSignature(data, privateKey);
        if (signature !== expectedSignature) {
            console.error('Invalid LiqPay signature');
            return res.status(400).json({ message: 'Invalid signature' });
        }

        // Decode payment data
        const paymentData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
        
        console.log('LiqPay callback received:', paymentData);

        // Handle payment status
        const { order_id, status, amount, transaction_id } = paymentData;

        // TODO: Update order status in database
        // const order = await Order.findOneAndUpdate(
        //     { orderId: order_id },
        //     { 
        //         paymentStatus: status,
        //         transactionId: transaction_id,
        //         paidAmount: amount 
        //     }
        // );

        // Status can be: success, failure, error, wait_accept, etc.
        switch (status) {
            case 'success':
            case 'sandbox':
                console.log(`Order ${order_id} paid successfully`);
                // TODO: Send confirmation email
                break;
            case 'failure':
            case 'error':
                console.log(`Order ${order_id} payment failed`);
                break;
            default:
                console.log(`Order ${order_id} status: ${status}`);
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Payment callback error:', error);
        res.status(500).json({ message: 'Callback processing error' });
    }
});

// @route   GET /api/payment/status/:orderId
// @desc    Check payment status
// @access  Public
router.get('/status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        // TODO: Fetch from database
        // const order = await Order.findOne({ orderId });

        // Placeholder response
        res.json({
            orderId: orderId,
            status: 'pending',
            message: 'Payment status check - implement with database'
        });

    } catch (error) {
        console.error('Payment status error:', error);
        res.status(500).json({ message: 'Error checking payment status' });
    }
});

export default router;
