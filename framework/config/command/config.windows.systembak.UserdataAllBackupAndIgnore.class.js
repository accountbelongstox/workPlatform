class AalBackupC{

	run(){
	let o = {
		ignore:[],
        childrenDir:{
				 "*": {        
				 	ignore: [
			            /^AMD/i,
			            /^ATI/i,
			            /^Application\s*Data/i,
			            /^History/i,
			            /^Microsoft/i,
			            /^Packages/i,
			            /^Temp/i,
			            /^Temporary\s*Internet\s*Files/i,
			            /^VirtualStore/i,
			            /^Adobe/i,
			            /^Macromedia/i,
			            /^Visual\s*Studio/i,
			            /^Intenret\s*Explorer/i,
			        ]
	        	}
	        }
		}
		;

        //设置属性
        for(let p in o){
            that[p] = o[p]
        }
		return o;
	}
}

module.exports = AalBackupC;