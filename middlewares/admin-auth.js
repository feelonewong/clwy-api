const jwt = require("jsonwebtoken")
const {User} = require("../models")
const {UnauthorizedError} = require("../utils/errors")
const {success, failure} = require("../utils/responses")

module.exports = async (req, res, next) => {
    try {
        const {token} = req.headers
        if (!token) {
            throw new UnauthorizedError("无权限访问.")
        }

        // 验证token
        const decoded = jwt.verify(token, process.env.SECRET)

        // 从token中解析userid
        const {userId} = decoded
        const user = await User.findByPk(userId)
        if (!user) {
            throw new UnauthorizedError("用户不存在.")
        }
        // 判断当前用户是否是管理员
        if (user.role !== 100) {
            throw new UnauthorizedError("非管理员用户无权限访问.")
        }
        req.user = user

        //放行
        next();
    } catch (error) {
        failure(res, error)
    }
}