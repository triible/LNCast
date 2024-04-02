import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const lnAdressSchema = new Schema({
    lnAddress: { type: String, required: true },
    preset: { type: String, default: 'Default' }
});

const LnAddress = mongoose.model('LnAddress', lnAdressSchema);

export default LnAddress;