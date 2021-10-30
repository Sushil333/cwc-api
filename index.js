import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRouter from "./routes/user.js";
import userHome from "./routes/home.js";
import morgan from 'morgan';

const app = express();

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(morgan('tiny'))
app.use(cors());

app.use("/", userHome);
app.use("/user", userRouter);

const CONNECTION_URL = 'mongodb+srv://admin:UTYeilxfYWj5DrV6@cluster0.st6gh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));