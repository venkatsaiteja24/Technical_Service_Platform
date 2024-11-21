// src/components/Auth/Signup.js
import React, { useState, useEffect } from 'react'; // Import necessary React hooks
import { useDispatch, useSelector } from 'react-redux'; // Import hooks to manage Redux state
import { signupUser } from '../../features/Auth/authSlice'; // Import the signup action from the auth slice
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios'; // Import Axios for making HTTP requests

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
    address: { street: '', city: '', state: '', zipCode: '' }
  });

  // State for technician details
  const [technicianDetails, setTechnicianDetails] = useState({
    phoneNumber: '',
    profession: '',
    skills: '',
    address: { street: '', city: '', state: '', zipCode: '' }
  });

  const [serviceNames, setServiceNames] = useState([]); // State to hold service names for dropdown

  // Fetch service names from the backend when the component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services/names');
        const names = response.data.map(service => service.name);
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
    setter(prevDetails => ({
      ...prevDetails,
      [field]: e.target.value
    }));
  };

  // Handle address changes specifically
  const handleAddressChange = (setter) => (field) => (e) => {
    setter(prevDetails => ({
      ...prevDetails,
      address: {
        ...prevDetails.address,
        [field]: e.target.value
      }
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

  // Validate state for both customer and technician roles
  const stateRegex = /^[A-Za-z]{2}$/;
  const state = role === 'customer' ? customerDetails.address.state : technicianDetails.address.state;
  if (!stateRegex.test(state)) {
    alert('Please enter a valid 2-letter state abbreviation.');
    return;
  }
  
    // Prepare signup data based on user role
    const signupData = {
      username,
      email,
      password,
      role,
      ...(role === 'customer' ? { customerDetails } : { 
        technicianDetails: {
          phoneNumber: technicianDetails.phoneNumber,
          profession: technicianDetails.profession,
          skills: technicianDetails.skills.split(',').map(skill => skill.trim()),
          address: technicianDetails.address,
        }
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
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>
        Username:
        <input type="text" value={username} onChange={handleInputChange(setUsername)} />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={handleInputChange(setEmail)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={handleInputChange(setPassword)} />
      </label>
      <label>
        Confirm Password:
        <input type="password" value={confirmPassword} onChange={handleInputChange(setConfirmPassword)} />
      </label>
      <label>
        Role:
        <select value={role} onChange={handleInputChange(setRole)}>
          <option value="customer">Customer</option>
          <option value="technician">Technician</option>
        </select>
      </label>

      {role === 'customer' && (
        <>
          <label>
            Phone Number:
            <input type="text" value={customerDetails.phoneNumber} onChange={handleDetailsChange(setCustomerDetails)('phoneNumber')} />
          </label>
          <h3>Address:</h3>
          <label>Street:
            <input type="text" value={customerDetails.address.street} onChange={handleAddressChange(setCustomerDetails)('street')} />
          </label>
          <label>City:
            <input type="text" value={customerDetails.address.city} onChange={handleAddressChange(setCustomerDetails)('city')} />
          </label>
          <label>
              State (abbreviation, e.g., MA):
              <input 
                  type="text" 
                  value={customerDetails.address.state} 
                  onChange={handleAddressChange(setCustomerDetails)('state')} 
                  placeholder="Enter state abbreviation" // Optional: add a placeholder for better UX
              />
          </label>
          <label>Zip Code:
            <input type="text" value={customerDetails.address.zipCode} onChange={handleAddressChange(setCustomerDetails)('zipCode')} />
          </label>
        </>
      )}

      {role === 'technician' && (
        <>
          <label>
            Phone Number:
            <input type="text" value={technicianDetails.phoneNumber} onChange={handleDetailsChange(setTechnicianDetails)('phoneNumber')} />
          </label>
          <label>Profession:
            <select value={technicianDetails.profession} onChange={handleDetailsChange(setTechnicianDetails)('profession')}>
              <option value="">Select Profession</option>
              {serviceNames.map((serviceName, index) => (
                <option key={index} value={serviceName}>{serviceName}</option>
              ))}
            </select>
          </label>
          <label>
            Skills:
            <input type="text" value={technicianDetails.skills} onChange={handleDetailsChange(setTechnicianDetails)('skills')} />
          </label>
          <h3>Address:</h3>
          <label>Street:
            <input type="text" value={technicianDetails.address.street} onChange={handleAddressChange(setTechnicianDetails)('street')} />
          </label>
          <label>City:
            <input type="text" value={technicianDetails.address.city} onChange={handleAddressChange(setTechnicianDetails)('city')} />
          </label>
          <label>
              State (abbreviation, e.g., MA):
              <input 
                  type="text" 
                  value={technicianDetails.address.state} 
                  onChange={handleAddressChange(setTechnicianDetails)('state')} 
                  placeholder="Enter state abbreviation" // Optional: add a placeholder for better UX
              />
          </label>

          <label>Zip Code:
            <input type="text" value={technicianDetails.address.zipCode} onChange={handleAddressChange(setTechnicianDetails)('zipCode')} />
          </label>
        </>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Signup;
