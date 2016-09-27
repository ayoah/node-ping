var fs         = require("fs");
var ping       = require('../index');
var path       = require('path')

var rootPath   = path.resolve(__dirname, '..')
var inputPath  = rootPath + '/data/sites.csv';
var outputPath = rootPath + '/data/output.csv';

//每次都会删除原有的output文件
fs.unlink(outputPath, function(err) {});

var hostsText = fs.readFileSync(inputPath, "utf-8");
var hosts = hostsText.split("\n");

console.log("===========================begin ping=================================")

hosts.forEach(function (host, index) {
    var outpu_prefix = "共:" + hosts.length + "--当前:" + (index+1) + "--域名:" + host + "--结果:"; 
    host = trim(host);
    var ret = "";
    ping.promise.probe(host, {
        timeout: 2,
        extra: ["-i 2"],
    })
    .then(function (res) {
        if(res.time) {
            ret = res.output.split("\n")[0].split(" ")[2];
        } else {
            ret = "失败！！";
        }       
        console.log(outpu_prefix + ret);
        fs.appendFile(outputPath, host + ',' + ret + "\n", function(error) {});
    })
    .done();
});


function trim(str){ //删除左右两端的空格
　　     return str.replace(/(^s*)|(s*$)/g, "");
　　 }
