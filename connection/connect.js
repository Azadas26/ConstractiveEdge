var mongoClient = require('mongodb').MongoClient
var promise = require('promise')

var state =
{
    db: null
}
module.exports =
{
    connection: () => {
        var dbname = "constructiveEdge";
        return new promise((resolve, reject) => {
            mongoClient.connect("mongodb://127.0.0.1:27017", { useNewUrlParser: true, useUnifiedTopology: true }, (err, data) => {
                if (err) {
                    reject("Database Connection Failed")
                }
                else {
                    resolve("Database  connection succcess...")
                    state.db = data.db(dbname)
                }
            })
        })
    },
    get: () => {
        return state.db
    }
}