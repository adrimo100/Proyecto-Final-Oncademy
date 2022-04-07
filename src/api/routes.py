"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Course, Subject, userSubjects, Role, Payment
from api.utils import generate_sitemap, APIException
import json
import os
from datetime import date

import stripe

api = Blueprint('api', __name__)


# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
# Clave secreta de Stripe que identifica la tienda
stripe.api_key = os.getenv("api_key")

endpoint_secret = os.getenv("endpoint_secret")


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
def webhook():
    
    event = request.json
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        user = User.query.filter_by(email = event.get("data").get("object").get("customer_details").get("email")).first()

        if(not user):
            return jsonify("El usuario no exite"), 404


        splitted_url = event.get("data").get("object").get("success_url").split("/")

        subject_id = int(splitted_url[4])

        subject = Subject.query.filter_by(id = subject_id).first()

        if(not Subject):
            return jsonify("La asignatura no exite"), 404


        #Añadimos el pago a la Table/Clase "Payments"

        payment = Payment(date = date.now(), quantity = 20, user_id = user.id, stripe_subscription_id = event.get("data").get("object").get("subscription"))

        payment.subjects.append(subject)

        db.session.add(payment)

        #Añadimos el la asignatura al usuario

        user.subjects.append(subject)

        #Hacemos el commit

        db.session.commit()

    return jsonify(success=True), 200

@api.route("/check-subscription/<int:subject_id>")
def checkSubscription(subject_id):

    user_id = request.json.get("id")

    user = User.query.filter_by(id = user_id).first()

    if(not user):
        return jsonify("No existe el usuario"), 404

    subject = Subject.query.filter_by(id = subject_id).first()

    if(not subject):
        return jsonify("No existe la asignatura"), 404

    if(subject in user.subjects):
        return jsonify(True), 200
    else:
        return jsonify(False),200



