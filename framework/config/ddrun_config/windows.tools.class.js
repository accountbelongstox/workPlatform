class C{
    constructor(o){

    }

    run(){
        let
            that = this,
            o = {
                description:"windows系统工具",
                mustParamsIsOne:true,//只需要满足1个参数
                mustParams: {//必要的命令参数
                    sethost: {
                        description: "设置hosts",
                        keyValue: false,//表示是键值对参数,
                        extend: {},
                        mustParams: {}
                    },
                    delhost: {
                        description: "删除hosts",
                        keyValue: false,//表示是键值对参数,
                        extend: {},
                        mustParams: {}
                    }
                },
                additionalParams: {//不必须的附加参数
                    ip: {
                        description: "设置hosts的IP地址",
                        keyValue: false,//表示是键值对参数
                        extend: {}
                    },
                    domain: {
                        description: "设置hosts的域名",
                        keyValue: false,//表示是键值对参数
                        extend: {}
                    }
                    //
                },
                extend:{
                }
            }
        ;
        return o;

    }
}

module.exports = C;