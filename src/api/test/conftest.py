from app import create_app
from api.models import User, db, Role
from api.database import add_roles
import pytest
from flask_jwt_extended import create_access_token
from faker import Faker

fake = Faker("es_ES")


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


@pytest.fixture
def create_users(roles):
    generated_users = []

    def _create_users(*roles_count):
        """Takes a list of tuples (role, count) and create users with the specified role.
        Returns a list of users. Cleans up the users after the test."""
        users = []

        for role, count in roles_count:
            for i in range(count):
                users.append(
                    User(
                        full_name=fake.name(),
                        email=fake.email(),
                        password=fake.password(),
                        role=roles[role],
                    )
                )

        db.session.add_all(users)
        db.session.commit()
        generated_users.extend(users)

        return users

    yield _create_users

    for user in generated_users:
        db.session.delete(user)
    db.session.commit()


@pytest.fixture()
def users(create_users):
    return create_users(("Admin", 1), ("Student", 1), ("Teacher", 1))


@pytest.fixture()
def admin(users):
    return next(user for user in users if user.role.name == "Admin")


@pytest.fixture
def get_authorization_header():
    """Returns the authorization header for a user"""
    return lambda user: {
        "Authorization": f"Bearer {create_access_token(identity=user.id)}"
    }
