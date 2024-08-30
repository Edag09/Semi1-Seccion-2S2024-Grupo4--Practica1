import conection
from mysql.connector import Error
from flask import jsonify

# Insertar una canción en la base de datos
def insertsong(data):

    connect = conection.conectar()
    
    try:
        cursor = connect.cursor()

        sql = "INSERT INTO canciones (nombre, fotografia_url, duracion, artista, archivo_mp3_url, fecha_subida) VALUES (%s, %s, %s, %s, %s, %s)"
        
        cursor.execute(sql,
                          (data['nombre'], data['fotografia_url'], data['duracion'], data['artista'],
                            data['archivo_mp3_url'], data['fecha_subida'])
          )
        
        connect.commit()
        print("Canción insertada exitosamente")
        connect.close()
        return cursor.lastrowid
    
    except Error as e:
        print("Error al insertar canción en MySQL", e)
        return None
    
    finally:
        if connect.is_connected():
            connect.close()
            cursor.close()

## Modificar una canción en la base de datos
def updatesong(data):

    connect = conection.conectar()
    
    try:
        cursor = connect.cursor()

        sql = "UPDATE canciones SET fotografia_url = %s, duracion = %s, artista = %s, archivo_mp3_url = %s, fecha_subida = %s WHERE nombre = %s"
        
        cursor.execute(sql,
                          (data['fotografia_url'], data['duracion'], data['artista'],
                            data['archivo_mp3_url'], data['fecha_subida'], data['nombre'] )
          )
        
        connect.commit()
        print("Canción actualizada exitosamente")
        connect.close()
        return cursor.lastrowid
    
    except Error as e:
        print("Error al actualizar canción en MySQL", e)
        return None
    
    finally:
        if connect.is_connected():
            connect.close()
            cursor.close()

## Eliminar una canción de la base de datos
def deletesong(data):

    connect = conection.conectar()
    
    try:
        cursor = connect.cursor()

        sql = "DELETE FROM canciones WHERE nombre = %s"
        
        cursor.execute(sql, (data['nombre'],))
        
        connect.commit()
        print("Canción eliminada exitosamente")
        connect.close()
        return cursor.lastrowid
    
    except Error as e:
        print("Error al eliminar canción en MySQL", e)
        return None
    
    finally:
        if connect.is_connected():
            connect.close()
            cursor.close()

## Buscar una canción en la base de datos
def searchsong(data):

    connect = conection.conectar()
    
    try:
        cursor = connect.cursor()

        sql = "SELECT * FROM canciones WHERE nombre = %s"
        
        cursor.execute(sql, (data['nombre'],))
        
        result = cursor.fetchone()
        print("Canción encontrada exitosamente")
        connect.close()

        response = {
            "nombre": result[1],
            "fotografia_url": result[2],
            "duracion": str(result[3]),
            "artista": result[4],
            "archivo_mp3_url": result[5],
            "fecha_subida": str(result[6])
        }
        return response
    
    except Error as e:
        print("Error al buscar canción en MySQL", e)
        return None
    
    finally:
        if connect.is_connected():
            connect.close()
            cursor.close()

### Para la playlist de Favoritos 

## Instertar una canción en la playlist de favoritos
def insertfavoritesong(data):

    connect = conection.conectar()
    
    try:
        cursor = connect.cursor()

        sql = "INSERT INTO favoritos (usuario_id, cancion_id, fecha_agregada) VALUES ( (SELECT id FROM usuarios WHERE nombres = %s), (SELECT id FROM canciones WHERE nombre = %s), NOW() );"
        
        cursor.execute(sql, (data['nombres'], data['nombre']))
        
        connect.commit()
        print("Canción insertada en favoritos exitosamente")
        connect.close()
        return cursor.lastrowid
    
    except Error as e:
        print("Error al insertar canción en favoritos en MySQL", e)
        return None
    
    finally:
        if connect.is_connected():
            connect.close()
            cursor.close()

## Eliminar una canción de la playlist de favoritos
def deletefavoritesong(data):

    connect = conection.conectar()
    
    try:
        cursor = connect.cursor()

        sql = "DELETE FROM favoritos WHERE usuario_id = (SELECT id FROM usuarios WHERE nombres = %s) AND cancion_id = (SELECT id FROM canciones WHERE nombre = %s);"
        
        cursor.execute(sql, (data['nombres'], data['nombre']))
        
        connect.commit()
        print("Canción eliminada de favoritos exitosamente")
        connect.close()
        return cursor.lastrowid
    
    except Error as e:
        print("Error al eliminar canción de favoritos en MySQL", e)
        return None
    
    finally:
        if connect.is_connected():
            connect.close()
            cursor.close()

## Listar todas las canciones de la playlist de favoritos de un usuario
def listfavoritesongs(data):

    connect = conection.conectar()
    
    try:
        cursor = connect.cursor()

        sql = "SELECT c.nombre, c.fotografia_url, c.duracion, c.artista, c.archivo_mp3_url, c.fecha_subida FROM favoritos f JOIN canciones c ON f.cancion_id = c.id WHERE f.usuario_id = (SELECT id FROM usuarios WHERE nombres = %s);"
        
        cursor.execute(sql, (data['nombres'],))
        
        result = cursor.fetchall()
        print("Canciones de favoritos listadas exitosamente")
        connect.close()

        response = []
        for row in result:
            response.append({
                "nombre": row[0],
                "fotografia_url": row[1],
                "duracion": str(row[2]),
                "artista": row[3],
                "archivo_mp3_url": row[4],
                "fecha_subida": str(row[5])
            })
        return response
    
    except Error as e:
        print("Error al listar canciones de favoritos en MySQL", e)
        return None
    
    finally:
        if connect.is_connected():
            connect.close()
            cursor.close()