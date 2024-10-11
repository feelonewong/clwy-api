const express = require("express")
const router = express.Router();
const {Article} = require('../../models')


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

module.exports = router;
