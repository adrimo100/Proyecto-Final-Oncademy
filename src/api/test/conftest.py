from app import create_app
from api.models import db
from api.database import add_roles
import pytest
from flask_migrate import Migrate


@pytest.fixture(scope="session")
def app():
    # Set up
    app = create_app(testing=True)
    db.create_all()
    add_roles(db)

    yield app

    # Tear down
    db.session.remove()
    db.drop_all()
        

@pytest.fixture()
def client(app):
    return app.test_client()