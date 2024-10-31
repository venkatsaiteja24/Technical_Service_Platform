import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import TechnicianCard from './TechnicianCard';
import BookingForm from './Booking/BookingForm';

const LandingPage = () => {
  const [service, setService] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [allTechnicians, setAllTechnicians] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  

  useEffect(() => {
    const fetchTechniciansAndServices = async () => {
      setLoading(true);
      try {
        const [techResponse, serviceResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/auth/all-technicians'),
          axios.get('http://localhost:5000/api/services'),
        ]);

        const allTechnicians = techResponse.data;
        const services = serviceResponse.data;

        const serviceMap = services.reduce((map, service) => {
          map[service.name] = service._id;
          return map;
        }, {});

        const techniciansWithServiceIds = allTechnicians.map(tech => ({
          ...tech,
          serviceId: serviceMap[tech.profession],
        }));

        setAllTechnicians(techniciansWithServiceIds);
        setTechnicians(techniciansWithServiceIds);
        setServices(services);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load technicians and services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTechniciansAndServices();
  }, []);

  const handleServiceChange = (serviceName) => {
    setService(serviceName);
    setDropdownOpen(false);

    // Finding the selected service and update description
    const selectedService = services.find(srv => srv.name === serviceName);
    setServiceDescription(selectedService ? selectedService.description : '');
    
     const filteredTechnicians = serviceName
      ? allTechnicians.filter((tech) => tech.profession === serviceName)
      : allTechnicians;

    setTechnicians(filteredTechnicians);
  };
  
  const handleTechnicianSelect = (technicianId, serviceId) => {
    setSelectedTechnicianId(technicianId);
    setSelectedServiceId(serviceId);
  };

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
    

      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <div style={{ color: 'red' }}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <div>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-controls="service-dropdown"
              style={{ padding: '10px', margin: '5px', cursor: 'pointer' }}
            >
              {service || 'Select a Service'}
            </button>
            {dropdownOpen && (
              <div 
                id="service-dropdown"
                role="menu"
                style={{
                  position: 'absolute',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  zIndex: 1000,
                  marginTop: '5px',
                  width: '100%',
                }}
              >
                {services.map((srv) => (
                  <button 
                    key={srv._id}
                    role="menuitem"
                    onClick={() => handleServiceChange(srv.name)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: 'none',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    {srv.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}




      {/* Displaying service description after service is selected */}
      {serviceDescription && (
            <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
              {serviceDescription}
            </p>
          )}

      {technicians.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {technicians.map((tech) => (
            <TechnicianCard 
              key={tech.userid}
              technician={tech}
              serviceId={tech.serviceId}
              onClick={() => handleTechnicianSelect(tech.userid, tech.serviceId)}
            />
          ))}
        </div>
      )}
        
      {selectedTechnicianId && selectedServiceId && (
        <div>
          <h4>Booking Appointment</h4>
          <BookingForm 
            technicianId={selectedTechnicianId} 
            customerId={user.id} 
            serviceId={selectedServiceId} 
          />
          <button onClick={() => setSelectedTechnicianId(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
