import os
from api.models import db, Role
from flask_migrate import Migrate


def set_up_db(app):
    """ Sets up the database """
    testing = app.config['TESTING']
    db_url_env_var = testing and 'TEST_DATABASE_URL' or 'DATABASE_URL'
    db_url = os.getenv(db_url_env_var)
    if db_url is None:
        raise KeyError(f"{db_url_env_var} is not set")

    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    MIGRATE = Migrate(app, db, compare_type = True)
    db.init_app(app)
    app.app_context().push()

