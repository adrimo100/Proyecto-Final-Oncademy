"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Course, Subject
from api.utils import generate_sitemap, APIException

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
    body = request.json
    user_data = {
        "name": body["name"],
        "email": body["email"],
        "password": body["password"],
        "repeat_password": body["repeatPassword"],
        "invitation_code": body["invitationCode"]
    }

    form = SignupForm(user_data)

    if (form.validate() == False):
        return jsonify({ "msg": ("Los datos de registro no son válidos. "
            "Revísalos e intentalo de nuevo") })

    user = User.query.filter_by(email=user_data["email"]).first()
    if user != None:
        return jsonify({ "msg": "User already exists" }), 400

    user = User(email=email, password=password)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({
        "msg": f"Successfully created user with email {user}",
        "token": access_token
    })



