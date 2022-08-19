from neo4j import GraphDatabase

from secret.secret import dbid, dbpw, dbaddr, dbport
class Neo:
    def __init__(self):
        self.driver = GraphDatabase.driver(uri=f"neo4j://{dbaddr}:{dbport}", auth=(dbid, dbpw))
    
    def __del__(self):
        self.driver.close()    

    #DB 전체 비디오들 각 아이디 조회
    def getVideos(self, tx):
        rets = []
        result = tx.run("match (n : Video) return (n)")
        for record in result:
            rets.append(record[0]["data"])
        return rets

    #원하는 비디오, 세그먼트의 컴포넌트들 조회
    def getVideo_Seg_KCS(self, tx, videoId, segNum):
        rets = []
        result = tx.run("match (n : Video) return (n)")
        for record in result:
            rets.append(record[0]["data"])
        return rets

    #해당 컴포넌트가 포함되어있는 비디오 조회
    def getKC_Videos(self, tx, KC):
        rets = []
        result = tx.run("match (n : Video) return (n)")
        for record in result:
            rets.append(record[0]["data"])
        return rets

    #실행부 이것만 쓸 예정
    def runQuery(self, q, arg1 = 0, arg2 = 0):
        with self.driver.session() as session:
            if q == 0:
                rets = session.read_transaction(self.getVideos)
            if q == 1:
                rets = session.read_transaction(self.getVideo_Seg_KCS, arg1, arg2)
            if q == 2:
                rets = session.read_transaction(self.getKC_Videos, arg1)
        return rets

N = Neo()
a1 = N.runQuery(0)
print(a1)