  import React from 'react';
  import PropTypes from 'prop-types';

  const TechnicianCard = ({ technician, serviceId, reviews, onClick }) => {
    // Use root-relative paths for images in the public folder
    const defaultImage = technician.profession === 'electrician' 
      ? '/electrician.avif' 
      : technician.profession === 'plumber' 
      ? '/plumber.avif' 
      : technician.profession === 'HVAC' 
      ? '/hvac.png' 
      : technician.profession === 'Gardener' 
      ? '/gardener.png'
      : technician.profession === 'Network Technician' 
      ? '/networktechnician.jpg'
      : technician.profession === 'Landscaper' 
      ? '/landscaper.avif'
      : technician.profession === 'Carpenter' 
      ? '/carpenter.avif'
      : '/default/image.png' // Fallback image if profession does not match


    // Destructure address properties with default values to avoid errors
    const { street = 'N/A', city = 'N/A', state = 'N/A', zipCode = 'N/A' } = technician.address || {};


  



  return (
    <div
      className="card"
      onClick={() => onClick(technician.userid, serviceId)}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        margin: '15px',
        padding: '15px',
        width: '220px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        fontFamily: 'Candara, sans-serif', 
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      <h5 style={{ color: '#555', fontSize: '0.9rem', fontWeight: 'bold' }}>{technician.profession}</h5>
      
      <img
        src={defaultImage}
        alt={technician.profession}
        style={{
          width: '100%',
          height: '170px',
          borderRadius: '6px',
          margin: '10px 0',
          objectFit: 'cover',
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/default/image.png';
        }}
      />

      <h4 style={{ fontSize: '1.1rem', color: '#333', margin: '5px 0' }}>{technician.username}</h4>

      <p style={{ fontSize: '0.85rem', color: '#777', marginTop: '5px' }}>
        {street}, {city}, {state} {zipCode}
      </p>

      <div style={{ marginTop: '10px' }}>
    {technician.reviews && technician.reviews.length > 0 ? (
      <div>
        <h5 style={{ margin: '5px 0', fontSize: '0.9rem', color: '#333' }}>
          Average Rating: 
          {(
            technician.reviews.reduce((sum, review) => sum + review.rating, 0) /
            technician.reviews.length
          ).toFixed(1)} / 5
        </h5>
        
      </div>
    ) : (
      <p style={{ fontSize: '0.85rem', color: '#777' }}>No reviews yet</p>
    )}
  </div>

      
    
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
      reviews: PropTypes.arrayOf(
        PropTypes.shape({
          rating: PropTypes.number.isRequired,
          comment: PropTypes.string.isRequired,
          customerName: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
        })
      ).isRequired, 
    }).isRequired,
    serviceId: PropTypes.string.isRequired, // Add serviceId for identification


    onClick: PropTypes.func, // Optional click handler
  };

  export default TechnicianCard;
