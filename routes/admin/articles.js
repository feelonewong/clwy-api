const express = require("express")
const router = express.Router();
const {Article} = require('../../models')
const {Op} = require("sequelize");


// 获取文章列表
router.get('/', async function (req, res, next) {
    const query = req.query
    const pageSize = Math.abs(query.pageSize) || 10
    const currentPage = Math.abs(query.currentPage) || 0
    const offset = (currentPage - 1) * pageSize

    const condition = {
        order: [['id', 'DESC']],
        limit: pageSize,
        offset: offset
    }

    try {
        const articles = await Article.findAndCountAll(condition)
        res.json({
            status: true, message: '数据查询成功', data: {
                rows: articles.rows,
                total: articles.count
            }
        });
    } catch (e) {
        res.json({
            status: false, message: '数据查询失败', errors: [e.message]
        });
    }

});

// 获取文章详情
router.get('/:id', async function (req, res, next) {
    // 路由地址参数
    const {id} = req.params
    try {
        const article = await Article.findByPk(id)
        if (article) {
            res.json({
                status: true,
                message: '课程详情查询成功',
                data: {
                    article
                }
            });
        } else {
            res.status(404).json({
                status: false,
                message: "数据未找到"
            })
        }
    } catch (e) {
        res.json({
            status: false, message: '课程详情查询失败', errors: [e.message]
        });
    }

});

// 新增文章
router.post('/', async function (req, res, next) {
    // 白名单过滤数据：防止用户乱传数据
    const body = filterBody(req)
    try {
        const articles = await Article.create(body)
        res.status(201).json({
            status: true, message: '数据新增成功'
        });
    } catch (e) {
        if(e.name === 'SequelizeValidationError'){
            const errors = e.errors.map(item=>item.message)
            res.json({
                status: false,
                message: '数据新增失败',
                errors
            });
        }else {
            res.json({
                status: false, message: '数据新增失败'
            });
        }
    }
});

// 删除文章:1.先找到数据，然后在删除数据
router.delete('/', async function (req, res, next) {
    const {id} = req.body
    try {
        const article = await Article.findByPk(id)
        if (article) {
            await article.destroy()
            res.json({
                status: true,
                message: '课程删除成功',
                data: {
                    article
                }
            });
        } else {
            res.status(404).json({
                status: false,
                message: "数据未找到"
            })
        }
    } catch (e) {
        res.json({
            status: false, message: '课程删除失败', errors: [e.message]
        });
    }

});

// 更新文章
router.put('/:id', async function (req, res) {
    // 先找数据在更新，找不到不更新
    const {id} = req.params
    const body = filterBody(req)
    try {
        const article = await Article.findByPk(id)
        if (article) {
            await article.update(body, {
                where: {
                    id
                }
            })
            res.json({
                status: true,
                message: '文章更新成功',
                data: {
                    article
                }
            });
        } else {
            res.status(404).json({
                status: false,
                message: "非法的id，数据未找到！"
            })
        }
    } catch (e) {
        res.json({
            status: false, message: '文章更新失败', errors: [e.message]
        });
    }
})

// 模糊查询
router.get('/', async function (req, res) {
    try {
        const query = req.query
        const condition = {
            order: [['id', 'DESC']]
        }
        if (query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            }
        }
        const articles = await Article.findAll(condition)
        res.json({
            status: true, message: '数据查询成功', data: {
                articles
            }
        });
    } catch (e) {
        res.json({
            status: false, message: '数据查询成功', errors: [e.message]
        });
    }
})

// 白名单过滤
function filterBody (req) {
    return {
        title: req.body.title,
        content: req.body.cotent
    }
}
module.exports = router;
