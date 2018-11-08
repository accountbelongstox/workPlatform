class C{
	constructor(load){

	}

	run(){
		let 
		that = this,
		o = {
                description:"生成重新安装Win时的恢复工具,该工具将顺序执行下列命令"
            }
		;

        //设置属性
        for(let p in o){
            that[p] = o[p]
        }


		return o;

	}
}

module.exports = C;