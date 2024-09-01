import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import Registro from './Components/Registro/Registro';
import Inicio from './Components/Principal/Inicio';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={<Inicio/>}/>
      </Routes>
    </Router>
  );
};

export default App;
