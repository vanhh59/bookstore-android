import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://vietanhcode:swd392@swd392.l0mnrwt.mongodb.net/book-store`);
    console.log(`Successfully connnected to mongoDB 👍`);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

// nâng cao chút nữa
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       useUnifiedTopology: true,
//       useNewUrlParser: true,
//       useCreateIndex: true,
//     });
//     console.log(`Successfully connnected to mongoDB: ${conn.connection.host} 👍`)
//   } catch (error) {
//     console.error(`ERROR: ${error.message}`);
//     process.exit(1);
//   }
// };


export default connectDB;