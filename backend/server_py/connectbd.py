import mysql.connector
from mysql.connector import Error

connect = None
# Conexión a la base de datos
def conectar():
    global connect
    try:
        connect = mysql.connector.connect(
        user='admin', 
        password='*Semi1_Practica1*', 
        host='bdpractica1.cp842gwg2jsl.us-east-1.rds.amazonaws.com', 
        database='Practica1_semi', 
        port='3306'
        )
        if connect.is_connected():
            db_Info = connect.get_server_info()
            print("Conectado al servidor MySQL versión ", db_Info)
            cursor = connect.cursor()
            cursor.execute("select database();")
            record = cursor.fetchone()
            print("Conectado a la base de datos ", record)
    except Error as e:
        print("Error al conectar a MySQL", e)
    finally:
        print("Conexión exitosa")

def insertuser(data):
    global connect
    conectar()
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
    
def loginuser(data):
    global connect
    conectar()
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