var promise = require('promise')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId
var db = require('../connection/connect')
var consts = require('../connection/constants')

module.exports =
{
    Show_Worker_Registration_Request: () => {
        return new promise(async (resolve, reject) => {
            var list = await db.get().collection(consts.workers_temp).find().toArray()
            resolve(list)
        })
    },
    Accept_Worker_Registration: (info) => {
        return new promise(async (resolve, reject) => {
            info.wkid = objectId(info.wkid)
            info.wkingstatus = false
            info.rating = parseInt("5")
            db.get().collection(consts.workers_base).insertOne(info).then((data) => {
                resolve(data.ops[0]._id)
            })
        })
    },
    Remove_Worker_Registration: (wkid) => {
        return new promise(async (resolve, reject) => {
            await db.get().collection(consts.workers_temp).deleteOne({ _id: objectId(wkid) }).then((info)=>
            {
                resolve(info)
            })
        })
    }
}