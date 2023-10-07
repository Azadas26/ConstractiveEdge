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
                        acc:1,
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
    Confirm_User_Request_By_WorkER: (userid, wrkid,type) => {
        return new promise((resolve, reject) => {
            var state =
            {
                userId: objectId(userid),
                workersId: objectId(wrkid),
                type:type,
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
                }).then((data)=>
                {
                    resolve(data)
                })
        })
    },
}