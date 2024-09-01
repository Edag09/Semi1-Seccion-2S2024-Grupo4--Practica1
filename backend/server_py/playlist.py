import conection
from mysql.connector import Error

# Ver lista de playlists de un usuario en específico
def getplaylists(data):
    try:
        # Conectar a la base de datos
        connection = conection.conectar()
        cursor = connection.cursor()

        # Obtener todas las playlists
        sql = '''SELECT p.*
                        FROM playlists p
                        JOIN usuarios u ON p.usuario_id = u.id
                        WHERE u.correo_electronico = %s;'''
        
        cursor.execute(sql, (data['correo_electronico'],))
        result = cursor.fetchall()

        # Cerrar la conexión
        cursor.close()
        connection.close()

        return result

    except Error as e:
        print("Error al conectar a MySQL", e)
        return None
    
# Crear una playlist nueva
def createplaylist(data):
    try:
        # Conectar a la base de datos
        connection = conection.conectar()
        cursor = connection.cursor()

        # Crear una nueva playlist
        sql = '''INSERT INTO playlists (nombre, descripcion, fondo_portada_url, usuario_id, fecha_creacion)
                VALUES (%s, %s, %s, (SELECT id FROM usuarios WHERE correo_electronico = %s), %s);'''

        cursor.execute(sql, (data['nombre'], data['descripcion'], data['fondo_portada_url'], data['correo_electronico'], data['fecha_creacion']))
        connection.commit()

        # Cerrar la conexión
        cursor.close()
        connection.close()

        print("Playlist creada exitosamente")
        return cursor.lastrowid

    except Error as e:
        print("Error al crear playlist en MySQL", e)

# Eliminar una playlist
def deleteplaylist(data):
    try:
        # Conectar a la base de datos
        connection = conection.conectar()
        cursor = connection.cursor()

        # Eliminar la playlist
        sql = '''DELETE FROM playlists WHERE nombre = %s AND usuario_id = (SELECT id FROM usuarios WHERE correo_electronico = %s);'''

        cursor.execute(sql, (data['nombre'], data['correo_electronico']))
        connection.commit()

        # Cerrar la conexión
        cursor.close()
        connection.close()

        print("Playlist eliminada exitosamente")
        return cursor.lastrowid

    except Error as e:
        print("Error al eliminar playlist en MySQL", e)

# Agregar una canción a una playlist
def addsongtoplaylist(data):
    try:
        # Conectar a la base de datos
        connection = conection.conectar()
        cursor = connection.cursor()

        # Agregar una canción a una playlist
        sql = '''INSERT INTO playlist_canciones (playlist_id, cancion_id)
                VALUES ((SELECT id FROM playlists WHERE nombre = %s AND usuario_id = (SELECT id FROM usuarios WHERE correo_electronico = %s)), (SELECT id FROM canciones WHERE nombre = %s));'''

        cursor.execute(sql, (data['playlist'], data['correo_electronico'], data['cancion']))
        connection.commit()

        # Cerrar la conexión
        cursor.close()
        connection.close()

        print("Canción agregada a la playlist exitosamente")
        return cursor.lastrowid

    except Error as e:
        print("Error al agregar canción a playlist en MySQL", e)

# Eliminar una canción de una playlist
def deletesongfromplaylist(data):
    try:
        # Conectar a la base de datos
        connection = conection.conectar()
        cursor = connection.cursor()

        # Eliminar una canción de una playlist
        sql = '''DELETE FROM playlist_canciones
                WHERE playlist_id = (SELECT id FROM playlists WHERE nombre = %s AND usuario_id = (SELECT id FROM usuarios WHERE correo_electronico = %s))
                AND cancion_id = (SELECT id FROM canciones WHERE nombre = %s);'''

        cursor.execute(sql, (data['playlist'], data['correo_electronico'], data['cancion']))
        connection.commit()

        # Cerrar la conexión
        cursor.close()
        connection.close()

        print("Canción eliminada de la playlist exitosamente")
        return cursor.lastrowid

    except Error as e:
        print("Error al eliminar canción de playlist en MySQL", e)