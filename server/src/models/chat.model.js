import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const chatSchema = new Schema({
    lnAddresses: {
        type: [
            {
                address: String,
                sent: {
                    type: Boolean,
                    default: false
                }
            }
        ], required: true
    },
    amount: { type: Number, default: 0 },
    sent: { type: Boolean, default: false },
    message: { type: String, required: true },
    error: { type: String, default: null }
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;