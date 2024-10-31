import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { Provider } from 'react-redux'; // Import Provider
import store from './app/store'; // Adjust the path to your store file
import App from './App';


const container = document.getElementById('root');
const root = createRoot(container); // Create a root
root.render(
  <Provider store={store}>  {/* Wrap App in Provider */}
    <App />
  </Provider>
); // Render your app
