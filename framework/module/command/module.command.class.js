/*
* @function 可执行参数的入口
* */

class CC{

    constructor(){
            //( )\\
        // -=( o )=-  \\
             // \\
            //   \\
    }

    init(parameters){
        let
            that = this
        ;
        //截取前面多余的参数
        parameters.splice(0,2);
        if(that.load.module.windows.IsAdmin()){
            //运行一个命令行模型
            that.load.run_module(parameters,null,()=>{
                that.load.console.info("\r\n -- end!",6);
            },true/*代表是命令行模式运行*/);
        }else{
            that.load.console.error("This is not run as administrator.");
        }
    }
}
module.exports = CC;