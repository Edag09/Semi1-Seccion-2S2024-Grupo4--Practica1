import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importar Link para la navegación
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validar las credenciales con la API
    try {
      const response = await fetch('URL_DE_TU_API/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Manejar el inicio de sesión exitoso
        console.log('Usuario autenticado:', data);
        // Aquí puedes redirigir al usuario a la página principal de la aplicación
      } else {
        setError('Correo electrónico o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error durante la autenticación:', error);
      setError('Ocurrió un error al iniciar sesión. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Iniciar Sesión</button>  
      </form>
      <br />
      <div className="login-links">
        <Link to="/reset-password">¿Olvidaste tu contraseña?</Link>
        <br />
        <p>¿No tienes cuenta?&nbsp;<Link to="/registro">Regístrate</Link></p>
      </div>
    </div>
  );
};

export default Login;
