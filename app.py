#--------------------------------------------------------------------------------------
from flask import Flask, render_template, request, jsonify
import queue
#--------------------------------------------------------------------------------------

#--------------------------------------------------------------------------------------

#--------------------------------------------------------------------------------------
app = Flask(__name__)
#--------------------------------------------------------------------------------------
nowStatusStr = ""
nowStatusSec = -1

def resultJsonUpdate(s:str):
	global nowStatusStr
	nowStatusStr += s

def sameCount(a:list, b:list):
	ret = 0
	for i in a:
		for j in b:
			if i.name == j.name:
				ret += 1
	return ret
#--------------------------------------------------------------------------------------
@app.route("/")
def root():
	return render_template('index.html')
@app.route("/index")
def index():
	return render_template('index.html')
@app.route("/result", methods=['POST'])
def result():
	global nowStatusStr
	global nowStatusSec
	tokenSum = 0
	nowStatusStr = ""
	nowStatusSec = 0
#--------------------------------------------------------------------------------------
	url = request.form['url']
	splitSec = float(request.form['sec'])
	keywordSize = int(request.form['keywordSize'])
	hit = request.form['hit']
	triple = request.form['triple']
	if hit == 'on':#반대로 설계됨
		hitBool = False
	else:
		hitBool = True
	if triple == 'on':
		tripleBool = True
	else:
		tripleBool = False
#--------------------------------------------------------------------------------------
	wiki = WikificationTest()
	ret = []    
	sett:queue.Queue = wiki.urlToSplitQueue(splitSec, url)
	queueSize = sett.qsize()
#--------------------------------------------------------------------------------------
	sameCountSum = 0
	frontResult = []
#--------------------------------------------------------------------------------------
	c = 1
	resultJsonUpdate("The stage of knowledge component extraction is performed. Please do not input any character. %d segments are identified."%(queueSize))
	while sett.qsize() != 0:
		subInSec = sett.get()
		#---------------------------------------------------------
		inp = wiki.preProcess(subInSec)
		tokenSum += len(inp)
		#ret.append(inp)
		resultJsonUpdate("<br>At # %d segment, (%d ~ %d minutes), %d words are collected. Start..." %(c, (splitSec * c - splitSec) / 60, (splitSec * c) / 60, len(inp)))
		#---------------------------------------------------------
		g = wiki.graphProcess(inp)
		result = g.getAnnotation(keywordSize, hitBool)
		#---------------------------------------------------------
		if len(frontResult) != 0:
			sameCountSum += sameCount(frontResult, result)
		frontResult = result
		#---------------------------------------------------------
		resultJsonUpdate("~Completed")
		#---------------------------------------------------------
		retTemp = []
		for i in range(len(result)):
			resultJsonUpdate("<br>%d : %s"%(i + 1, result[i].name))
			retTemp.append(result[i].name)
		ret.append(retTemp)
		#---------------------------------------------------------
		c += 1
		resultJsonUpdate("<br>")
#--------------------------------------------------------------------------------------
	tmp = url.split('v=')[1]
	ytid = ''
	for char in tmp:
		if char == '&':
			break
		ytid += char
#--------------------------------------------------------------------------------------
	forward_sec = nowStatusSec
	nowStatusSec = 0
	if tripleBool:
		tri = Triple()
		ret1, ret2, ret3 = tri.output(ret)
		print(len(ret1))
	else:
		ret1 = ret
		ret2 = []
		ret3 = []
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