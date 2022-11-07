#--------------------------------------------------------------------------------------
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from bson.json_util import dumps
#--------------------------------------------------------------------------------------
from datetime import datetime
from neo import Neo
from pymongo import MongoClient
from secret.secret import session_secret_key
from secret.secret import mongo_dbid, mongo_dbpw, mongo_dbaddr, mongo_dbport
#--------------------------------------------------------------------------------------
#--------------------------------------------------------------------------------------
app = Flask(__name__)
app.secret_key = session_secret_key
neo = Neo()
#--------------------------------------------------------------------------------------
client = MongoClient(host=mongo_dbaddr, port=mongo_dbport, username=mongo_dbid, password=mongo_dbpw)
db = client['showpool']
doc = db['users']
#--------------------------------------------------------------------------------------
REF_NUM = 3 #참고할 영상 개수, 추천 시스템과 동일해야함, 세그먼트로 변경될 수 있음
#-------------------------------------------------------------------------------------

@app.route("/")
def root():
	return redirect(url_for('index'))

@app.route("/index")
def index():
	if 'id' in session:
		return render_template('index.html', user_id=session['id'])
	else:
		return render_template('index.html', user_id="ANNONYMOUS")

#--------------------------------------------------------------------------------------

@app.route("/backLogin", methods=['POST'])
def backLogin():
	inp_id = request.form['id']
	inp_pw = request.form['pw']
	checkCol = doc.find_one({"id": inp_id }, {"pw": 1})
	if checkCol is not None:
		if checkCol['pw'] == inp_pw:
			session['id'] = inp_id
			return render_template('index.html', user_id=inp_id)
	return jsonify({"m" : "login error"})

@app.route("/backLogout")
def backLogout():
	if 'id' in session:
		session.clear()	
	return redirect(url_for('index'))

#--------------------------------------------------------------------------------------

@app.route("/eventClick", methods=['POST'])
def eventClick():
	params = request.get_json()
	vid = params['vid']
	comps = params['comps']
	user_info = doc.find_one({"id": session['id']})
	if vid in user_info['clickedID']:
		return jsonify({"msg" : 'skip'})
	if len(user_info['clickedID']) >= REF_NUM:
		doc.update_one({"id" : user_info['id']}, {"$pop":{"clickedID" : -1}})
	doc.update_one({"id" : user_info['id']}, {"$push":{"clickedID" : vid}})
	doc.update_one({"id" : user_info['id']}, {"$set":{"time_lastclick" : datetime.today().strftime("%Y%m%d%H%M%S")}})
	return jsonify({"msg" : 'clear'})

@app.route("/getWho", methods=['POST'])
def getWho():
	if 'id' in session:
		j = {"id" : session['id']}
	else:
		j = {"id" : 'ANONYMOUS'}
	return jsonify(j)

#--------------------------------------------------------------------------------------

@app.route("/getVideosR", methods=['POST'])
def getVideosR():
	global neo
	ret = neo.runQuery(0)
	j = {"videoIds" : ret}
	return jsonify(j)

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
	return jsonify(j)

#--------------------------------------------------------------------------------------

@app.route("/getVideoR1s", methods=['POST'])
def getVideoR1s():
	global doc
	try:
		ret = doc.find_one({"id": session["id"]}, {"_id" : 0, "recommID1" : 1})
	except KeyError:
		ret = []
	j = {"videoRecomms" : ret["recommID1"]}
	return jsonify(j)

@app.route("/getVideoR2s", methods=['POST'])
def getVideoR2s():
	global doc
	try:
		ret = doc.find_one({"id": session["id"]}, {"_id" : 0, "recommID2" : 1})
	except KeyError:
		ret = []
	j = {"videoRecomms" : ret["recommID2"]}
	return jsonify(j)

#--------------------------------------------------------------------------------------

if __name__ == "__main__":
		app.debug = True
		app.run(debug=True)