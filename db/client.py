from pymongo import MongoClient

#base local
#db_client = MongoClient().local

#base remota
db_client = MongoClient("mongodb+srv://SkillMap:k3qNL9xrqNK3c1Ig@skillcluster.3cb8l.mongodb.net/?retryWrites=true&w=majority&appName=SkillCluster").skillmap