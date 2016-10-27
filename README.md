#Mark
原来用写了个shell的脚本ping域名获取ip，速度非常慢

用node改写后速度提高无数倍，挺好用

usage:

域名数据:data/sites.csv

结果:
	data/output.csv =>获取到ip的结果集
	
	data/error.csv =>没有获取到ip的结果集
	
cmd: node /path/to/ping/ping.js --num [int]

输入参数多次筛选结果，最大化得到结果的正确性

