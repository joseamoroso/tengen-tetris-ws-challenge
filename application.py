from flask import Flask, render_template, request, redirect, url_for

# Initialize the flask app.
app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')

# Choose the game mode based on the value of the button pressed.
@app.route('/game', methods=['POST'])
def game():
	mode = request.form['mode']
	if mode == 'solo':
		return redirect(url_for('solo'))
	elif mode == 'duo':
		return redirect(url_for('duo'))

# Serve the game in solo mode.
@app.route('/solo', methods=['GET'])
def solo():
	return render_template('solo.html')

# Serve the game in duo mode.
@app.route('/duo', methods=['GET'])
def duo():
	return render_template('duo.html')

if __name__ == '__main__':
	app.debug = True
	app.run(host='0.0.0.0', port=8080)
