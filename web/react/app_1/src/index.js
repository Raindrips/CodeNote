import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Canvas from './drag_test/App_1';
import MovingDot from './state_test/MovingDot.jsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MovingDot />
  </React.StrictMode>
);
reportWebVitals();