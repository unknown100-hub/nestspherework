const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSessionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, select: false },
    expiresAt: { type: Date, required: true, expires: 0 }
}, { timestamps: true });

module.exports = mongoose.models.UserSession || mongoose.model('UserSession', userSessionSchema);
