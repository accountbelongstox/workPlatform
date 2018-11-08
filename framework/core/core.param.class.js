/**
 * @class 分析命令参数.
 */
class func{

    constructor(load){
    }

    init(option){
        this.option = option;
    }

    //判断是否有该参数
    is(name){
        let
            that = this
        ;
        if(that.result[name]){
            return true
        }else{
            return null;
        }
    }

    get (paramName=null,defaultV=null,isValue=false){
        let
            that = this,
            r = that.paramGet(paramName,defaultV,isValue)
        ;
        return r;
    }
    //2. 只会返回 key部份
    getKey (paramName){
        if(!paramName) return null;
        let
            that = this,
            r = that.paramGet(paramName,null,false,true)
        ;
        return r;
    }
    //1. getValue("xxx") 将会返回一个KEY,VALUE的值
    getValue (paramName=null,defaultV=null){
        let
            that = this,
            r = that.paramGet(paramName,defaultV,true)
        ;
        return r;
    }
    //1. getValue("xxx") 将会返回一个KEY,VALUE的值
    value (paramName=null,defaultV=null){
        let
            that = this,
            r = that.paramGet(paramName,defaultV,true)
        ;
        return r;
    }
    /*
    @ 判断参数是否存在于某一个数组中,并返回第一个值,用于参数无序时的判断
    */
    contain (arr){
        let
            that = this,
            params = that.option,
            result = null
        ;
        if(!(arr instanceof Array) && (typeof arr === "object")){
            let
                narr = []
            ;
            for(let p in arr){
                narr.push(p);
            }
            arr = narr;
        }
        params.forEach((param)=>{
            arr.forEach((item)=>{
                if(param.toUpperCase() === item.toUpperCase()){
                    result = item;
                    return;
                }
            });
            if(result)return;
        });
        return result;
    }
    /*
    @func 获取一个参数
	@getParam
    @params paramName:需要获取的参数名 isValue:该参数是否含有值 default:如果没有找到参数则返回默认值
    */
    //getParam(opt,paramName=null,defaultV=null,isValue=false,getKey=false){
    paramGet(paramName=null,defaultV=null,isValue=false,getKey=false){
		
        let
            that = this,
			opt = that.option
        ;
        //如果不传该值,则返回一个带有各类方法的类.!=0 防止正好取下标为0的参数。0刚好被识别为false
        if(!paramName && paramName !== 0){
            let 
                o = {},
                isValueExp = new RegExp(`^\\-+?[a-zA-Z0-9]+?\\:(.+)`,"i"),
                _isValueExp = new RegExp(`^[a-zA-Z0-9]+?\\:(.+)`,"i"),
                notValueExp = new RegExp(`^\\-+?[a-zA-Z0-9]+?$`,"i"),
                _notValueExp = new RegExp(`^[a-zA-Z0-9]+?$`,"i")
            ;
            for(let i=0;i<opt.length;i++){
                let 
                _vTname = opt[i],
                _vTnameNotDir = function(){
                    //排除该参数为一个目录
                    let Dir = that.load.node.path.parse(_vTname);
                    if(Dir.root && Dir.dir){
                        return false;
                    }
                    return true;
                },
                _vKey = _vTname.replace(/\:.+$/ig,""),
                _vKey2 = _vTname.replace(/^\-+/ig,""),
                _vValue = true
                ;
                if( (isValueExp.test(_vTname) || _isValueExp.test(_vTname) ) && _vTnameNotDir()){//带值的参数
                    let isValueExpTReg = /(?<=(\-|^))[a-zA-Z0-9]+?(?=\:)/;
                    let isValueExpVReg = /(?<=\:)(.+)$/ig;
                    let _vVK = _vTname.match(isValueExpTReg);
                    let _vVV = _vTname.match(isValueExpVReg);
                    _vKey2 = _vVK[0];
                    if(_vVV){
                        _vValue = _vVV[0].replace(/^\'|^\"|\"$|\'$/ig,"");
                    }
                }
                o[_vKey] = `${_vValue}`;
                o[_vKey2] = `${_vValue}`;
            }
            return o;
        }
        let 
            param,
            isValueExp = new RegExp(`^\\-*${paramName}\\:(.+)`,"i"),
            notValueExp = new RegExp(`^\\-*${paramName}$`,"i"),
            isNumberValueExp = new RegExp(`^\\-+`,"ig"),
            isNumber = parseInt(paramName)//如果值是数字,则判断是否有该值即可
        ;
        //如果是指定数组来取参数
        if(isNumber === isNumber){
            let oneV = opt[isNumber];
            if(oneV){
                oneV = oneV.replace(isNumberValueExp,"");
                return oneV;
            }else{
                if(defaultV)return defaultV;
            }
            return null;
        }
        let
            _v = null
        ;
        //如果是指定名字来取参数 
        for(let i=0;i<opt.length;i++){

            let
                command = opt[i]
            ;
            //该参数是否是KEY,value型的
            if(isValueExp.test(command)){
                //如果 key.value 只要求返回 key
                if(getKey)return paramName;
                isValue = true;
            }

            if(isValue){
                //如果是带有值的参数，则样式为 --dir:"C:\xxx\xxx" 
                _v = command.match(isValueExp);
                if(_v && _v.length > 1){
                    _v = _v[1];
                    _v = that.load.module.string.trimX(_v);
                    let
                        _vIsInt = parseInt(_v)
                    ;
                    //如果是数字类型则直接返回数字型 
                    if( _vIsInt === _vIsInt){
                        return _vIsInt;
                    }
                    return _v;
                }
            }else{
                if(notValueExp.test(command)){
                    return true;
                }
            }
        }
        if(defaultV !== null){
            //如果没有找到参数则返回默认值
            return defaultV;
        }else{
            //以上条件都不成立的情况下最终返回空
            return _v;
        }
    }
}

module.exports = func;