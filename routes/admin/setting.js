const express = require("express")
const router = express.Router();
const {Setting} = require('../../models')
const {Op} = require("sequelize");
const {
    success,
    failure
} = require('../../utils/responses')
const {NotFoundError} = require('../../utils/errors')

// 获取系统系统设置
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
    if (query.title) {
        condition.where = {
            title: {
                [Op.like]: `%${query.title}%`
            }
        }
    }

    try {
        const settings = await Setting.findAndCountAll(condition)

        success(res, '数据查询成功', {
            settings: settings.rows,
            total: settings.count
        })
    } catch (e) {
        console.log('error')
        failure(res, e)
    }
});


// 更新系统设置
router.put('/', async function (req, res) {
    // 先找数据在更新，找不到不更新
    const {id} = req.params
    const body = filterBody(req)
    try {
        const setting = await getSetting()
        await setting.update(body)
        success(res, '系统设置更新成功', {setting})
    } catch (e) {
        failure(res, e)
    }
})

// 白名单过滤
function filterBody(req) {
    return {
        name: req.body.name,
        icp: req.body.icp,
        copyright: req.body.copyright
    }
}

// 公共方法用来查询数据
async function getSetting() {
    const setting = await Setting.findOne()

    if (!setting) {
        throw new NotFoundError(`ID: ${id}的系统设置未找到.`)
    }
    return setting
}

module.exports = router;
