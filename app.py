#--------------------------------------------------------------------------------------
from flask import Flask, render_template, request, jsonify, redirect, url_for
#--------------------------------------------------------------------------------------
from neo import Neo
#--------------------------------------------------------------------------------------

#--------------------------------------------------------------------------------------
app = Flask(__name__)
neo = Neo()
#--------------------------------------------------------------------------------------

#--------------------------------------------------------------------------------------

@app.route("/")
def root():
	return redirect(url_for('index'))

@app.route("/index")
def index():
	return render_template('index.html')

#--------------------------------------------------------------------------------------

@app.route("/getVideos", methods=['POST'])
def getVideos():
	global neo
	ret = neo.runQuery(0)	
	j = {"videoIds" : ret}
	return jsonify(j)

@app.route("/getVideoSegKCS", methods=['POST'])
def getVideoSegKCS():
	global neo
	params = request.get_json()
	ret = neo.runQuery(1, params['vid'])
	j = {"segComs" : ret}
	return jsonify(j)

@app.route("/getKC_Videos", methods=['POST'])
def getKC_Videos():
	global neo
	params = request.get_json()
	ret = neo.runQuery(2, params['comp'])
	j = {"videoIds" : ret}
	print(j)
	return jsonify(j)

#--------------------------------------------------------------------------------------

if __name__ == "__main__":
		app.debug = True
		app.run(debug=True)