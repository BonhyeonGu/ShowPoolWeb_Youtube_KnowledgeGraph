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
	j = {"vedioIds" : ret}
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
	neo.runQuery(2, params['kc'])
	j = {"vedioIds" : nowStatusStr+"<p style=\"text-align: center;\">%d SEC</p>"%(nowStatusSec)}
	return jsonify(j)

#--------------------------------------------------------------------------------------

@app.route("/result", methods=['POST'])
def result():
	inputValues = [tokenSum, splitSec, queueSize, keywordSize, forward_sec, hit, sameCountSum, tripleBool]
	return render_template('result.html', ret1=ret1, ret2=ret2, ret3=ret3, iv = inputValues, url="http://www.youtube.com/embed/" + ytid + "?enablejsapi=1&origin=http://example.com")

#--------------------------------------------------------------------------------------

if __name__ == "__main__":
		app.debug = True
		app.run(debug=True)