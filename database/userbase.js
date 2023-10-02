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
                    user : data,
                    state : true
                }
                if (data) {
                    await bcrypt.compare(info.password, data.password).then((res) => {
                        if(res)
                        {
                            resolve(state)
                        }
                        else
                        {
                            resolve({state :false})
                        }
                    })
                }
                else {
                    resolve({ state: false })
                }
            })
        })
    }
}