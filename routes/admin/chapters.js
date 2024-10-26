const express = require("express")
const router = express.Router();
const {Chapter, Course} = require('../../models')
const {Op} = require("sequelize");
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response')

// 获取章节列表
router.get('/', async function (req, res, next) {
    const query = req.query
    const pageSize = Math.abs(query.pageSize) || 10
    const currentPage = Math.abs(query.currentPage) || 1
    const offset = (currentPage - 1) * pageSize
    if (!query.courseId) {
        throw  new Error('获取章节列表失败，课程ID不能为空！')
    }
    const condition = {
        ...getCondition(),
        order: [['rank', 'ASC'], ['id', 'ASC']],
        limit: pageSize,
        offset: offset
    }
    condition.where = {
        courseId: {
            [Op.eq]: query.courseId
        },
    }
    if(query.title){
        condition.where = {
            title:{
                [Op.like]: `%${query.title}%`
            }
        }
    }
    try {
        const chapters = await Chapter.findAndCountAll(condition)

        success(res, '数据查询成功',{
            chapters: chapters.rows,
            total: chapters.count
        } )
    } catch (e) {
        console.log('error')
        failure(res, e)
    }
});

// 获取章节详情
router.get('/:id', async function (req, res, next) {
    try {
        const chapter = await getChapter(req)
        success(res, '章节详情查询成功', {chapter})
    } catch (e) {
        failure(res, e)
    }

});

// 新增章节
router.post('/', async function (req, res, next) {
    // 白名单过滤数据：防止用户乱传数据
    const body = filterBody(req)
    try {
        const chapters = await Chapter.create(body)
        success(res, '章节新增成功', {},201)
    } catch (e) {
        failure(res, e)
    }
});

// 删除章节:1.先找到数据，然后在删除数据
router.delete('/', async function (req, res, next) {
    try {
        const chapter = await getChapter(req)
        if (chapter) {
            await chapter.destroy()
            success(res, '课程删除成功', {chapter})
        } else {
            failure(res, e)
        }
    } catch (e) {
        failure(res, e)
    }

});

// 更新章节
router.put('/:id', async function (req, res) {
    // 先找数据在更新，找不到不更新
    const {id} = req.params
    const body = filterBody(req)
    try {
        const chapter = await getChapter(req)
        await chapter.update(body, {
            where: {
                id
            }
        })
        success(res, '章节更新成功', {chapter})
    } catch (e) {
        failure(res, e)
    }
})

// 白名单过滤
function filterBody(req) {
    return {
        courseId: req.body.courseId,
        title: req.body.title,
        content: req.body.content,
        video: req.body.video,
        rank: req.body.rank,

    }
}

function getCondition(){
    return {
        attributes: {exclude: ['CourseId']},
        include: [{
            model: Course,
            as: 'course',
            attributes: ['id', 'name']
        }]
    }
}

// 公共方法用来查询数据
async function getChapter(req) {
    const {id} = req.params
    const condition = getCondition()
    const chapter = await Chapter.findByPk(id, condition)

    if (!chapter) {
        throw new NotFoundError(`ID: ${id}的章节未找到.`)
    }
    return chapter
}

module.exports = router;
