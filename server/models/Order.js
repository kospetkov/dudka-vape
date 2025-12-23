import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // Optional - null for guest orders
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        name: {
            ua: String,
            ru: String,
            en: String
        }
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    donationAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    guestInfo: {
        name: String,
        email: String,
        phone: String,
        address: String,
        comment: String
    },
    // Placeholders for future integrations
    delivery: {
        method: String, // Future: Nova Poshta
        trackingNumber: String
    },
    payment: {
        method: String, // Future: LiqPay
        status: String,
        transactionId: String
    }
}, {
    timestamps: true
});

// Index for user orders
orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
