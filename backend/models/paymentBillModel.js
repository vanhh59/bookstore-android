import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const paymentBillSchema = mongoose.Schema(
    {
        senderName: {
            type: String,
            required: true,
        },

        senderBank: {
            type: String,
            required: true,
        },

        senderAccount: {
            type: String,
            required: true,
        },

        receiverName: {
            type: String,
            required: true,
        },

        receiverBank: {
            type: String,
            required: true,
        },

        receiverAccount: {
            type: String,
            required: true,
        },

        date: {
            type: String,
            required: true,
        },

        amount: {
            type: String,
            required: true,
        },

    },
    { timestamps: true }
);

const PaymentBill = mongoose.model("PaymentBill", paymentBillSchema);
export default PaymentBill;
