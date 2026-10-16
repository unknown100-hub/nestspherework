const mongoose = require('mongoose');

const { Schema } = mongoose;

const preferencesSchema = new Schema({
    smsInspection: { type: Boolean, default: true },
    emailEscrow: { type: Boolean, default: true },
    newListings: { type: Boolean, default: false },
    paymentReceipts: { type: Boolean, default: true },
    lowBalanceAlerts: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
}, { _id: false });

const paymentPreferencesSchema = new Schema({
    defaultMethod: {
        type: String,
        enum: ['mpesa', 'bank', 'card', 'wallet'],
        default: 'mpesa'
    },
    mpesaPhone: { type: String, trim: true },
    bank: { type: String, trim: true },
    lowBalanceThreshold: { type: Number, min: 0, default: 20000 }
}, { _id: false });

const userSchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 254,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: { type: String, trim: true, maxlength: 30 },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: ['client', 'contractor', 'admin'], default: 'client', required: true },
    status: { type: String, enum: ['active', 'suspended'], default: 'active', required: true },
    location: { type: String, trim: true, maxlength: 160 },
    occupation: { type: String, trim: true, maxlength: 120 },
    bio: { type: String, trim: true, maxlength: 1000 },
    verificationTier: { type: String, trim: true, maxlength: 80 },
    avatarUrl: { type: String, trim: true, maxlength: 2048 },
    language: { type: String, trim: true, default: 'English' },
    currency: { type: String, uppercase: true, trim: true, default: 'KES', match: /^[A-Z]{3}$/ },
    timezone: { type: String, trim: true, default: 'Africa/Nairobi' },
    preferences: { type: preferencesSchema, default: () => ({}) },
    paymentPreferences: { type: paymentPreferencesSchema, default: () => ({}) },
    twoFactorEnabled: { type: Boolean, default: false },
    loginAlerts: { type: Boolean, default: true },
    passwordChangedAt: { type: Date, default: null }
}, {
    timestamps: true,
    toJSON: {
        transform(_document, value) {
            delete value.passwordHash;
            delete value.__v;
            return value;
        }
    }
});

userSchema.index({ status: 1, role: 1 });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
