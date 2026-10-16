const mongoose = require('mongoose');

const { Schema } = mongoose;

const imageSchema = new Schema({
    url: { type: String, required: true, trim: true, maxlength: 2048 },
    alt: { type: String, trim: true, maxlength: 160 }
}, { _id: false });

const locationSchema = new Schema({
    address: { type: String, trim: true, maxlength: 200 },
    locality: { type: String, trim: true, maxlength: 100 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    county: { type: String, trim: true, maxlength: 100 },
    country: { type: String, trim: true, default: 'Kenya', maxlength: 100 },
    coordinates: {
        latitude: { type: Number, min: -90, max: 90 },
        longitude: { type: Number, min: -180, max: 180 }
    }
}, { _id: false });

const propertySchema = new Schema({
    title: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, trim: true, maxlength: 5000 },
    intent: { type: String, enum: ['buy', 'rent', 'commercial'], required: true, index: true },
    type: {
        type: String,
        enum: ['apartment', 'villa', 'land', 'commercial', 'townhouse', 'maisonette', 'other'],
        required: true
    },
    price: { type: Number, required: true, min: 0, validate: Number.isFinite },
    currency: { type: String, uppercase: true, trim: true, default: 'KES', match: /^[A-Z]{3}$/ },
    pricePeriod: { type: String, enum: ['once', 'month', 'year'], default: 'once' },
    bedrooms: { type: Number, min: 0, max: 100, default: 0 },
    bathrooms: { type: Number, min: 0, max: 100 },
    areaSqm: { type: Number, min: 0 },
    location: { type: locationSchema, required: true },
    features: [{ type: String, trim: true, maxlength: 100 }],
    images: { type: [imageSchema], default: [] },
    status: {
        type: String,
        enum: ['draft', 'published', 'reserved', 'under-contract', 'rented', 'sold', 'withdrawn'],
        default: 'draft',
        index: true
    },
    listedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    publishedAt: { type: Date, default: null }
}, { timestamps: true });

propertySchema.index({ 'location.city': 1, intent: 1, status: 1 });
propertySchema.index({ price: 1, bedrooms: 1 });
propertySchema.index({ title: 'text', description: 'text', 'location.city': 'text', 'location.locality': 'text' });

module.exports = mongoose.models.Property || mongoose.model('Property', propertySchema);
