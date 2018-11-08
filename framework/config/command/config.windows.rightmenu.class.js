class C{
	constructor(load){

	}

	run(){
		let 
		that = this,
		o = {
                description:"恢复右键菜单"
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