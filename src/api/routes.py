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


h = {'id': 'evt_1KlbrSLkR53a2kgbIRx5xsMY', 
'object': 'event', 
'api_version': '2020-08-27', 
'created': 1649263058, 
'data': {'object': {'id': 'cs_test_a1O8hjrWwPNqZi4ovu1kiw4bTLgRfRPgnw1KFCsqE0ZSLlPcfVc1YeTf76', 
'object': 'checkout.session', 
'after_expiration': None, 
'allow_promotion_codes': None, 
'amount_subtotal': 2000,
'amount_total': 2000, 
'automatic_tax': {'enabled': False, 'status': None}, 
'billing_address_collection': None, 
'cancel_url': 'https://3000-4geeksacademy-reactflask-ocamqqjm9fb.ws-eu38.gitpod.io/subject/6', 
'client_reference_id': None, 
'consent': None, 
'consent_collection': None, 
'currency': 'eur', 
'customer': 'cus_LSWvGYKuDs8uRn', 
'customer_creation': None, 
'customer_details': {'address': {'city': None, 'country': 'ES', 'line1': None, 'line2': None, 'postal_code': None, 'state': None}, 
'email': 'adrimo100@gmail.com', 
'name': 'Adrián Molina Elvira', 
'phone': None, 
'tax_exempt': 'none', 
'tax_ids': []}, 
'customer_email': None, 
'expires_at': 1649349426, 
'livemode': False, 'locale': None, 
'metadata': {},
'mode': 'subscription', 
'payment_intent': None, 'payment_link': 
None, 'payment_method_options': None, 
'payment_method_types': ['card'], 
'payment_status': 'paid', 
'phone_number_collection': {'enabled': False}, 
'recovered_from': None, 
'setup_intent': None, 'shipping': None, 
'shipping_address_collection': None, 'shipping_options': [], 
'shipping_rate': None, 'status': 
'complete', 'submit_type': None, 
'subscription': 'sub_1KlbrFLkR53a2kgbJlCbyq7K', 
'success_url': 'https://3000-4geeksacademy-reactflask-ocamqqjm9fb.ws-eu38.gitpod.io/subject/6/success', 
'total_details': {'amount_discount': 0, 'amount_shipping': 0, 'amount_tax': 0}, 'url': None}}, 
'livemode': False, 'pending_webhooks': 1, 
'request': {'id': 'req_XhSBiUqYhfquMt', 'idempotency_key': '284d3aa1-04a7-479d-afe0-c04c84201c49'}, 
'type': 'checkout.session.completed'}