from flask import Flask, render_template

# Initialize the flask app.
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game', methods=['POST'])
def game():
	return render_template('game.html')

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8080)
