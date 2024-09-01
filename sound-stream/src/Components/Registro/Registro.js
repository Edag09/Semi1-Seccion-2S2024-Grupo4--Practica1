import React, { useState } from 'react';
import './Registro.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    photo: null,
  });
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, photo: file });

    // Mostrar una vista previa de la foto
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Validación y lógica de registro aquí
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!formData.photo) {
      setError('La foto del usuario es obligatoria');
      return;
    }

    // Aquí puedes agregar la lógica para enviar los datos del formulario a tu API
    console.log('Datos del usuario:', formData);
  };

  return (
    <div className="register-container">
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">Nombres:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Apellidos:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="photo">Foto del Usuario:</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }} // Ocultar el input de archivo
          />
          <div className="photo-upload">
            <button type="button" onClick={() => document.getElementById('photo').click()}>
              {photoPreview ? 'Cambiar Foto' : 'Subir Foto'}
            </button>
            {photoPreview && <img src={photoPreview} alt="Vista previa de la foto" className="photo-preview" />}
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Registro;
