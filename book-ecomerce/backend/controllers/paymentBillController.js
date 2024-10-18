import PaymentBill from "../models/paymentBillModel.js";  // Make sure the path is correct
import asyncHandler from "../middlewares/asyncHandler.js";  // Middleware for error handling

// Add new payment bill
const addPaymentBill = asyncHandler(async (req, res) => {
    const { senderName, senderBank, senderAccount, receiverName, receiverBank, receiverAccount, date, amount } = req.body;

    // Validate input fields
    if (!senderName || !senderBank || !senderAccount || !receiverName || !receiverBank || !receiverAccount || !date || !amount) {
        res.status(400);
        throw new Error("Please provide all the required fields");
    }

    // Create a new payment bill object
    const newPaymentBill = new PaymentBill({
        senderName,
        senderBank,
        senderAccount,
        receiverName,
        receiverBank,
        receiverAccount,
        date,
        amount,
    });

    // Save the payment bill to the database
    const createdPaymentBill = await newPaymentBill.save();

    // Send response with the created payment bill
    res.status(201).json({
        success: true,
        message: "Payment bill created successfully",
        data: createdPaymentBill,
    });
});

// Get all payment bills
const getPaymentBillsAll = asyncHandler(async (req, res) => {
    // Fetch all payment bills from the database
    const paymentBills = await PaymentBill.find({});

    // Send response with the payment bills
    res.json({
        success: true,
        data: paymentBills,
    });
});

const getPaymentBillById = asyncHandler(async (req, res) => {
    // Fetch payment bill by id from the database
    const paymentBill = await PaymentBill.findById(req.params.id);

    // Validate payment bill
    if (!paymentBill) {
        res.status(404);
        throw new Error("Payment bill not found");
    }

    // Send response with the payment bill
    res.json({
        success: true,
        data: paymentBill,
    });
});


export { addPaymentBill, getPaymentBillsAll, getPaymentBillById };  // Export the addPaymentBill function
