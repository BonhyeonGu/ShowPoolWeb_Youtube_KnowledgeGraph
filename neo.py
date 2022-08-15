from neo4j.v1 import GraphDatabase, basic_auth

from secret import dbid, dbpw, dbaddr, dbport
class Neo:
    def __init__(self):
        self.driver = GraphDatabase.driver(uri=f"bolt://{dbaddr}:{dbport}", auth=basic_auth(user=dbid, password=dbpw))
    
    def run_query(self, q):
        with self.driver.session() as session: 
            results = session.run(q, parameters={})
        return results