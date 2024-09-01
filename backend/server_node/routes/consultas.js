const express = require("express");
const router = express.Router();
const mysqlConnection = require("../database");

//Endpoint de Usuarios
router.post("/", (req, res) => {
  res.status(200).send("OK");
});

//Endpoint de Usuarios
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Faltan datos del login", code: 400 });
  }
  const query =
    "SELECT * FROM usuarios WHERE correo_electronico = ? AND contrasena = ?";
  mysqlConnection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.length > 0) {
      return res.status(200).json({ message: "Login exitoso", code: 200 });
    } else {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos", code: 401 });
    }
  });
});

router.post("/createuser", (req, res) => {
  const {
    name,
    lastName,
    photoUrl,
    email,
    password,
    dateOfBirth,
    role,
    creationDate,
  } = req.body;
  if (
    !name ||
    !lastName ||
    !photoUrl ||
    !email ||
    !password ||
    !dateOfBirth ||
    !role ||
    !creationDate
  ) {
    return res
      .status(400)
      .json({
        message: "Faltan datos obligatorios para crear el usuario",
        code: 400,
      });
  }
  const checkEmailQuery = "SELECT * FROM usuarios WHERE correo_electronico = ?";
  mysqlConnection.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Error al verificar el correo electrónico:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.length > 0) {
      return res
        .status(412)
        .json({
          message: "El correo electrónico ya está registrado",
          code: 412,
        });
    }
    const query =
      "INSERT INTO usuarios (nombres, apellidos, foto_url, correo_electronico, contrasena, fecha_nacimiento, rol, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    mysqlConnection.query(
      query,
      [
        name,
        lastName,
        photoUrl,
        email,
        password,
        dateOfBirth,
        role,
        creationDate,
      ],
      (err, results) => {
        if (err) {
          console.error("Error al ejecutar la consulta:", err);
          return res
            .status(500)
            .json({ message: "Error interno del servidor", code: 500 });
        }
        return res
          .status(200)
          .json({
            message: "Usuario creado exitosamente",
            code: 200,
            userId: results.insertId,
          });
      }
    );
  });
});

router.get("/userinfo", (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res
      .status(400)
      .json({ message: "Faltan datos del usuario", code: 400 });
  }
  const query = "SELECT * FROM usuarios WHERE id = ?";
  mysqlConnection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.length > 0) {
      return res.status(200).json(results[0]);
    } else {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado", code: 404 });
    }
  });
});

router.put("/modifyuser", (req, res) => {
  const { userId, name, lastName, photoUrl, email, password } = req.body;
  if (!userId || !password) {
    return res
      .status(400)
      .json({ message: "Faltan datos obligatorios", code: 400 });
  }
  const verifyPasswordQuery = "SELECT contrasena FROM usuarios WHERE id = ?";
  mysqlConnection.query(verifyPasswordQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error al verificar la contraseña:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.length > 0) {
      const storedPassword = results[0].contrasena;
      if (storedPassword !== password) {
        return res
          .status(401)
          .json({ message: "Contraseña incorrecta", code: 401 });
      }
      const updateUserQuery = `
                UPDATE usuarios SET 
                    nombres = ?, 
                    apellidos = ?, 
                    foto_url = ?, 
                    correo_electronico = ? 
                WHERE id = ?`;
      mysqlConnection.query(
        updateUserQuery,
        [name, lastName, photoUrl, email, userId],
        (err, results) => {
          if (err) {
            console.error("Error al actualizar los datos del usuario:", err);
            return res
              .status(500)
              .json({ message: "Error interno del servidor", code: 500 });
          }
          return res
            .status(200)
            .json({
              message: "Datos del usuario actualizados exitosamente",
              code: 200,
            });
        }
      );
    } else {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado", code: 404 });
    }
  });
});

router.delete("/deleteuser", (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) {
    return res
      .status(400)
      .json({ message: "Faltan datos obligatorios", code: 400 });
  }
  const verifyPasswordQuery = "SELECT contrasena FROM usuarios WHERE id = ?";
  mysqlConnection.query(verifyPasswordQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error al verificar la contraseña:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.length > 0) {
      const storedPassword = results[0].contrasena;
      if (storedPassword !== password) {
        return res
          .status(401)
          .json({ message: "Contraseña incorrecta", code: 401 });
      }
      const deleteUserQuery = "DELETE FROM usuarios WHERE id = ?";
      mysqlConnection.query(deleteUserQuery, [userId], (err, results) => {
        if (err) {
          console.error("Error al eliminar el usuario:", err);
          return res
            .status(500)
            .json({ message: "Error interno del servidor", code: 500 });
        }
        if (results.affectedRows > 0) {
          return res
            .status(200)
            .json({ message: "Usuario eliminado exitosamente", code: 200 });
        } else {
          return res
            .status(404)
            .json({ message: "Usuario no encontrado", code: 404 });
        }
      });
    } else {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado", code: 404 });
    }
  });
});

