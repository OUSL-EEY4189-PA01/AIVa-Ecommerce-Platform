import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from '/components/Navbar';
import Footer from '/components/Footer';
import Login from '/pages/Login';
import Register from '/pages/Register';
import Home from '/pages/Home';


const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;

