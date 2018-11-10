class C{
    constructor(load){

    }

    run(){
        let
            that = this
        ;
        return {
            description : "开发工具",
            mustParamsIsOne : true,//必须的参数 0全部
            mustParams : {//必要的命令参数
                addweb: {
                    description: "智能添加一个测试网站到本地apache和nginx,基根目录存放于平台配置的wwwroot下",
                    keyValue: false,//表示是键值对参数,
                    MustBeSatisfied:true,
                    extend: {},
                    mustParams: {}
                },
                removeweb: {
                    description: "删除一个测试网站,只删除配置而不会删除文件",
                    keyValue: false,//表示是键值对参数
                    MustBeSatisfied:true,
                    extend: {}
                }
            },
            additionalParams : {//不必须的附加参数
                url: {
                    description: "添加的网址",
                    keyValue: true,//表示是键值对参数
                    extend: {}
                }
            },
            extend : {
                support:{
                }
            }
        }
        ;
    }
}

module.exports = C;