import pytest
import random
from api.models import db, Course, Subject
from faker import Faker

fake = Faker("es_ES")

@pytest.fixture(scope="module")
def courses():
    courses = [Course(name=f"{i} ESO") for i in (1, 2)]
    db.session.add_all(courses)
    db.session.commit()

    yield courses

    for course in courses:
        db.session.delete(course)
    db.session.commit()

@pytest.fixture(scope="module")
def subjects(courses):
    subjects = [
        Subject(
            name=name,
            course=random.choice(courses),
            description=fake.paragraph(),
            cardDescription=fake.paragraph(),
            image_url=fake.pystr(),
            start_date=fake.date(),
            end_date=fake.date(),
            stripe_id=fake.pystr(),
        )
        for name in ("Matemáticas", "Lengua", "Ciencias")
    ]
    db.session.add_all(subjects)
    db.session.commit()

    yield subjects

    for subject in subjects:
        db.session.delete(subject)
    db.session.commit()


class TestAddUserSubjects:
    @pytest.mark.parametrize("role", ["Student", "Teacher"])
    @pytest.mark.parametrize("subjects_count", [1, 2])
    def test_success(
        self,
        client,
        subjects,
        users,
        admin,
        get_authorization_header,
        role,
        subjects_count,
    ):
        """Test that we can add one or more subjects to a Student or a Teacher"""
        new_subject_ids = [
            subject.id for subject in random.sample(subjects, subjects_count)
        ]
        user = next(user for user in users if user.role.name == role)

        response = client.post(
            f"/api/users/{user.id}/subjects",
            headers=get_authorization_header(admin),
            json={"subjects": new_subject_ids},
        )

        assert response.status_code == 200
        for subject in response.json["subjects"]:
            assert subject["id"] in [subject.id for subject in user.subjects]

    @pytest.mark.parametrize(
        "role,expected_status", [("Student", 403), ("Teacher", 403), (None, 401)]
    )
    def test_no_permissions(
        self, client, users, subjects, get_authorization_header, role, expected_status
    ):
        """
        Test that we can not add subjects if we are no authenticated or
        with Student or Teacher roles
        """
        request_user = role and next(user for user in users if user.role.name == role)
        random_user = random.choice(users)

        response = client.post(
            f"/api/users/{random_user.id}/subjects",
            headers=request_user and get_authorization_header(request_user),
            json={"subjects": [subject.id for subject in random.sample(subjects, 2)]},
        )

        assert response.status_code == expected_status

    def test_invalid_user(
        self, client, admin, users, subjects, get_authorization_header
    ):
        """Test that we can not add subjects to a user that does not exist"""
        response = client.post(
            f"/api/users/{len(users) + 1}/subjects",
            headers=get_authorization_header(admin),
            json={"subjects": [subject.id for subject in random.sample(subjects, 2)]},
        )

        assert response.status_code == 404

    def test_invalid_subject(
        self, client, admin, users, subjects, get_authorization_header
    ):
        """Test that we can not add subjects that do not exist"""
        response = client.post(
            f"/api/users/{random.choice(users).id}/subjects",
            headers=get_authorization_header(admin),
            json={"subjects": [len(subjects) + 1]},
        )

        assert response.status_code == 404

    def test_subject_already_added(
        self, client, admin, users, subjects, get_authorization_header
    ):
        """Test that we can not add a subject that is already added to a user"""
        user = random.choice(users)
        subject = random.choice(subjects)
        user.subjects.append(subject)
        db.session.commit()

        response = client.post(
            f"/api/users/{user.id}/subjects",
            headers=get_authorization_header(admin),
            json={"subjects": [subject.id]},
        )

        assert response.status_code == 400
        assert (
            f"El usuario ya tiene asignada la asignatura '{subject.name}'"
            == response.json["error"]
        )
