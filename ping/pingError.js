var fs         = require("fs");
var ping       = require('../index');
var path       = require('path');

var rootPath   = path.resolve(__dirname, '..');
var outputPath = rootPath + '/data/output.csv';
var errorPath = rootPath + '/data/error.csv';


var hostsText = fs.readFileSync(errorPath, "utf-8");
var hosts = hostsText.split("\n");
//每次都会删除原有的error文件
fs.unlink(errorPath, function(err) {});

console.log("===========================begin ping=================================")

hosts.forEach(function (host, index) {
    if(host) {
        pingFunction(host, index);
    }
});

function pingFunction(host, index) {
    var outpu_prefix = "共:" + hosts.length + "--当前:" + (index+1) + "--域名:" + host + "--结果:";
    host = trim(host);
    var ret = "";
    ping.promise.probe(host, {
        timeout: 15,
        extra: ["-i 2"],
    })
    .then(function (res) {
        var flag = true;
        if(res.time) {
            ret = res.output.split("\n")[0].split(" ")[2];
        } else {
            flag = false;
            ret = "失败！！";
        }
        console.log(outpu_prefix + ret);

        if(flag) {
            fs.appendFile(outputPath, host + ',' + ret + "\n", function(error) {});
        } else {
            fs.appendFile(errorPath, host + "\n", function(error) {});
        }

    })
    .done();
}

function trim(str){ //删除左右两端的空格
　　     return str.replace(/(^["|'|s]*)|(["|'|s]*$)/g, "");
　　 }
