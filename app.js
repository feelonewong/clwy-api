const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// 中间件
const adminAuth = require("./middlewares/admin-auth")

const indexRouter = require('./routes/index');
const categoriesRouter = require('./routes/categories')
const courses = require('./routes/courses')
const usersRouter = require('./routes/users');
const chaptersRouter = require('./routes/chapters');
const articlesRouter = require('./routes/articles');

const AdminArticleRouter = require('./routes/admin/articles')
const AdminCategoryRouter = require('./routes/admin/categories')
const AdminSettingRouter = require('./routes/admin/setting')
const AdminUserRouter = require('./routes/admin/user')
const AdminCourseRouter = require('./routes/admin/courses')
const AdminChapterRouter = require('./routes/admin/chapters')
const AdminChartRouter = require('./routes/admin/charts')
const AdminAuthRouter = require('./routes/admin/auth')
const settingsRouter = require('./routes/settings');
const searchRouter = require('./routes/search');

require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/categories', categoriesRouter);
app.use('/courses', courses);
app.use('/admin/articles', adminAuth, AdminArticleRouter)
app.use('/admin/category', adminAuth, AdminCategoryRouter)
app.use('/admin/setting', adminAuth, AdminSettingRouter)
app.use('/admin/user', adminAuth, AdminUserRouter)
app.use('/admin/users', adminAuth, usersRouter);
app.use('/admin/course', adminAuth, AdminCourseRouter);
app.use('/admin/chapter', adminAuth, AdminChapterRouter);
app.use('/admin/charts', adminAuth, AdminChartRouter);
app.use('/admin/auth', AdminAuthRouter); // 权限验证
app.use('/chapters', chaptersRouter); // 章节
app.use('/articles', articlesRouter); // 文章接口
app.use('/settings', settingsRouter); // 系统设置接口
app.use('/search', searchRouter); // 系统设置接口


module.exports = app;
