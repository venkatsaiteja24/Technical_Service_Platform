import React from 'react';
import PropTypes from 'prop-types';

const TechnicianCard = ({ technician, serviceId, onClick }) => {
  // Use root-relative paths for images in the public folder
  const defaultImage = technician.profession === 'electrician' 
    ? '/electrician.avif' 
    : technician.profession === 'plumber' 
    ? '/plumber.avif' 
    : '/default/image.png'; // Fallback image if profession does not match

  // Destructure address properties with default values to avoid errors
  const { street = 'N/A', city = 'N/A', state = 'N/A', zipCode = 'N/A' } = technician.address || {};

  return (
    <div
      onClick={() => onClick(technician.userid, serviceId)} // Passing technician ID and service ID on click
      style={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        margin: '10px',
        padding: '10px',
        width: '200px',
        cursor: 'pointer', // Indicate that the card is clickable
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <img
        src={defaultImage}
        alt={technician.profession}
        style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
        onError={(e) => { e.target.onerror = null; e.target.src = '/default/image.png'; }} // Fallback image for error
      />
      <h4>{technician.username}</h4>
      <p>
        {street}, {city}, {state} {zipCode}
      </p>
    </div>
  );
};

// PropTypes for type checking
TechnicianCard.propTypes = {
  technician: PropTypes.shape({
    userid: PropTypes.string.isRequired, // Add userid for unique identification
    username: PropTypes.string.isRequired,
    profession: PropTypes.string.isRequired,
    address: PropTypes.shape({
      street: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zipCode: PropTypes.string,
    }),
  }).isRequired,
  serviceId: PropTypes.string.isRequired, // Add serviceId for identification
  onClick: PropTypes.func, // Optional click handler
};

export default TechnicianCard;
