const mongoose = require('mongoose');

const { Schema } = mongoose;

const milestoneSchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 160 },
    percentage: { type: Number, required: true, min: 0.01, max: 100 },
    status: {
        type: String,
        enum: ['unfunded', 'funded', 'inspection-submitted', 'approved', 'released'],
        default: 'unfunded',
        required: true
    },
    inspectionReport: { type: String, trim: true, maxlength: 2000 },
    fundedAt: { type: Date, default: null },
    inspectionSubmittedAt: { type: Date, default: null },
    approvedAt: { type: Date, default: null },
    releasedAt: { type: Date, default: null },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    fundingTransaction: { type: Schema.Types.ObjectId, ref: 'Transaction', default: null },
    releaseTransaction: { type: Schema.Types.ObjectId, ref: 'Transaction', default: null }
});

const constructionProjectSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contractor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, trim: true, maxlength: 3000 },
    budget: { type: Number, required: true, min: 0.01, validate: Number.isFinite },
    currency: { type: String, uppercase: true, trim: true, default: 'KES', match: /^[A-Z]{3}$/ },
    status: { type: String, enum: ['draft', 'active', 'completed', 'cancelled'], default: 'draft', required: true },
    milestones: {
        type: [milestoneSchema],
        default: [],
        validate: {
            validator(milestones) {
                if (milestones.length === 0) return true;
                const total = milestones.reduce((sum, milestone) => sum + milestone.percentage, 0);
                return Math.abs(total - 100) < 0.01;
            },
            message: 'Construction milestone percentages must total 100.'
        }
    }
}, { timestamps: true });

module.exports = mongoose.models.ConstructionProject
    || mongoose.model('ConstructionProject', constructionProjectSchema);
