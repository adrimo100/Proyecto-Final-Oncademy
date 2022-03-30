"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Course, Subject, userSubjects
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


@api.route("/Subjects/<int:subject_id>")
def getSubject(subject_id):

    subject_obj = Subject.query.filter_by(id = subject_id).first()

    if(not subject_obj):
        return jsonify("No existe la asignatura"), 404

    return jsonify(subject_obj.serialize()), 200

@api.route("/Subjects/<int:subject_id>/Teachers")
def getTeachers(subject_id):

    subject_obj = Subject.query.filter_by(id = subject_id).first()

    if(not subject_obj):
        return jsonify("No existe la asignatura"), 404

    teachers_obj = User.query.filter_by(role_id = 2).filter(User.subjects.any(id = subject_id)).all()

    teachers = [teacher.full_name for teacher in teachers_obj]

    print(teachers)

    return jsonify(teachers), 200





