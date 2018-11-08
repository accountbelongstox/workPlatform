
class stringC{
    constructor(load){
        load.get_class(`module/time`);
    }

    /**
     * @func 将字符转为对应的格式
     * @param str
     */
    parse(str){
        let
            that = this,
            theString = that.trim(str),
            isNumber = /^\d+$/,
            isFloat = /^\d+\.\d+$/,
            isBoolean = /^(false|true)$/i,
            isNull = /^null$/i,
            result = null
        ;
            //匹配整数
        if(isNumber.test(theString)){
            result = parseInt(theString);
            //匹配浮点
        }else if(isFloat.test(theString)){
            result = parseFloat(theString);
            //匹配布尔
        }else if(isBoolean.test(theString)){
            (theString.toLowerCase() === "true") ? result = true : result = false;
            //匹配null
        }else if(isNull.test(theString)){
            result = null;
            //尝试转json
        }else{
            try{
                result = JSON.parse(theString);
            }catch(err){
                result = str;
            }
        }
        return result;
    }
    /**
     * @func 判断一个字符串的长度
     * @param fact 是否取得实际长度
     * @returns {number}
     */
    length(o,fact=false){
        let
            that = this,
            len = o.length ,
            strLen = 0
        ;
        while(strLen < o.length ){
            let
                strTmp = o.charAt(strLen)
            ;
            if(that.isChinese(strTmp)){
                fact ? len-- : len++;
            }
            strLen++;
        }

        return len;
    }

    isNumber(n){
        if( !(/^\d/.test(n))){
            return null;
        }
        n = new Number(n);
        if(n === n){
            return n;
        }else{
            return null;
        }
    }
    /*
    @func 清洁字符串
    */
    trim(str,Symbol=[],extend=false){
        let
            that = this,
            clearSpaceReg = /^\s+|\s+$/,
            typeofStr = typeof str,
            strings = []
        ;
        if(Symbol && ( (typeof Symbol) === "string" )  ){
            Symbol = [Symbol]
        }

        if( typeof Symbol === "string" ){
            Symbol = [Symbol]
        }

        Symbol = Symbol.concat([`'`,`"`]);

        if(typeofStr === "string"){
            strings = [str];
        }else{
            strings = str;
        }
        (function start(len){
            if(len < strings.length){
                let
                    str = strings[len]
                ;
                if(typeof str === "string"){
                    //清除空格
                    if(clearSpaceReg.test(str)){
                        str = str.replace(clearSpaceReg,``);
                    }

                    for(let i=0;i<Symbol.length;i++){
                        let
                            _s = Symbol[i],
                            //指定扩展时只有前后都有符号时才替换
                            queryLRT = extend ? new RegExp(`^\\${_s}.+\\${_s}$`,"ig") : new RegExp(`^\\${_s}+|\\${_s}+$`,"ig"),
                            noneLRT = extend ? new RegExp(`^\\${_s}|\\${_s}$`,"ig") : new RegExp(`^\\${_s}+|\\${_s}+$`,"ig")
                        ;
                        if(queryLRT.test(str)){
                            str = str.replace(noneLRT,"");
                        }
                    }
                    str = str.replace(/^\s+|\s+$/ig,"");
                    strings[len] = str;
                }
                start(++len);
            }
        })(0);

        if(typeofStr === "string"){
            str = strings.join(``);
        }else{
            str = strings;
        }
        return str;
    }

    /**
     * @func 字符串处理
     * @param str
     */
    trimX(str,symbol = []){
        if(typeof symbol ==="string"){
            symbol = [symbol]
        }
        let
            that = this,
            symbols = [`'`,`"`].concat(symbol)
        ;
        symbols.forEach((symbolOne)=>{
            let
                _text = that.strToRegText(symbolOne),
                _reg = new RegExp(`^${_text}.+?${_text}$`),
                _replaceReg = new RegExp(`^${_text}+|${_text}+$`,`ig`)
            ;
            if(_reg.test(str)){
                str = str.replace(_replaceReg,``);
            }
        });
        return str;
    }

    /**
     *
     * @func 将配置文件转为配置数组
     * @param content 配置文件内容
     * @param annotation 注释符
     * @param filter 是否过滤无效项
     */
    iniTextToArray(content,annotation="#;",filter=true){

        let
            that = this,
            sourceIniArray = content.split(/[\r\n]+/),
            annotationRegText = that.strToRegText(annotation),
            scopeCodeOneReg = new RegExp(`^[${annotationRegText}]\\s*$`,`i`),
            resultArray = []
        ;
        if(filter){
            sourceIniArray = that.load.module.array.filter(sourceIniArray);
            //用来去除每一行的空值的正则 # ;
            sourceIniArray.forEach((scopeCodeOne)=>{
                //去除无效项 # ;
                if(!scopeCodeOneReg.test(scopeCodeOne)){
                    resultArray.push(scopeCodeOne);
                }
            });
        }else{
            resultArray = sourceIniArray;
        }
        return resultArray;
    }

