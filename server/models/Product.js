import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        ua: { type: String, required: true },
        ru: { type: String, required: true },
        en: { type: String, required: true }
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        ua: String,
        ru: String,
        en: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    brand: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    images: [{
        url: String,
        alt: String
    }],
    characteristics: {
        ua: [{ key: String, value: String }],
        ru: [{ key: String, value: String }],
        en: [{ key: String, value: String }]
    },
    application: {
        ua: [String],
        ru: [String],
        en: [String]
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    sourceUrl: {
        type: String,
        // URL from which product was parsed
    },
    featured: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for filtering
productSchema.index({ brand: 1, price: 1 });
productSchema.index({ category: 1, active: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
