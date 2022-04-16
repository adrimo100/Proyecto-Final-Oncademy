import json
import pytest
import math
import random
from api.models import Course, User, db, Subject
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
    @pytest.fixture()
    def users(self, create_users):
        return create_users(("Admin", 1), ("Student", 15), ("Teacher", 15))

    @pytest.fixture()
    def admin(self, users):
        return next(user for user in users if user.role.name == "Admin")

    def test_success(self, client, users, admin, get_authorization_header):
        response = client.get("/api/users", headers=get_authorization_header(admin))

        assert response.status_code == 200
        for user in response.json["users"]:
            assert user["id"] in [user.id for user in users]        

    def test_implements_pagination(
        self, client, users, admin, get_authorization_header
    ):
        expected_total_pages = math.ceil(len(users) / 10)

        response = client.get(
            "/api/users?page=2", headers=get_authorization_header(admin)
        )

        assert response.status_code == 200
        assert len(response.json["users"]) == 10
        assert response.json["pages"] == expected_total_pages
        assert response.json["total"] == len(users)

    def test_get_all_users_using_pagination(
        self, client, users, admin, get_authorization_header
    ):
        expected_pages = math.ceil(len(users) / 10)

        user_ids_from_api = []
        # Get all pages from api and store the id of each user
        for page in range(1, expected_pages + 1):
            response = client.get(
                f"/api/users?page={page}", headers=get_authorization_header(admin)
            )
            user_ids_from_api.extend([user["id"] for user in response.json["users"]])

        # Assert that all users were fetched from the api
        for user in users:
            assert user.id in user_ids_from_api

    @pytest.mark.parametrize("role", ["Student", "Teacher"])
    def test_filter_by_role(self, client, users, admin, get_authorization_header, role):
        expected_users_count = len([user for user in users if user.role.name == role])
        
        response = client.get(
            f"/api/users?role={role}", headers=get_authorization_header(admin)
        )

        assert response.status_code == 200
        assert response.json["total"] == expected_users_count

class TestUpdateUserSubjectsSuccess:
    @pytest.fixture(scope="session")
    def courses(self):
        courses = [Course(name=f"{i} ESO") for i in (1, 2)]
        db.session.add_all(courses)
        db.session.commit()

        yield courses

        for course in courses:
            db.session.delete(course)
        db.session.commit()

    @pytest.fixture(scope="session")
    def subjects(self, courses):
        subjects = [
            Subject(
                name=name,
                course = random.choice(courses),
                description=fake.paragraph(),
                cardDescription=fake.paragraph(),
                image_url=fake.pystr(),
                start_date=fake.date(),
                end_date=fake.date(),
                stripe_id=fake.pystr(),
            )
            for name in ("Matemáticas", "Lengua", "Ciencias")]
        db.session.add_all(subjects)
        db.session.commit()

        yield subjects

        for subject in subjects:
            db.session.delete(subject)
        db.session.commit()

    @pytest.fixture()
    def users(self, create_users):
        return create_users(("Admin", 1), ("Student", 1), ("Teacher", 1))

    @pytest.fixture()
    def admin(self, users):
        return next(user for user in users if user.role.name == "Admin")


    @pytest.mark.parametrize("role", ["Student", "Teacher"])
    @pytest.mark.parametrize("subjects_count", [1, 2])
    def test_success(
        self, client, subjects, users, admin, get_authorization_header, role, subjects_count
    ):
        """ Test that we can add one or more subjects to a Student or a Teacher"""
        new_subject_ids = [subject.id for subject in random.sample(subjects, subjects_count)]
        user = next(user for user in users if user.role.name == role)
        
        response = client.post(
            f"/api/users/{user.id}/subjects",
            headers=get_authorization_header(admin),
            json={"subjects": new_subject_ids})

        assert response.status_code == 200
        for subject in response.json["subjects"]:
            assert subject["id"] in [subject.id for subject in user.subjects]
        