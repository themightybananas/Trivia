// src/App.js
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Trivia from './Trivia';

function App() {
  return (
    <ChakraProvider>
      <Trivia />
    </ChakraProvider>
  );
}

export default App;
