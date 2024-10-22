import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Ensure all required fields are filled
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all the inputs." });
  }

  // Check if user already exists by email
  const userExistsByEmail = await User.findOne({ email });
  if (userExistsByEmail) {
    return res.status(400).json({ message: "User with this email already exists." });
  }

  // Check if user already exists by username
  const userExistsByUsername = await User.findOne({ username });
  if (userExistsByUsername) {
    return res.status(400).json({ message: "Username is already taken." });
  }

  // Hash the password before saving to the database
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user object with hashed password
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    // Save the new user to the database
    await newUser.save();

    // Create a token for the user
    createToken(res, newUser._id);

    // Send success response with user data (without password)
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Catch duplicate key error (like username or email)
      const duplicateField = Object.keys(error.keyPattern)[0]; // Get which field caused the error
      return res.status(400).json({ message: `${duplicateField} is already in use.` });
    }

    // Handle other errors during user creation
    res.status(500).json({ message: "Failed to create user, please try again." });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // In email và password để debug (tùy chọn)
  console.log(email);
  console.log(password);

  // Tìm người dùng theo email trong cơ sở dữ liệu
  const existingUser = await User.findOne({ email });

  // Kiểm tra xem người dùng có tồn tại không
  if (existingUser) {
    // So sánh mật khẩu được cung cấp với mật khẩu đã băm lưu trữ
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    // Nếu mật khẩu hợp lệ, tạo token và trả về thông tin người dùng
    if (isPasswordValid) {
      const token = createToken(res, existingUser._id); // Tạo token tại đây

      res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        token, // Thêm token vào response
      });
    } else {
      // Nếu mật khẩu không hợp lệ, trả về phản hồi 401 Unauthorized
      res.status(401).json({ message: "Email hoặc mật khẩu không hợp lệ" });
    }
  } else {
    // Nếu không tìm thấy người dùng, trả về phản hồi 404 Not Found
    res.status(404).json({ message: "Người dùng không tồn tại" });
  }
});



const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httyOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      password: updatedUser.password,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  registerUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};