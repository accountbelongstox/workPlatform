/*
* @function 可执行参数的入口
* */

class CC{

    constructor(){

    }

    init(parameters){
        let
            that = this
        ;
        that.load.core.param.init(parameters);
        //截取前面多余的参数
        parameters.splice(0,2);
        console.log(that.load.module.windows);
        if( that.load.module.windows.IsAdmin() ){
            //运行一个命令行模型
            that.load.run_module(parameters,null,()=>{
                that.load.module.console.info("\r\n -- end!",6);
            },true/*代表是命令行模式运行*/);
        }else{
            that.load.module.console.error("This is not run as administrator.");
        }
    }
}
module.exports = CC;