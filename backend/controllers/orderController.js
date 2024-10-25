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

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const foundPaymentBill = await PaymentBill.findById(paymentBill);
    if (!foundPaymentBill) {
      return res.status(404).json({ message: "Payment Bill not found" });
    }

    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const productIds = orderItems.map(item => item.id);
    console.log(productIds);
    const productsFromDB = await Product.find({ _id: { $in: productIds } });

    if (productsFromDB.length !== productIds.length) {
      return res.status(404).json({ message: "One or more products not found" });
    }

    const orderItemsPromises = orderItems.map(async (productFromClient) => {
      const matchingProductFromDB = productsFromDB.find(
        (productFromDB) => productFromDB._id.toString() == productFromClient.id
      );

      if (!matchingProductFromDB) {
        throw new Error(`Product not found: ${itemFromClient.id}`);
      }

      const orderItem = await OrderItems.findOne({ user: foundUser._id, product: matchingProductFromDB._id });

      if (orderItem) {
        orderItem.qty = productFromClient.qty;
      }

      return await orderItem.save();

    });

    const savedOrderItems = await Promise.all(orderItemsPromises);

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(savedOrderItems);

    const order = new Order({
      user: foundUser._id, 
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

    await Promise.all(savedOrderItems.map(async (item) => {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock -= item.qty; // Decrease the stock by the quantity ordered
        await product.save(); // Save the updated product
      }
    }));

    OrderItems.collection.drop();

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
    const user = req.params.id; // Extract userId from req.params

    // Validate if the user exists
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    //console.log(foundUser);

    // Fetch the orders for the found user
    const orders = await Order.find({ user: foundUser._id }); // Use the found user's ID

    if (!orders || orders.length == 0) {
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
};

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );
  
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