//Endpoint de Canciones
router.post("/createsong", (req, res) => {
  const { nameSong, photoSongUrl, duration, artist, mp3FileUrl, uploadDate } =
    req.body;
  if (
    !nameSong ||
    !photoSongUrl ||
    !duration ||
    !artist ||
    !mp3FileUrl ||
    !uploadDate
  ) {
    return res
      .status(400)
      .json({
        message: "Faltan datos obligatorios para crear la cancion",
        code: 400,
      });
  }
  const query =
    "INSERT INTO canciones (nombre, fotografia_url, duracion, artista, archivo_mp3_url, fecha_subida) VALUES (?, ?, ?, ?, ?, ?)";
  mysqlConnection.query(
    query,
    [nameSong, photoSongUrl, duration, artist, mp3FileUrl, uploadDate],
    (err, results) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        return res
          .status(500)
          .json({ message: "Error interno del servidor", code: 500 });
      }
      return res
        .status(200)
        .json({
          message: "Cancion creada exitosamente",
          code: 200,
          songId: results.insertId,
        });
    }
  );
});

router.get("/searchsong", (req, res) => {
  const { nameSong, artist } = req.query;
  if (!nameSong && !artist) {
    return res
      .status(400)
      .json({
        message:
          "Debe proporcionar el nombre de la canción o el nombre del artista para buscar",
        code: 400,
      });
  }
  let query = "SELECT * FROM canciones WHERE";
  let queryParams = [];
  if (nameSong) {
    query += " nombre LIKE ?";
    queryParams.push(`%${nameSong}%`);
  }
  if (artist) {
    if (nameSong) query += " AND";
    query += " artista LIKE ?";
    queryParams.push(`%${artist}%`);
  }
  mysqlConnection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.length > 0) {
      return res.status(200).json({ songs: results, code: 200 });
    } else {
      return res
        .status(404)
        .json({
          message:
            "No se encontraron canciones que coincidan con los criterios de búsqueda",
          code: 404,
        });
    }
  });
});

router.delete("/deletesong/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ message: "El ID de la canción es obligatorio", code: 400 });
  }
  const query = "DELETE FROM canciones WHERE id = ?";
  mysqlConnection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Canción eliminada exitosamente", code: 200 });
    } else {
      return res
        .status(404)
        .json({ message: "Canción no encontrada", code: 404 });
    }
  });
});

router.put("/modifysong/:id", (req, res) => {
  const { id } = req.params;
  const { nameSong, photoSongUrl, duration, artist, mp3FileUrl, uploadDate } =
    req.body;
  if (!id) {
    return res
      .status(400)
      .json({ message: "El ID de la canción es obligatorio", code: 400 });
  }
  let query = "UPDATE canciones SET ";
  const queryParams = [];
  if (nameSong) {
    query += "nombre = ?, ";
    queryParams.push(nameSong);
  }
  if (photoSongUrl) {
    query += "fotografia_url = ?, ";
    queryParams.push(photoSongUrl);
  }
  if (duration) {
    query += "duracion = ?, ";
    queryParams.push(duration);
  }
  if (artist) {
    query += "artista = ?, ";
    queryParams.push(artist);
  }
  if (mp3FileUrl) {
    query += "archivo_mp3_url = ?, ";
    queryParams.push(mp3FileUrl);
  }
  if (uploadDate) {
    query += "fecha_subida = ?, ";
    queryParams.push(uploadDate);
  }
  query = query.slice(0, -2) + " WHERE id = ?";
  queryParams.push(id);
  mysqlConnection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Canción actualizada exitosamente", code: 200 });
    } else {
      return res
        .status(404)
        .json({ message: "Canción no encontrada", code: 404 });
    }
  });
});

