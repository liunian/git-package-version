/**
 * 版本号检测
 * Created by bd on 15/8/6.
 */


/**
 * 判断 git daily 版本号是否和 npm 的版本号不匹配
 *
 * 当且仅当 git 和 npm 版本不是 undefined 且不相等时返回 true
 * 即意味着，如果不是 daily 分支或没有 npm version 等情况，返回是 false
 *
 * @param dir
 */
function test(dir) {
    var readline = require('readline-sync');

    var versions = getVersions(dir);

    var notMatch = false;
    if (versions.gitVersion !== undefined &&
        versions.npmVersion !== undefined &&
        versions.gitVersion !== versions.npmVersion) {
        notMatch = true;
    }

    if (notMatch) {
        updateNpmVersion(versions.gitVersion);
    }
}

/**
 * 获取 git daily 版本号和 npm package 的版本号
 *
 * 如果不是 git 仓库或不是 daily 分支，git 版本号设为 undefined；
 * 如果不存在 package.json 或 package.json 里不存在 version 字段，npm package 版本号设为 undefined
 *
 * @param {String} dir 待提取版本号的目录
 * @returns {{gitVersion: *, npmVersion: *}}
 */
function getVersions(dir) {
    var fs = require('fs');
    var path = require('path');

    if (!fs.existsSync(dir)) {
        throw new Error('不存在该目录：' + dir);
    }

    var gitVersion;
    var gitHeadPath = path.resolve(dir, '.git/HEAD');
    if (fs.existsSync(gitHeadPath)) {
        var headStr = fs.readFileSync(gitHeadPath, {
            flag: 'r'
        }).toString().trim();

        var dailyVersionPtn = /refs\/heads\/daily\/(.+)$/;
        var matchResult = headStr.match(dailyVersionPtn);
        if (matchResult && matchResult.length == 2) {
            gitVersion = matchResult[1];
        }
    }

    var npmVersion;
    var packageFilePath = path.resolve(dir, 'package.json');
    if (fs.existsSync(packageFilePath)) {
        var packageJSON = require(packageFilePath);
        npmVersion = packageJSON.version;
    }

    return {
        gitVersion: gitVersion,
        npmVersion: npmVersion
    };
}

function updateNpmVersion(version) {
    var childProcess = require('child_process');
    var readlineSync = require('readline-sync');

    var answer = readlineSync.question('Update npm Version to ' + version + '? (Y/N): ', {
        defaultInput: 'Y'
    });

    if (answer) {
        childProcess.execSync('npm version ' + version);
    }
}

module.exports = {
    test: test,
    getVersions: getVersions,
    updateNpmVersion: updateNpmVersion
};
