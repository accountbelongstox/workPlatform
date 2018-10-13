class C{
	constructor(common){

	}

	run(){
		let 
		that = this,
		o = {
            description:"安装一个服务",
            mustParamsIsOne:true,//只需要满足1个参数
            mustParams: {//必要的命令参数
                list: {
                    description: "列出所有支持的软件",
                    keyValue: false,//表示是键值对参数,
                    extend: {},
                    mustParams: {}
                },
                query: {
                    description: "查找一个软件包",
                    keyValue: true,//表示是键值对参数
                    mustParams: {//必要的命令参数
                    },
                    extend: {}
                },
                onesoft: {
                    description: "安装一个软件 / alias : one",
                    keyValue: true,//表示是键值对参数
                    mustParams: {//必要的命令参数
                    },
                    extend: {}
                },
                one: {
                    description: "安装一个软件",
                    keyValue: true,//表示是键值对参数
                    mustParams: {//必要的命令参数
                    },
                    extend: {}
                },
                allsoft:{
                    keyValue: false,//表示是键值对参数,
                    description: "安装全部软件"
                },
                group:{
                    keyValue: false,//表示是键值对参数,
                    description: "安装一组软件"
                },
                scanlist: {
                    description: "根据本地资源目录扫瞄成软件列表.",
                    keyValue: false,//表示是键值对参数
                    extend: {}
                },
                scanlistx: {
                    description: "scanlist强制模式,会重新计算每个文件包的md5值.",
                    keyValue: false,//表示是键值对参数
                    extend: {}
                }
            },
            additionalParams: {//不必须的附加参数
                fast: {
                    description: "快速安装略过解压过程/需要程序已经提前解压到application对应目录",
                    keyValue: false,//表示是键值对参数
                    extend: {}
                },
                force: {
                    description: "强制安装软件",
                    keyValue: false,//表示是键值对参数
                    extend: {}
                },
                next: {
                    description: "安装完后,继续安装下一个软件",
                    keyValue: false,//表示是键值对参数
                    extend: {}
                },
                "group-next": {
                    description: "安装完后,继续安装当前组的下一个软件",
                    keyValue: false,//表示是键值对参数
                    extend: {}
                },
                "cmd": {
                    description: "安装完后,回调CMD命令.(特殊符号转义符^)",
                    keyValue: false,//表示是键值对参数
                    extend: {}
                }
                //
            },
            extend:{
                //需要设置环境变量的软件分组,只支持zip解压安装的软件
                //同时此设置只应用于生成软件列表,不限制生成
                setEnvironment:[`database`,`programming_platform`,`system`,`webserver`],
                installList :`install.list.json`,
                //强制安装到其他文件夹下的软件
                //programFiles 配置来自于platform配置
                installToDir:{
                    programFiles:[/^program\-.+/i]
                }
            }
        }
		;
		return o;

	}
}

module.exports = C;