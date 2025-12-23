import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
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
    image: String,
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
