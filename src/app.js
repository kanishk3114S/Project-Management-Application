import express from 'express'
import cors from 'cors'
import authRouter from "./routes/user.routes.js"

const app = express()

//basic configurations//

app.use(express.json({limit : "16kb"})); //converts the req json file to req.body.
app.use(express.urlencoded({extended: true , limit : "16kb"})); //extends the URL
app.use(express.static("public")); //

//cors configurations//

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

//Importing the route//

import healthCheckRoutes from "./routes/health.routes.js"
import hamaraRouter from './routes/user.routes.js';

//middleware//
app.use("/api/v1/healthcheck", healthCheckRoutes);
app.use("/api/v1/users", hamaraRouter);

app.get('/' , (req,res)=>{

    res.send("Hello Ji");

});


export default app;