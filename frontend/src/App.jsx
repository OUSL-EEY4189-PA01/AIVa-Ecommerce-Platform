import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from '/components/Navbar';
import Login from '/pages/Login';
import Register from '/pages/Register';
import Home from '/pages/Home';
import Products from '../pages/Products';


const App = () => {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

