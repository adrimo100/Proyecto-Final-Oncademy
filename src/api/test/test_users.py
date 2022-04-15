import json
import pytest
import math
from api.models import User, db
from faker import Faker
from flask_jwt_extended import create_access_token

fake = Faker("es_ES")


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


@pytest.fixture
def get_authorization_header():
    """Returns the authorization header for a user"""
    return lambda user: {
        "Authorization": f"Bearer {create_access_token(identity=user.id)}"
    }


class TestGetUsersFailure:
    def test_unauthenticated(self, client):
        response = client.get("/api/users")
        assert response.status_code == 401

    @pytest.mark.parametrize("role", ["Student", "Teacher"])
    def test_as_student_or_teacher(
        self, client, role, create_users, get_authorization_header
    ):
        user = create_users((role, 1)).pop()

        response = client.get("api/users", headers=get_authorization_header(user))

        assert response.status_code == 403
    
    @pytest.mark.parametrize("role", [1, "RandomFakeRole"])
    def test_filter_by_invalid_role(
        self, client, create_users, get_authorization_header, role
    ):
        admin = create_users(("Admin", 1)).pop()

        response = client.get(
            f"/api/users?role={role}", headers=get_authorization_header(admin)
        )

        assert response.status_code == 400


class TestGetUsersSuccess:
    def test_success(self, client, create_users, get_authorization_header):
        users = create_users(("Admin", 1), ("Student", 5))
        admin = next(user for user in users if user.role.name == "Admin")

        response = client.get("/api/users", headers=get_authorization_header(admin))

        assert response.status_code == 200
        assert len(response.json["users"]) == len(users)

    def test_implements_pagination(
        self, client, create_users, get_authorization_header
    ):
        users = create_users(("Admin", 1), ("Student", 10), ("Teacher", 10))
        admin = next(user for user in users if user.role.name == "Admin")

        response = client.get(
            "/api/users?page=2", headers=get_authorization_header(admin)
        )

        assert response.status_code == 200
        assert len(response.json["users"]) == 10
        assert response.json["pages"] == math.ceil(len(users) / 10)  # 3 pages

    def test_get_all_users_using_pagination(
        self, client, create_users, get_authorization_header
    ):
        users = create_users(("Admin", 1), ("Student", 10), ("Teacher", 10))
        admin = next(user for user in users if user.role.name == "Admin")
        expected_pages = math.ceil(len(users) / 10)

        user_ids_from_api = []
        for page in range(1, expected_pages + 1):
            response = client.get(
                f"/api/users?page={page}", headers=get_authorization_header(admin)
            )
            user_ids_from_api.extend([user["id"] for user in response.json["users"]])

        for user in users:
            assert user.id in user_ids_from_api

    @pytest.mark.parametrize("role", ["Student", "Teacher"])
    def test_filter_by_role(
        self, client, create_users, get_authorization_header, role
    ):
        users = create_users(("Admin", 1), ("Student", 15), ("Teacher", 15))
        admin = next(user for user in users if user.role.name == "Admin")

        response = client.get(
            f"/api/users?role={role}", headers=get_authorization_header(admin)
        )

        assert response.status_code == 200
        assert response.json["total"] == 15


