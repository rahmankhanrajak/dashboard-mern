import { useState, useEffect } from 'react';
import { createStore } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const SET_ACTIVE_MENU = 'SET_ACTIVE_MENU';
const SET_VENDORS = 'SET_VENDORS';
const SET_BRANDS = 'SET_BRANDS';
const SET_PRODUCTS = 'SET_PRODUCTS';
const SET_LOADING = 'SET_LOADING';
const SET_VENDOR_FORM = 'SET_VENDOR_FORM';
const SET_BRAND_FORM = 'SET_BRAND_FORM';
const SET_PRODUCT_FORM = 'SET_PRODUCT_FORM';
const RESET_VENDOR_FORM = 'RESET_VENDOR_FORM';
const RESET_BRAND_FORM = 'RESET_BRAND_FORM';
const RESET_PRODUCT_FORM = 'RESET_PRODUCT_FORM';

const setActiveMenu = (menu) => ({ type: SET_ACTIVE_MENU, payload: menu });
const setVendors = (vendors) => ({ type: SET_VENDORS, payload: vendors });
const setBrands = (brands) => ({ type: SET_BRANDS, payload: brands });
const setProducts = (products) => ({ type: SET_PRODUCTS, payload: products });
const setLoading = (loading) => ({ type: SET_LOADING, payload: loading });
const setVendorForm = (data) => ({ type: SET_VENDOR_FORM, payload: data });
const setBrandForm = (data) => ({ type: SET_BRAND_FORM, payload: data });
const setProductForm = (data) => ({ type: SET_PRODUCT_FORM, payload: data });
const resetVendorForm = () => ({ type: RESET_VENDOR_FORM });
const resetBrandForm = () => ({ type: RESET_BRAND_FORM });
const resetProductForm = () => ({ type: RESET_PRODUCT_FORM });

