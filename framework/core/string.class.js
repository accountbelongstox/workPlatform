
class stringC{

    // 字符串处理   -----------------------------------------------------------------------------------------------------------------------------------
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
                console.log(_replaceReg);
                str = str.replace(_replaceReg,``);
            }
        });
        return str;
    }

    /**
     * @func 分离字符串
     * @space
     */
    splitSpace(str){
        let
            that = this,
            len = 0,
            _strTmp = ``,
            removeSpace = /^\s+\s+$/g,
            symbolRead = false
        ;
        str = str.replace(removeSpace);
        while(len < str.length - 1){
            let
                _str = str[len]
            ;
            if(`'"`.includes(_str)){
                symbolRead = true;
                console.log(`\`'"\`.includes(_str)`,`'"`.includes(_str));
            }
            len++;
        }
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
                { reg:/(\~)/ig,replace:"\\$1"},
                { reg:/(\`)/ig,replace:"\\$1"},
                { reg:/(\!)/ig,replace:"\\$1"},
                { reg:/(\@)/ig,replace:"\\$1"},
                { reg:/(\#)/ig,replace:"\\$1"},
                { reg:/(\%)/ig,replace:"\\$1"},
                { reg:/(\^)/ig,replace:"\\$1"},
                { reg:/(\&)/ig,replace:"\\$1"},
                { reg:/(\()/ig,replace:"\\$1"},
                { reg:/(\))/ig,replace:"\\$1"},
                { reg:/(\-)/ig,replace:"\\$1"},
                { reg:/(\_)/ig,replace:"\\$1"},
                { reg:/(\=)/ig,replace:"\\$1"},
                { reg:/(\+)/ig,replace:"\\$1"},
                { reg:/(\<)/ig,replace:"\\$1"},
                { reg:/(\>)/ig,replace:"\\$1"},
                { reg:/(\?)/ig,replace:"\\$1"},
                { reg:/(\/)/ig,replace:"\\$1"},
                { reg:/(\:)/ig,replace:"\\$1"},
                { reg:/(\;)/ig,replace:"\\$1"},
                { reg:/(\,)/ig,replace:"\\$1"},
                { reg:/(\")/ig,replace:"\\$1"},
                { reg:/(\')/ig,replace:"\\$1"},
                { reg:/(\.)/ig,replace:"\\$1"},
                { reg:/(\[)/ig,replace:"\\$1"},
                { reg:/(\])/ig,replace:"\\$1"},
                { reg:/(\{)/ig,replace:"\\$1"},
                { reg:/(\})/ig,replace:"\\$1"},
                { reg:/(\$)/ig,replace:"\\$1"},
                { reg:/(\\)/ig,replace:"\\$1"},
                { reg:/(\|)/ig,replace:"\\$1"}
            ]
        ;
        // 增加替换
        if(force){
            replaceObject.push(
                { reg:/(\*)/ig,replace:"\\$1"}
            );
        }
        while(len < sourceString.length){
            strArray[len] = sourceString[len];
            len++
        }
        strArray.forEach((str,index)=>{
            let
                queryResult = false
            ;
            replaceObject.forEach((replaceItem)=>{
                if(replaceItem.reg.test(str) && !queryResult){
                    str = str.replace(replaceItem.reg,replaceItem.replace);
                    strArray[index] = str;
                    queryResult = true;
                }
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
    createRegExp(str,gi=""){
        let
            that = this,
            reg = new RegExp(that.strToRegText(str,true,true),gi)
        ;
        return reg;
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
        if(data == '') return '';
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
    */
    isChinese(temp)
    {
       let re=/[^\u4e00-\u9fa5]/;
       if (re.test(temp)) return false ;
       return true ;
     }
}


module.exports = stringC;