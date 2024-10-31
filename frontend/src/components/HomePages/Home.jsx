// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate(); // Create a navigate function
  return (
    <div>
      <h1>Welcome to Our Service Platform</h1>
      <p>We connect customers with trusted local technicians for all your home service needs.</p>
      
      <section>
        <h2>About Us</h2>
        <p>We aim to provide a seamless and reliable platform for booking services like plumbing, electrical work, and more.</p>
      </section>

      <section>
        <h2>Our Services</h2>
        <div className="service-images">
          <img src="plumbing.jpg" alt="Plumbing" />
          <img src="electrician.jpg" alt="Electrical Work" />
        </div>
      </section>

      <button onClick={() => navigate('/signup')}>Get Started</button>
    </div>
  );
};

export default Home;
