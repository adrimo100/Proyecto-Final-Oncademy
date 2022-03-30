"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Course, Subject, Role
from api.utils import generate_sitemap, APIException, SignupForm

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
    user_data = {
        "name": request.json.get("name"),
        "email": request.json.get("email"),
        "password": request.json.get("password"),
        "repeat_password": request.json.get("repeatPassword"),
        "invitation_code": request.json.get("invitationCode")
    }

    form = SignupForm(data=user_data)

    if (form.validate() == False):
        return jsonify({
            "validation_errors": form.errors
        }), 400

    user = User.query.filter_by(email=user_data["email"]).first()
    if user != None:
        return jsonify({ "msg": "User already exists" }), 400

    student_role = Role.query.filter_by(name="student").first()
    if student_role is None:
        student_role = Role(name="student")

    user = User(full_name=user_data["name"], email=user_data["email"], password=user_data["password"], role=student_role)
    
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "msg": f"Successfully created user: {user}",
    })



