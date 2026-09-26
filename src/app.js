import express from 'express'
import cors from 'cors'
import hamaraRouter from "./routes/user.routes.js"
import ourRouter from "./routes/project.routes.js"
import taskRouter from "./routes/task.routes.js"
import noteRouter from "./routes/note.routes.js"
import healthCheckRoutes from "./routes/health.routes.js"
import cookieParser from 'cookie-parser'
import { ApiError } from "./utils/api-error.js"

const app = express()

// Trust the reverse proxy (Render) so secure cookies are sent correctly
app.set("trust proxy", 1);

//basic configurations//

app.use(express.json({limit : "16kb"})); //converts the req json file to req.body.
app.use(express.urlencoded({extended: true , limit : "16kb"})); //extends the URL
app.use(express.static("public")); //

//cors configurations//

// Parse CORS origin — handle "*" specially because credentials:true
// forbids the literal wildcard "*" in Access-Control-Allow-Origin.
// Using `origin: true` reflects the request's Origin header instead.
const parseCorsOrigin = () => {
  const envOrigin = process.env.CORS_ORIGIN;
  if (!envOrigin || envOrigin.trim() === "*") {
    return true; // reflects request origin — works with credentials
  }
  const origins = envOrigin.split(",").map((o) => o.trim()).filter(Boolean);
  return origins.length === 1 ? origins[0] : origins;
};

app.use(
  cors({
    origin: parseCorsOrigin(),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(cookieParser());

//middleware//
app.use("/api/v1/healthcheck", healthCheckRoutes);
app.use("/api/v1/users", hamaraRouter);
app.use("/api/v1/auth", hamaraRouter); // alias for PRD endpoint structure
app.use("/api/v1/projects" , ourRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/notes", noteRouter);

app.get('/' , (req,res)=>{

    res.send("Hello Ji");

});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    const response = {
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors,
        data: null,
        success: false
    };

    return res.status(error.statusCode).json(response);
});


export default app;