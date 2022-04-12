import os
from flask_admin import Admin
from .models import db, User, Role, Subject, Course, Payment, InvitationCode
from flask_admin.contrib.sqla import ModelView

def set_up_admin(app):
    """ Sets up the Flask-Admin extension """
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Role, db.session))
    admin.add_view(ModelView(Subject, db.session))
    admin.add_view(ModelView(Course, db.session))
    admin.add_view(ModelView(Payment, db.session))
    admin.add_view(ModelView(InvitationCode, db.session))



    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))