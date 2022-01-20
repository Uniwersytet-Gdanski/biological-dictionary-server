#!/bin/bash
# initiates a basic replica set in the mongodb container for transactions to work
docker exec -it mongodb mongo --eval 'if(rs.status().code==94)rs.initiate({"_id":"main","members":[{"_id":0,"host":"localhost:27017"}]});'
# autoexpire sessions
docker exec -it mongodb mongo ug-biological-dictionary --eval 'db.sessions.createIndex({"expiresAt":1},{expireAfterSeconds:1});'