// ThemedButton.js
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const ThemedButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === 'light' ? '#ccc' : '#333',
        color: theme === 'light' ? '#000' : '#ccc',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
    </button>
  );
};

export default ThemedButton;
