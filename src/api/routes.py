"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Course, Subject, Role, InvitationCode
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

    return jsonify({ "token": access_token })
