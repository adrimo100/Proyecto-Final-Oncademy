"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, Course, Subject, Role, Payment, InvitationCode
from api.utils import CourseForm, admin_required, APIException, SignupForm, SubjectForm
from flask_jwt_extended import create_access_token, current_user, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
import os, glob
import stripe
import datetime
from werkzeug.utils import secure_filename 
from cloudinary import uploader


app = Flask(__name__)


api = Blueprint('api', __name__)

UPLOAD_FOLDER = './src/front/img'
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

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

    teachers = [teacher.serialize() for teacher in teachers_obj]

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

    #Si borramos usuario desde stripe
    elif event['type'] == 'customer.deleted':
      customer = event['data']['object']
      
      user = User.query.filter_by(email = customer["email"]).first()

      if(not user):
          return jsonify("El usuario no exite"), 404

      user.stripe_id = ""

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
        
@api.route("/users", methods=["POST"])
def create_user():
    # Get user info and convert keys to snake_case
    user_data = {
        "full_name": request.json.get("fullName"),
        "email": request.json.get("email"),
        "password": request.json.get("password"),
        "repeat_password": request.json.get("repeatPassword"),
        "invitation_code": request.json.get("invitationCode"),
    }

    # Validate data
    form = SignupForm(data=user_data)
    if form.validate() == False:
        raise APIException(
            "Alguno de los campos no es correcto, revísalos.",
            400,
            {"validationErrors": form.errors}
        )

    # Check if user exists
    user = User.query.filter_by(email=form.data["email"]).first()
    if user != None:
        raise APIException("El usuario ya existe", 400)

    # Assign role depending on invitation code
    role = None
    invitation_code = form.data.get("invitation_code")
    if invitation_code is None or len(invitation_code) < 1:
        # Assign student role
        role = Role.query.filter_by(name="Student").first()
    else:
        # Validate invitation code
        invitation_code = InvitationCode.query.filter_by(code=invitation_code).first()
        if invitation_code is None:
            raise APIException("El código de invitación no es válido.", 400)

        # Remove invitation code and assign teacher role
        db.session.delete(invitation_code)
        role = Role.query.filter_by(name="Teacher").first()

    # Hash password
    hashed_pwd = generate_password_hash(form.data["password"])

    # Create user
    user = User(
        full_name=form.data["full_name"],
        email=form.data["email"],
        password=hashed_pwd,
        role=role,
    )
    db.session.add(user)

    # Save all changes in db
    db.session.commit()

    # Create jwt
    access_token = create_access_token(identity=user.id)

    return jsonify({"user": user.serialize(), "token": access_token})


@api.route("/users", methods=["GET"])
@jwt_required()
@admin_required
def get_users():
    user_name = request.args.get("userName", None)
    role_name = request.args.get("role", None)
    page = request.args.get("page", 1, type=int)

    stmt = User.query
    
    # Validate and add role filter
    if role_name:
        role = Role.query.filter_by(name=role_name).first()
        if role is None:
            raise APIException(f"No existe el rol '{role_name}'", 400)

        stmt = stmt.filter_by(role=role)

    # Add user name filter
    if user_name:
        stmt = stmt.filter(User.full_name.ilike(f"%{user_name}%"))

    # Get results paginated and ordered alphabetically by user name
    result = stmt.order_by(User.full_name).paginate(page, 10)

    return jsonify(
        {
            "items": [user.serialize() for user in result.items],
            "total": result.total,
            "pages": result.pages,
        }
    )

@api.route("/users/<int:user_id>/subjects", methods=["POST"])
@jwt_required()
@admin_required
def add_subjects_to_user(user_id):
    subject_ids = request.json.get("subjects", [])
    
    # Validate user
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        raise APIException("El usuario no existe", 404)
    
    # Validate subjects
    new_subjects = Subject.query.filter(Subject.id.in_(subject_ids)).all()
    if len(new_subjects) != len(subject_ids):
        raise APIException("Alguna de las asignaturas no existe", 404)
    for subject in new_subjects:
        if subject in user.subjects:
            raise APIException(f"El usuario ya tiene asignada la asignatura '{subject.name}'", 400)

    # Add subjects to user
    user.subjects.extend(new_subjects)
    db.session.commit()

    return jsonify({"user": user.serialize()})

