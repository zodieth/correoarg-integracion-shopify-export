import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://perlastorecontacto:bqA2ZmPrlvaBqjnB@cluster0.iyzispc.mongodb.net/";

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export default dbConnect;
