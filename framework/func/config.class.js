class configC{
	constructor(o){
        
        
        
        
        
        
        
        
        
        
	}
     /**
     * @func 取得所有版本路径
     * @param installDir
     * @returns {Array}
     * @constructor
     */
    GetVersionFull(installDir){
        let 
        	that = this,
			r = [],
			reg = /\.*/ig
        ;
        if(!that.o.tool.file.isPath(installDir)){
            installDir = that.o.func.install.getSoftInfo(installDir).applicationDir
		}
		let
            versions = that.o.node.fs.readdirSync(installDir)
		;
        versions.forEach((version)=>{
            if(reg.test(version)){
                let
                    apache = that.o.node.path.join(installDir,version)
                ;
                if(that.o.tool.file.isDirSync(apache)){
                    r.push(apache);
                }
            }
        });
        return r;
    }
    /**
	 * @func 取得PHP的版本结构
	 * @params phpVersionFull 可以指定单个版本号,比如 54n 也可以没有参数，获取所有
	 * @return Object
	 */
    GetPHPVersion(phpVersionFull){
        let
            that = this,
            phpVersionsFullPath = that.o.func.config.GetVersionFull("php"),
            phpVersions = []
        ;
        phpVersionsFullPath.forEach((phpVersion)=>{
            let
                versionTmp = phpVersion.replace(/^.+?(?=\d)/,``).replace(/\.+|\-+/ig,``),//
                versionMatch = versionTmp.match(/\d+/),
                versionA = versionMatch[0].substr(0,2),
                versionB = versionTmp.substr(versionMatch[0].length,1),
                version = versionA+versionB,
                conf = that.o.node.path.join(phpVersion,`php.ini`),
				tmpJson = {}
            ;
            tmpJson[version]={
            	base:that.o.node.path.parse(phpVersion).base,
            	version,
                dir:phpVersion,
                conf
            };
            phpVersions.push(tmpJson);
        });
        if(phpVersionFull){
            //如果指定版本,则单独获取一个版本
            if(phpVersions[phpVersionFull]){
                //没有指定时,获取全部
                phpVersionFull = [phpVersions[phpVersionFull]];
            }else{
                that.o.tool.console.error(`Not find php version in ${phpVersion}`);
                return null;
            }
		}else{
            phpVersionFull = phpVersions;
		}
        return phpVersionFull;
    }

    /**
     * @func 取得 httpd 下面的PHP多版本配置的文件
     * @return String
     */
	GetApacheMultiplePHPsApi(apacheVersion="2.4"){
    	let
			that = this,
			phpVersions = that.o.func.config.GetPHPVersion(),
            multiPHP = []
		;
        apacheVersion = apacheVersion.replace(/\./i,``);
        apacheVersion = apacheVersion.split(/\B/).join(`_`);
        phpVersions.forEach((versionJson)=>{
            for(let p in versionJson){
                let
                    versionObject = versionJson[p],
                    phpVersion = versionObject.version.substr(0,2),
                    phpBaseVersion = phpVersion.substr(0,1),
                    dir = versionObject.dir.replace(/\\/ig,`/`).replace(/[\\\/]$/,``)+"/",
                    sApi = ``,
                    moduleFileDir = `${dir}php${phpBaseVersion}apache${apacheVersion}.dll`,
                    PHPts_dll = `${dir}php${phpBaseVersion}ts.dll`,
                    PHPLibSsh2_dll = `${dir}libssh2.dll`,
                    PHPCgiExe = `${dir}php-cgi.exe`,
                    //需要文件存在时才生成配置
                    FCgiD = that.o.tool.file.isFilesSync(PHPCgiExe) ? `<IfModule fcgid_module>
	FcgidInitialEnv PHPRC "${dir}"
	AddHandler fcgid-script .php
	FcgidWrapper "${PHPCgiExe}" .php
</IfModule>` : ``,
					tmpJson = {}
                ;
                switch (phpVersion) {
                    case "52":
                        sApi = that.o.tool.file.isFilesSync(PHPts_dll,moduleFileDir) ? `LoadFile "${PHPts_dll}"
LoadModule php5_module "${moduleFileDir}"
<IfModule php5_module>
	PHPIniDir ""${dir}"
</IfModule>
LoadFile "${dir}libmysql.dll"
LoadFile "${dir}libmcrypt.dll"
<FilesMatch "/.php$">
    SetHandler application/x-httpd-php
</FilesMatch>` : ``;
                        FCgiD = ``;
                        break;
                    case "53":
                        sApi = that.o.tool.file.isFilesSync(PHPts_dll,moduleFileDir) ? `LoadFile "${PHPts_dll}"
LoadModule php5_module "${moduleFileDir}"
<IfModule php5_module>
	PHPIniDir "${dir}"
</IfModule>
<FilesMatch "\\.php$">
    SetHandler application/x-httpd-php
</FilesMatch>` : ``;
                        break;
                    case "54":
                        sApi = that.o.tool.file.isFilesSync(PHPts_dll,moduleFileDir) ? `LoadFile "${PHPts_dll}"
LoadModule php5_module "${moduleFileDir}"
<IfModule php5_module>
	PHPIniDir "${dir}"
	AddType application/x-httpd-php .php .phtml
</IfModule>` : ``;
                        break;
                    default:
                        sApi = that.o.tool.file.isFilesSync(PHPts_dll,PHPLibSsh2_dll) ? `LoadFile "${PHPLibSsh2_dll}"
LoadFile "${PHPts_dll}"
LoadModule php${phpBaseVersion}_module "${moduleFileDir}"
<IfModule php7_module>
	PHPIniDir "${dir}"
</IfModule>
<FilesMatch "\\.php$">
    SetHandler application/x-httpd-php
</FilesMatch>` : ``;
                        break;
                }
                tmpJson[p] = {
                	version:versionObject,
                	multiPHP:{},
                    dir
				};
                if(FCgiD) tmpJson[p].multiPHP[`httpd-php-fcgid${p}`] = FCgiD;
                if(sApi) tmpJson[p].multiPHP[`httpd-php-sapi${p}`] = sApi;
                if(FCgiD || sApi)multiPHP.push(tmpJson);
            }
        });
        return multiPHP;
	}

    /**
     * @func 不管何种格式,将APACHE版格号格式化为  2.X 形式
     * @param version
     * @returns {*}
     */
    formatApacheVersion(version="2.4"){
        let
            that = this
        ;
        version = that.o.node.path.parse(version).base;
        version = version.replace(/.+?(?=\d)/,``);
        version = version.replace(/[^0-9]/g,``);
        return version;
    }
    /**
     * @func 将 PHP 的 CIG 添加到配置中
	 * @params version string apache 版本号: apache2.4
     */
    GetOrAddMultiPHPsApiAndFCgiDConf(version,force=true,waring=true){
        let
            that = this,
        	ApacheVersion = that.formatApacheVersion(version),
            multiPHP = that.GetApacheMultiplePHPsApi(ApacheVersion),
            phpMulti = {}
		;
        for(let p in multiPHP){
            let
                PHPObjectOne = multiPHP[p]
            ;
            for(let o in PHPObjectOne){
                let
                    PHPObjectItem = PHPObjectOne[o],
                    PHPOne = PHPObjectItem.multiPHP
                ;
                for(let u in PHPOne){
                    let
                        multiPHPOne = PHPOne[u],
                        sourceConf = `conf/php/${u}.conf`,
                        confPath = that.o.node.path.join(version,sourceConf)
                    ;
                    phpMulti[o] = {
                        version : o,
                        conf : confPath,
                        sourceConf,
                        dir:PHPObjectItem.version.dir,
                        ini:PHPObjectItem.version.conf
                    };
                    if(!that.o.tool.file.isFileSync(confPath) && force){
                        that.o.tool.console.info(`Create configuration file => ${confPath}`,4);
                        that.o.tool.file.writeFileSync(confPath,multiPHPOne);
                    }else{
                        if(waring)that.o.tool.console.waring(`Configuration file exists => ${confPath}`);
                    }
                }
            }
        }
        return phpMulti;
	}

    /**
     @ func 设置一个配置文件
     * @param option 参数选项
     * @param option.path default 配置文件基本路径,可以是数组,数组时将设置多个
     * @param option.key default "" 设置xxx,设置下级 (xxx -> children_xxx)
     * @param option.keyPrefix default key 的前置空格或符号
     * @param option.multiKey default false 不只有一个值 ,如配置apache时，会有一系列连续值，如果配置了此值,则要键值对应才配置,否则从最后一个KEY或末尾处添加
     * @param option.value default ""
     * @param option.addValue default false 无条件直接添加value
     * @param option.valueTrim default false 移除值的前后空格
     * @param option.status default true 打开还是关闭该项
     * @param option.valueDisabled:false 只需将结果配置正确即可,该值的原是否开始保持不变
     * @param option.confName default 配置文件名称 xxx.ini
     * @param option.assignmentSymbol default "=" 赋值符号
     * @param option.tag default 新加的配置是否需要tag标签,如[ddrun]
     * @param option.tagLeft default "[" 标签边界左
     * @param option.tagRight default "]" 标签边界右
     * @param option.Annotation default "#" 注释符号
     * @param option.valueSymbol default `"` 值的包含符号 如果配置为 null 则无论什么值不添加包含符号
     * @param option.exampleConf: [] 初始实例配置文件数组,用于将软件内示例配置文件复制成正式文件,在没有正式文件的前提下生效
     * @param option.checkKey default (true|false)如果有该值才设置,如果没有则不设置
     * @param option.valueIsDirAndCreate default (true|false) 值是一个目录并且创建
     * @param option.valueIsFileAndCreate default (true|false) 值是一个文件并且创建
     * @param option.valueIsFileAndCreateDir default (true|false) 值是一个文件并且创建上级目录
     * @param option.changQuotePath default false 仅仅是改变值的路径,值必须是一个文件如dll的引用,传入一个目录用来改变其路径,不修改文件名
     * @param callback
     * @param sourceIniText 配置源文件
     * @param debug 调试
     */
    SetIni(option,callback,sourceIniText=null/*配置文件内容,每次队列只执行一次,且优先读取模版内容*/,debug=false){
        let
            that = this,
            iniDefaultPath = null,
            optionFast = option[0],
            EOL = that.o.tool.windows.os().EOL,
            //此处3个变量需要在最顶上获取
            //因为是全局共用
            //1.例子配置文件
            exampleConf = that.SetIniDefaultValue(optionFast,'exampleConf',[]),
            //2.配置文件路径
            iniPath = that.SetIniDefaultValue(optionFast,'path'),
            //3.配置文件名称
            confName = that.SetIniDefaultValue(optionFast,'confName'),
            //4.清除多余的项和空项
            filter = that.SetIniDefaultValue(optionFast,'filter',true),
            //接收配置文件分割后的数组
            sourceIniArray = [],
            annotation = that.SetIniDefaultValue(optionFast,'annotation',`#;`),//注释符号
            annotationRegText = that.o.tool.string.strToRegText(annotation),
            childrenSplit = ` -> `,
            closedSplit = ` <-> `
        ;
        if(!confName || !iniPath){
            that.o.tool.console.error(`Not find config name or ini path.`);
            if(callback)callback(sourceIniText);
        }else{
            if(!iniDefaultPath){
                iniDefaultPath = that.o.node.path.join(iniPath,confName);
                that.o.tool.console.success(`Set ini in ${iniDefaultPath} `);
            }
            if(!sourceIniText){
                // 从模版读取配置
                // 备份至模版,此配置文件只读取一次
                sourceIniText = that.GetIniInTemplateAndBackupToTmplate(iniPath,exampleConf,confName);
            }
/*            if(debug){
                console.log(iniPath,exampleConf,confName,3432432);
                return;
            }*/

            //获得配置文件转成的数组
            sourceIniArray = that.o.tool.string.iniTextToArray(sourceIniText,annotation,filter);

            (function startSetINI(len){
                if(len >= option.length){
                    //首位为末尾各添加一个换行符
                    sourceIniArray = that.o.tool.array.filter(sourceIniArray);
                    sourceIniText = sourceIniArray.join(EOL);
                    //重写配置文件
                    //console.log(sourceIniArray[sourceIniArray.length - 1],444);
                    that.o.node.fs.writeFileSync(iniDefaultPath,sourceIniText,{encoding: 'utf8'});
                    if(callback)callback(sourceIniText);
                }else{
                    let
                        opt = option[len],
                        tagLeft = that.SetIniDefaultValue(opt,`tagLeft`,"["),//如果有左值则取左值,没有则取默认值
                        tagRight = that.SetIniDefaultValue(opt,'tagRight',"]"),
                        key = that.SetIniDefaultValue(opt,'key'),
                        keyPrefix = that.SetIniDefaultValue(opt,'keyPrefix',``),
                        multiKey = that.SetIniDefaultValue(opt,`multiKey`,false),
                        insertMultiKeyBefore = that.SetIniDefaultValue(opt,`insertMultiKeyBefore`,false),
                        childrenKey = key.split(childrenSplit),//->
                        isChildrenKey = (childrenKey.length > 1),
                        closedKey = key.split(closedSplit),//<->
                        isCloseKey = (closedKey.length > 1),
                        showKey = key,
                        tag = that.SetIniDefaultValue(opt,'tag',""),
                        status = that.SetIniDefaultValue(opt,'status',true),//状态是否打开
                        value = that.SetIniDefaultValue(opt,'value',""),
                        addValue = that.SetIniDefaultValue(opt,'addValue',false),
                        valueTrim = that.SetIniDefaultValue(opt,'valueTrim',false),//注释符号
                        //处理注释符号为正则
                        valueDisabled = that.SetIniDefaultValue(opt,'valueDisabled',false),//配置结果正确,配置结果正确即可,不改变之前的是否开启或关闭
                        changQuotePath = that.SetIniDefaultValue(opt,'changQuotePath',false),//是改变值的路径,不改变文件名
                        assignmentSymbol = that.SetIniDefaultValue(opt,'assignmentSymbol'," = "),//赋值符号
                        //值的包含符,如果有空格时,需要用到包含符 如果配置为 null 则无论什么值不添加包含符号
                        valueSymbol = that.SetIniDefaultValue(opt,'valueSymbol',`"`),
                        checkKey = that.SetIniDefaultValue(opt,'checkKey',false),//默认不检查 是否有该值
                        valueIsDirAndCreate = that.SetIniDefaultValue(opt,'valueIsDirAndCreate',false),
                        valueIsFileAndCreate = that.SetIniDefaultValue(opt,'valueIsFileAndCreate',false),
                        valueIsFileAndCreateDir = that.SetIniDefaultValue(opt,'valueIsFileAndCreateDir',false),
                        /*----------------------------- ----------------------------- -----------------------------*/
                        tagEndText = ``,
                        tagStartText = ``
                    ;
                    if(tag){
                        // 指定了标签 [scope]
                        tagStartText = tagLeft+that.o.tool.string.trim(tag)+tagRight;
                        tagEndText = tagLeft;
                    }
                    // 再次处理源配置文件的分割数组长
                    // 处理 aaa -> bbb形式
                    if(isChildrenKey){
                        // 指定了标签 [scope]
                        key = that.o.tool.string.trim(childrenKey[1]);
                        tagStartText = tagLeft+that.o.tool.string.trim(childrenKey[0])+tagRight;
                        tagEndText = tagLeft;
                    }
                    if(isCloseKey){
                        // 处理闭合配置 <a> ... </a>
                        let
                            closedKeyArray = closedKey[1].split(childrenSplit),
                            closedKeyIncludeKey = (closedKeyArray.length > 1),
                            closedTag = closedKey[1]
                        ;
                        // 如果下级依然指定KEY,则配置Key
                        if(closedKeyIncludeKey){
                            key = closedKeyArray[1];
                            closedTag = closedKeyArray[0];
                        }
                        tagStartText = that.o.tool.string.trim(closedKey[0]);
                        tagEndText = that.o.tool.string.trim(closedTag);
                    }
                    let
                        defineTagRegT = that.o.tool.string.createRegExp(tagStartText,`i`),
                        // 用来查找标签的配置段范围
                        isTagConfReg = that.o.tool.string.createRegExp(tagEndText,`i`),
                        keyReg = that.getKeyReg(key,value,assignmentSymbol,annotationRegText,multiKey),
                        scopeCodeMin = 0,
                        scopeCodeMax = sourceIniArray.length,
                        // 让系统 知道范围是否被查找到
                        allowSetScopeMin = true,
                        // 为了避免范围上限被重复赋值的开关
                        allowSetScopeMax = true,
                        queryDefineTag = false,
                        queryScopeIs
                    ;
                    sourceIniArray.forEach((codeLine,index)=>{
                        if( isChildrenKey ){
                            //如果已经查找到起始地址,才根据起始地址找到结束地址
                            if( isTagConfReg.test( codeLine) && !allowSetScopeMin && allowSetScopeMax ){
                                scopeCodeMax = index;
                                allowSetScopeMax = false;
                            }
                            //得到范围的起始地址
                            if( defineTagRegT.test( codeLine) ){
                                scopeCodeMin = index+1;
                                allowSetScopeMin = false;
                                //查找到标签 [aaa]
                                queryDefineTag = true;
                            }
                        }
                        //如果是多个键 以最后一个为界限
                        if(multiKey && keyReg.test( codeLine)){
                            scopeCodeMax = index+1;
                        }
                    });
                    //当指定了TAG标签,而又没有查找到时,将范围归0
                    if( isChildrenKey && !queryDefineTag){
                        scopeCodeMin = scopeCodeMax;
                    }
                    //查找到范围
                    queryScopeIs = ((scopeCodeMax - scopeCodeMin) > 0);
                    let
                        keyValueReg = that.getKeyValueReg(key,assignmentSymbol,annotationRegText,multiKey,value),
                        isQueryValue = false,
                        annotationReg = new RegExp(`^\\s*[${annotationRegText}]{1,}`),
                        notFindScopeGetKeyValue = that.getSetIniTagAndKv(tag,EOL,key,keyPrefix,value,status,assignmentSymbol,valueSymbol,changQuotePath,annotation),
                        insertLocationIndex = null,
                        valueExistsCount = []
                    ;

                    //如果没有查找到代码范围,并且无须判断此值一定要存在,则添加
                    if(!queryScopeIs && !checkKey){
                        //没有查询到范围代码,进入下一次
                        sourceIniArray.push(notFindScopeGetKeyValue);
                        that.o.tool.console.info(`\t( ${showKey} ) : >>>>>> ${value} add success!`,3);
                    }else if(queryScopeIs){
                        //非添加配置,默认设置的值都必须是原先有的,为了避免错乱,如果要强制添加,需要开启 addValue = true
                        let
                            valueExistsIndex = null
                        ;
                        //只配置标签范围内的内容
                        for(let len = scopeCodeMin;len<scopeCodeMax;len++){
                            let
                                scopeCodeOne = sourceIniArray[len]
                            ;
                            //多KEY时,需要连KEY带VALUE一起查找,否则无法确定是添加那个KEY
                            if(multiKey){
                                if(keyValueReg.multi.test( scopeCodeOne ) ){
                                    //查找到结果
                                    valueExistsIndex = {
                                        codeLen:len,
                                        scopeCodeOne
                                    };
                                }
                                //查找第一个出现的位置
                                if(keyValueReg.normal.test( scopeCodeOne ) ){
                                    if(insertLocationIndex === null){
                                        insertLocationIndex = len;
                                    }
                                }
                            }else{
                                // 优先查找已经开启的选项
                                // 如果有多个开启,则需要关闭多余的
                                if(keyValueReg.enabled.test( scopeCodeOne ) ){
                                    //统计打开的项,如果有多余则下方删除
                                    valueExistsCount.push(len);
                                    //查找到结果
                                    valueExistsIndex = {
                                        codeLen:len,
                                        scopeCodeOne
                                    };
                                }
                                // 如果配置已经有,则修改配置
                                // 后续的配置一律删除,只保留一条
                                if(keyValueReg.normal.test( scopeCodeOne ) && !valueExistsIndex ){
                                    //查找到结果
                                    valueExistsIndex = {
                                        codeLen:len,
                                        scopeCodeOne
                                    };
                                }
                            }
                        }


                        //查找到结果,直接替换当前行
                        if(valueExistsIndex !== null){
                            let
                                codeLen = valueExistsIndex.codeLen,
                                scopeCodeOne = valueExistsIndex.scopeCodeOne,
                                setIntKV = that.getSetIniKV(key,keyPrefix,value,assignmentSymbol,valueSymbol,changQuotePath,annotation,scopeCodeOne,keyValueReg),
                                newValue = (function (){
                                    //只要结果正确即可,不改变之前是否开启或关闭
                                    let
                                        result = null
                                    ;
                                    //且没有强制指定要开启
                                    if(valueDisabled || !status){
                                        //关闭状态
                                        result = annotationReg.test( scopeCodeOne ) ?  setIntKV.disabled :  setIntKV.enabled;
                                    }else {
                                        result = setIntKV.enabled;
                                    }
                                    if(valueTrim){
                                        result = that.o.tool.string.trim(newValue);
                                    }
                                    return result;
                                })()
                            ;
                            sourceIniArray[codeLen] = newValue;
                            //查找到值是做一个标识
                            //后面的创建文件夹时需要用到
                            isQueryValue = true;

                            //如果要关闭其他查找到的项
                            //从该数组遍历并关闭即可
                            valueExistsCount.splice(0,1);//删除第一个被查找到的值的标记
                            valueExistsCount.forEach((valueExistsLen)=>{
                                //sourceIniArray[codeLen] = "#"+sourceIniArray[codeLen];
                            });

                        }else if((!isQueryValue && !checkKey) || addValue || multiKey){
                            //没找到结果,但允许强制添加,如果是多KEY,则必须强制添加
                            // checkKey 检测是否有该值,
                            // 如果上面没有查找到,
                            // 又未申明了必须找到该值,则添加此值
                            let
                                newValue = `${keyPrefix}${key}${assignmentSymbol}${value}`
                            ;
                            if(!insertMultiKeyBefore || insertMultiKeyBefore === null){
                                insertLocationIndex = scopeCodeMax;
                            }
                            sourceIniArray.splice(insertLocationIndex, 0, newValue);
                        }else{
                            that.o.tool.console.info(`\t( ${showKey} ) : >>>>>> ${value} set success!`,4);
                        }
                        that.createSetIniValueDir(value,valueIsDirAndCreate,valueIsFileAndCreate,valueIsFileAndCreateDir,checkKey,isQueryValue);
                    }else{
                        that.o.tool.console.waring(`( ${showKey} ) : >>>>>> ${value} , Not find tag.`);
                    }
                    startSetINI(++len);
                }
            })(0);
        }
    }

    /**
     * @func 取得一个查询INI Key的函数
     * @param key
     * @param value
     * @param assignmentSymbol
     * @param annotationRegText
     * @param multiKey
     * @returns {RegExp}
     */
    getKeyReg(key,value,assignmentSymbol,annotationRegText,multiKey){
        let
            that = this,
            keyQueryText,
            keyRegText = that.o.tool.string.strToRegText(key),
            keyValueReg = null
        ;
        keyQueryText = key ? keyRegText : ``;
        keyValueReg = new RegExp(`^\\s*[${annotationRegText}]*\\s*${keyQueryText}.*$`,"ig");
        return keyValueReg;
    }

    /**
     *
     * @func 取得一个查询INI值的函数
     * @param key
     * @param assignmentSymbol
     * @param annotationRegText
     * @param multiKey
     * @param value
     * @returns {{normal: RegExp, multi: RegExp}}
     */
    getKeyValueReg(key,assignmentSymbol,annotationRegText,multiKey,value){

        let
            that = this,
            keyRegText = that.o.tool.string.strToRegText(key),
            valueRegText = that.o.tool.string.strToRegText(value),
            valueTexts = [],
            multiKeyRegArray = []
        ;

        //为防止空格赋值符被过滤，所以非空格时才TRIM处理
        if( !(/\s+/ig.test(assignmentSymbol))){
            assignmentSymbol = that.o.tool.string.trim(assignmentSymbol);
        }
        assignmentSymbol = that.o.tool.string.strToRegText(assignmentSymbol);
        if(keyRegText){
            valueTexts.push(keyRegText);
            multiKeyRegArray.push(keyRegText);
        }
        if(assignmentSymbol){
            valueTexts.push(assignmentSymbol);
            multiKeyRegArray.push(assignmentSymbol);
        }
        //如果是有多个KEY,查找时要连带值一起查找,否则无法分清是否设置那个KEY.
        if(valueRegText){
            multiKeyRegArray.push(valueRegText);
        }

        if(annotationRegText){
            annotationRegText = `[${annotationRegText}]*`;
        }

        let
            keyValueJoinText = `\\s*${valueTexts.join(`\\s*`)}.*`,
            multiKeyText = `\\s*${multiKeyRegArray.join(`\\s*`)}.*`,
            normalQReg = new RegExp(`^\\s*${annotationRegText}${keyValueJoinText}$`,"ig"),
            multiReg = new RegExp(`^\\s*${annotationRegText}${multiKeyText}$`,"ig"),
            enabledReg = new RegExp(`^${keyValueJoinText}$`,"ig")
        ;
        return {
            normal:normalQReg,
            enabled:enabledReg,
            multi:multiReg
        };
    }

    /**
     * @func  给出一个 key 和 value的组合 SetIni 的配合函数
     * @param key
     * @param value
     * @param assignmentSymbol 赋值符号
     * @param valueSymbol
     * @param changQuotePath 一只改变值的路径
     * @param keyPrefix
     * @param annotation 注释符号
     * @returns {string}
     * @constructor
     */
    getSetIniKV(key,keyPrefix,value,assignmentSymbol,valueSymbol,changQuotePath,annotation,queryValue=``){
        if(!valueSymbol)valueSymbol = ``;
        if(!assignmentSymbol)assignmentSymbol = ``;
        let
            that = this,
            KV = ``,
            valueX = value,
            assignmentSymbolTrim = that.o.tool.string.trim(assignmentSymbol)
        ;
        value = that.o.tool.string.trim(value,[],true);
        if(key){
            //如果有空格,或非数字开头
            if(/^[^\d]{1,}/.test(value) || /\s/.test(value)){
                valueX = `${valueSymbol}${value}${valueSymbol}`
            }
            //如果只改变路径
            if(changQuotePath && queryValue){
                let
                    queryValueMatch = null
                ;
                if(assignmentSymbol){
                    let
                        queryValueParse = queryValue.split(assignmentSymbolTrim)
                    ;
                    queryValueParse = that.o.tool.string.trim(queryValueParse);
                    queryValueMatch = queryValueParse[queryValueParse.length-1];
                }else{
                    queryValueMatch = valueX;
                }
                valueX = that.o.tool.file.queryPathJoin(value,queryValueMatch);
            }
            KV = `${keyPrefix}${key}${assignmentSymbol}${valueX}`;
        }else{
            //如果 key 不存在则是单值
            //如 skip-grant-tables
            KV = value;
        }
        // 值是否开启的状态符号
        let
            KVObject = {
                disabled:`${annotation[0]}${KV}`,
                enabled:KV
            };
        return KVObject;
    }

    /**
     * @func 对set获取默认值
     * @param opt
     * @param a
     * @param b
     * @returns {*}
     * @constructor
     */
    SetIniDefaultValue(opt,a,b=null){
        let
            that = this
        ;
        if(!that.option.SetIniPublic){
            that.option.SetIniPublic = {};
        }
        if(a in opt){
            return opt[a];
        }else if(a in that.option.SetIniPublic){
            return that.option.SetIniPublic[a];
        }else{
            return b;
        }
    }
    /**
     * @func 对值的文件夹创建
     * @param value
     * @param valueIsDirAndCreate
     * @param valueIsFileAndCreate
     * @param valueIsFileAndCreateDir
     */
    createSetIniValueDir(value,valueIsDirAndCreate,valueIsFileAndCreate,valueIsFileAndCreateDir,checkKey,isQueryValue){
        let
            that = this
        ;
        //不指定一定要有值,或指定必须有原值且已查到值
        if(!checkKey || (checkKey && isQueryValue)){
            value = that.o.tool.string.trim(value);
            // 值是一个目录并且创建
            if(valueIsDirAndCreate){
                that.o.tool.file.mkdirSync(value);
            }
            // 值是一个文件并且创建
            if(valueIsFileAndCreate){
                that.o.tool.file.touchSync(value);
            }
            // 值是一个文件并且创建上级目录
            if(valueIsFileAndCreateDir){
                that.o.tool.file.mkFileDirSync(value);
            }
        }
    }
    getSetIniTagAndKv(tag,EOL,key,keyPrefix,value,status,assignmentSymbol,valueSymbol,changQuotePath,annotation){
        if(tag)tag = `${tag}${EOL}`
        let
            that = this,
            KV = that.getSetIniKV(key,keyPrefix,value,assignmentSymbol,valueSymbol,changQuotePath,annotation),
            statusKV = status ? KV.enabled : KV.disabled,
            TagAndKv=`${tag}${statusKV}`
        ;
        return TagAndKv;
    }
    /**
     * @func 取得Conf配置文件内容
     * @param iniDir
     * @param exampleConf
     * @param confName
     * @returns {string}
     * @constructor
     */
    GetIniInTemplateAndBackupToTmplate(iniDir,exampleConf,confName){
        let
            that  = this
        ;
        if(!that.o.tool.func.exists(exampleConf)){
            exampleConf = [confName];
        }
        if(!confName){
            confName = that.o.node.path.parse(iniDir).base;
        }
        if(that.o.tool.file.isFileSync(iniDir)){
            iniDir = that.o.node.path.join(iniDir,`../`);
        }
        let
            configContent = ``,
            iniDirPathname = that.o.node.url.parse(iniDir).pathname,
            templateRoot = that.o.path.template,
            templateDir = that.o.node.path.join(templateRoot,iniDirPathname),
            confNameTemplatePath = that.o.node.path.join(templateDir,confName),
            allConfigs = exampleConf
        ;
        //合并主配置文件名和开发版文件名
        allConfigs.forEach( (confNameOne)=>{
            let
                confPathOne = that.o.node.path.join(iniDir,confNameOne),
                templateConfDir = that.o.node.path.join(templateDir,confNameOne)
            ;
            //如果模版文件没有,则要复制过去
            if( !that.o.tool.file.isFileSync(templateConfDir) ){
                //如果源配置存在,则要备份到模版
                if( that.o.tool.file.isFileSync(confPathOne) ){
                    let
                        iniContentOne = that.o.tool.file.readFileSync(confPathOne)
                    ;
                    that.o.tool.file.writeFileSync(templateConfDir,iniContentOne);
                }
            }
        });
        //如果默认配置不存在,则要从开发配置复制过来
        if( !that.o.tool.file.isFileSync(confNameTemplatePath) ){
            exampleConf.forEach((exampleConfOne)=>{
                let
                    exampleConfOnePath =that.o.node.path.join(templateDir,exampleConfOne)
                ;
                //第一个就被复制过来
                if( that.o.tool.file.isFileSync(exampleConfOnePath) ){
                    configContent = that.o.tool.file.readFileSync(exampleConfOnePath);
                    that.o.tool.file.writeFileSync(confNameTemplatePath,configContent);
                    return configContent;
                }
            });
        }else{
            configContent = that.o.tool.file.readFileSync(confNameTemplatePath);
        }
        return configContent;
    }
    /*
	@func 取得PHP当前的安装路径
    */
    phpCurrentApplicationDir(){
        let
            that  = this,
            phpInfo = that.o.func.install.getSoftInfo("php"),
            //通过环境变量直接取得
            current = that.o.node.path.join(phpInfo.applicationDir,phpInfo.environmentVariable.path)
        ;
        current = current.replace(/\\|\/$/ig,'/');
        return current;
    }

    /**
     * @func 安装 apache 的 Module
     * @param apacheDir APACHE的根路径
     * @param key 要设置的值
     * @param callback 回调
     * @param ConfigContent 配置文件的内容,可不传
     * @param status 开启或者关闭状态
     */
    installHttpdModule(apacheDir,key,callback,ConfigContent,status=true){
    	let
    	that = this,
    	installConfig = that.o.support.webserver.httpd.installModule[key]
    	;
        that.option.SetIniPublic= {
            path:apacheDir,
            confName:`conf/httpd.conf`,
            tag:``,
            assignmentSymbol:" ",
            filter:false,
            valueSymbol:null,
            multiKey:true,
            key:`LoadModule`,
        };
    	if(installConfig){
            //安装
            let
                simpleName = key.replace(/mod\_|\_module/ig,``),
                moduleValue = `${simpleName}_module modules/mod_${simpleName}.so`,
                setIniArray = []
            ;
            if(status){
                let
                    remoteUrls = installConfig.remoteUrls
                ;
                if(typeof remoteUrls == "string"){
                    remoteUrls = [remoteUrls];
                }
                //依次下载,如果下载成功则停止
                (function startDownModule(len){
                    if(len >= remoteUrls.length){
                        that.o.tool.console.error(`Download address failed : ${remoteUrls} ..`);
                        if(callback)callback();
                    } else {
                        let
                            remoteUrl = remoteUrls[len]
                        ;
                        that.o.tool.network.downFile({
                            url:remoteUrl
                        },(savepath)=>{
                            if(!savepath){
                                //下载不成功,重新下载
                                startDownModule(++len);
                            }else{
                                //下载成功,解压并编译
                                let
                                    opt = [
                                        "zip",
                                        "x",
                                        `file:"${savepath}"`
                                    ]
                                ;
                                //调用解压模块
                                that.o.tool.module.runModule(`command`,opt,(exFile)=>{
                                    if(exFile.target){
                                        let
                                            soFile = `${key}.so`,
                                            mod_fcgid = that.o.tool.file.queryFileSync(exFile.target,soFile),
                                            moduleDir = that.o.node.path.join(apacheDir,`modules/${soFile}`)
                                        ;
                                        setIniArray.push({
                                            value:moduleValue,
                                        });
                                        if(!that.o.tool.file.isFileSync(moduleDir)){
                                            //将文件复制过去
                                            that.o.node.fs.createReadStream(mod_fcgid).pipe(that.o.node.fs.createWriteStream(moduleDir)).on('close',(err)=>{
                                                that.SetIni(setIniArray,()=>{
                                                    if(callback)callback(true);
                                                },ConfigContent);
                                            });
                                        }else{
                                            that.SetIni(setIniArray,()=>{
                                                if(callback)callback(true);
                                            },ConfigContent);
                                        }
                                    }else{
                                        that.o.tool.console.error(`Unzip failed: ${exFile} ..`);
                                        if(callback)callback();
                                    }
                                });
                            }
                        });
                    }
                })(0);
            }else{
                that.o.tool.console.error(`Disabled: ${key}`);
                setIniArray.push({
                    status,
                    value:moduleValue,
                });
                if(callback)callback();
            }
    	}else{
    		that.o.tool.console.error(`Not find LoadModule ${key} in support ..`);
    		if(callback)callback();
    	}
    }
}

module.exports = configC;