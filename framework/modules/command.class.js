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
        that.o.param.init(parameters);
        //截取前面多余的参数
        parameters.splice(0,2);

        if( that.o.tool.windows.IsAdmin() ){
            //运行一个命令行模型
            that.o.tool.module.runModule(`command`,parameters);
        }else{
            that.o.tool.console.error("This is not run as administrator.");
        }
    }
}
module.exports = CC;