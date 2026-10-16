const mongoose = require('mongoose');

const { Schema } = mongoose;

const designProjectSchema = new Schema({
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    designer: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    packageName: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 2000 },
    totalAmount: { type: Number, required: true, min: 0.01, validate: Number.isFinite },
    amountPaid: {
        type: Number,
        min: 0,
        default: 0,
        validate: {
            validator(value) {
                return Number.isFinite(value) && value <= this.totalAmount;
            },
            message: 'Amount paid cannot exceed the project total.'
        }
    },
    currency: { type: String, uppercase: true, trim: true, default: 'KES', match: /^[A-Z]{3}$/ },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active', required: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }]
}, { timestamps: true });

module.exports = mongoose.models.DesignProject || mongoose.model('DesignProject', designProjectSchema);
