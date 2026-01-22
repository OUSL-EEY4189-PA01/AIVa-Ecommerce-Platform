import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import connectDB from './config/db.js';
import {fileURLToPath} from 'url';
import path from 'path';

dotenv.config();

connectDB();

const app = express();


app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


