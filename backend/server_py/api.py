from flask import Flask, request, jsonify
from datetime import datetime
import users as users
import song as songs

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

## Ruta para crear una canción
@app.route('/createsong', methods=['POST'])
def create_song():
    # Obtener el JSON de la solicitud
    data = request.get_json()

    # Validar que todos los campos están presentes
    required_fields = ['nombre', 'fotografia_url', 'duracion', 'artista', 'archivo_mp3_url', 'fecha_subida']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo '{field}' es requerido."}), 400

    # Procesar los datos (aquí simplemente los imprimimos)
    songs.insertsong(data)

    # Suponiendo que en esta parte insertas la canción en una base de datos

    # Retornar una respuesta exitosa
    return jsonify({
        "message": "Canción creada exitosamente",
        "data": data
    }), 201

## Ruta para actualizar una canción
@app.route('/modifysong', methods=['PUT'])
def modify_song():
    # Obtener el JSON de la solicitud
    data = request.get_json()

    # Validar que todos los campos están presentes
    required_fields = ['nombre', 'fotografia_url', 'duracion', 'artista', 'archivo_mp3_url', 'fecha_subida']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo '{field}' es requerido."}), 400

    # Procesar los datos (aquí simplemente los imprimimos)
    songs.updatesong(data)

    # Retornar una respuesta exitosa
    return jsonify({
        "message": "Canción actualizada exitosamente",
        "data": data
    }),

## Ruta para eliminar una canción
@app.route('/deletesong', methods=['DELETE'])
def delete_song():
    # Obtener el JSON de la solicitud
    data = request.get_json()

    # Validar que todos los campos están presentes
    required_fields = ['nombre']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo '{field}' es requerido."}), 400

    # Procesar los datos (aquí simplemente los imprimimos)
    songs.deletesong(data)

    # Retornar una respuesta exitosa
    return jsonify({
        "message": "Canción eliminada exitosamente",
        "data": data
    }), 200

## Ruta para buscar una canción
@app.route('/searchsong', methods=['POST'])
def search_song():
    # Obtener el JSON de la solicitud
    data = request.get_json()

    # Validar que todos los campos están presentes
    required_fields = ['nombre']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo '{field}' es requerido."}), 400

    # Procesar los datos (aquí simplemente los imprimimos)
    result = songs.searchsong(data)

    # Retornar una respuesta exitosa
    return jsonify({
        "message": "Canción encontrada exitosamente",
        "data": result
    }), 200

## Ruta para insertar una canción en favoritos
@app.route('/addfavorite', methods=['POST'])
def add_favorite():
    # Obtener el JSON de la solicitud
    data = request.get_json()

    # Validar que todos los campos están presentes
    required_fields = ['nombres', 'nombre']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo '{field}' es requerido."}), 400

    # Procesar los datos (aquí simplemente los imprimimos)
    songs.insertfavoritesong(data)

    # Retornar una respuesta exitosa
    return jsonify({
        "message": "Canción añadida a favoritos exitosamente",
        "data": data
    }),

## Ruta para eliminar una canción de favoritos
@app.route('/deletefavorite', methods=['DELETE'])
def delete_favorite():
    # Obtener el JSON de la solicitud
    data = request.get_json()

    # Validar que todos los campos están presentes
    required_fields = ['nombres', 'nombre']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo '{field}' es requerido."}), 400

    # Procesar los datos (aquí simplemente los imprimimos)
    songs.deletefavoritesong(data)

    # Retornar una respuesta exitosa
    return jsonify({
        "message": "Canción eliminada de favoritos exitosamente",
        "data": data
    }), 200

## Ruta para Listar todas las canciones de la playlist de favoritos de un usuario
@app.route('/favorite', methods=['GET'])
def list_favorite():
    # Obtener el JSON de la solicitud
    data = request.get_json()

    # Validar que todos los campos están presentes
    required_fields = ['nombres']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo '{field}' es requerido."}), 400

    # Procesar los datos (aquí simplemente los imprimimos)
    result = songs.listfavoritesongs(data)

    # Retornar una respuesta exitosa
    return jsonify({
        "message": "Canciones de favoritos listadas exitosamente",
        "data": result
    }), 200

if __name__ == "__main__":
    app.run(debug=True)
