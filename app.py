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
	j = {"vedioIds" : nowStatusStr+"<p style=\"text-align: center;\">%d SEC</p>"%(nowStatusSec)}
	return jsonify(j)

@app.route("/getVideos", methods=['POST'])
def getVideos():
	global neo
	j = {"vedioIds" : nowStatusStr+"<p style=\"text-align: center;\">%d SEC</p>"%(nowStatusSec)}
	return jsonify(j)

#--------------------------------------------------------------------------------------

@app.route("/result", methods=['POST'])
def result():
	inputValues = [tokenSum, splitSec, queueSize, keywordSize, forward_sec, hit, sameCountSum, tripleBool]
	return render_template('result.html', ret1=ret1, ret2=ret2, ret3=ret3, iv = inputValues, url="http://www.youtube.com/embed/" + ytid + "?enablejsapi=1&origin=http://example.com")
#--------------------------------------------------------------------------------------

@app.route("/statusJsonOutput", methods=['POST'])
def statusJsonOutput():
	global nowStatusStr
	global nowStatusSec
	nowStatusSec += 1
	test_data = {"s" : nowStatusStr+"<p style=\"text-align: center;\">%d SEC</p>"%(nowStatusSec)}
	return jsonify(test_data)

if __name__ == "__main__":
		app.debug = True
		app.run(debug=True)