router.get("/viewsong/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ message: "El ID de la canción es obligatorio", code: 400 });
  }
  const query = "SELECT * FROM canciones WHERE id = ?";
  mysqlConnection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.length > 0) {
      return res.status(200).json({ song: results[0], code: 200 });
    } else {
      return res
        .status(404)
        .json({ message: "Canción no encontrada", code: 404 });
    }
  });
});

router.post("/addfavorite", (req, res) => {
  const { userId, songId, dateAdded } = req.body;
  if (!userId || !songId) {
    return res
      .status(400)
      .json({ message: "Faltan datos obligatorios", code: 400 });
  }
  const query =
    "INSERT INTO favoritos (usuario_id, cancion_id, fecha_agregada) VALUES (?, ?, ?)";
  mysqlConnection.query(query, [userId, songId, dateAdded], (err, results) => {
    if (err) {
      console.error("Error al agregar el favorito:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    return res
      .status(200)
      .json({
        message: "Favorito agregado exitosamente",
        code: 200,
        favoriteId: results.insertId,
      });
  });
});

router.delete("/removesong", (req, res) => {
  const { userId, songId } = req.body;
  if (!userId || !songId) {
    return res
      .status(400)
      .json({ message: "Faltan datos obligatorios", code: 400 });
  }
  const query = "DELETE FROM favoritos WHERE usuario_id = ? AND cancion_id = ?";
  mysqlConnection.query(query, [userId, songId], (err, results) => {
    if (err) {
      console.error("Error al eliminar el favorito:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Favorito eliminado exitosamente", code: 200 });
    } else {
      return res
        .status(404)
        .json({ message: "Favorito no encontrado", code: 404 });
    }
  });
});

router.get("/listfavorite", (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res
      .status(400)
      .json({ message: "Faltan datos obligatorios", code: 400 });
  }
  const query = `
        SELECT f.id, f.usuario_id, f.cancion_id, f.fecha_agregada, c.nombre AS nombre_cancion, c.fotografia_url AS foto_cancion
        FROM favoritos f
        JOIN canciones c ON f.cancion_id = c.id
        WHERE f.usuario_id = ?`;
  mysqlConnection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error al listar los favoritos:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    return res.status(200).json({ favorites: results, code: 200 });
  });
});

//Endpoint de Playlist
router.post("/createplaylist", (req, res) => {
  const { name, description, coverUrl, userId, creationDate } = req.body;
  if (!name || !description || !coverUrl || !userId || !creationDate) {
    return res
      .status(400)
      .json({
        message: "Faltan datos obligatorios para crear la playlist",
        code: 400,
      });
  }
  const query =
    "INSERT INTO playlists (nombre, descripcion, fondo_portada_url, usuario_id, fecha_creacion) VALUES (?, ?, ?, ?, ?)";
  mysqlConnection.query(
    query,
    [name, description, coverUrl, userId, creationDate],
    (err, results) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        return res
          .status(500)
          .json({ message: "Error interno del servidor", code: 500 });
      }
      return res
        .status(200)
        .json({
          message: "Playlist creada exitosamente",
          code: 200,
          playlistId: results.insertId,
        });
    }
  );
});

router.get("/playlist", (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res
      .status(400)
      .json({ message: "Faltan datos obligatorios: userId", code: 400 });
  }
  const query = "SELECT * FROM playlists WHERE usuario_id = ?";
  mysqlConnection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.length > 0) {
      return res.status(200).json({ playlists: results });
    } else {
      return res
        .status(404)
        .json({
          message: "No se encontraron playlists para este usuario",
          code: 404,
        });
    }
  });
});

router.delete("/deleteplaylist", (req, res) => {
  const { playlistId, userId } = req.body;
  if (!playlistId || !userId) {
    return res
      .status(400)
      .json({
        message: "Faltan datos obligatorios: playlistId o userId",
        code: 400,
      });
  }
  const deleteQuery = "DELETE FROM playlists WHERE id = ? AND usuario_id = ?";
  mysqlConnection.query(deleteQuery, [playlistId, userId], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Playlist eliminada exitosamente", code: 200 });
    } else {
      return res
        .status(404)
        .json({
          message:
            "Playlist no encontrada o el usuario no tiene permiso para eliminarla",
          code: 404,
        });
    }
  });
});

