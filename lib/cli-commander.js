var program = require('commander');
module.exports = function() {
    program
        .version('1.0.0')
        .usage('[options]')
        .option('--num [num]', '递归次数')
        .parse(process.argv);

    if (typeof program.num === 'undefined') {
        console.log('num参数是必须的！');
        console.log('  -用法 --num [num]');
        process.exit(1)
    }
    return program.num;
};
