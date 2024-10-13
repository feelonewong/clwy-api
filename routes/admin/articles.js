const express = require("express")
const router = express.Router();
const {Article} = require('../../models')
const {Op} = require("sequelize");
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response')

// 获取文章列表
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
        const articles = await Article.findAndCountAll(condition)

        success(res, '数据查询成功',{
            articles: articles.rows,
            total: articles.count
        } )
    } catch (e) {
        console.log('error')
        failure(res, e)
    }
});

// 获取文章详情
router.get('/:id', async function (req, res, next) {
    try {
        const article = await getArticle(req)
        success(res, '文章详情查询成功', {article})
    } catch (e) {
        failure(res, e)
    }

});

// 新增文章
router.post('/', async function (req, res, next) {
    // 白名单过滤数据：防止用户乱传数据
    const body = filterBody(req)
    try {
        const articles = await Article.create(body)
        success(res, '文章新增成功', {},201)
    } catch (e) {
        failure(res, e)
    }
});

// 删除文章:1.先找到数据，然后在删除数据
router.delete('/', async function (req, res, next) {
    try {
        const article = await getArticle(req)
        if (article) {
            await article.destroy()
            success(res, '课程删除成功', {article})
        } else {
            failure(res, e)
        }
    } catch (e) {
        failure(res, e)
    }

});

// 更新文章
router.put('/:id', async function (req, res) {
    // 先找数据在更新，找不到不更新
    const {id} = req.params
    const body = filterBody(req)
    try {
        const article = await getArticle(req)
        await article.update(body, {
            where: {
                id
            }
        })
        success(res, '文章更新成功', {article})
    } catch (e) {
        failure(res, e)
    }
})

// 白名单过滤
function filterBody(req) {
    return {
        title: req.body.title,
        content: req.body.content
    }
}

// 公共方法用来查询数据
async function getArticle(req) {
    const {id} = req.params
    const article = await Article.findByPk(id)

    if (!article) {
        throw new NotFoundError(`ID: ${id}的文章未找到.`)
    }
    return article
}

module.exports = router;
