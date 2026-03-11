import { Routes, Route } from 'react-router-dom';
import Navbar from '/components/Navbar';
import Footer from '/components/Footer';
import ProtectedRoute from '/components/ProtectedRoute';
import Home from '/pages/Home';
import Products from '/pages/Products';
import ProductDetails from '/pages/ProductDetails';
import Cart from '/pages/Cart';
import Checkout from '/pages/Checkout';
import Login from '/pages/Login';
import Register from '/pages/Register';
import Admin from '/pages/Admin';
import Profile from '/pages/Profile';
import PaymentSuccess from '/pages/PaymentSuccess';
import './App.css';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/payment-success" element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

