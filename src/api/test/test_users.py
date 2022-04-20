import pytest
import math
from faker import Faker

fake = Faker("es_ES")


class TestGetUsersSuccess:
    @pytest.fixture()
    def users(self, create_users):
        return create_users(("Admin", 1), ("Student", 15), ("Teacher", 15))

    def test_success(self, client, users, admin, get_authorization_header):
        response = client.get("/api/users", headers=get_authorization_header(admin))

        assert response.status_code == 200
        for user in response.json["items"]:
            assert user["id"] in [user.id for user in users]

    def test_implements_pagination(
        self, client, users, admin, get_authorization_header
    ):
        expected_total_pages = math.ceil(len(users) / 10)

        response = client.get(
            "/api/users?page=2", headers=get_authorization_header(admin)
        )

        assert response.status_code == 200
        assert len(response.json["items"]) == 10
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
            user_ids_from_api.extend([user["id"] for user in response.json["items"]])

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


class TestGetUsersFailure:
    def test_unauthenticated(self, client):
        response = client.get("/api/users")

        assert response.status_code == 401

    @pytest.mark.parametrize("role", ["Student", "Teacher"])
    def test_as_student_or_teacher(self, client, users, get_authorization_header, role):
        # Get a user with the role Student or Teacher
        user = next(user for user in users if user.role.name == role)

        response = client.get("api/users", headers=get_authorization_header(user))

        assert response.status_code == 403

    @pytest.mark.parametrize("role", [1, "RandomFakeRole"])
    def test_filter_by_invalid_role(
        self, client, get_authorization_header, role, admin
    ):
        response = client.get(
            f"/api/users?role={role}", headers=get_authorization_header(admin)
        )

        assert response.status_code == 400
