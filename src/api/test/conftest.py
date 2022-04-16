from app import create_app
from api.models import db, Role
from api.database import add_roles
import pytest


@pytest.fixture(scope="session", autouse=True)
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

@pytest.fixture(scope="session")
def roles():
    return {
        role: Role.query.filter_by(name=role).first()
        for role in ["Student", "Teacher", "Admin"]
    }

