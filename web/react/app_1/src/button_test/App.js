// App.js
import React from 'react';
import { ThemeProvider } from './ThemeContext';
import ThemedButton from './ThemedButton';

const App = () => {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
};

export default App;