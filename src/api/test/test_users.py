import pytest
from api.models import User, db
from faker import Faker
from flask_jwt_extended import create_access_token

fake = Faker("es_ES")


@pytest.fixture()
def admin(roles):
    admin = User(
        full_name=fake.name(),
        email=fake.email(),
        password=fake.password(),
        role=roles["Admin"],
    )
    db.session.add(admin)
    db.session.commit()

    yield admin

    db.session.delete(admin)
    db.session.commit()

@pytest.fixture()
def student(roles):
    student = User(
        full_name=fake.name(),
        email=fake.email(),
        password=fake.password(),
        role=roles["Student"],
    )
    db.session.add(student)
    db.session.commit()

    yield student

    db.session.delete(student)
    db.session.commit()

@pytest.fixture()
def authorization():
    """ Returns the authorization header for a user """
    return lambda user: {"Authorization": f"Bearer {create_access_token(identity=user.id)}"}


class TestUsers:
    """
    Test the users API
    """

    def test_get_users(self, client, admin, authorization):
        """
        Test that the users API returns a list of users
        """
        response = client.get("/api/users", headers={**authorization(admin)})

        print(response.json)
        assert response.status_code == 200
        assert response.json["users"] == [admin.serialize()]
        assert response.json["total"] == 1
        assert response.json["page"] == 1

    def test_fail_without_token(self, client):
        """
        Test that the users API returns a 401 if no token is provided
        """
        response = client.get("/api/users")

        assert response.status_code == 401

    def test_fail_as_student(self, client, student, authorization):
        response = client.get("/api/users", headers={**authorization(student)})
        assert response.status_code == 403

# TODO: organize success and failure tests, split get_users in different cases...