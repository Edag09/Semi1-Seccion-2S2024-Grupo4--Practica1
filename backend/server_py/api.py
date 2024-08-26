from flask import Flask, request, jsonify
from datetime import datetime
import connectbd

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
    connectbd.insertuser(required_fields)

    # Suponiendo que en esta parte insertas el usuario en una base de datos

    # Retornar una respuesta exitosa
    return jsonify({
        "message": "Usuario creado exitosamente",
        "data": data
    }), 201



if __name__ == "__main__":
    app.run(debug=True)
