// src/components/Auth/Signup.js
import React, { useState, useEffect } from 'react'; // Import necessary React hooks
import { useDispatch, useSelector } from 'react-redux'; // Import hooks to manage Redux state
import { signupUser } from '../../features/Auth/authSlice'; // Import the signup action from the auth slice
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios'; // Import Axios for making HTTP requests
import './Signup.css'; // Import a CSS file for styling

const Signup = () => {
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const navigate = useNavigate(); // For navigation on successful signup
  const { loading, error } = useSelector((state) => state.auth); // Get loading status and error from Redux state

  // Define state variables for the form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');

  // State for customer details
  const [customerDetails, setCustomerDetails] = useState({
    phoneNumber: '',
    address: { street: '', city: '', state: '', zipCode: '' },
  });

  // State for technician details
  const [technicianDetails, setTechnicianDetails] = useState({
    phoneNumber: '',
    profession: '',
    skills: '',
    address: { street: '', city: '', state: '', zipCode: '' },
  });

  const [serviceNames, setServiceNames] = useState([]); // State to hold service names for dropdown

  // Fetch service names from the backend when the component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services/names');
        const names = response.data.map((service) => service.name);
        setServiceNames(names);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  // Handle input change for general fields
  const handleInputChange = (setter) => (e) => setter(e.target.value);

  // Handle changes in detailed fields (like phone number)
  const handleDetailsChange = (setter) => (field) => (e) => {
    setter((prevDetails) => ({
      ...prevDetails,
      [field]: e.target.value,
    }));
  };

  // Handle address changes specifically
  const handleAddressChange = (setter) => (field) => (e) => {
    setter((prevDetails) => ({
      ...prevDetails,
      address: {
        ...prevDetails.address,
        [field]: e.target.value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!username || !email || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Prepare signup data based on user role
    const signupData = {
      username,
      email,
      password,
      role,
      ...(role === 'customer'
        ? { customerDetails }
        : {
            technicianDetails: {
              phoneNumber: technicianDetails.phoneNumber,
              profession: technicianDetails.profession,
              skills: technicianDetails.skills.split(',').map((skill) => skill.trim()),
              address: technicianDetails.address,
            },
          }),
    };

    try {
      await dispatch(signupUser(signupData)).unwrap();
      navigate('/login'); // Redirect to login page on success
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label>Username:</label>
        <input type="text" value={username} onChange={handleInputChange(setUsername)} />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" value={email} onChange={handleInputChange(setEmail)} />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input type="password" value={password} onChange={handleInputChange(setPassword)} />
      </div>
      <div className="form-group">
        <label>Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={handleInputChange(setConfirmPassword)} />
      </div>
      <div className="form-group">
        <label>Role:</label>
        <select value={role} onChange={handleInputChange(setRole)}>
          <option value="customer">Customer</option>
          <option value="technician">Technician</option>
        </select>
      </div>

      {role === 'customer' && (
        <div className="customer-details">
          <h3>Customer Details</h3>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              value={customerDetails.phoneNumber}
              onChange={handleDetailsChange(setCustomerDetails)('phoneNumber')}
            />
          </div>
          <h4>Address</h4>
          <div className="form-group">
            <label>Street:</label>
            <input
              type="text"
              value={customerDetails.address.street}
              onChange={handleAddressChange(setCustomerDetails)('street')}
            />
          </div>
          <div className="form-group">
            <label>City:</label>
            <input
              type="text"
              value={customerDetails.address.city}
              onChange={handleAddressChange(setCustomerDetails)('city')}
            />
          </div>
          <div className="form-group">
            <label>State:</label>
            <input
              type="text"
              value={customerDetails.address.state}
              onChange={handleAddressChange(setCustomerDetails)('state')}
            />
          </div>
          <div className="form-group">
            <label>Zip Code:</label>
            <input
              type="text"
              value={customerDetails.address.zipCode}
              onChange={handleAddressChange(setCustomerDetails)('zipCode')}
            />
          </div>
        </div>
      )}


        {role === 'technician' && (
          <div className="technician-details">
            <h3>Technician Details</h3>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="text"
                value={technicianDetails.phoneNumber}
                onChange={handleDetailsChange(setTechnicianDetails)('phoneNumber')}
              />
            </div>
            <div className="form-group">
              <label>Profession:</label>
              <select
                value={technicianDetails.profession}
                onChange={handleDetailsChange(setTechnicianDetails)('profession')}
              >
                <option value="">Select Profession</option>
                {serviceNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Skills (comma-separated):</label>
              <input
                type="text"
                value={technicianDetails.skills}
                onChange={handleDetailsChange(setTechnicianDetails)('skills')}
              />
            </div>
            <h4>Address</h4>
            <div className="form-group">
              <label>Street:</label>
              <input
                type="text"
                value={technicianDetails.address.street}
                onChange={handleAddressChange(setTechnicianDetails)('street')}
              />
            </div>
            <div className="form-group">
              <label>City:</label>
              <input
                type="text"
                value={technicianDetails.address.city}
                onChange={handleAddressChange(setTechnicianDetails)('city')}
              />
            </div>
            <div className="form-group">
              <label>State:</label>
              <input
                type="text"
                value={technicianDetails.address.state}
                onChange={handleAddressChange(setTechnicianDetails)('state')}
              />
            </div>
            <div className="form-group">
              <label>Zip Code:</label>
              <input
                type="text"
                value={technicianDetails.address.zipCode}
                onChange={handleAddressChange(setTechnicianDetails)('zipCode')}
              />
            </div>
          </div>
        )}


      <button className="submit-button" type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Signup;
