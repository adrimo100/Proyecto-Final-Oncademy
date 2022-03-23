from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


userSubjects = db.Table("userSubkects",
db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key = True),
db.Column("subject_id", db.Integer, db.ForeignKey("subject.id"), primary_key = True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(50), unique = False, nullable = False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), unique=False, nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey("role.id"), nullable = False)
    role = db.relationship("Role", backref="user", lazy = True)
    subjects = db.relationship("Subject", secondary = userSubjects, lazy = "subquery", backref = db.backref("User", lazy = True))
    
    def __repr__(self):
        return '<User %r>' % self.full_name

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "subjects": self.subjects
            # do not serialize the password, its a security breach
        }



class Role(db.Model):

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), unique = True, nullable = False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }

class Subject(db.Model):

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), unique = False, nullable = False)
    description = db.Column(db.String(), unique = False, nullable = False)
    image_url = db.Column(db.String(), unique = False, nullable = False)
    start_date = db.Column(db.DateTime, unique = False, nullable = True)
    end_date = db.Column(db.DateTime, unique = False, nullable = True)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable = True)
    course = db.relationship("Course", backref = "subject", lazy = True)


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "image_url": self.image_url,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "course_name": self.course.name,
        }


class Course(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), unique = False, nullable = False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }


subjects = db.Table("tags",
db.Column("payment_id", db.Integer, db.ForeignKey("payment.id"), primary_key = True),
db.Column("subject_id", db.Integer, db.ForeignKey("subject.id"), primary_key = True)
)

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    date = db.Column(db.DateTime, unique = False, nullable = False)
    quantity = db.Column(db.Float, unique = False, nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable = False)
    user = db.relationship("User", backref = "payment", lazy = True )
    subjects = db.relationship("Subject", secondary = subjects, lazy = "subquery", backref = db.backref("payments", lazy = True))

    def serialize(self):
        return{
            "id": self.id,
            "date": self.date,
            "quantity": self.quantity,
            "user": self.user,
            "subjects": self.subjects
        }




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