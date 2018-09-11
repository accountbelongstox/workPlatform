class C{
	constructor(common){

	}

	run(){
		let 
		that = this,
		o = {
            mustParamsIsOne:false,//必须的参数 0全部
            mustParams : {//必要的命令参数
                url:{
                    description:"需要下载的url路径",
                    keyValue:true,//表示是键值对参数
                    extend:{

                    },
                    mustParams:{
                    }
                }
            },
            additionalParams : {//不必须的附加参数
                save:{
                    description:"指定存放路径",
                    keyValue:true,//表示是键值对参数
                    extend:{

                    }
                },
                thread:{
                    description:"线程数据,默认1线程",
                    keyValue:true,//表示是键值对参数
                    extend:{

                    }
                },
                timeout:{
                    description:"超时时间,默认30秒",
                    keyValue:true,//表示是键值对参数
                    extend:{

                    }
                },
                base64:{
                    description:"是否默认将base64转为图片",
                    keyValue:false,//表示是键值对参数
                    extend:{

                    }
                },
                level:{
                    description:"下载层级,默认为3层",
                    keyValue:true,//表示是键值对参数
                    extend:{

                    }
                },
                charset:{
                    description:"指定编码,默认utf8",
                    keyValue:true,//表示是键值对参数
                    extend:{

                    }
                }
            },
            extend:{
                save : `./assets/copyweb`,
                //需要查找延生下载的标签
                queryHTMLTag : [
                    {
                        a:{
                            //指定抓取的属性
                            attrs:[`href`],
                            //忽略带有以下属性的元素
                            ignores:[{
                                href:[/^\s*javascript\s*\:/,/^\s*\#/]
                            }],
                            isStaticSource:false,//是否是静态元素,静态元素需要直接下载
                            checkDownloadLevel:true//检查下载层级
                        }
                    },
                    {
                        img:{
                            attrs:[`src`],
                            isStaticSource:true,//是否是静态元素,静态元素需要直接下载\
                        }
                    },
                    {
                        link:{
                            attrs:[`href`],
                            isStaticSource:true,//是否是静态元素,静态元素需要直接下载
                            //删除带有以下参数的元素
                            deletes:[{
                                rel:["dns-prefetch"]
                            }],
                        }
                    },
                    {
                        script:{
                            attrs:[`src`],
                            isStaticSource:true,//是否是静态元素,静态元素需要直接下载
                        }
                    }
                ],
                //html需要分析的标签或文件,一般是为了提取基中的内容,分析函数将在调用类中的 同名函数,比如 styleAnalysis(styleContent)
                htmlAnalysis:{
                    tag:["style"],
                    file:["css","cssx"]
                },
                //html如果需要代码替换,由此处添加JSON
                htmlReplace:{

                }
            }
        }
		;



		return o;

	}
}

module.exports = C;