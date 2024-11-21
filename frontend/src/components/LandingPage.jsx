import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import TechnicianCard from './TechnicianCard';
import BookingForm from './Booking/BookingForm';
import './CSS/LandingPage.css';

const LandingPage = () => {
  const { user } = useSelector((state) => state.auth);

  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [filterOpen, setFilterOpen] = useState(false);

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
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);


  useEffect(() => {
    const fetchTechniciansAndServices = async () => {
      setLoading(true);
      try {
        const [techResponse, serviceResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/auth/all-technicians'),
          axios.get('http://localhost:5000/api/services'),
        ]);

        const serviceMap = serviceResponse.data.reduce((map, service) => {
          map[service.name] = service._id;
          return map;
        }, {});

        const techniciansWithServiceIds = techResponse.data.map((tech) => ({
          ...tech,
          serviceId: serviceMap[tech.profession],
        }));

                                // Fetch reviews for each technician
                          const reviewsResponse = await Promise.all(
                            techniciansWithServiceIds.map((tech) =>
                              axios.get(`http://localhost:5000/api/reviews/${tech.userid}`)
                            )
                          );

                         // Map reviews to technicians
                        techniciansWithServiceIds.forEach((tech, index) => {
                          tech.reviews = reviewsResponse[index].data; // Add reviews to each technician
                        });

        setAllTechnicians(techniciansWithServiceIds);
        setTechnicians(techniciansWithServiceIds);
        setServices(serviceResponse.data);

  

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load technicians and services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTechniciansAndServices();
  }, []);



  useEffect(() => {
    // Define filterTechnicians inside the useEffect hook
    const filterTechnicians = (technicians) => {
      return technicians.filter(
        (tech) =>
          (!service || service === 'All Services' || tech.profession === service) && // Filter by service
          (!city || tech.address.city.toLowerCase().includes(city.toLowerCase())) && // Filter by city
          (!state || tech.address.state.toLowerCase().includes(state.toLowerCase())) // Filter by state
      );
    };
  
    setTechnicians(filterTechnicians(allTechnicians)); // Apply combined filters
  }, [city, state, service, allTechnicians]); // Dependencies don't include 'filterTechnicians' anymore
  

  const handleServiceChange = (serviceName) => {
    setService(serviceName);
    setDropdownOpen(false);

    const selectedService = services.find((srv) => srv.name === serviceName);
    setServiceDescription(selectedService ? selectedService.description : '');
  };

  // Function to open the booking modal
  const openBookingModal = (technicianId, serviceId) => {
    setSelectedTechnicianId(technicianId);
    setSelectedServiceId(serviceId);
    setBookingModalOpen(true);
  };

  // Function to close the booking modal
  const closeBookingModal = () => {
    setSelectedTechnicianId(null);
    setSelectedServiceId(null);
    setBookingModalOpen(false);
  };

  return (
    <div className="heading">
      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <div>
          <span>
          <div className="dropdown-container">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="dropdown-toggle"
            >
              {service || 'Select a Service'}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button
                onClick={() => handleServiceChange('All Services')}
                className="dropdown-item"
                >
                All Services
                 </button>
                  {services.map((srv) => (
                  <button
                    key={srv._id}
                    onClick={() => handleServiceChange(srv.name)}
                    className="dropdown-item"
                  >
                    {srv.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <p></p>
          </div>
          <button onClick={() => setFilterOpen((prev) => !prev)} className="filter-btn">
            Filter
          </button>

          {filterOpen && (
            <div className="filter-inputs">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          )}
          </span>
          {serviceDescription && <p className="service-description">{serviceDescription}</p>}

          {technicians.length > 0 ? (
            <div className="technician-cards">
              {technicians.map((tech) => (
                <TechnicianCard
                  key={tech.userid}
                  technician={tech}
                  serviceId={tech.serviceId}
                  // reviews={reviews[tech._id] || []} // Pass reviews for each technician
                  onClick={() => openBookingModal(tech.userid, tech.serviceId)}
                />
              ))}
            </div>
          ) : (
            <p className="no-technicians">No technicians found for the selected filters.
            </p>
          )}
        </div>
      )}
          {console.log(selectedTechnicianId)}
      {/* Modal for Booking Form */}
      {isBookingModalOpen && (
        <>
          <div className="modal-overlay" onClick={closeBookingModal}></div>
          <div className="booking-modal">
            <h4>Booking Appointment</h4>
            <BookingForm
              technicianId={selectedTechnicianId}
              customerId={user.id}
              serviceId={selectedServiceId}
            />
            <button onClick={closeBookingModal} className="close-btn">
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LandingPage;
