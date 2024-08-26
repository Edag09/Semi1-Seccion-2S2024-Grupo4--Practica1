from flask import Flask, request, jsonify
from datetime import datetime
import users as users

app = Flask(__name__)

## Ruta para crear un usuario
@app.route('/createuser', methods=['POST'])
def create_user():
    # Obtener el JSON de la solicitud
    data = request.get_json()

    # Validar que todos los campos están presentes
    required_fields = ['nombres', 'apellidos', 'foto_url', 'correo_electronico', 'contrasena', 
                       'fecha_nacimiento', 'rol', 'fecha_creacion']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo '{field}' es requerido."}), 400

    # Procesar los datos (aquí simplemente los imprimimos)
    users.insertuser(data)

    # Suponiendo que en esta parte insertas el usuario en una base de datos

    # Retornar una respuesta exitosa
    return jsonify({
        "message": "Usuario creado exitosamente",
        "data": data
    }), 201

## Ruta para iniciar sesión
@app.route('/login', methods=['POST'])
def login():
    # Obtener el JSON de la solicitud
    data = request.get_json()

    # Validar que todos los campos están presentes
    required_fields = ['correo_electronico', 'contrasena']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo '{field}' es requerido."}), 400

    # Procesar los datos (aquí simplemente los imprimimos)
    result = users.loginuser(data)

    # Retornar una respuesta exitosa
    return jsonify({
        "message": "Inicio de sesión exitoso",
        "data": result
    }), 200

## Ruta para actualizar un usuario
@app.route('/updateuser', methods=['PUT'])
def update_user():
    # Obtener el JSON de la solicitud
    data = request.get_json()

    # Validar que todos los campos están presentes
    required_fields = ['nombres', 'apellidos', 'foto_url', 'correo_electronico', 'contrasena', 
                       'fecha_nacimiento', 'rol', 'fecha_creacion']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo '{field}' es requerido."}), 400

    # Procesar los datos (aquí simplemente los imprimimos)
    users.updateuser(data)

    # Retornar una respuesta exitosa
    return jsonify({
        "message": "Usuario actualizado exitosamente",
        "data": data
    }), 200

## Ruta para eliminar un usuario
@app.route('/deleteuser', methods=['DELETE'])
def delete_user():
    # Obtener el JSON de la solicitud
    data = request.get_json()

    # Validar que todos los campos están presentes
    required_fields = ['correo_electronico']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo '{field}' es requerido."}), 400

    # Procesar los datos (aquí simplemente los imprimimos)
    users.deleteuser(data)

    # Retornar una respuesta exitosa
    return jsonify({
        "message": "Usuario eliminado exitosamente",
        "data": data
    }), 200

if __name__ == "__main__":
    app.run(debug=True)
