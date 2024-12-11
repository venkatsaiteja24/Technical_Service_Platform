import React from 'react';
import '../components/CSS/ContactSupport.css'; // Import the CSS file for styling

const ContactSupport = () => {
  return (
    <div className="contact-support">
      <h1>Contact Support</h1>
      <p>If you have any questions or need assistance, feel free to reach out to our support team:</p>

      <div className="contact-details">
        <p><strong>Name:</strong> Venkata Sai Teja Thammishetti</p>
        <p><strong>Phone:</strong> 704-951-1824</p>
        <p><strong>Email:</strong> <a href="mailto:vthammishetti@clarku.edu">vthammishetti@clarku.edu</a></p>
      </div>
    </div>
  );
};

export default ContactSupport;
