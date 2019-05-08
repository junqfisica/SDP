from flask import Blueprint, send_from_directory

main = Blueprint('main', __name__)

# redirect calls to css and js scripts produce by Angular build.
@main.route('/<path:path>', methods=['GET'])
def static_proxy(path):
    return send_from_directory('./webapp/angular', path)

# redirect to the index.html produced by Angular build.
@main.route('/')
def root():
    return send_from_directory('./webapp', 'index.html')
