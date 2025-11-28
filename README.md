einmal aus führen 

# führe rs.initiate im mongo container aus
docker-compose exec mongo mongosh --eval "rs.initiate({_id: 'rs0', members:[{_id:0, host:'mongo:27017'}]})"

# prüfen
docker-compose exec mongo mongosh --eval "rs.status()"




## Troubleshooting
Wenn ein Fehler beim Erstellen der Activity auftritt, z.B.:
```
Message:
Invalid `prisma.activity.create()` invocation: Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set. https://pris.ly/d/mongodb-replica-set
Stack:
PrismaClientKnownRequestError: 
Invalid `prisma.activity.create()` invocation:
```

docker-compose up -d mongo


docker-compose exec mongo mongosh --eval "rs.initiate({_id: 'rs0', members:[{_id:0, host:'mongo:27017'}]})"
