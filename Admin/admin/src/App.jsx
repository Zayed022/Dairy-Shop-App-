import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./components/Products/Products";
import AddProduct from "./components/Products/AddProduct";


const App = () => {


  return (
   
      <Routes>
        
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            
         
        
      </Routes>
    
  );
};

export default App;
