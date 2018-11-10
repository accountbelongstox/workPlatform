const
encoding = 'cp936',
binaryEncoding = 'binary'
;


/**
 * @class 全局公共函数.
 */
class func{

    constructor(load){
    }

    
    /**
     * @func 取得一个值
     * @param a
     * @param b
     * @returns {*}
     */
    get(a=null,b=null){
        if(a){
            return a;
        }else if(b){
            return b;
        }else{
            return a;
        }
    }




    /**
     * @func 判断一个值是否存在
     * @param val
     */
    exists(val){
        let
            that = this,
            exists = 0
        ;
        if(that.load.module.array.isArray(val)){
            if(val.length){
                val.forEach((v)=>{
                   if(v) exists++;
                });
            }else{
                exists = val.length;
            }
        }else if(that.load.module.array.isObject(val)){
            for(let p in val){
                if(val[p]){
                    exists++;
                }
            }
        }else{
            exists = val;
        }
        if(exists){
            return val;
        }else{
            return false;
        }
    }
}

module.exports = func;