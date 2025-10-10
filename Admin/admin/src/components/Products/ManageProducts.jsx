import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiSave } from "react-icons/fi";
import { MdAdd } from "react-icons/md";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editable, setEditable] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://dairy-shop-app-4.onrender.com/api/v1/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`https://dairy-shop-app-4.onrender.com/api/v1/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      setMessage("Product deleted successfully!");
    } catch {
      setMessage("Error deleting product!");
    }
  };

  // Handle edit toggle
  const handleEdit = (product) => {
    setEditId(product._id);
    setEditable({ ...product });
  };

  // Handle save after edit
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `https://dairy-shop-app-4.onrender.com/api/v1/products/${editId}`,
        editable
      );
      setProducts(
        products.map((p) => (p._id === editId ? res.data.updated : p))
      );
      setEditId(null);
      setMessage("Product updated successfully!");
    } catch {
      setMessage("Failed to update product!");
    } finally {
      setLoading(false);
    }
  };

  // Handle stock update
  const handleStockUpdate = async (id, stock) => {
    try {
      const res = await axios.patch(
        `https://dairy-shop-app-4.onrender.com/api/v1/products/${id}/stock`,
        { stock }
      );
      setProducts(
        products.map((p) => (p._id === id ? res.data.updated : p))
      );
      setMessage("Stock updated successfully!");
    } catch {
      setMessage("Failed to update stock!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
          <a
            href="/products/add"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <MdAdd size={20} /> Add Product
          </a>
        </div>

        {message && (
          <div className="mb-4 text-center text-green-700 bg-green-100 py-2 rounded-lg">
            {message}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700">Image</th>
                <th className="px-4 py-3 text-left text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-gray-700">Unit</th>
                <th className="px-4 py-3 text-left text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-gray-700">Price</th>
                <th className="px-4 py-3 text-left text-gray-700">Stock</th>
                <th className="px-4 py-3 text-center text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  </td>

                  <td className="px-4 py-3">
                    {editId === product._id ? (
                      <input
                        className="border rounded px-2 py-1"
                        value={editable.name}
                        onChange={(e) =>
                          setEditable({ ...editable, name: e.target.value })
                        }
                      />
                    ) : (
                      product.name
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editId === product._id ? (
                      <input
                        className="border rounded px-2 py-1"
                        value={editable.name}
                        onChange={(e) =>
                          setEditable({ ...editable, name: e.target.value })
                        }
                      />
                    ) : (
                      product.unit
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editId === product._id ? (
                      <input
                        className="border rounded px-2 py-1"
                        value={editable.category}
                        onChange={(e) =>
                          setEditable({
                            ...editable,
                            category: e.target.value,
                          })
                        }
                      />
                    ) : (
                      product.category
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editId === product._id ? (
                      <input
                        type="number"
                        className="border rounded px-2 py-1"
                        value={editable.price}
                        onChange={(e) =>
                          setEditable({
                            ...editable,
                            price: e.target.value,
                          })
                        }
                      />
                    ) : (
                      `₹${product.price}`
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={product.stock}
                      onChange={(e) =>
                        handleStockUpdate(product._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 w-20"
                    />
                  </td>

                  <td className="px-4 py-3 text-center">
                    {editId === product._id ? (
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FiSave size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <FiEdit size={20} />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No products found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
