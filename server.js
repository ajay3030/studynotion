const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
// // const paymentRoutes = require("./routes/Payments");
// // const profileRoutes = require("./routes/Profile");
const CourseRoutes = require("./routes/Course");

const database = require("./config/database");
// // const cookieParser = require("cookie-parser");

// // const cors = require("cors");
// // const fileUpload = require("express-fileupload");
// // const { cloudnairyconnect } = require("./config/cloudinary");

require("dotenv").config();


const PORT = process.env.PORT || 6000;
database.connect();


// // app.use(cookieParser());

// // app.use(
// //   cors({
// //     origin: JSON.parse(process.env.CORS_ORIGIN),
// //     credentials: true,
// //     maxAge: 14400,
// //   })
// // );

// // app.use(
// //   fileUpload({
// //     useTempFiles: true,
// //     tempFileDir: "/tmp",
// //   })
// // );

// // cloudnairyconnect();
app.use(express.json())
app.use("/api/v1/auth", userRoutes);

// // app.use("/api/v1/payment", paymentRoutes);

// // app.use("/api/v1/profile", profileRoutes);

app.use("/api/v1/course", CourseRoutes);

// // app.use("/api/v1/contact", require("./routes/ContactUs"));



app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





// 24243214321342342 this reference code 

// const express = require('express');
// const app = express();

// require("dotenv").config();
// const PORT = process.env.PORT || 5000;

// // app.use(express.json())

// // const router = require('./routers/crud')
// // app.use('/api/v1', router);



// const database = require("./config/database");
// database.connect();

// app.get("/",(req,res)=>{
//     res.send("this is default route");
// })

// app.listen(PORT,()=>{
//   console.log("hiiiiiiiiiiiii")
// });