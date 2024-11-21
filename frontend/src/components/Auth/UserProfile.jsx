import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../features/Auth/authSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  
  // Initialize form fields with user data
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAddress(user.address);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUserData = { name, email, address };
    dispatch(updateUser(updatedUserData));
  };

  return (
    <div className="user-profile">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        <div>
          <label>Address</label>
          <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UserProfile;
