const express = require("express")
const router = express.Router();
const {Article} = require('../../models')
const {Op} = require("sequelize");


// 获取文章列表
router.get('/', async function (req, res, next) {
    const condition = {
        order: [['id', 'DESC']]
    }
    try {
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
    const body = {
        title: req.body.title,
        content: req.body.content
    }
    try {
        const articles = await Article.create(body)
        res.status(201).json({
            status: true, message: '数据新增成功'
        });
    } catch (e) {
        res.json({
            status: false, message: '数据新增失败'
        });
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
    const body = req.body
    try {
        const article = await Article.findByPk(id)
        if (article) {
            await article.update({
                title: body.title,
                content: body.content
            }, {
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

module.exports = router;
