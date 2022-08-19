from neo4j import GraphDatabase

from secret import dbid, dbpw, dbaddr, dbport
class Neo:
    def __init__(self):
        self.driver = GraphDatabase.driver(uri=f"neo4j://{dbaddr}:{dbport}", auth=(dbid, dbpw))
    
    def __del__(self):
        self.driver.close()    

    def getVideos(self, tx):
        rets = []
        result = tx.run("match (n : Video) return (n)")
        for record in result:
            rets.append(record[0]["data"])
        return rets

    def getVideo_Seg_KCS(self, tx, videoId, segNum):
        rets = []
        result = tx.run("match (n : Video) return (n)")
        for record in result:
            rets.append(record[0]["data"])
        return rets

    def getKC_Videos(self, tx, KC):
        rets = []
        result = tx.run("match (n : Video) return (n)")
        for record in result:
            rets.append(record[0]["data"])
        return rets

    def runQuery(self, q, arg1, arg2):
        with self.driver.session() as session:
            if q == 0:
                rets = session.read_transaction(self.getVideos)
            if q == 1:
                rets = session.read_transaction(self.getVideo_Seg_KCS, arg1, arg2)
            if q == 2:
                rets = session.read_transaction(self.getKC_Videos, arg1)
        return rets