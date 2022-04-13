import json
import pytest
import math
from api.models import User, db
from faker import Faker
from flask_jwt_extended import create_access_token

fake = Faker("es_ES")


@pytest.fixture
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


@pytest.fixture
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


@pytest.fixture(
    params=[
        # No results (when searching for a those roles)
        {"Student": 0, "Teacher": 0},
        # One result and one page
        {"Student": 1, "Teacher": 1},
        # Multiple results and pages
        {"Student": 17, "Teacher": 17},
    ],
    ids=["no_addition", "one_addition", "multiple_additions"],
)
def create_users(roles, request):
    added_users = []

    for role, count in request.param.items():
        for _ in range(count):
            added_users.append(
                User(
                    full_name=fake.name(),
                    email=fake.email(),
                    password=fake.password(),
                    role=roles[role],
                )
            )

    db.session.add_all(added_users)
    db.session.commit()

    yield added_users

    for user in added_users:
        db.session.delete(user)
    db.session.commit()


@pytest.fixture
def get_db_users():
    return lambda: User.query.all()


@pytest.fixture
def authorization():
    """Returns the authorization header for a user"""
    return lambda user: {
        "Authorization": f"Bearer {create_access_token(identity=user.id)}"
    }


@pytest.fixture
def get_users_as_admin(client, admin, authorization):
    return lambda page=1: client.get(f"/api/users?page={page}", headers={**authorization(admin)})


class TestUsers:
    """
    Test the users API
    """

    def test_get_users(self, create_users, get_users_as_admin, get_db_users):
        """
        Test that the users API returns a list of users
        """        
        response = get_users_as_admin()
        db_users = get_db_users()

        assert response.status_code == 200
        assert response.json["total"] == len(db_users)
        assert response.json["pages"] == math.ceil(len(db_users) / 10)
        for response_user in response.json["users"]:
            assert response_user in [db_user.serialize() for db_user in db_users]

    def test_pagination(self, create_users, get_users_as_admin, get_db_users):
        """
        Test that we can get all the users with pagination
        """        
        db_users = get_db_users()
        total_pages = math.ceil(len(db_users) / 10)
        fetched_users = set()

        for page in range(1, total_pages + 1):
            response = get_users_as_admin(page)
            for user in response.json["users"]:
                fetched_users.add(user["id"])
            
        assert len(fetched_users) == len(db_users)

    @pytest.mark.skip(reason="TODO")
    def test_filter_by_role():
        # TODO
        pass

    def test_fail_without_token(self, client):
        """
        Test that the users API returns a 401 if no token is provided
        """
        response = client.get("/api/users")

        assert response.status_code == 401

    def test_fail_as_student(self, client, student, authorization):
        response = client.get("/api/users", headers={**authorization(student)})
        assert response.status_code == 403


