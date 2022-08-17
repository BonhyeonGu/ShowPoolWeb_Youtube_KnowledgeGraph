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

    def runQuery(self, q):
        with self.driver.session() as session:
            if q == 0:
                rets = session.read_transaction(self.getVideos)
        return rets