router.put("/updateplaylist", (req, res) => {
  const { playlistId, userId, name, description, coverImageUrl } = req.body;
  if (!playlistId || !userId || !name || !description || !coverImageUrl) {
    return res
      .status(400)
      .json({
        message:
          "Faltan datos obligatorios: playlistId, userId, name, description, o coverImageUrl",
        code: 400,
      });
  }
  const updateQuery = `
        UPDATE playlists 
        SET nombre = ?, descripcion = ?, fondo_portada_url = ?
        WHERE id = ? AND usuario_id = ?
    `;
  mysqlConnection.query(
    updateQuery,
    [name, description, coverImageUrl, playlistId, userId],
    (err, results) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        return res
          .status(500)
          .json({ message: "Error interno del servidor", code: 500 });
      }
      if (results.affectedRows > 0) {
        return res
          .status(200)
          .json({ message: "Playlist actualizada exitosamente", code: 200 });
      } else {
        return res
          .status(404)
          .json({
            message:
              "Playlist no encontrada o el usuario no tiene permiso para actualizarla",
            code: 404,
          });
      }
    }
  );
});

router.post("/addsong", (req, res) => {
  const { playlistId, songId, addedDate } = req.body;
  if (!playlistId || !songId || !addedDate) {
    return res
      .status(400)
      .json({
        message: "Faltan datos obligatorios: playlistId, songId, o addedDate",
        code: 400,
      });
  }
  const checkPlaylistQuery = "SELECT * FROM playlists WHERE id = ?";
  mysqlConnection.query(
    checkPlaylistQuery,
    [playlistId],
    (err, playlistResults) => {
      if (err) {
        console.error("Error al verificar la playlist:", err);
        return res
          .status(500)
          .json({ message: "Error interno del servidor", code: 500 });
      }
      if (playlistResults.length === 0) {
        return res
          .status(404)
          .json({ message: "Playlist no encontrada", code: 404 });
      }
      const checkSongQuery = "SELECT * FROM canciones WHERE id = ?";
      mysqlConnection.query(checkSongQuery, [songId], (err, songResults) => {
        if (err) {
          console.error("Error al verificar la canción:", err);
          return res
            .status(500)
            .json({ message: "Error interno del servidor", code: 500 });
        }
        if (songResults.length === 0) {
          return res
            .status(404)
            .json({ message: "Canción no encontrada", code: 404 });
        }
        const addSongQuery = `
                INSERT INTO playlist_canciones (playlist_id, cancion_id, fecha_agregada)
                VALUES (?, ?, ?)
            `;
        mysqlConnection.query(
          addSongQuery,
          [playlistId, songId, addedDate],
          (err, results) => {
            if (err) {
              console.error("Error al agregar la canción a la playlist:", err);
              return res
                .status(500)
                .json({ message: "Error interno del servidor", code: 500 });
            }
            return res
              .status(200)
              .json({
                message: "Canción agregada a la playlist exitosamente",
                code: 200,
              });
          }
        );
      });
    }
  );
});

router.get("/playlistsongs", (req, res) => {
  const { playlistId } = req.query;
  if (!playlistId) {
    return res
      .status(400)
      .json({
        message: "Falta el playlistId en los parámetros de la solicitud",
        code: 400,
      });
  }
  const query = `
        SELECT c.id, c.nombre, c.fotografia_url, c.duracion, c.artista, c.archivo_mp3_url, c.fecha_subida
        FROM canciones c
        INNER JOIN playlist_canciones pc ON c.id = pc.cancion_id
        WHERE pc.playlist_id = ?
    `;
  mysqlConnection.query(query, [playlistId], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.length > 0) {
      return res
        .status(200)
        .json({
          message: "Canciones obtenidas exitosamente",
          code: 200,
          songs: results,
        });
    } else {
      return res
        .status(404)
        .json({
          message: "No se encontraron canciones en la playlist",
          code: 404,
        });
    }
  });
});

router.delete("/removesongplaylist", (req, res) => {
  const { playlistId, songId } = req.body;
  if (!playlistId || !songId) {
    return res
      .status(400)
      .json({ message: "Faltan datos obligatorios", code: 400 });
  }
  const query =
    "DELETE FROM playlist_canciones WHERE playlist_id = ? AND cancion_id = ?";
  mysqlConnection.query(query, [playlistId, songId], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res
        .status(500)
        .json({ message: "Error interno del servidor", code: 500 });
    }
    if (results.affectedRows > 0) {
      return res
        .status(200)
        .json({
          message: "Canción eliminada de la playlist exitosamente",
          code: 200,
        });
    } else {
      return res
        .status(404)
        .json({ message: "Canción no encontrada en la playlist", code: 404 });
    }
  });
});

module.exports = router;
