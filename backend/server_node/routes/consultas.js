const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

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

module.exports = router;