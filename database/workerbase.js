var promise = require('promise')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId
var db = require('../connection/connect')
var consts = require('../connection/constants')

module.exports =
{
    Do_Signup_By_WORKERUsers: (info) => {
        return new promise(async (resolve, reject) => {
            info.password = await bcrypt.hash(info.password, 10)
            db.get().collection(consts.workers_temp).insertOne(info).then((data) => {
                resolve(data.ops[0]._id)
            })
        })
    },
    Do_Login_By_The_Workers: (info) => {
        return new promise(async (resolve, reject) => {
            await db.get().collection(consts.workers_base).findOne({ email: info.email }).then(async (data) => {
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
    Get_Request_from_users: (id) => {
        return new promise(async (resolve, reject) => {
            var list = await db.get().collection(consts.request_base).aggregate([
                {
                    $match:
                    {
                        workersId: objectId(id)
                    }
                },
                {
                    $lookup:
                    {
                        from: consts.userbase,
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    }
                },
                {
                    $project:
                    {
                        userId: 1,
                        wrktype: 1,
                        status: 1,
                        acc: 1,
                        user:
                        {
                            $arrayElemAt: ['$user', 0]
                        }
                    }
                }
            ]).toArray()
            resolve(list);
        })
    },
    Reject_Request_From_UseR: (userId, wrkId) => {
        return new promise(async (resolve, reject) => {
            console.log(userId, wrkId);
            await db.get().collection(consts.request_base).updateOne({ userId: objectId(userId), workersId: objectId(wrkId) },
                {
                    $set:
                    {
                        status: true
                    }
                }).then((data) => {
                    resolve(data)
                })
        })
    },
    Confirm_User_Request_By_WorkER: (userid, wrkid, type) => {
        return new promise((resolve, reject) => {
            var state =
            {
                userId: objectId(userid),
                workersId: objectId(wrkid),
                type: type,
                status: false
            }
            db.get().collection(consts.accept_base).insertOne({ ...state }).then((info) => {
                resolve(info)
            })
        })
    },
    Change_acc_By_Worker: (userid, wrkid) => {
        return new promise(async (resolve, reject) => {
            await db.get().collection(consts.request_base).updateOne({ userId: objectId(userid), workersId: objectId(wrkid) },
                {
                    $set:
                    {
                        acc: true
                    }
                }).then((data) => {
                    resolve(data)
                })
        })
    },
    Change_Workers_Working_Status: (wkid, status) => {
        return new promise(async (resolve, reject) => {
            await db.get().collection(consts.workers_base).updateOne({ wkid: objectId(wkid) },
                {
                    $set:
                    {
                        wkingstatus: status
                    }
                }).then((data) => {
                    resolve(data)
                })
        })
    },
    Get_Current_workes: (wkid) => {
        return new promise(async (resolve, reject) => {
            var list = await db.get().collection(consts.userandwkr).aggregate([
                {
                    $match:
                    {
                        workersId: objectId(wkid)
                    }
                },
                {
                    $lookup:
                    {
                        from: consts.userbase,
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    }
                },
                {
                    $project:
                    {
                        userId: 1,
                        type: 1,
                        status: 1,
                        starting: 1,
                        user:
                        {
                            $arrayElemAt: ['$user', 0]
                        }
                    }
                }
            ]).toArray()
            resolve(list);
        })
    },
    Update_Work_By_worker: (userid, wkid) => {
        return new promise(async (resolve, reject) => {
            await db.get().collection(consts.userandwkr).updateMany({ userId: objectId(userid), workersId: objectId(wkid) },
                {
                    $set:
                    {
                        status: false,
                        endstatus: true,
                        ending: new Date()
                    }
                }).then((data) => {
                    resolve(data)
                })
        })
    },
    Check_Workers_status: (wkid) => {
        return new promise(async (resolve, reject) => {
            await db.get().collection(consts.workers_base).findOne({ wkid: objectId(wkid),wkingstatus:true}).then((data)=>
            {
                if(data)
                {
                    resolve(true)
                }
                else
                {
                    resolve(false)
                }
            })
        })
    }
}