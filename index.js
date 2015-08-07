/**
 * 检测 package 的版本是否和 daily 分支的版本一致，
 * 如果不一致，那么提示把 package 的版本更新为 daily 的版本
 *
 * usage:
 *
 * var Version = require('gitlab-version');
 * Version.test(path);
 *
 * Created by bd on 15/8/6.
 */
var Version = require('./lib/version');

module.exports = Version;