const initialState = {
  activeMenu: 'vendor',
  vendors: [],
  brands: [],
  products: [],
  loading: false,
  vendorForm: {
    Area: '',
    vendorName: '',
    Address: '',
    isUpdate: false,
    formId: ''
  },
  brandForm: {
    selectedVendor: '',
    newTask: '',
    isUpdate: false,
    formId: ''
  },
  productForm: {
    selectedVendor: '',
    selectBrand: '',
    selectqty: '',
    isUpdate: false,
    formId: ''
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_MENU:
      return { ...state, activeMenu: action.payload };
    case SET_VENDORS:
      return { ...state, vendors: action.payload };
    case SET_BRANDS:
      return { ...state, brands: action.payload };
    case SET_PRODUCTS:
      return { ...state, products: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_VENDOR_FORM:
      return { ...state, vendorForm: { ...state.vendorForm, ...action.payload } };
    case SET_BRAND_FORM:
      return { ...state, brandForm: { ...state.brandForm, ...action.payload } };
    case SET_PRODUCT_FORM:
      return { ...state, productForm: { ...state.productForm, ...action.payload } };
    case RESET_VENDOR_FORM:
      return { ...state, vendorForm: initialState.vendorForm };
    case RESET_BRAND_FORM:
      return { ...state, brandForm: initialState.brandForm };
    case RESET_PRODUCT_FORM:
      return { ...state, productForm: initialState.productForm };
    default:
      return state;
  }
};

const store = createStore(reducer);

function AppContent() {
  const dispatch = useDispatch();
  const { activeMenu, vendors, brands, products, loading, vendorForm, brandForm, productForm } = useSelector(state => state);

  useEffect(() => {
    fetchVendors();
    fetchBrands();
    fetchProducts();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${API_URL}/vendors`);
      dispatch(setVendors(response.data));
    } catch (error) {
      console.error('Error fetching vendors:', error);
      alert('Failed to fetch vendors');
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/brands`);
      dispatch(setBrands(response.data));
    } catch (error) {
      console.error('Error fetching brands:', error);
      alert('Failed to fetch brands');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      dispatch(setProducts(response.data));
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    }
  };

  const addVendor = async () => {
    if (!vendorForm.Area.trim() || !vendorForm.vendorName.trim() || !vendorForm.Address.trim()) {
      alert("All fields are required");
      return;
    }

    dispatch(setLoading(true));
    try {
      await axios.post(`${API_URL}/vendors`, {
        vendorName: vendorForm.vendorName,
        Area: vendorForm.Area,
        Address: vendorForm.Address
      });
      await fetchVendors();
      dispatch(resetVendorForm());
    } catch (error) {
      console.error('Error adding vendor:', error);
      alert(error.response?.data?.error || 'Failed to add vendor');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteVendor = async (vendor) => {
    if (!window.confirm(`Delete vendor "${vendor.vendorName}"? This will also delete all associated brands and products.`)) {
      return;
    }

    dispatch(setLoading(true));
    try {
      await axios.delete(`${API_URL}/vendors/${vendor._id}`);
      await fetchVendors();
      await fetchBrands();
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      alert(error.response?.data?.error || 'Failed to delete vendor');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const editVendor = (item) => {
    dispatch(setVendorForm({
      formId: item._id,
      vendorName: item.vendorName,
      Area: item.Area,
      Address: item.Address,
      isUpdate: true
    }));
  };

  const updateVendor = async () => {
    if (!vendorForm.Area.trim() || !vendorForm.vendorName.trim() || !vendorForm.Address.trim()) {
      alert("All fields are required");
      return;
    }

    dispatch(setLoading(true));
    try {
      const response = await fetch(`${API_URL}/vendors/${vendorForm.formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorName: vendorForm.vendorName,
          Area: vendorForm.Area,
          Address: vendorForm.Address
        })
      });

      if (!response.ok) {
        alert('Failed to update vendor');
        return;
      }

      await fetchVendors();
      dispatch(resetVendorForm());
    } catch (error) {
      console.error('Error updating vendor:', error);
      alert('Failed to update vendor');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const addBrand = async () => {
    if (!brandForm.newTask.trim() || !brandForm.selectedVendor) {
      alert("Please select vendor and enter brand name");
      return;
    }

    dispatch(setLoading(true));
    try {
      await axios.post(`${API_URL}/brands`, {
        vendor: brandForm.selectedVendor,
        newTask: brandForm.newTask
      });
      await fetchBrands();
      dispatch(setBrandForm({ newTask: '' }));
    } catch (error) {
      console.error('Error adding brand:', error);
      alert(error.response?.data?.error || 'Failed to add brand');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteBrand = async (brand) => {
    if (!window.confirm(`Delete brand "${brand.newTask}"? This will also delete all associated products.`)) {
      return;
    }

    dispatch(setLoading(true));
    try {
      await axios.delete(`${API_URL}/brands/${brand._id}`);
      await fetchBrands();
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert(error.response?.data?.error || 'Failed to delete brand');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const editBrand = (item) => {
    dispatch(setBrandForm({
      formId: item._id,
      selectedVendor: item.vendor,
      newTask: item.newTask,
      isUpdate: true
    }));
  };

  const updateBrand = async () => {
    if (!brandForm.newTask.trim() || !brandForm.selectedVendor) {
      alert("Please select vendor and enter brand name");
      return;
    }

    dispatch(setLoading(true));
    try {
      await axios.put(`${API_URL}/brands/${brandForm.formId}`, {
        vendor: brandForm.selectedVendor,
        newTask: brandForm.newTask
      });
      await fetchBrands();
      dispatch(resetBrandForm());
    } catch (error) {
      console.error('Error updating brand:', error);
      alert(error.response?.data?.error || 'Failed to update brand');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const addProduct = async () => {
    if (!productForm.selectBrand.trim() || !productForm.selectqty.trim() || !productForm.selectedVendor) {
      alert("All fields are required");
      return;
    }

    dispatch(setLoading(true));
    try {
      await axios.post(`${API_URL}/products`, {
        vendor: productForm.selectedVendor,
        selectBrand: productForm.selectBrand,
        selectqty: productForm.selectqty
      });
      await fetchProducts();
      dispatch(setProductForm({ selectBrand: '', selectqty: '' }));
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete product "${product.selectBrand} ${product.selectqty}"?`)) {
      return;
    }

    dispatch(setLoading(true));
    try {
      await axios.delete(`${API_URL}/products/${product._id}`);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const editProduct = (item) => {
    dispatch(setProductForm({
      formId: item._id,
      selectedVendor: item.vendor,
      selectBrand: item.selectBrand,
      selectqty: item.selectqty,
      isUpdate: true
    }));
  };

  const updateProduct = async () => {
    if (!productForm.selectBrand.trim() || !productForm.selectqty.trim() || !productForm.selectedVendor) {
      alert("All fields are required");
      return;
    }

    dispatch(setLoading(true));
    try {
      await axios.put(`${API_URL}/products/${productForm.formId}`, {
        vendor: productForm.selectedVendor,
        selectBrand: productForm.selectBrand,
        selectqty: productForm.selectqty
      });
      await fetchProducts();
      dispatch(resetProductForm());
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {loading && <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#3498db', color: 'white', padding: '10px', textAlign: 'center', zIndex: 1000 }}>Loading...</div>}

      <div style={{ width: '200px', backgroundColor: '#2c3e50', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3>WaterCane admin</h3>
        <button onClick={() => dispatch(setActiveMenu('vendor'))} style={{ background: activeMenu === 'vendor' ? '#34495e' : 'transparent', color: 'white', padding: '10px', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Vendor</button>
        <button onClick={() => dispatch(setActiveMenu('brand'))} style={{ background: activeMenu === 'brand' ? '#34495e' : 'transparent', color: 'white', padding: '10px', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Brand</button>
        <button onClick={() => dispatch(setActiveMenu('product'))} style={{ background: activeMenu === 'product' ? '#34495e' : 'transparent', color: 'white', padding: '10px', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Products</button>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        {activeMenu === 'vendor' && (
          <>
            <h2>Vendor Entry</h2>
            <input placeholder='Enter Area' value={vendorForm.Area} onChange={(e) => dispatch(setVendorForm({ Area: e.target.value }))} style={{ margin: '5px', padding: '8px' }} />
            <input placeholder='Enter Vendor Name' value={vendorForm.vendorName} onChange={(e) => dispatch(setVendorForm({ vendorName: e.target.value }))} style={{ margin: '5px', padding: '8px' }} />
            <input placeholder='Enter Address' value={vendorForm.Address} onChange={(e) => dispatch(setVendorForm({ Address: e.target.value }))} style={{ margin: '5px', padding: '8px' }} />
            {!vendorForm.isUpdate ?
              <button onClick={addVendor} style={{ margin: '5px', padding: '10px', background: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}>Add Vendor</button> :
              <button onClick={updateVendor} style={{ margin: '5px', padding: '10px', background: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer' }}>Update Vendor</button>
            }
            <h3>Vendors List</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={{ border: '1px solid #ddd', padding: '8px' }}>Vendor Name</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Address</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Area</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th></tr></thead>
              <tbody>{vendors.map((item) => (<tr key={item._id}><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.vendorName}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.Address}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.Area}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}><button onClick={() => editVendor(item)} style={{ margin: '2px', padding: '5px', background: '#f39c12', color: 'white', border: 'none', cursor: 'pointer' }}>Edit</button><button onClick={() => deleteVendor(item)} style={{ margin: '2px', padding: '5px', background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button></td></tr>))}</tbody>
            </table>
          </>
        )}

        {activeMenu === 'brand' && (
          <>
            <h2>Brand Management</h2>
            <select value={brandForm.selectedVendor} onChange={(e) => dispatch(setBrandForm({ selectedVendor: e.target.value }))} style={{ margin: '5px', padding: '8px' }}><option value="">-- Select Vendor --</option>{vendors.map((vendor) => (<option key={vendor._id} value={vendor.vendorName}>{vendor.vendorName}</option>))}</select>
            <input placeholder='Brand Name' value={brandForm.newTask} onChange={(e) => dispatch(setBrandForm({ newTask: e.target.value }))} style={{ margin: '5px', padding: '8px' }} />
            {!brandForm.isUpdate ?
              <button onClick={addBrand} style={{ margin: '5px', padding: '10px', background: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}>Add Brand</button> :
              <button onClick={updateBrand} style={{ margin: '5px', padding: '10px', background: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer' }}>Update Brand</button>
            }
            <h3>Brands List</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={{ border: '1px solid #ddd', padding: '8px' }}>Vendor</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Brand</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th></tr></thead>
              <tbody>{brands.map((item) => (<tr key={item._id}><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.vendor}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.newTask}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}><button onClick={() => editBrand(item)} style={{ margin: '2px', padding: '5px', background: '#f39c12', color: 'white', border: 'none', cursor: 'pointer' }}>Edit</button><button onClick={() => deleteBrand(item)} style={{ margin: '2px', padding: '5px', background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button></td></tr>))}</tbody>
            </table>
          </>
        )}

        {activeMenu === 'product' && (
          <>
            <h3>Add Product</h3>
            <select value={productForm.selectedVendor} onChange={(e) => dispatch(setProductForm({ selectedVendor: e.target.value }))} style={{ margin: '5px', padding: '8px' }}><option value="">-- Select Vendor --</option>{vendors.map((vendor) => (<option key={vendor._id} value={vendor.vendorName}>{vendor.vendorName}</option>))}</select>
            <select value={productForm.selectBrand} onChange={(e) => dispatch(setProductForm({ selectBrand: e.target.value }))} style={{ margin: '5px', padding: '8px' }}><option value="">-- Select Brand --</option>{brands.filter(item => item.vendor === productForm.selectedVendor).map((item) => (<option key={item._id} value={item.newTask}>{item.newTask}</option>))}</select>
            <select value={productForm.selectqty} onChange={(e) => dispatch(setProductForm({ selectqty: e.target.value }))} style={{ margin: '5px', padding: '8px' }}><option value="">-- Select Quantity --</option><option value="10L">10L</option><option value="20L">20L</option><option value="30L">30L</option></select>
            {!productForm.isUpdate ?
              <button onClick={addProduct} style={{ margin: '5px', padding: '10px', background: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}>Add Product</button> :
              <button onClick={updateProduct} style={{ margin: '5px', padding: '10px', background: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer' }}>Update Product</button>
            }
            <h3>Products List</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={{ border: '1px solid #ddd', padding: '8px' }}>Vendor</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Brand</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Qty</th><th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th></tr></thead>
              <tbody>{products.map((item) => (<tr key={item._id}><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.vendor}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.selectBrand}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.selectqty}</td><td style={{ border: '1px solid #ddd', padding: '8px' }}><button onClick={() => editProduct(item)} style={{ margin: '2px', padding: '5px', background: '#f39c12', color: 'white', border: 'none', cursor: 'pointer' }}>Edit</button><button onClick={() => deleteProduct(item)} style={{ margin: '2px', padding: '5px', background: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button></td></tr>))}</tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;