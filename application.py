from flask import Flask, render_template

# Initialize the flask application object.
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("layout.html")

if __name__ == '__main__':
    app.run()
