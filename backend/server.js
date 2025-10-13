import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = express();


app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


