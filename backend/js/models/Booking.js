const mongoose = require('mongoose');
const { randomUUID } = require('node:crypto');

const { Schema } = mongoose;

const bookingSchema = new Schema({
    reference: {
        type: String,
        required: true,
        unique: true,
        default: () => `BK-${randomUUID()}`
    },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    professional: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    property: { type: Schema.Types.ObjectId, ref: 'Property', default: null },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    category: {
        type: String,
        enum: ['site-visit', 'consultation', 'inspection', 'boq-request', 'plan-review'],
        required: true
    },
    preferredDate: { type: Date, required: true },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    notes: { type: String, trim: true, maxlength: 400 },
    status: {
        type: String,
        enum: ['pending-confirmation', 'confirmed', 'completed', 'cancelled', 'rejected'],
        default: 'pending-confirmation',
        required: true
    }
}, { timestamps: true });

bookingSchema.index({ customer: 1, preferredDate: 1 });
bookingSchema.index({ status: 1, preferredDate: 1 });

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
