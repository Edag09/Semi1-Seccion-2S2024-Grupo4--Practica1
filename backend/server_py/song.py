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