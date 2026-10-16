const mongoose = require('mongoose');

const { Schema } = mongoose;

const walletSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, min: 0, default: 0, validate: Number.isFinite },
    currency: { type: String, uppercase: true, trim: true, default: 'KES', match: /^[A-Z]{3}$/ },
    status: { type: String, enum: ['active', 'frozen'], default: 'active', required: true }
}, { timestamps: true });

module.exports = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);