    /**
     * @tools 字符转正则字符.
     * @param str,force增强字符串 fast 是否加上^标识
     * @returns {string}
     */
    strToRegText(sourceString,force=false,fast=false){
        let
            strArray = [],
            len = 0,
            replaceObject = [
                //替换打印字符
                { reg:/\f/ig,replace:"\\f{1,}"},
                { reg:/\n/ig,replace:"\\n{1,}"},
                { reg:/\r/ig,replace:"\\r{1,}"},
                { reg:/\s/ig,replace:"\\s{1,}"},
                { reg:/\t/ig,replace:"\\t{1,}"},
                { reg:/\v/ig,replace:"\\v{1,}"},
                { reg:/\d/ig,replace:"\\d{1,}"},
                //非打印字符
                { reg:[
                        /(\~)/ig,
                        /(\`)/ig,
                        /(\!)/ig,
                        /(\@)/ig,
                        /(\#)/ig,
                        /(\%)/ig,
                        /(\^)/ig,
                        /(\&)/ig,
                        /(\()/ig,
                        /(\))/ig,
                        /(\-)/ig,
                        /(\_)/ig,
                        /(\=)/ig,
                        /(\+)/ig,
                        /(\<)/ig,
                        /(\>)/ig,
                        /(\?)/ig,
                        /(\/)/ig,
                        /(\:)/ig,
                        /(\;)/ig,
                        /(\,)/ig,
                        /(\")/ig,
                        /(\')/ig,
                        /(\.)/ig,
                        /(\[)/ig,
                        /(\])/ig,
                        /(\{)/ig,
                        /(\})/ig,
                        /(\$)/ig,
                        /(\\)/ig,
                        /(\|)/ig
                    ],
                    replace:"\\$1"
                }
            ]
        ;
        // 增强替换,通配符*亦可替换
        if(force){
            replaceObject.push(
                { reg:/(\*)/ig,replace:"\\$1"}
            );
        }
        while(len < sourceString.length){
            strArray[ len ] = sourceString[ len ];
            len++
        }
        strArray.forEach((str,index)=>{
            let
                queryResult = false
            ;
            replaceObject.forEach((replaceItem)=>{
                let
                    regs = replaceItem.reg,
                    regArray = (regs instanceof Array) ? regs : [regs],
                    replaceResult = replaceItem.replace
                ;
                regArray.forEach((regItem)=>{
                    if(regItem.test(str) && !queryResult){
                        str = str.replace(regItem,replaceResult);
                        strArray[index] = str;
                        queryResult = true;
                    }
                });
            });
        });
        sourceString = strArray.join(``);
        if(fast){
            sourceString = `^`+sourceString;
        }
        return sourceString;
    }



    /**
     * @tools 将字符串替换成正则
     * @param str
     * @returns {string}
     */
    stringWildcardRegularized(str){
        let
            that = this
        ;
        str = that.strToRegText(str);
        str = `${str.replace(/(\*)/ig,".+")}`;
        return `^`+str;
    }

    /**
     * @func 通过字符串创建一个正则.
     */
    createRegExp(str,gi="gi",force=true,fast=false){
        let
            that = this
        ;
        return (  new RegExp(that.strToRegText(str,force,fast),gi) );
    }

    /**
     * @tools 将字符串直接转为可以匹配配置正则字符
     * @param str
     * @returns {string}
     */
    strToConfigReg(key,value,conf_symbol,this_config){
        let slice="";//是否匹配左或右侧面字.
        let left_reg = /\$\`/ig;
        let right_reg = /\$\'/ig;
        let extend="";
        if(value.match(left_reg)){
            slice = "left";
            extend = value.match(/.+(?=\$\`)/ig)[0].replace(/.+?\%/ig,'');
            value = value.replace(left_reg,"")
        }
        if(value.match(right_reg)){
            slice = "right";
            extend = value.match(/.+(?=\$\')/ig)[0].replace(/.+?\%/ig,'');
            value = value.replace(right_reg,"")
        }
        //console.log(value);
        key = this.strToRegText(key);
        let reg_text;
        switch (slice){
            case "left":
                reg_text =`(?<=[\\s*\\;|\\s*\\#|\\s*]\\s*)${key}\\s*\\${conf_symbol}\\s*(.+?)${ this.strToRegText(extend)}`;
                break;
            case "right":
                reg_text =`[\\s*\\;|\\s*\\#|\\s*]\\s*${key}\\s*\\${conf_symbol}\\s*(.+?)${ this.strToRegText(extend)}(.+)`;
                break;
            default:
                reg_text = `(?<=[\\s*\\;|\\s*\\#|\\s*]\\s*)${key}\\s*\\${conf_symbol}\\s*(.+)`;
                break;
        }
        let reg = new RegExp(reg_text,"ig");

        value = value.replace(/\%appdir\%/ig,this_config.appdir);
        value = value.replace(/\%basedir\%/ig,this_config.basedir);
        value = value.replace(/\%appname\%/ig,this_config.appname);

        return {
            reg,
            slice,
            extend,
            value
        };
    }


    /**
     * @tools 用Unicode方法替换一个字符串
     */
    replaceToUnicode(str,sourceString,targetString){
        let _in = this.stringUnicodeHas(str,sourceString);
        let _a = this.ToUnicodeArr(str);
        let _tar = this.ToUnicodeArr(targetString);
        let _reToken = false

        if( _in  != null){
            let _a_ = []
            for(let i=0;i<_a.length;i++){
                if(i < _in[0] || i > _in[1]){
                    _a_.push(_a[i])
                }else{
                    if(!_reToken){
                        _a_ = _a_.concat(_tar)
                    }
                }
            }
            _a = _a_
        }
        return this.UinucodeToString(_a)
    }

    /**
     * @tools 查看一个字符串是否包含另一个字符串,并返回包含起即到结束位置
     */
    stringUnicodeHas(sourceString,targetString){
        let _a = this.ToUnicodeArr(sourceString);
        let _b = this.ToUnicodeArr(targetString);
        let _in = this.arrInArrAtContinue(_a,_b);
        if( _in  != null){
            return _in
        }
        return false
    }

    /**
     * @tools 将字符转为Unicode数组
     * @param s
     * @returns {Array}
     * @constructor
     */
    ToUnicodeArr(s){
        let _arr = [],
            i = 0,
            w

        if(s instanceof String){
            s = [s]
        }
        while(  w = s.charAt(i) )
        {
            i++;
            _arr.push(w.charCodeAt())
        }
        return _arr;
    }

    /**
     * @tools 将Unicode数组转字符串
     * @param u
     * @returns {string}
     * @constructor
     */
    UinucodeToString(u){
        let t = ""

        if(u instanceof String){
            u = [u]
        }
        for(let i=0;i<u.length;i++){
            let _t = String.fromCharCode(u[i]);
            t += _t

        }
        return t;
    }

    /*
    @func 字符串转数组
    */
    stringToArray(str){
        let 
        a = [],
        i = 0,
        tmp = null
        ;

        while(tmp = str.charAt(i)){
            a.push(tmp);
            i++;
        }
        
        return a;
    }

    /**
     * @func 判断是否是一个字符串
     * @param str
     * @returns {boolean}
     */
    isString(str){
        let
            that = this
        ;
        if(typeof str === "string"){
            return true;
        }
        return false;
    }

    /*
    @func 字符串首字母大写
    */
    initialsUpper(str){
        let 
        that = this
        ;

        if(str){
            str = that.stringToArray(str);
        }else{
            return str;
        }
        str = str[0].toUpperCase()+str.splice(1).join("");

        return str;
    }


    /*
    @func 根据common类的要求来处理加载类,比如abc.eee.class.js 会被处理成abcEee.则把.改成首字母大写
    */
    commonClassNameFormat(name){
        let 
        that = this,
        a = name.split('.')
        ;
        for(let i=0;i<a.length;i++){
            if(i != 0){
                a[i] = that.initialsUpper(a[i]);
            }
        }
        name = a.join('');
        return name;
    }

    /*
    @func 将字符串中的汉字转unicode
    */
    chinesetounicode(data){
        let 
        that = this
        ;
        if(data === '') return '';
        var str =''; 
        for(var i=0;i<data.length;i++){
            if(that.isChinese(data[i])){
                str+="\\u"+parseInt(data[i].charCodeAt(0),10).toString(16);
            }else{
                str+=data[i];
            }
        }
       return str;
    }


    /*
    @func 判断是否是汉字
    @param temp
    */
    isChinese(temp){
       let
           re=/[^\u4e00-\u9fa5]/
       ;
       if(re.test(temp)){
           return false ;
       }
       return true ;
    }

    /**
     * @func SQL转义
     * @param sql
     * @returns {*}
     */
    sqlParse(sql){
        let
            that = this
        ;
        sql = sql+``;
        sql = sql.replace(/\'/g,`\\'`);
        sql = sql.replace(/\`/g,`\\\``);
        sql = sql.replace(/\\/g,`\\\\`);
        return sql;
    }

    /*
    @func 生成一个由时间值组成的文件名
     */
    createFileName(file_path){
        let
            that = this,
            prefix_string = that.load.module.time.format(`yyyy-mm-dd-hh-mm-ss`),
            file_parse = (function (){
                if(file_path){
                    return  that.load.node.path.parse(file_path);
                }else{
                    return null;
                }
            })(),
            file_pathname = ``,
            file_name = ``,
            file_ext = ``,
            file_new_path = ``
        ;
        if(file_parse){
            file_pathname = file_parse.dir;
            file_name = file_parse.name;
            file_ext = file_parse.ext;
        }
        file_new_path = that.load.node.path.join(`${file_pathname}`,`${file_name}${prefix_string}${file_ext}`);
        return file_new_path
    }
}


module.exports = stringC;