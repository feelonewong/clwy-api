const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const AdminArticleRouter = require('./routes/admin/articles')
const AdminCategoryRouter = require('./routes/admin/categories')
const AdminSettingRouter = require('./routes/admin/setting')
const AdminUserRouter = require('./routes/admin/user')
const AdminCourseRouter = require('./routes/admin/courses')
const AdminChapterRouter = require('./routes/admin/chapters')
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin/articles', AdminArticleRouter)
app.use('/admin/category', AdminCategoryRouter)
app.use('/admin/setting', AdminSettingRouter)
app.use('/admin/user', AdminUserRouter)
app.use('/admin/users', usersRouter);
app.use('/admin/course', AdminCourseRouter);
app.use('/admin/chapter', AdminChapterRouter);

module.exports = app;
