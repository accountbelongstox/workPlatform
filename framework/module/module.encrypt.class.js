const
crypto = require('crypto')
;



class encrypt{
	/*
	@func 将一个字符串用md5加密
	*/
	md5(t){
		try{
			t = t+'';
		}catch(e){
			return '';
		}
		if(!t)return '';
	    var md5 = crypto.createHash('md5');
	    return md5.update(t).digest('hex');
	}


}



module.exports =  encrypt;