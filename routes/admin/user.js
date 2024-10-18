const express = require("express")
const router = express.Router();
const {User} = require('../../models')
const {Op} = require("sequelize");
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response')

// 获取用户列表
router.get('/', async function (req, res, next) {
    const query = req.query
    const pageSize = Math.abs(query.pageSize) || 10
    const currentPage = Math.abs(query.currentPage) || 1
    const offset = (currentPage - 1) * pageSize
    const condition = {
        order: [['id', 'DESC']],
        limit: pageSize,
        offset: offset
    }
    if (query.email) {
        condition.where = {
            email: {
                [Op.eq]: query.email
            }
        };
    }

    if (query.username) {
        condition.where = {
            username: {
                [Op.eq]: query.username
            }
        };
    }
    // 模糊匹配
    if (query.nickname) {
        condition.where = {
            nickname: {
                [Op.like]: `%${ query.nickname }%`
            }
        };
    }
    // 具体查询
    if (query.role) {
        condition.where = {
            role: {
                [Op.eq]: query.role
            }
        };
    }


    try {
        const users = await User.findAndCountAll(condition)

        success(res, '数据查询成功',{
            users: users.rows,
            total: users.count
        } )
    } catch (e) {
        console.log('error')
        failure(res, e)
    }
});

// 获取用户详情
router.get('/:id', async function (req, res, next) {
    try {
        const user = await getUser(req)
        success(res, '用户详情查询成功', {user})
    } catch (e) {
        failure(res, e)
    }

});

// 新增用户
router.post('/', async function (req, res, next) {
    // 白名单过滤数据：防止用户乱传数据
    const body = filterBody(req)
    try {
        const users = await User.create(body)
        success(res, '用户新增成功', {},201)
    } catch (e) {
        failure(res, e)
    }
});


// 更新用户
router.put('/:id', async function (req, res) {
    // 先找数据在更新，找不到不更新
    const {id} = req.params
    const body = filterBody(req)
    try {
        const user = await getUser(req)
        await user.update(body, {
            where: {
                id
            }
        })
        success(res, '用户更新成功', {user})
    } catch (e) {
        failure(res, e)
    }
})

// 白名单过滤
function filterBody(req) {
    return {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        sex: req.body.sex,
        company: req.body.company,
        introduce: req.body.introduce,
        role: req.body.role,
        avatar: req.body.avatar
    }
}

// 公共方法用来查询数据
async function getUser(req) {
    const {id} = req.params
    const user = await User.findByPk(id)

    if (!user) {
        throw new NotFoundError(`ID: ${id}的用户未找到.`)
    }
    return user
}

module.exports = router;
