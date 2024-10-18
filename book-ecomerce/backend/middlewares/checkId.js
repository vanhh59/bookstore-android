import { isValidObjectId } from "mongoose";

// Kiểm tra xem id có hợp lệ không với hàm isValidObjectId từ mongoose
function checkId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error(`Invalid Object of: ${req.params.id}`);
  }
  next();
}

export default checkId;