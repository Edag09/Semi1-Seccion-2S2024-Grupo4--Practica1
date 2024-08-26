import conection

# Insertar un usuario en la base de datos
def insertuser(data):

    connect = conection.conectar()
    
    try:
        cursor = connect.cursor()

        sql = "INSERT INTO usuarios (nombres, apellidos, foto_url, correo_electronico, contrasena, fecha_nacimiento, rol, fecha_creacion) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        
        cursor.execute(sql, data)
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
        cursor.execute(sql, data)
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
        sql = "UPDATE usuarios SET nombres = %s, apellidos = %s, foto_url = %s, correo_electronico = %s, contrasena = %s, fecha_nacimiento = %s, rol = %s, fecha_creacion = %s WHERE id = %s"
        cursor.execute(sql, data)
        connect.commit()
        print("Usuario actualizado exitosamente")
        connect.close()
        return cursor.rowcount
    except Error as e:
        print("Error al actualizar usuario en MySQL", e)
        return None

# Eliminar un usuario en la base de datos
def deleteuser(id):
    
    connect = conection.conectar()

    try:
        cursor = connect.cursor()
        sql = "DELETE FROM usuarios WHERE id = %s"
        cursor.execute(sql, (id,))
        connect.commit()
        print("Usuario eliminado exitosamente")
        connect.close()
        return cursor.rowcount
    except Error as e:
        print("Error al eliminar usuario en MySQL", e)
        return None
