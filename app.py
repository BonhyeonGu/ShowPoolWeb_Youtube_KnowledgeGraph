#--------------------------------------------------------------------------------------
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
#--------------------------------------------------------------------------------------
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
#--------------------------------------------------------------------------------------
#-------------------------------------------------------------------------------------

@app.route("/")
def root():
	return redirect(url_for('index'))

@app.route("/index")
def index():
	if 'id' in session:
		return render_template('index.html')
	else:
		return render_template('index.html')

#--------------------------------------------------------------------------------------

@app.route("/backLogin", methods=['POST'])
def backLogin():
	inp_id = request.form['id']
	inp_pw = request.form['pw']
	usersCol = db['users']
	checkCol = usersCol.find_one({"id": inp_id }, {"pw": 1})
	if checkCol is not None:
		if checkCol['pw'] == inp_pw:
			session['id'] = inp_id
			return render_template('index.html', user_id = inp_id)
	return jsonify({"m" : "login error"})

@app.route("/backLogout")
def backLogout():
	if 'id' in session:
		session.clear()	
	return redirect(url_for('index'))

#--------------------------------------------------------------------------------------

@app.route("/eventClick")
def eventClick():
	if 'id' in session:
		j = {"id" : session['id']}
	else:
		j = {"id" : 'ANONYMOUS'}
	return jsonify(j)
	
#클릭했을때 세그먼트별로 조사되어야 하는가?
#네오포지에 저장할 정보는 없는가?

@app.route("/getWho")
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

if __name__ == "__main__":
		app.debug = True
		app.run(debug=True)