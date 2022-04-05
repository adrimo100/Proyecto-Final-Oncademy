"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Course, Subject, userSubjects, Role
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

import stripe

api = Blueprint('api', __name__)


# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
# Clave secreta de Stripe que identifica la tienda
stripe.api_key = "sk_test_51KjoxdLkR53a2kgbefxpdGdJYstVbITvMuqpqQfNEm7tCISSXC4j4ijVr6N82fUqsmQO48kn4ewEYvZ8V5kh51d900HguP49KH"

endpoint_secret = 'whsec_6e459dd8d2484bc834066a3f7900b8bfefcc570707001c4e626034a0d3e25bbf'


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


@api.route("/Subjects/<int:subject_id>", methods =["GET"])
def getSubject(subject_id):

    subject_obj = Subject.query.filter_by(id = subject_id).first()

    if(not subject_obj):
        return jsonify("No existe la asignatura"), 404

    return jsonify(subject_obj.serialize()), 200

@api.route("/Subjects/<int:subject_id>/Teachers", methods =["GET"])
def getTeachers(subject_id):

    subject_obj = Subject.query.filter_by(id = subject_id).first()

    if(not subject_obj):
        return jsonify("No existe la asignatura"), 404

    teacher_rol = Role.query.filter_by(name = "Teacher").first() #get the teacher role object

    teachers_obj = User.query.filter_by(role = teacher_rol).filter(User.subjects.any(id = subject_id)).all()

    teachers = [teacher.full_name for teacher in teachers_obj]

    return jsonify(teachers), 200

@api.route("/webhook", methods = ["POST"])
def weebhook():
    
    try:
        payload = request.data

        sig_header = request.headers.get("stripe-signature") #Firma para verificar que la solicitud es de stripe
    
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret) #Crea el webhook y almacena los eventos en event

        print(event)
    except ValueError:
        return "Bad payload"
    except stripe.error.SignatureVerificationError:
        return "Bad signature"

    if event['type'] == 'checkout.session.completed':
      session = event['data']['object']
    # ... handle other event types
   

    return jsonify(success=True)

   