@api.route("/users/<int:user_id>/subjects/<int:subject_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_subjects_from_user(user_id, subject_id):
    # Validate user
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        raise APIException("El usuario no existe", 404)

    # Validate subject
    subject = Subject.query.filter_by(id=subject_id).first()
    if subject is None:
        raise APIException("La asignatura no existe", 404)
    if subject not in user.subjects:
        raise APIException("El usuario no tiene asignada la asignatura", 400)

    # Remove subject from user
    user.subjects.remove(subject)
    db.session.commit()

    return jsonify({"user": user.serialize()})

@api.route("/login", methods=["POST"])
def create_token():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()
    if user is None or not user.password_is_valid(password):
        raise APIException("Correo electrónico o contraseña incorrectos", 401)

    # Create jwt
    access_token = create_access_token(identity=user.id)

    return jsonify({"user": user.serialize(), "token": access_token})


@api.route("/authenticated")
@jwt_required()
def get_authenticated_user():
    # We re-generate a token with a new expiration date
    access_token = create_access_token(identity=current_user.id)

    return jsonify({"user": current_user.serialize(), "token": access_token})


@api.route("/invitation-codes", methods=["POST"])
@jwt_required()
@admin_required
def create_invitation_code():
    invitation_code = InvitationCode()
    db.session.add(invitation_code)
    db.session.commit()

    return jsonify({"invitationCode": invitation_code.code}), 200


# Gets payments and filter by user name if provided. Returns payments in pages
@api.route("/payments", methods=["GET"])
@jwt_required()
@admin_required
def get_payments():
    user_name = request.args.get("userName")
    page = int(request.args.get("page")) or 1

    stmt = Payment.query

    # Add user name filter
    if user_name:
        stmt = (stmt
            .join(Payment.user, aliased=True)
            .filter(User.full_name.ilike(f"%{user_name}%"))
        )

    # Get results paginated and ordered by date
    result = (stmt
        .order_by(Payment.date.desc())
        .paginate(page, 10))

    return jsonify(
        {
            "items": [payment.serialize() for payment in result.items],
            "total": result.total,
            "pages": result.pages,
        }
    )

@api.route("/subjects", methods=["GET"])
def get_subjects():
    subject_name = request.args.get("name")
    course_id = request.args.get("course_id", None, int)
    page = request.args.get("page", 1, int)

    stmt = Subject.query

    # Add subject name filter
    if subject_name:
        stmt = stmt.filter(Subject.name.ilike(f"%{subject_name}%"))

    # Add course filter
    if course_id:
        stmt = stmt.filter_by(course_id=course_id)

    # Get results paginated and ordered alphabetically by subject name
    result = stmt.order_by(Subject.name).paginate(page, 10)

    return jsonify({
        "items": [subject.serialize() for subject in result.items],
        "total": result.total,
        "pages": result.pages,
    })

@jwt_required()
@admin_required
@api.route("/subjects", methods=["POST"])
def create_subject():
    # Validate subject data
    form = SubjectForm(data=request.json)
    if form.validate() == False:
        raise APIException(
            "Alguno de los campos no es correcto, revísalos.",
            400,
            {"validationErrors": form.errors}
        )

    # Create subject and add it to the db
    subject = Subject(**form.data)
    db.session.add(subject)
    db.session.commit()

    return jsonify(subject=subject.serialize())

@jwt_required()
@admin_required
@api.route("/subjects/<int:subject_id>", methods=["PUT"])
def update_subject(subject_id):
    # Validate subject data
    form = SubjectForm(data=request.json)

    if form.validate() == False:
        raise APIException(
            "Alguno de los campos no es correcto, revísalos.",
            400,
            {"validationErrors": form.errors}
        )

    # Check if subject exists
    subject = Subject.query.get(subject_id)
    if subject is None:
        raise APIException("La asignatura no existe", 404)

    # Update subject data if it's different
    for key, value in form.data.items():
        if getattr(subject, key) != value:
            setattr(subject, key, value)
    db.session.commit()

    return jsonify({"subject": subject.serialize()})


@jwt_required()
@admin_required
@api.route("/subjects/<int:subject_id>", methods=["DELETE"])
def delete_subject(subject_id):
    # Check if subject exists
    subject = Subject.query.get(subject_id)
    if subject is None:
        raise APIException("La asignatura no existe", 404)

    db.session.delete(subject)
    db.session.commit()

    return jsonify(message="Asignatura eliminada con éxito")


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

    if(field_name == "email" and user.stripe_id):
        stripe.Customer.modify(
        user.stripe_id,
        email = new_value,
        )


    return jsonify(user.serialize()), 200

@api.route("/changeAvatar", methods = ["PUT"])
@jwt_required()
def changeAvatar():
    file = request.files['file']

    if file:
        upload_result = uploader.upload(file, **{
            "public_id": current_user.id,
            "overwrite": True,
            "transformation": [
                {'gravity': "face"},
                {'width': 160, 'crop': "scale"}
            ]
        })
    
    current_user.avatar = upload_result['secure_url']
    db.session.commit()
    
    return jsonify(current_user.serialize()), 200

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

    user = User.query.filter_by(email = user_email).first()

    if(not user):
        return("El usuario no existe"), 404

    if(not user.stripe_id):

        #We create a stripe customer
        customer_obj = stripe.Customer.create(email = user_email,)
        
        if(not customer_obj):
            return jsonify("No se puedo crear el usuario"), 500

        setattr(user, "stripe_id", customer_obj.id)

        db.session.commit()
    


    #We create the checkout session

    stripe_session = stripe.checkout.Session.create(
    success_url= success_url,
    cancel_url= cancel_url,
    customer= user.stripe_id,
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

@api.route("/courses")
def get_courses():
    """Returns courses in pages, filtered by name if required"""
    name = request.args.get("name")
    page = int(request.args.get("page")) or 1

    stmt = Course.query

    # Add name filter
    if name:
        stmt = stmt.filter(Course.name.ilike(f"%{name}%"))

    # Get results paginated and ordered by date
    result = stmt.order_by(Course.name).paginate(page, 10)

    return jsonify(
        {
            "items": [course.serialize() for course in result.items],
            "total": result.total,
            "pages": result.pages,
        }
    )

@api.route("/courses", methods = ["POST"])
@jwt_required()
@admin_required
def create_course():
    # Get course data
    name = request.json.get("name")
    
    # Validate data
    form = CourseForm(data={"name": name})
    if form.validate() == False:
        raise APIException(
            "Alguno de los campos no es correcto, revísalos.",
            400,
            {"validationErrors": form.errors}
        )

    # Create course
    course = Course(**form.data)
    db.session.add(course)
    db.session.commit()

    return jsonify(course=course.serialize()), 201


@api.route("/courses/<int:id>", methods=["PUT"])
@jwt_required()
@admin_required
def update_course(id):
    course = Course.query.get(id)

    if not course:
        raise APIException("No se ha encontrado el curso solicitado.", status_code=404)

    name = request.json.get("name")
    if name:
        course.name = name

    db.session.commit()

    return jsonify(course=course.serialize()), 200


@api.route("/courses/<int:id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_course(id):
    course = Course.query.get(id)

    if not course:
        raise APIException("No se ha encontrado el curso solicitado.", status_code=404)

    if len(course.subjects) > 0:
        raise APIException(
            "No se puede eliminar un curso que tenga asignaturas asociadas.",
            status_code=400,
        )

    db.session.delete(course)
    db.session.commit()

    return jsonify(course=course.serialize()), 200
