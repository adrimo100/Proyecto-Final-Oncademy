"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Course, Subject, userSubjects, Role, Payment, InvitationCode
from api.utils import generate_sitemap, APIException, SignupForm
from flask_jwt_extended import create_access_token, current_user, jwt_required
from werkzeug.security import generate_password_hash
import json
import os
import datetime

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

        payment = Payment(date = datetime.datetime.now(), quantity = 20, user_id = user.id, stripe_subscription_id = event.get("data").get("object").get("subscription"))

        payment.subjects.append(subject)

        db.session.add(payment)

        #Añadimos el la asignatura al usuario

        user.subjects.append(subject)

        #Hacemos el commit

        db.session.commit()

    return jsonify(success=True), 200

@api.route("/check-subscription/<int:subject_id>", methods = ["GET"])
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
    user = User.query.filter_by(email=form.data["email"]).first()
    if user != None:
        return jsonify({ "error": "El usuario ya existe." }), 400

    # Assign role depending on invitation code
    role = None
    invitation_code = form.data.get("invitation_code")
    if invitation_code is None or len(invitation_code) < 1:
        # Assign student role
        role = Role.query.filter_by(name="Student").first()
    else:
        # Validate invitation code
        invitation_code = InvitationCode.query.filter_by(code=invitation_code).first()
        if (invitation_code is None):
            return jsonify({ "error": "El código de invitación no es válido."}), 400
            
        # Remove invitation code and assign teacher role
        db.session.delete(invitation_code)
        role = Role.query.filter_by(name="Teacher").first()
        
    # Hash password
    hashed_pwd = generate_password_hash(form.data["password"])

    # Create user
    user = User(full_name=form.data["full_name"], email=form.data["email"], password=hashed_pwd, role=role)
    db.session.add(user)

    # Save all changes in db
    db.session.commit()

    # Create jwt
    access_token = create_access_token(identity=user.id)

    return jsonify({
        "user": user.serialize(),
        "token": access_token
    })

@api.route("/login", methods=["POST"])
def create_token():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()
    if user is None or not user.password_is_valid(password):
        return jsonify({"error": "Correo electrónico o contraseña incorrectos"}), 401
    
    # Create jwt
    access_token = create_access_token(identity=user.id)

    return jsonify({ 
        "user": user.serialize(),
        "token": access_token
    })

@api.route("/authenticated")
@jwt_required()
def get_authenticated_user():
    # We re-generate a token with a new expiration date
    access_token = create_access_token(identity=current_user.id)

    return jsonify({
        "user": current_user.serialize(),
        "token": access_token
    })

@api.route("/editUser", methods = ["PUT"])
@jwt_required()
def editUser():
    new_value = request.json.get("new_value")
    old_value = request.json.get("old_value")
    field_name = request.json.get("field_name")

    user = User.query.filter(getattr(User, field_name) == old_value).first()

    if(not user):
        return jsonify("El usuario no existe"), 404

    setattr(user, field_name, new_value)
    db.session.commit()

    return jsonify(user.serialize()), 200

@api.route("/checkPassword", methods = ["PUT"])
@jwt_required()
def checkPassword():
    
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()
    if user is None or not user.password_is_valid(password):
        return jsonify({"error": "Correo electrónico o contraseña incorrectos", "answer": False}), 401

    return jsonify({"answer": True}), 200
        
@api.route("/changePassword", methods = ["PUT"])
@jwt_required()
def editPassword():
    email = request.json.get("email")
    oldPassword = request.json.get("oldPassword")
    newPassword = request.json.get("newPassword")

    print(newPassword)

    user = User.query.filter_by(email=email).first()
    if user is None or not user.password_is_valid(oldPassword):
        return jsonify({"error": "Correo electrónico o contraseña incorrectos"}), 401

    #Generate Hash of Password
    hashed_pwd = generate_password_hash(newPassword)

    user.password = hashed_pwd
    db.session.commit()

    return jsonify("Contraseña cambiada con éxito"), 200

@api.route("/cancelSubscription", methods = ["PUT"])
@jwt_required()
def cancelSubscription():
    
    user_email = request.json.get("user_email")
    subject_id = request.json.get("subject")

    user = User.query.filter_by(email = user_email).first()

    if(not user):
        return jsonify("El usuario no existe"), 404

    subject = Subject.query.filter_by(id = subject_id).first()

    if(not subject):
        return jsonify("La asignatura no existe"), 404

    payment = Payment.query.filter_by(user_id = user.id).filter(Payment.subjects.any(id = subject.id)).first()

    if(not payment):
        return jsonify("La subscripción no existe"), 404

    subscription_id = payment.stripe_subscription_id

    #Cancelamos la subscripción
    stripe.Subscription.delete(subscription_id)

    #Eliminamos el pago
    db.session.delete(payment)

    #Eliminamos la asignatura del alumno
    user.subjects.remove(subject)

    db.session.commit()

    return jsonify(user.serialize()), 200

@api.route("/createCheckoutSession", methods =["POST"])
@jwt_required()
def createCheckoutSession():

    user_email = request.json.get("user_email")
    success_url = request.json.get("success_url")
    cancel_url = request.json.get("cancel_url")
    subject_id = request.json.get("subject_id")

    subject = Subject.query.filter_by(id = subject_id).first()

    if(not subject):
        return jsonify("Asignatura no encontrada"), 404

    price_id = subject.stripe_id

    #We create a stripe customer
    customer_obj = stripe.Customer.create(email = user_email,)
    
    if(not customer_obj):
        return jsonify("No se puedo crear el usuario"), 500

    customer_id = customer_obj.id

    #We create the checkout session

    stripe_session = stripe.checkout.Session.create(
    success_url= success_url,
    cancel_url= cancel_url,
    customer= customer_id,
    line_items=[
    {
      "price": price_id,
      "quantity": 1,
    },
    ],
    mode= "subscription"
    )

    if(not stripe_session):
        return jsonify("No se pudo crear la sesión de pago"), 500

    return jsonify({"session_url": stripe_session.get("url")}), 200





