const express = require("express")
const router = express.Router();
const {Category} = require('../../models')
const {Op} = require("sequelize");
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response')

// 获取分类列表
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
    if (query.name) {
        condition.where = {
            name: {
                [Op.like]: `%${query.name}%`
            }
        }
    }

    try {
        const category = await Category.findAndCountAll(condition)

        success(res, '数据查询成功',{
            category: category.rows,
            total: category.count
        } )
    } catch (e) {
        console.log('error')
        failure(res, e)
    }
});

// 获取分类详情
router.get('/:id', async function (req, res, next) {
    try {
        const category = await getCategory(req)
        success(res, '分类详情查询成功', {category})
    } catch (e) {
        failure(res, e)
    }

});

// 新增分类
router.post('/', async function (req, res, next) {
    // 白名单过滤数据：防止用户乱传数据
    const body = filterBody(req)
    try {
        const category = await Category.create(body)
        success(res, '分类新增成功', {},201)
    } catch (e) {
        failure(res, e)
    }
});

// 删除分类:1.先找到数据，然后在删除数据
router.delete('/', async function (req, res, next) {
    try {
        const category = await getCategory(req)
        if (category) {
            await category.destroy()
            success(res, '课程删除成功', {category})
        } else {
            failure(res, e)
        }
    } catch (e) {
        failure(res, e)
    }

});

// 更新分类
router.put('/:id', async function (req, res) {
    // 先找数据在更新，找不到不更新
    const {id} = req.params
    const body = filterBody(req)
    try {
        const category = await getCategory(req)
        await category.update(body, {
            where: {
                id
            }
        })
        success(res, '分类更新成功', {category})
    } catch (e) {
        failure(res, e)
    }
})

// 白名单过滤
function filterBody(req) {
    return {
        name: req.body.name,
        rank: req.body.rank
    }
}

// 公共方法用来查询数据
async function getCategory(req) {
    const {id} = req.params
    const category = await Category.findByPk(id)

    if (!category) {
        throw new NotFoundError(`ID: ${id}的分类未找到.`)
    }
    return category
}

module.exports = router;
