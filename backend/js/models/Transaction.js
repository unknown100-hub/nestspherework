const mongoose = require('mongoose');
const { randomUUID } = require('node:crypto');

const { Schema } = mongoose;

const transactionSchema = new Schema({
    reference: {
        type: String,
        required: true,
        unique: true,
        default: () => `NSP-${randomUUID()}`
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    wallet: { type: Schema.Types.ObjectId, ref: 'Wallet', default: null },
    kind: {
        type: String,
        enum: ['topup', 'payment', 'refund', 'escrow-fund', 'escrow-release'],
        required: true
    },
    category: {
        type: String,
        enum: ['property', 'rent', 'design', 'booking', 'escrow', 'other'],
        required: true
    },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    amount: { type: Number, required: true, min: 0.01, validate: Number.isFinite },
    currency: { type: String, uppercase: true, trim: true, default: 'KES', match: /^[A-Z]{3}$/ },
    method: { type: String, enum: ['wallet', 'mpesa', 'bank', 'card'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'reversed'], default: 'pending', required: true },
    walletBalanceAfter: { type: Number, min: 0, default: null },
    providerReference: { type: String, trim: true, maxlength: 200 },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', default: null },
    property: { type: Schema.Types.ObjectId, ref: 'Property', default: null },
    designProject: { type: Schema.Types.ObjectId, ref: 'DesignProject', default: null },
    constructionProject: { type: Schema.Types.ObjectId, ref: 'ConstructionProject', default: null },
    completedAt: { type: Date, default: null }
}, { timestamps: true });

transactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
