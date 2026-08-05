import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/dbConnection.js";

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`DB connected and Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  });

