import conection
from mysql.connector import Error

# Insertar un usuario en la base de datos
def insertuser(data):

    connect = conection.conectar()
    
    try:
        cursor = connect.cursor()

        sql = "INSERT INTO usuarios (nombres, apellidos, foto_url, correo_electronico, contrasena, fecha_nacimiento, rol, fecha_creacion) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        
        cursor.execute(sql, 
                       (data['nombres'], data['apellidos'], data['foto_url'], data['correo_electronico'],
                        data['contrasena'], data['fecha_nacimiento'], data['rol'], data['fecha_creacion'])
        )
        connect.commit()
        print("Usuario insertado exitosamente")
        connect.close()
        return cursor.lastrowid
    
    except Error as e:
        print("Error al insertar usuario en MySQL", e)
        return None
    
# Buscar un usuario en la base de datos
def loginuser(data):

    connect = conection.conectar()

    try:
        cursor = connect.cursor()
        sql = "SELECT * FROM usuarios WHERE correo_electronico = %s AND contrasena = %s"
        cursor.execute(sql, (data['correo_electronico'], data['contrasena']))
        result = cursor.fetchone()
        connect.close()
        return result
    except Error as e:
        print("Error al buscar usuario en MySQL", e)
        return None
    
# Actualizar un usuario en la base de datos
def updateuser(data):

    connect = conection.conectar()

    try:
        cursor = connect.cursor()
        sql = """UPDATE usuarios 
                SET nombres = %s, apellidos = %s, foto_url = %s, contrasena = %s, 
                    fecha_nacimiento = %s, rol = %s, fecha_creacion = %s 
                WHERE correo_electronico = %s"""
                
        # Pasa los valores como una tupla
        cursor.execute(sql, (
            data['nombres'], 
            data['apellidos'], 
            data['foto_url'], 
            data['contrasena'], 
            data['fecha_nacimiento'], 
            data['rol'], 
            data['fecha_creacion'], 
            data['correo_electronico']  # El correo que identifica al usuario
        ))
        connect.commit()
        print("Usuario actualizado exitosamente")
        connect.close()
        return cursor.rowcount
    except Error as e:
        print("Error al actualizar usuario en MySQL", e)
        return None

# Eliminar un usuario en la base de datos
def deleteuser(data):
    
    connect = conection.conectar()

    try:
        cursor = connect.cursor()
        sql = "DELETE FROM usuarios WHERE correo_electronico = %s"
        cursor.execute(sql,(data['correo_electronico'],))
        connect.commit()
        print("Usuario eliminado exitosamente")
        connect.close()
        return cursor.rowcount
    except Error as e:
        print("Error al eliminar usuario en MySQL", e)
        return None
