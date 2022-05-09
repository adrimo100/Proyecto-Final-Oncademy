from flask_sqlalchemy import SQLAlchemy
import random
from werkzeug.security import check_password_hash
from flask import url_for


db = SQLAlchemy()


userSubjects = db.Table("userSubjects",
db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key = True),
db.Column("subject_id", db.Integer, db.ForeignKey("subject.id"), primary_key = True)
)

class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(70), unique = False, nullable = False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), unique=False, nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey("role.id"), nullable = False)
    role = db.relationship("Role", backref="user", lazy = True)
    avatar = db.Column(db.String(), unique = False, nullable = True)
    stripe_id = db.Column(db.String(), unique = False, nullable = True)
    subjects = db.relationship("Subject", secondary = userSubjects, lazy = "subquery", backref = db.backref("users", lazy = True))
    
    def __repr__(self): 
        return self.full_name

    def serialize(self):

        subjects_ser = [subject.serialize() for subject in self.subjects]

        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "avatar": "../../img/" + self.avatar,
            "role": self.role.name,
            "subjects": subjects_ser
            # do not serialize the password, its a security breach
        }

    def password_is_valid(self, pwd_candidate):
        return check_password_hash(self.password, pwd_candidate)


class Role(db.Model):

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), unique = True, nullable = False)

    def __repr__(self):
        return self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }

class Subject(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), unique = False, nullable = False)
    description = db.Column(db.String(), unique = False, nullable = False)
    cardDescription = db.Column(db.String(200), unique = False, nullable = False)
    image_url = db.Column(db.String(), unique = False, nullable = False)
    start_date = db.Column(db.Date, unique = False, nullable = True)
    end_date = db.Column(db.Date, unique = False, nullable = True)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable = True)
    course = db.relationship("Course", backref = "subjects", lazy = True)
    stripe_id = db.Column(db.String(), unique = False, nullable = False)

    def __repr__(self):
        return self.name


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "cardDescription": self.cardDescription,
            "image_url": self.image_url,
            "start_date": self.start_date and self.start_date.strftime("%d/%m/%y"),
            "end_date": self.end_date and self.end_date.strftime("%d/%m/%y"),
            "course_id": self.course_id,
            "course_name": self.course.name,
            "stripe_id": self.stripe_id,
            "users": [{ "full_name": u.full_name, "role": u.role.name } for u in self.users],
        }


class Course(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), unique = False, nullable = False)

    def __repr__(self):
        return self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "subjects": [subject.serialize() for subject in self.subjects]
        }


subjects = db.Table("tags",
db.Column("payment_id", db.Integer, db.ForeignKey("payment.id"), primary_key = True),
db.Column("subject_id", db.Integer, db.ForeignKey("subject.id"), primary_key = True)
)

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    date = db.Column(db.DateTime, unique = False, nullable = False)
    quantity = db.Column(db.Float, unique = False, nullable = False)
    stripe_subscription_id = db.Column(db.String(), unique = True, nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable = False)
    user = db.relationship("User", backref = "payment", lazy = True )
    subjects = db.relationship("Subject", secondary = subjects, lazy = "subquery", backref = db.backref("payments", lazy = True))

    def serialize(self):
        return {
            "id": self.id,
            "date": self.date.strftime("%d-%m-%Y - %H:%M:%S"),
            "quantity": self.quantity,
            "user": self.user.full_name,
            "subjects": [ f"{subject.name} ({subject.course.name})" for subject in self.subjects],
            "stripe_subscription_id": self.stripe_subscription_id,
        }

class InvitationCode(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    code = db.Column(db.String(155), unique = True, nullable = False)

    def __init__(self):
        self.code = random.getrandbits(155)

    def __repr__(self):
        return self.code



"""
class PaymentDetail(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    payment_id = db.Column(db.Integer, db.ForeignKey("payment.id"), nullable = False)
    payment = db.relationship("Payment", backref = "paymentDetail", lazy = True)
    subject_id = db.Column(db.Integer, db.ForeignKey("subject.id"), nullable = False)
    subject = db.relationship("Subject", backref = "payment", lazy = True )

    def serialize(self):
        return {
            "id": self.id,
            "payment": self.payment,
            "subject": self.subject
        }
"""
"""
class ActiveUser(db.Model):
     id = db.Column(db.Integer, primary_key = True)
     user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable = False)
     user = db.relationship("User", backref = "activeUser", lazy = True)
     subject_id = db.Column(db.Integer, db.ForeignKey("subject.id"), nullable = False)
     subject = db.relationship("Subject", backref="activeUser", lazy = True)
     

     def serialize(self):
         return {
             "id": self.id,
             "user": self.user,
             "subject": self.subject
         }
"""