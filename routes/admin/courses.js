const express = require("express")
const router = express.Router();
const {Course, Category, User, Chapter} = require('../../models')
const {Op} = require("sequelize");
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response')

// 获取课程列表
router.get('/', async function (req, res, next) {
    const query = req.query
    const pageSize = Math.abs(query.pageSize) || 10
    const currentPage = Math.abs(query.currentPage) || 1
    const offset = (currentPage - 1) * pageSize
    const condition = {
        attributes: { exclude: [ 'UserId','CategoryId'] },
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
            }
        ],
        order: [['id', 'DESC']],
        limit: pageSize,
        offset: offset
    }
    if (query.categoryId) {
        condition.where = {
            categoryId: {
                [Op.eq]: query.categoryId
            }
        };
    }

    if (query.userId) {
        condition.where = {
            userId: {
                [Op.eq]: query.userId
            }
        };
    }

    if (query.name) {
        condition.where = {
            name: {
                [Op.like]: `%${query.name}%`
            }
        };
    }

    if (query.recommended) {
        condition.where = {
            recommended: {
                // 需要转布尔值
                [Op.eq]: query.recommended === 'true'
            }
        };
    }

    if (query.introductory) {
        condition.where = {
            introductory: {
                [Op.eq]: query.introductory === 'true'
            }
        };
    }


    try {
        const courses = await Course.findAndCountAll(condition)

        success(res, '数据查询成功', {
            courses: courses.rows,
            total: courses.count
        })
    } catch (e) {
        console.log('error')
        failure(res, e)
    }
});
function getCondition() {
    return {
        attributes: { exclude: ['CategoryId', 'UserId'] },
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
            }
        ]
    }
}
// 获取课程详情
router.get('/:id', async function (req, res, next) {
    try {

        const course = await getCourse(req)
        success(res, '课程详情查询成功', {course})
    } catch (e) {
        failure(res, e)
    }

});

// 新增课程
router.post('/', async function (req, res, next) {
    // 白名单过滤数据：防止用户乱传数据
    const body = filterBody(req)
    try {
        const courses = await Course.create(body)
        success(res, '课程新增成功', {}, 201)
    } catch (e) {
        failure(res, e)
    }
});

// 删除课程:1.先找到数据，然后在删除数据
router.delete('/:id', async function (req, res, next) {
    try {
        console.log(1234, 'delete')

        const course = await getCourse(req)
        const count = await Chapter.count({where: {courseId: req.params.id}})
        if(count > 0) {
            throw new Error("当前课程有章节，无法删除！")
        }
        if (course) {
            await course.destroy()
            success(res, '课程删除成功', {course})
        } else {
            failure(res, e)
        }
    } catch (e) {
        failure(res, e)
    }

});

// 更新课程
router.put('/:id', async function (req, res) {
    // 先找数据在更新，找不到不更新
    const {id} = req.params
    const body = filterBody(req)
    try {
        const course = await getCourse(req)
        await course.update(body, {
            where: {
                id
            }
        })
        success(res, '课程更新成功', {course})
    } catch (e) {
        failure(res, e)
    }
})

// 白名单过滤
function filterBody(req) {
    return {
        categoryId: req.body.categoryId,
        userId: req.body.userId,
        name: req.body.name,
        image: req.body.image,
        recommended: req.body.recommended,
        introductory: req.body.introductory,
        content: req.body.content,

    }
}

// 公共方法用来查询数据
async function getCourse(req) {
    const {id} = req.params
    const condition = {
        attributes: { exclude: [ 'UserId','CategoryId'] },
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
            }
        ],
        order: [['id', 'DESC']]
    }
    const course = await Course.findByPk(id,condition)

    if (!course) {
        throw new NotFoundError(`ID: ${id}的课程未找到。`)
    }
    return course
}

module.exports = router;
