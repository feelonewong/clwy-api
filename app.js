const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const AdminArticleRouter = require('./routes/admin/articles')
const AdminCategoryRouter = require('./routes/admin/categories')
const AdminSettingRouter = require('./routes/admin/setting')

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
app.use('/users', usersRouter);

module.exports = app;
