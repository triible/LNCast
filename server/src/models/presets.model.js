import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const presetsSchema = new Schema({
    title: { type: String, required: true },
    order: { type: Number, default: 0, required: true }
});

const Presets = mongoose.model('Presets', presetsSchema);

export default Presets;