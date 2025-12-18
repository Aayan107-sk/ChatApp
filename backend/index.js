import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './conf/connectDB.js';
import authRoutes from './routes/authRoute.js';


dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

//routes
app.use('/api/auth', authRoutes); 



app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

