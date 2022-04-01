"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Course, Subject, Role
from api.utils import generate_sitemap, APIException, SignupForm
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

api = Blueprint('api', __name__)

@api.route("/Courses", methods = ["GET"])
def getCourses():

    courses_obj = Course.query.all()

    if(not courses_obj):
        return ("No hay cursos"), 400

    courses = [course.serialize() for course in courses_obj]

    return jsonify(courses),200

@api.route("/Courses/<int:course_id>", methods = ["GET"])
def getSubjectsOfCourse(course_id):
    
    course = Course.query.filter_by(id = course_id).first()
    
    if(not course):
        return jsonify("No existe el curso"), 404
    
    subjects_obj = Subject.query.filter_by(course_id = course_id).all()

    subjects = [subject.serialize() for subject in subjects_obj]
    
    return jsonify({
        "name": course.name,
        "id": course_id,
        "subjects": subjects
    }), 200

@api.route("/users", methods = ["POST"])
def create_user():
    # Get user info and convert keys to snake_case
    user_data = {
        "full_name": request.json.get("fullName"),
        "email": request.json.get("email"),
        "password": request.json.get("password"),
        "repeat_password": request.json.get("repeatPassword"),
        "invitation_code": request.json.get("invitationCode")
    }

    # Validate data
    form = SignupForm(data=user_data)
    if (form.validate() == False):
        return jsonify({
            "validationErrors": form.errors
        }), 400

    # Check if user exists
    user = User.query.filter_by(email).first()
    if user != None:
        return jsonify({ "error": "El usuario ya existe." }), 400

    # Assign student role. Create it if it does not exist. TODO: check for invitation codes
    student_role = Role.query.filter_by(name="Estudiante").first()
    if student_role is None:
        student_role = Role(name="Estudiante")

    # Hash password
    hashed_pwd = generate_password_hash(form.data["password"])

    # Create user and add to the db.
    user = User(full_name=form.data["full_name"], email=form.data["email"], password=hashed_pwd, role=student_role)
    db.session.add(user)
    db.session.commit()

    # Create jwt
    access_token = create_access_token(identity=user.id)

    return jsonify({
        "user": user.serialize(),
        "token": access_token
    })



