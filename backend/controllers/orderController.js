import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import PaymentBill from "../models/paymentBillModel.js";
import OrderItems from "../models/orderItemModel.js"; // Add this import
import User from "../models/userModel.js";

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  ); // reduce method to calculate total price of all items

  const shippingPrice = itemsPrice > 100 ? 0 : 10; // 
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = async (req, res) => {
  try {
    const { user, orderItems, shippingAddress, paymentMethod, paymentBill } = req.body;

    // Check for empty order items
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // Check if the paymentBill exists
    const foundPaymentBill = await PaymentBill.findById(paymentBill);
    if (!foundPaymentBill) {
      return res.status(404).json({ message: "Payment Bill not found" });
    }

    // Fetch the user from the database
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch products from the database
    const productIds = orderItems.map(item => item.id);
    console.log(productIds);

    const itemsFromDB = await Product.find({ _id: { $in: productIds } });

    if (itemsFromDB.length !== productIds.length) {
      return res.status(404).json({ message: "One or more products not found" });
    }

    // Create OrderItems in the database and map the product references
    const orderItemsPromises = orderItems.map(async (itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() == itemFromClient.id
      );

      if (!matchingItemFromDB) {
        throw new Error(`Product not found: ${itemFromClient.id}`);
      }

      // Create a new order item and save it
      const newOrderItem = new OrderItems({
        name: matchingItemFromDB.name,
        qty: itemFromClient.qty,
        image: matchingItemFromDB.image,
        price: matchingItemFromDB.price,
        product: matchingItemFromDB._id,
      });

      return await newOrderItem.save();
    });

    const savedOrderItems = await Promise.all(orderItemsPromises);

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(savedOrderItems);

    // Create and save the order with user ID
    const order = new Order({
      user: foundUser._id, // Store only the user ID here
      paymentBill: foundPaymentBill._id,
      orderItems: savedOrderItems.map(item => item._id), // Store references to OrderItems
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    // Get user ID from URL parameters
    const userId = req.params.userId; // Extract userId from req.params

    // Validate if the user exists
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the orders for the found user
    const orders = await Order.find({ user: foundUser._id }); // Use the found user's ID

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    // Return the orders
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; // countDocuments method to count total orders

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; // reduce method to calculate total sales

const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; // aggregate method to group orders by date and calculate total sales

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );
    // populate user field with username and email 

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// markOrderAsPaid function to update order as paid
const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCartItems = async (req, res) => {
  try {
    // Fetch all orders and only select orderItems
    const orders = await Order.find({}).select('orderItems').populate('orderItems.product', 'name price image'); // Populate product details

    // Extract orderItems from each order
    const allOrderItems = orders.map(order => order.orderItems).flat();

    res.json({
      success: true,
      data: allOrderItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,

  getCartItems
};
