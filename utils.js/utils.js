const User = require('./../models/user-model');



exports.defaultpageThings = async (loggeduserid) => {

    const logguser = await User.findOne({_id:loggeduserid}).select("name profileImage")

    return {logguser}
}