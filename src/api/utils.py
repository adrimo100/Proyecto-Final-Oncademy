from flask import jsonify, url_for
from wtforms import Form, BooleanField, StringField, PasswordField, validators, ValidationError

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://github.com/4GeeksAcademy/react-flask-hello/blob/4677c732f09717c85156fbd71c147f0d98fcac6f/docs/assets/rigo-baby.jpg?raw=true' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"

required_validator = validators.DataRequired('Campo obligatorio.')
min_max_error = 'Debe tener entre %(min)d y %(max)d caracteres.'
class SignupForm(Form):
    full_name = StringField('Name', [required_validator, validators.Length(min=7, max=70, message=min_max_error)])
    email = StringField('Email', [required_validator, validators.Email('La dirección de correo electrónico no es válida'), validators.Length(max=255, message='Debe tener menos de %(max)d catacteres.')])
    password = PasswordField('Password', [
        required_validator,
        validators.Length(min=8, max=255, message=min_max_error),
    ])
    repeat_password = PasswordField('Repeat Password', [
        validators.EqualTo('password', 'Las contraseñas deben coincidir.')
    ])
    invitation_code = StringField('Invitation Code')
