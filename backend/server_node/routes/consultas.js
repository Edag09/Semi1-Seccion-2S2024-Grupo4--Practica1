const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

//Endpoint de Usuarios
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Faltan datos del login', code: 400 });
    }
    const query = 'SELECT * FROM usuarios WHERE correo_electronico = ? AND contrasena = ?';
    mysqlConnection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ message: 'Error interno del servidor', code: 500 });
        }
        if (results.length > 0) {
            return res.status(200).json({ message: 'Login exitoso', code: 200 });
        } else {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos', code: 401 });
        }
    });
});

router.post('/createuser', (req, res) => {
    const { name, lastName, photoUrl, email, password, dateOfBirth, role, creationDate } = req.body;
    if (!name || !lastName || !photoUrl || !email || !password || !dateOfBirth || ! role || !creationDate) {
        return res.status(400).json({ message: 'Faltan datos obligatorios para crear el usuario', code: 400 });
    }
    const checkEmailQuery = 'SELECT * FROM usuarios WHERE correo_electronico = ?';
    mysqlConnection.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error('Error al verificar el correo electrónico:', err);
            return res.status(500).json({ message: 'Error interno del servidor', code: 500 });
        }
        if (results.length > 0) {
            return res.status(412).json({ message: 'El correo electrónico ya está registrado', code: 412 });
        }
        const query = 'INSERT INTO usuarios (nombres, apellidos, foto_url, correo_electronico, contrasena, fecha_nacimiento, rol, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        mysqlConnection.query(query, [name, lastName, photoUrl, email, password, dateOfBirth, role, creationDate], (err, results) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return res.status(500).json({ message: 'Error interno del servidor', code: 500 });
            }
            return res.status(200).json({ message: 'Usuario creado exitosamente', code: 200, userId: results.insertId });
        });
    });
});

router.get('/userinfo', (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: 'Faltan datos del usuario', code: 400 });
    }
    const query = 'SELECT * FROM usuarios WHERE id = ?';
    mysqlConnection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ message: 'Error interno del servidor', code: 500 });
        }
        if (results.length > 0) {
            return res.status(200).json(results[0]);
        } else {
            return res.status(404).json({ message: 'Usuario no encontrado', code: 404 });
        }
    });
});

router.put('/modifyuser', (req, res) => {
    const { userId, name, lastName, photoUrl, email, password } = req.body;
    if (!userId || !password) {
        return res.status(400).json({ message: 'Faltan datos obligatorios', code: 400 });
    }
    const verifyPasswordQuery = 'SELECT contrasena FROM usuarios WHERE id = ?';
    mysqlConnection.query(verifyPasswordQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error al verificar la contraseña:', err);
            return res.status(500).json({ message: 'Error interno del servidor', code: 500 });
        }
        if (results.length > 0) {
            const storedPassword = results[0].contrasena;
            if (storedPassword !== password) {
                return res.status(401).json({ message: 'Contraseña incorrecta', code: 401 });
            }
            const updateUserQuery = `
                UPDATE usuarios SET 
                    nombres = ?, 
                    apellidos = ?, 
                    foto_url = ?, 
                    correo_electronico = ? 
                WHERE id = ?`;
            mysqlConnection.query(updateUserQuery, [name, lastName, photoUrl, email, userId], (err, results) => {
                if (err) {
                    console.error('Error al actualizar los datos del usuario:', err);
                    return res.status(500).json({ message: 'Error interno del servidor', code: 500 });
                }
                return res.status(200).json({ message: 'Datos del usuario actualizados exitosamente', code: 200 });
            });
        } else {
            return res.status(404).json({ message: 'Usuario no encontrado', code: 404 });
        }
    });
});

module.exports = router;