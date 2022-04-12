import os
import datetime
from flask_jwt_extended import JWTManager
from api.models import User

def set_up_jwt(app):
    """ Sets up the Flask-JWT-Extended extension """
    app.config["JWT_SECRET_KEY"] = os.getenv("FLASK_APP_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(days=1)
    jwt = JWTManager(app)

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        return User.query.get(identity)
