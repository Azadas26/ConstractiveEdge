var promise = require('promise')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId
var db = require('../connection/connect')
var consts = require('../connection/constants')

module.exports =
{
    Do_Signup_By_Users: (info) => {
        return new promise(async (resolve, reject) => {
            info.password = await bcrypt.hash(info.password, 10)
            db.get().collection(consts.userbase).insertOne(info).then((data) => {
                resolve(data.ops[0]._id)
            })
        })
    },
    Do_Login_By_The_USer: (info) => {
        return new promise(async (resolve, reject) => {
            await db.get().collection(consts.userbase).findOne({ email: info.email }).then(async (data) => {
                var state =
                {
                    user: data,
                    state: true
                }
                if (data) {
                    await bcrypt.compare(info.password, data.password).then((res) => {
                        if (res) {
                            resolve(state)
                        }
                        else {
                            resolve({ state: false })
                        }
                    })
                }
                else {
                    resolve({ state: false })
                }
            })
        })
    },
    FInd_Worker_By_THEUser: (info) => {
        return new promise(async (resolve, reject) => {
            var wrk = await db.get().collection(consts.workers_base).find({ wrktype: info.wrktype, district: info.district }).toArray()
            resolve(wrk);
        })
    },
    Individual_Worker_Info: (Id) => {
        return new promise(async (resolve, reject) => {
            await db.get().collection(consts.workers_base).findOne({wkid: objectId(Id) }).then((info) => {
                resolve(info)
            })
        })
    },
    User_Send_request_TO_WorKEr: (urid, wkid,type) => {
        return new promise(async (resolve, reject) => {
            var state =
            {
                userId: objectId(urid),
                workersId: objectId(wkid),
                wrktype : type
            }       
                    db.get().collection(consts.request_base).insertOne({ ...state }).then((info) => {
                        var info =
                        {
                            msg: null,
                            wkid: wkid

                        }
                        resolve(info)
                    })                  
        })
    },
    Check_Wether_the_User_already_requestedORNot: (urid, wkid)=>
    {
        return new promise(async(resolve,reject)=>
        {
            var data = await db.get().collection(consts.request_base).findOne({ userId: objectId(urid), workersId: objectId(wkid) })
            if (data) {
                var info =
                {
                    msg: "Your already requested wt foe the responce from this worker",
                    wkid: wkid

                }
                resolve(info)
            }
            else
            {
                var info =
                {
                    msg: null,
                    wkid: wkid

                }
                resolve(info)
            }
        })
    },
    Get_List_OF_user_Requests : (urid)=>
    {
        return new promise(async(resolve,reject)=>
        {
            var list = await db.get().collection(consts.request_base).aggregate([
                {
                    $match :{userId:objectId(urid)}
                },
                {
                    $lookup:
                    {
                        from: consts.workers_base,
                        localField: "workersId",
                        foreignField: "wkid",
                        as: "workers",
                    }
                },
                {
                    $project:
                    {
                        userId:1,
                        workers:
                        {
                            $arrayElemAt: ['$workers', 0]
                        }
                    }
                }
            ]).toArray()
            resolve(list)
        })
    },
    Remove_WorkersUser_Request_By_user : (urid,wkid)=>
    {
        return new promise(async(resolve,reject)=>
        {
            await db.get().collection(consts.request_base).deleteOne({userId:objectId(urid),workersId:objectId(wkid)}).then((data)=>
            {
                resolve(data)
            })
        })
    }
}