import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./components/Products/Products";
import AddProduct from "./components/Products/AddProduct";
import ManageProducts from "./components/Products/ManageProducts";
import Orders from "./components/Orders/Orders";
import ViewOrders from "./components/Orders/ViewOrders";
import FeeManagement from "./components/DeliveryCharges/FeeManagement";
import ManageCODSettings from "./components/CODSetting/ManageCODSetting";


const App = () => {


  return (
   
      <Routes>
        
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/update" element={<ManageProducts />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/view-orders" element={<ViewOrders />} />
            <Route path="/delivery" element={<FeeManagement />} />
            <Route path="/settings" element={<ManageCODSettings />} />
            
         
        
      </Routes>
    
  );
};

export default App;
