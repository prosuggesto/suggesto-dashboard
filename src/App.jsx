import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TrendDetail from './pages/TrendDetail';
import QuestionDetail from './pages/QuestionDetail';
import AddProduct from './pages/admin/AddProduct';
import AddData from './pages/admin/AddData';
import EditProduct from './pages/admin/EditProduct';
import EditData from './pages/admin/EditData';
import DeleteProduct from './pages/admin/DeleteProduct';
import DeleteData from './pages/admin/DeleteData';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/trend/:categoryId" element={<TrendDetail />} />
        <Route path="/dashboard/questions/:type" element={<QuestionDetail />} />

        {/* Admin Routes */}
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/add-data" element={<AddData />} />
        <Route path="/admin/edit-product" element={<EditProduct />} />
        <Route path="/admin/edit-data" element={<EditData />} />
        <Route path="/admin/delete-product" element={<DeleteProduct />} />
        <Route path="/admin/delete-data" element={<DeleteData />} />
      </Routes>
    </Router>
  );
}

export default App;
