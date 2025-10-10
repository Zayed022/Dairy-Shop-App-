import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./components/Products/Products";
import AddProduct from "./components/Products/AddProduct";
import ManageProducts from "./components/Products/ManageProducts";
import Orders from "./components/Orders/Orders";
import ViewOrders from "./components/Orders/ViewOrders";


const App = () => {


  return (
   
      <Routes>
        
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/update" element={<ManageProducts />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/" element={<ViewOrders />} />
            
         
        
      </Routes>
    
  );
};

export default App;
