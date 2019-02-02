class CC {
    constructor(load) {
    }

    run() {
        let
            that = this,
            o = {
                platform: that.load.get_class(`config/command/platform`),
                framwork: {
                    modules: {//framwork下的模型配置
                        command: {// 命令行执行时必须满
                            mustParamsIsOne: true,//表示必要的参数
                            description: `命令行模块`,
                            mustParams: {//必要的命令参数
                                //windows工具命令
                                windows: that.load.get_class(`config/command/windows`),
                                zip: that.load.get_class(`config/command/zip`),
                                copyweb: that.load.get_class(`config/command/copyweb`),
                                develop: that.load.get_class(`config/command/develop`)
                            }
                        }
                    }
                }
            }
        ;
        return o;
    }
}
module.exports = CC;