var promise = require('promise')
var bcrypt = require('bcryptjs')
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
            info.five = true
            info.four = false
            info.three = false
            info.two = false
            info.one = false
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
    },
    Do_admIn_LogIn : (info)=>
    {
        return new promise(async(resolve,reject)=>
        {
            await db.get().collection(consts.admin_base).findOne({name:info.name,password:info.password}).then((infos)=>
            {
                if(infos)
                {
                    resolve(infos)
                }
                else
                {
                    resolve(false)
                }
            })
        })
    },
    Get_Workers_Details : ()=>
    {
        return new promise(async(resolve,reject)=>
        {
            var list = await db.get().collection(consts.workers_base).find().toArray()
            resolve(list)
        })
    },
    Remove_Worker : (id)=>
    {
        return new promise(async(resolve,reject)=>
        {
            await db.get().collection(consts.workers_base).deleteOne({wkid:objectId(id)}).then((data)=>
            {
                resolve()
            })
        })
    },
    Get_Users_Details: () => {
        return new promise(async (resolve, reject) => {
            var list = await db.get().collection(consts.userbase).find().toArray()
            resolve(list)
        })
    },
    Remove_Users: (id) => {
        return new promise(async (resolve, reject) => {
            await db.get().collection(consts.userbase).deleteOne({ _id: objectId(id) }).then((data) => {
                resolve()
            })
        })
    },
    Get_all_activites : ()=>
    {
        return new promise(async(resolve,reject)=>
        {
            var act = await db.get().collection(consts.userandwkr).aggregate([
                {
                    $lookup:
                    {
                           from: consts.userbase,
                           localField: "userId",
                           foreignField: "_id",
                            as: "user"
                    }
                },
                {
                    $project:
                    {
                        workersId:1,
                        type:1,
                        status:1,
                        endstatus:1,
                        starting:1,
                        ending:1,
                        user:
                        {
                            $arrayElemAt: ['$user', 0]
                        }
                    }
                },
                {
                    $lookup:
                    {
                        from: consts.workers_base,
                        localField: "workersId",
                        foreignField: "wkid",
                        as: "worker"
                    }
                },
                {
                    $project:
                    {
                        type: 1,
                        status: 1,
                        endstatus: 1,
                        starting: 1,
                        ending: 1,
                        user:1,
                        worker:
                        {
                            $arrayElemAt: ['$worker', 0]
                        }
                    }
                }
            ]).toArray()
            resolve(act)
        })
    }
}