import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function App() {
  const [activeMenu, setActiveMenu] = useState('vendor');
  const [selectedVendor, setSelectedVendor] = useState("");

  const [newTask, setNewTask] = useState("");
  const [formId, setformId] = useState("");
  const [isUpdate, setisUpdate] = useState(false);

  const [selectBrand, setselectBrand] = useState("");
  const [selectqty, setselectqty] = useState("");
  const [productsList, setproductsList] = useState([]);
  const [formIdproduct, setformIdproduct] = useState("");
  const [isUpdateProduct, setisUpdateProduct] = useState(false);

  const [Area, setArea] = useState("");
  const [vendorName, setvendorName] = useState("");
  const [Address, setAddress] = useState("");
  const [isvendorUpdate, setisvendorUpdate] = useState(false);
  const [formIdvendor, setformIdvendor] = useState("");

  const [vendorsList, setvendorsList] = useState([]);
  const [brandList, setbrandList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVendors();
    fetchBrands();
    fetchProducts();
  }, []);


  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${API_URL}/vendors`);
      setvendorsList(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      alert('Failed to fetch vendors');
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/brands`);
      setbrandList(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      alert('Failed to fetch brands');
    }
  };



  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setproductsList(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    }
  };

  const addVendor = async () => {
    if (!Area.trim() || !vendorName.trim() || !Address.trim()) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/vendors`, {
        vendorName,
        Area,
        Address
      });
      await fetchVendors();
      setArea("");
      setvendorName("");
      setAddress("");
    } catch (error) {
      console.error('Error adding vendor:', error);
      alert(error.response?.data?.error || 'Failed to add vendor');
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (vendor) => {
    if (!window.confirm(`Delete vendor "${vendor.vendorName}"? This will also delete all associated brands and products.`)) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/vendors/${vendor._id}`);

      await fetchVendors();
      await fetchBrands();
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      alert(error.response?.data?.error || 'Failed to delete vendor');
    } finally {
      setLoading(false);
    }
  };


  const editVendor = (item) => {
    setformIdvendor(item._id);
    setvendorName(item.vendorName);
    setArea(item.Area);
    setAddress(item.Address);
    setisvendorUpdate(true);
  };

  const updateVendor = async () => {
    if (!Area.trim() || !vendorName.trim() || !Address.trim()) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/vendors/${formIdvendor}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorName, Area, Address })
      });

      if (!response.ok) {
        alert('Failed to update vendor');
        return;
      }

      await fetchVendors();
      setArea("");
      setvendorName("");
      setAddress("");
      setisvendorUpdate(false);
      setformIdvendor("");
    } catch (error) {
      console.error('Error updating vendor:', error);
      alert('Failed to update vendor');
    } finally {
      setLoading(false);
    }
  };
  const addTask = async () => {
    if (!newTask.trim() || !selectedVendor) {
      alert("Please select vendor and enter brand name");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/brands`, {
        vendor: selectedVendor,
        newTask
      })
      await fetchBrands();
      setNewTask("");
    } catch (error) {
      console.error('Error adding brand:', error);
      alert(error.response?.data?.error || 'Failed to add brand');
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (brand) => {
    if (!window.confirm(`Delete brand "${brand.newTask}"? This will also delete all associated products.`)) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/brands/${brand._id}`);
      await fetchBrands();
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert(error.response?.data?.error || 'Failed to delete brand');
    } finally {
      setLoading(false);
    }
  };


  const editTask = (item) => {
    setformId(item._id);
    setSelectedVendor(item.vendor);
    setNewTask(item.newTask);
    setisUpdate(true);
  };

  const updateTask = async () => {
    if (!newTask.trim() || !selectedVendor) {
      alert("Please select vendor and enter brand name");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_URL}/brands/${formId}`, {
        vendor: selectedVendor,
        newTask
      });
      await fetchBrands();
      setNewTask("");
      setisUpdate(false);
      setformId("");
    } catch (error) {
      console.error('Error updating brand:', error);
      alert(error.response?.data?.error || 'Failed to update brand');
    } finally {
      setLoading(false);
    }
  };


  // const addProduct = async () => {
  //   if (!selectBrand.trim() || !selectqty.trim() || !selectedVendor) {
  //     alert("All fields are required");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${API_URL}/products`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ vendor: selectedVendor, selectBrand, selectqty })
  //     });

  //     if (!response.ok) {
  //       alert('Failed to create product');
  //       return;
  //     }

  //     await fetchProducts();
  //     setselectBrand("");
  //     setselectqty("");
  //   } catch (error) {
  //     console.error('Error adding product:', error);
  //     alert('Failed to add product');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const addProduct = async () => {
    if (!selectBrand.trim() || !selectqty.trim() || !selectedVendor) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/products`, {
        vendor: selectedVendor, selectBrand, selectqty
      });

      if (!response.ok) {
        alert('Failed to create product');
        return;
      }

      await fetchProducts();
      setselectBrand("");
      setselectqty("");
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete product "${product.selectBrand} ${product.selectqty}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/products/${product._id}`);

      if (!response.ok) {
        alert('Failed to delete product');
        return;
      }

      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (item) => {
    setformIdproduct(item._id);
    setSelectedVendor(item.vendor);
    setselectBrand(item.selectBrand);
    setselectqty(item.selectqty);
    setisUpdateProduct(true);
  };

  const updateProduct = async () => {
    if (!selectBrand.trim() || !selectqty.trim() || !selectedVendor) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/products/${formIdproduct}`, {
        vendor: selectedVendor, selectBrand, selectqty
      });

      if (!response.ok) {
        alert('Failed to update product');
        return;
      }

      await fetchProducts();
      setselectBrand("");
      setselectqty("");
      setisUpdateProduct(false);
      setformIdproduct("");
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {loading && <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#3498db', color: 'white', padding: '10px', textAlign: 'center', zIndex: 1000 }}>Loading...</div>}

      <div style={{ width: '200px', backgroundColor: '#2c3e50', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3>WaterCane admin</h3>
        <button onClick={() => setActiveMenu('vendor')} style={{ background: activeMenu === 'vendor' ? '#34495e' : 'transparent', color: 'white', padding: '10px', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Vendor</button>
        <button onClick={() => setActiveMenu('brand')} style={{ background: activeMenu === 'brand' ? '#34495e' : 'transparent', color: 'white', padding: '10px', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Brand</button>
        <button onClick={() => setActiveMenu('product')} style={{ background: activeMenu === 'product' ? '#34495e' : 'transparent', color: 'white', padding: '10px', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Products</button>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        {activeMenu === 'vendor' && (
          <>
            <h2>Vendor Entry</h2>
            <input placeholder='Enter Area' value={Area} onChange={(e) => setArea(e.target.value)} style={{ margin: '5px', padding: '8px' }} />
            <input placeholder='Enter Vendor Name' value={vendorName} onChange={(e) => setvendorName(e.target.value)} style={{ margin: '5px', padding: '8px' }} />
            <input placeholder='Enter Address' value={Address} onChange={(e) => setAddress(e.target.value)} style={{ margin: '5px', padding: '8px' }} />
            {!isvendorUpdate ?
              <button onClick={addVendor} style={{ margin: '5px', padding: '10px', background: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}>Add Vendor</button> :
              <button onClick={updateVendor} style={{ margin: '5px', padding: '10px', background: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer' }}>Update Vendor</button>
            }
            <h3>Vendors List</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={{ border: '1px solid #ddd', padding: '8px' }}>Vendor Name</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Address</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Area</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th></tr></thead>
              <tbody>{vendorsList.map((item) => (<tr key={item._id}><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.vendorName}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.Address}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.Area}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}><button onClick={() => editVendor(item)} style={{ margin: '2px', padding: '5px', background: '#f39c12', color: 'white', border: 'none', cursor: 'pointer' }}>Edit</button><button onClick={() => deleteVendor(item)} style={{ margin: '2px', padding: '5px', background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button></td></tr>))}</tbody>
            </table>
          </>
        )}

        {activeMenu === 'brand' && (
          <>
            <h2>Brand Management</h2>
            <select value={selectedVendor} onChange={(e) => setSelectedVendor(e.target.value)} style={{ margin: '5px', padding: '8px' }}><option value="">-- Select Vendor --</option>{vendorsList.map((vendor) => (<option key={vendor._id} value={vendor.vendorName}>{vendor.vendorName}</option>))}</select>
            <input placeholder='Brand Name' value={newTask} onChange={(e) => setNewTask(e.target.value)} style={{ margin: '5px', padding: '8px' }} />
            {!isUpdate ?
              <button onClick={addTask} style={{ margin: '5px', padding: '10px', background: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}>Add Brand</button> :
              <button onClick={updateTask} style={{ margin: '5px', padding: '10px', background: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer' }}>Update Brand</button>
            }
            <h3>Brands List</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={{ border: '1px solid #ddd', padding: '8px' }}>Vendor</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Brand</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th></tr></thead>
              <tbody>{brandList.map((item) => (<tr key={item._id}><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.vendor}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.newTask}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}><button onClick={() => editTask(item)} style={{ margin: '2px', padding: '5px', background: '#f39c12', color: 'white', border: 'none', cursor: 'pointer' }}>Edit</button><button onClick={() => deleteBrand(item)} style={{ margin: '2px', padding: '5px', background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button></td></tr>))}</tbody>
            </table>
          </>
        )}

        {activeMenu === 'product' && (
          <>
            <h3>Add Product</h3>
            <select value={selectedVendor} onChange={(e) => setSelectedVendor(e.target.value)} style={{ margin: '5px', padding: '8px' }}><option value="">-- Select Vendor --</option>{vendorsList.map((vendor) => (<option key={vendor._id} value={vendor.vendorName}>{vendor.vendorName}</option>))}</select>
            <select value={selectBrand} onChange={(e) => setselectBrand(e.target.value)} style={{ margin: '5px', padding: '8px' }}><option value="">-- Select Brand --</option>{brandList.filter(item => item.vendor === selectedVendor).map((item) => (<option key={item._id} value={item.newTask}>{item.newTask}</option>))}</select>
            <select value={selectqty} onChange={(e) => setselectqty(e.target.value)} style={{ margin: '5px', padding: '8px' }}><option value="">-- Select Quantity --</option><option value="10L">10L</option><option value="20L">20L</option><option value="30L">30L</option></select>
            {!isUpdateProduct ?
              <button onClick={addProduct} style={{ margin: '5px', padding: '10px', background: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}>Add Product</button> :
              <button onClick={updateProduct} style={{ margin: '5px', padding: '10px', background: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer' }}>Update Product</button>
            }
            <h3>Products List</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={{ border: '1px solid #ddd', padding: '8px' }}>Vendor</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Brand</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Qty</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th></tr></thead>
              <tbody>{productsList.map((item) => (<tr key={item._id}><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.vendor}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.selectBrand}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.selectqty}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}><button onClick={() => editProduct(item)} style={{ margin: '2px', padding: '5px', background: '#f39c12', color: 'white', border: 'none', cursor: 'pointer' }}>Edit</button><button onClick={() => deleteProduct(item)} style={{ margin: '2px', padding: '5px', background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button></td></tr>))}</tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default App;