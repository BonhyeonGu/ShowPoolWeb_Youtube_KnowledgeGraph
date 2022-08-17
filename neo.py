from neo4j import GraphDatabase

from secret import dbid, dbpw, dbaddr, dbport
class Neo:
    def __init__(self):
        self.driver = GraphDatabase.driver(uri=f"neo4j://{dbaddr}:{dbport}", auth=(dbid, dbpw))
    
    def run_query(self, q):
        with self.driver.session() as session: 
            results = session.run(q, parameters={})
        return results

a = Neo()
q = "match (n : Video) return (n)"
b = a.run_query(q)
for i, each in enumerate(b):
    print(each)