var Q           = require('q'),
    fs          = require("fs"),
    hosts       = [],
    ping        = require('../index'),
    path        = require('path'),
    rootPath    = path.resolve(__dirname, '..'),
    inputPath   = rootPath + '/data/sites.csv',
    outputPath  = rootPath + '/data/output.csv',
    errorPath   = rootPath + '/data/error.csv';

function trim(str) { //删除左右两端的空格
    return str.replace(/(^["|'|s]*)|(["|'|s]*$)/g, "");
}

function logResult(res) {
    var host = res.host;
    var outpu_prefix = "域名:" + host + "--结果:";
    var flag = true;
    if (res.time) {
        ret = res.output.split("\n")[0].split(" ")[2];
    } else {
        flag = false;
        ret = "失败！！";
    }
    console.log(outpu_prefix + ret);

    if (flag) {
        fs.appendFileSync(outputPath, host + ',' + ret + "\n", 'utf8');
    } else {
        fs.appendFileSync(errorPath, host + "\n", 'utf8');
    }
    return outpu_prefix + ret;
}

module.exports = function(isFirst) {

    console.log("===========================begin ping=================================");

    if(isFirst) {
        try {
            fs.accessSync(inputPath, fs.F_OK);
            hosts= fs.readFileSync(inputPath, "utf-8").split("\n");
            //每次都会删除原有的output文件
            fs.unlink(outputPath, function (err) {});
            fs.unlink(errorPath, function (err) {});
        } catch (e) {
            console.log('file is not readable');
            process.exit(1);
        }
    } else {
        try {
            fs.accessSync(errorPath, fs.F_OK);
            hosts = fs.readFileSync(errorPath, "utf-8").split("\n");
            fs.unlink(errorPath, function (err) {});
        } catch (e) {
            console.log('file is not readable');
            process.exit(1);
        }
    }
    var pingCollection = [];
    hosts.map(function (host) {
        host = trim(host);
        if(host) {
            pingCollection.push(ping.promise.probe(host, {
                timeout: 5,
                extra: ["-i 2"]
            }).then(function (res) {
                var deferred = Q.defer();
                logResult(res);
                deferred.resolve(res);
                return deferred.promise;
            }));
        }
    });

    return Promise.all(pingCollection).then(function(res) {
        console.log('===========================waiting for next ping=================================');
    }, function (value) {
        console.log('error');
    });
    

}