import app from "./app.js";
import { connectDB } from "./db/index.js";
import dotenv from "dotenv";
dotenv.config();

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server is running on http://localhost:" + process.env.PORT);
  });
});

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});
