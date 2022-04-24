"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from api.database import set_up_db
from api.jwt import set_up_jwt
from api.admin import set_up_admin
from api.utils import APIException, generate_sitemap
from api.routes import api

def create_app(testing = False):
    static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../../public/')

    app = Flask(__name__)
    app.url_map.strict_slashes = False
    app.config['TESTING'] = testing
    
    # Allow CORS requests to this API
    CORS(app)

    set_up_db(app)
    set_up_jwt(app)
    set_up_admin(app)

    # Add all endpoints form the API with a "api" prefix
    app.register_blueprint(api, url_prefix='/api')


    # Handle/serialize errors like a JSON object
    @app.errorhandler(APIException)
    def handle_invalid_usage(error):
        return jsonify(error.to_dict()), error.status_code

    # generate sitemap with all the endpoints
    @app.route('/')
    def sitemap():
        ENV = os.getenv("FLASK_ENV")
        
        if ENV == "development":
            return generate_sitemap(app)
        return send_from_directory(static_file_dir, 'index.html')

    # any other endpoint will try to serve it like a static file
    @app.route('/<path:path>', methods=['GET'])
    def serve_any_other_file(path):
        if not os.path.isfile(os.path.join(static_file_dir, path)):
            path = 'index.html'
        response = send_from_directory(static_file_dir, path)
        response.cache_control.max_age = 0 # avoid cache memory
        return response

    return app