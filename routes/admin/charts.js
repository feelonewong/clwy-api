const express = require("express")
const router = express.Router();
const {sequelize, User} = require('../../models')
const {Op} = require("sequelize");
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response')


// 统计用户性别
router.get('/sex', async function (req, res) {
    try {
        const male = await User.count({where: {sex: 0}});
        const female = await User.count({where: {sex: 1}});
        const unknown = await User.count({where: {sex: 2}});
        const data = [
            {value: male, name: "男性"},
            {value: female, name: "女性"},
            {value: unknown, name: "未选择"},
        ]
        success(res, '查询用户性别成功', {data})

    } catch (error) {
        failure(error)
    }
});

// 查询每月用户数据
router.get('/user', async function (req, res) {
    try {
       const [results] = await sequelize.query("SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC")
        const data = {
           months: [],
            value: []
        }
        results.forEach(item=>{
            data.months.push(item.month);
            data.value.push(item.value);
        })
        success(res, '查询每月用户量成功', {data})

    } catch (error) {
        failure(error)
    }
});

module.exports = router;