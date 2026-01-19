import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    tag: { type: String, default: '🎁 Акція' },
    image: { type: String, required: true },
    buttonText: { type: String, default: '' },
    buttonLink: { type: String, default: '/catalog' },
    order: { type: Number, default: 0 }
}, { _id: true });

const settingsSchema = new mongoose.Schema({
    // Singleton key
    key: { type: String, default: 'main', unique: true },
    
    // Store info
    storeName: { type: String, default: '' },
    storeDescription: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    
    // Contacts (new unified format)
    contacts: {
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        address: { type: String, default: '' }
    },
    
    // Social links
    socialLinks: {
        instagram: { type: String, default: '' },
        telegram: { type: String, default: '' },
        tiktok: { type: String, default: '' },
        youtube: { type: String, default: '' },
        facebook: { type: String, default: '' }
    },
    
    // Legacy contacts (for backward compatibility)
    contactEmails: [{ type: String }],
    contactPhones: [{ type: String }],
    address: { type: String, default: '' },
    
    // Working hours
    workingHours: {
        weekdays: { type: String, default: '10:00 - 20:00' },
        saturday: { type: String, default: '10:00 - 18:00' },
        sunday: { type: String, default: 'Вихідний' }
    },
    
    // Hero section
    heroTitle: { type: String, default: '' },
    heroSubtitle: { type: String, default: '' },
    heroEnabled: { type: Boolean, default: true },
    
    // Slider
    heroSliderEnabled: { type: Boolean, default: false },
    heroSlider: [slideSchema],
    
    // Theme (CSS variables)
    theme: {
        type: Map,
        of: String,
        default: {}
    }
    
}, { timestamps: true });

// Static method to get settings (singleton pattern)
settingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne({ key: 'main' });
    if (!settings) {
        settings = await this.create({ key: 'main' });
    }
    return settings;
};

// Static method to update settings
settingsSchema.statics.updateSettings = async function(data) {
    const settings = await this.findOneAndUpdate(
        { key: 'main' },
        { $set: data },
        { new: true, upsert: true, runValidators: true }
    );
    return settings;
};

export default mongoose.model('Settings', settingsSchema);
