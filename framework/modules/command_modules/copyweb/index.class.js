
/**
 * @explain 为了不过多占用资源,将使用临时文件作为缓存.
 */
class index {
    constructor(common) {

        common.get_node('http');
        common.get_node('https');
        common.get_node('fs');
        //cheerio 教程 https://cnodejs.org/topic/5203a71844e76d216a727d2e
        common.get_node('cheerio');
        common.get_node('request');
        common.get_node('path');
        common.get_node('url');

        common.get_core('func');

        common.get_core('file');
        common.get_core('network');

        common.get_config();

    }

    run(callback) {

        let
        that = this,
        firstSavaPath = ''//首页的保存位置
        ;

        //需要下载的URL
        that.option.copyWebBaseDownloadUrl = that.common.params.get('url');
        //当前需要启动的线程数
        that.option.thread = that.common.params.get('thread',1);
        //正在下载线程数
        that.option.currentDownloadThread = 0;
        //单个文件请求超时时间
        that.option.timeout = that.common.params.get('timeout',30);
        //是否将base64转为图片,默认不转
        that.option.base64ToPng = that.common.params.get('base64',false);
        //下载层级
        that.option.level = that.common.params.get('level',3);
        //默认编码,不管指定什么编码,都会自动查找修正
        that.option.charset = that.common.params.get('charset',"utf8");


        //用来存放线程下载临时队列数据
        that.option.threadDownloadUrlArr = new Set();

        /*
        1.启动线程循环,从下载列表中读取下载列表
        2.每次最多读到线程上指定的数据
        3.new一个下载器
        4.下载并全部处理完后,检查下载列表中是否还有队例,如果没有队列了,则代表全部下载完.因为下载队例是在文件处理过程中添加的
        5.如果还有队列,将继续启动下载器.
        */
        //取得最基本的的保存地址,之后各文件的保存地址都要和此地址相连接
        that.option.copyWebBasicSavePath = that.common.params.get('save',null,true);

        if(!that.option.copyWebBasicSavePath || !that.common.core.file.isDirSync(that.option.copyWebBasicSavePath) ){
            let
            devRoot = that.common.config.devEnv.root
            ;
            that.option.copyWebBasicSavePath = that.common.node.path.join(devRoot,that.conf.extend.save);
        }

        //url的基地址
        that.option.basicURL = that.common.core.network.formatUrl(that.option.copyWebBaseDownloadUrl );
        //域名协议
        that.option.protocol = that.common.node.url.parse(that.option.basicURL).protocol;
        //本次下载的基本保存地址
        firstSavaPath = that.common.core.network.URLGetLocalSaveAddress(that.option.copyWebBaseDownloadUrl ,that.option.copyWebBasicSavePath,true,false);
        that.option.basicSavePath = that.common.node.path.parse(firstSavaPath).dir;

        //将URL添加到下载队列
        that.option.DownloadQueueURL = new Set();
        that.option.DownloadQueueURL.add({
            mergeUrl : that.option.basicURL,//下载地址
            savePath : firstSavaPath,
            isStaticSource : false//不是静态资源
        });
        //待下载域名列表的迭代器
        that.option.DownloadQueueURLIterator = that.option.DownloadQueueURL[Symbol.iterator]();

        that.threadController();

        //that.StartDownloadThisUrlSet();
    }

    //线程控制器
    threadController(){
        let
        that = this
        ;

        //根据线程从总队列里取得对应的下载数据
        while( that.option.currentDownloadThread <= that.option.thread ){
            //正在下载数+1
            that.option.currentDownloadThread++;
            let
            currentDowloadUrlIterator = that.option.DownloadQueueURLIterator.next()
            ;
            if(!currentDowloadUrlIterator.done){
                //取得的数据打包进入下载
                that.StartDownloadThisUrlSet(currentDowloadUrlIterator.value);
            }else{
                break;
            }
        }
    }

    //下载分离器,HTML和CSS图片各走不同方法
    StartDownloadThisUrlSet(currentDowloadUrlObject){
        /*
        mergeUrl : 处理过的下载地址
        savePath : 本次保存的目录
        isStaticSource: 该URL是否是静态资源,静态资源将直接进 request 方式下载
        */

        let
        that = this
        ;
        //非静态资源
        if(!currentDowloadUrlObject.isStaticSource){
            that.common.core.network.HTMLGet({
                url:currentDowloadUrlObject.mergeUrl,
                timeout:that.option.timeout

            },(HTMLdata)=>{
                //HTML需要分析CSS和JS和背景图片
                that.HTMLQueryCssJsImg(HTMLdata,currentDowloadUrlObject);
            });
        }else{

        }
    }


    /*
    * @tools 保存网页资源
    * */
    HTMLQueryCssJsImg(HTMLdata,currentDowloadUrlObject) {

        let
        that = this,
        $cheerio,
        currentDowloadUrl = currentDowloadUrlObject.mergeUrl,//当前下载路径
        currentSavePath = currentDowloadUrlObject.savePath,//当前下载保存目录 
        currentSaveDir = that.common.node.path.parse(currentSavePath).dir,
        currentIsStaticSource = currentDowloadUrlObject.isStaticSource,//当前是否静态资源
        sourceList = that.conf.extend.queryHTMLTag,
        //HTML内部需要分析的标签,或文件
        htmlAnalysis = that.conf.extend.htmlAnalysis,
        charsetQuery = HTMLdata.match(/(?<=\<meta.+?charset).+?(?=\>)/ig)
        ;

        ;
        if(charsetQuery){
            that.option.charset = charsetQuery[0].replace(/[^a-zA-Z\-]/ig,``);
        }

        sourceList.forEach(function (HTMLtags) {
            for(let HTMLTagName in HTMLtags){
                let
                HTMLtag = HTMLtags[HTMLTagName]
                ;
                //如果有删除项
                if("deletes" in HTMLtag){
                    let 
                    needDeleteDocumentElement = HTMLtag["deletes"]
                    ;
                    needDeleteDocumentElement.forEach((needDeleteArry) =>{
                        for(let needDeleteEleTag in needDeleteArry){

                            let
                            deleteOneArray = needDeleteArry[needDeleteEleTag]
                            ;

                            deleteOneArray.forEach( (deleteOne) =>{
                                let
                                queryTagText  = `\\<\\s*${HTMLTagName}.+?${needDeleteEleTag}\\s*\\=\\s*[\\'\\"]{1}.*${that.common.core.string.strToRegText(deleteOne)}.*[\\'\\"]{1}.+?\\>`,
                                queryTagReg = new RegExp(queryTagText,"ig"),
                                needDeleteTagContents = HTMLdata.match(queryTagReg)
                                ;
                                if(needDeleteTagContents){
                                    needDeleteTagContents.forEach((c)=>{
                                        //删除不要的项
                                        HTMLdata = HTMLdata.replace(c,``);
                                    })
                                }
                            })
                        }
                    })
                }
            }        
        });

        //先在前面替换好要替换的数据后,再使用 cheerio 加载
        $cheerio = that.common.node.cheerio.load(HTMLdata);
        //cheerio加载的目的是方便读取一些属性,但是对于HTML的替换没有效果


        sourceList.forEach(function (HTMLtags) {
            for(let HTMLTagName in HTMLtags){
                let
                HTMLtag = HTMLtags[HTMLTagName],
                HTMLTagNameEles = $cheerio(HTMLTagName),
                //是否是静态资源
                isStaticSource = HTMLtag.isStaticSource,
                checkDownloadLevel = HTMLtag.checkDownloadLevel
                ;
                for(let index=0;index<HTMLTagNameEles.length;index++){
                    let
                    item = HTMLTagNameEles[index]
                    ;
                    //被查找到的标签的值.
                    HTMLtag.attrs.forEach( (attr)=>{
                        let
                        queryAttr = $cheerio(item).attr(attr)
                        ;

                        if(queryAttr){
                            //排除非需要过滤的值 
                            if("ignores" in HTMLtag){
                                let 
                                needIgnoresValue = HTMLtag["ignores"]
                                ;
                                needIgnoresValue.forEach((needIgnoreArry) =>{
                                    for(let needIgnoreEleTag in needIgnoreArry){
                                        let
                                        ignoreOneArray = needIgnoreArry[needIgnoreEleTag]
                                        ;
                                        ignoreOneArray.forEach( (ignoreOne) =>{
                                            //满足条件时排除该值 
                                            if(ignoreOne.test(queryAttr)){
                                                HTMLTagNameEles.splice(index,1);
                                                index--;
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    });
                }      

                /*
                @已经被过滤和排除一些不必要的元素
                */
                HTMLTagNameEles.each( (index,item) =>{
                    //被查找到的标签的值.
                    HTMLtag.attrs.forEach( (attr)=>{

                        let
                        queryAttr = $cheerio(item).attr(attr)
                        ;
                        if(queryAttr){
                            //将查找到的URL与基本URL合并,以便于继续下载网页其他元素,同时为替换准备数据
                            //URL合并级别,1,只合并没有hostname的相对地址,2 在1的基础上增加合同同域名地址 3,在2的基础上增加合并站外地址
                            let 
                            fieldsWithDomainGetObject = that.fieldsWithDomainGetAddresses({
                                queryField : queryAttr,
                                currentDowloadUrl,
                                currentSaveDir,
                                isStaticSource,
                                checkDownloadLevel,
                                tagName:HTMLTagName,
                                replaceSourceHTml:HTMLdata
                            })
                            ;
                            HTMLdata = fieldsWithDomainGetObject.replaceSourceHTml;
                        }   
                    });
                })
            }
        })


        //对网页里的指定元素进行内容处理,或提取
        let
        needAnalysisTag = htmlAnalysis.tag
        ;

        needAnalysisTag.forEach( ( oneAnalysisTag,i) =>{
            $cheerio(oneAnalysisTag).each((k,queryTagContent)=>{
                queryTagContent = $cheerio.html(queryTagContent);
                if(that[`${oneAnalysisTag}Analysis`]){
                    //进入标签处理函数
                    //CSS JS STYLE等
                    //传入需要处理的内容以及下载对象
                    HTMLdata = that[`${oneAnalysisTag}Analysis`](queryTagContent,currentDowloadUrlObject,HTMLdata);
                }
            })
        })

        //全部处理完毕后
        //保存文件
        //同时减去一个线程计数
        //并同时启动一个新的下载分离器
        that.common.core.file.writeFile(currentSavePath,HTMLdata,that.option.charset);

    }

    /*
    @func CSS文件进行处理,查找其中的图片等资源
    @params 参数1,需要传入的要处理的内容,参数2.在处理时做一些本地化替换,替换最初的源内容,并返回,3下载对象. 
    */
    styleAnalysis(styleContent,currentDowloadUrlObject,replaceSourceHTml){

        let 
        that = this,
        currentDowloadUrl = currentDowloadUrlObject.mergeUrl,//当前下载路径
        currentSavePath = currentDowloadUrlObject.savePath,//当前下载保存目录 
        currentSaveDir = that.common.node.path.parse(currentSavePath).dir,
        currentIsStaticSource = currentDowloadUrlObject.isStaticSource,//当前是否静态资源
        queryGetAllImages = styleContent.match(/(?<=url\s*\().+?(?=\))/ig)
        ;

        if(!replaceSourceHTml)replaceSourceHTml = styleContent;

        if (queryGetAllImages) {
            queryGetAllImages.forEach((queryAttr,i)=>{
                let
                fieldsWithDomainGetObject = that.fieldsWithDomainGetAddresses({
                    queryField : queryAttr,
                    currentDowloadUrl,
                    currentSaveDir,
                    isStaticSource : true,
                    replaceSourceHTml
                })
                ;
                replaceSourceHTml = fieldsWithDomainGetObject.replaceSourceHTml;

            })
        }

        return replaceSourceHTml;
    }




    //对资源类型文件进行请求并保存.
    save_source(src_save_path, http_src) {
        let 
        that = this
        ;
        let img_save_path_parse = path.parse(src_save_path);
        console.log(img_save_path_parse)
        that.common.core.file.mkdirSync(img_save_path_parse.dir);
        request.head(http_src, function (err, res, body) {
            if (err) {
                console.log(err);
            }
        });
        request(http_src).pipe(fs.createWriteStream(src_save_path));
    }


    /*
    @func 根据字段及域名处理
    @1. 合成远程地址
    @2. 合成本地地址
    @3. 替换源代码
    @4. 处理base64编码
    */
    fieldsWithDomainGetAddresses(option){
        let
        that = this,
        {
            queryField,
            currentDowloadUrl,
            currentSaveDir,
            replaceSourceHTml,
            isStaticSource,
            tagName,
            checkDownloadLevel//检查下载层级
        } = option;

        let
        privateQueryField = that.common.core.string.trim(queryField),
        //将原代码本地化后的代码
        transformCode = privateQueryField,
        //绝对路径地址 //开头
        absoluteUrlA = /^\/\//i.test(privateQueryField),
        //绝对路径地址 http开头
        absoluteUrlB = /^http/i.test(privateQueryField),
        //base64类型 
        isDataBase64 = /^data\:image/i.test(privateQueryField),
        //如果是相对路径
        isRelativeUrl = !/^\.{1,}\//i.test(privateQueryField),
        mergeUrlObject,
        mergeUrl,
        isSuper = false,
        sourceUrlDownloadSavaPath,
        isHomologousDomain = true,
        pageLevelNotOverflow = true,
        testCondition = privateQueryField.includes(`img/google_custom_search_watermark.gif`)
        ;

        //如果不是base64类型,都要下载
        if( !isDataBase64 ){


            mergeUrlObject = that.common.core.network.formatUrlAndGetIsSuper(privateQueryField,currentDowloadUrl);
            mergeUrl = mergeUrlObject.downloadUrl;
            isSuper = mergeUrlObject.isSuper;
            sourceUrlDownloadSavaPath = that.common.core.network.URLGetLocalSaveAddress(mergeUrl,null,true);


            if(testCondition){
                //console.log(queryField,mergeUrl,mergeUrlObject)
            }

            let
            mergeUrlParse = that.common.node.url.parse( mergeUrl ),
            basicUrlParse = that.common.node.url.parse( that.option.basicURL )
            ;

            if(mergeUrlParse.hostname != basicUrlParse.hostname){
                isHomologousDomain = false;
            }

            //将替换代码修改为路径 
            transformCode = that.common.node.url.parse(mergeUrl).pathname;

            //如果是顶级目录,则和根路径连接
            if(isSuper){
                transformCode = "/"+sourceUrlDownloadSavaPath.replace(/^\//,``);
                sourceUrlDownloadSavaPath = that.common.node.path.join( that.option.basicSavePath ,sourceUrlDownloadSavaPath);
            }else{
                if(!isRelativeUrl){

                    let
                    pathParentSymbol = privateQueryField.replace(/\w.+$/,``),
                    //检查是否达到顶层
                    isPathTop = that.common.node.path.join(currentSaveDir,pathParentSymbol).length < currentSaveDir.length
                    ;
                    //达到顶级时 ../ 不能再作合成.因此最高只能以顶级域名为根目录
                    if(isPathTop){
                        privateQueryField = privateQueryField.replace(/^[\.\/\\]+/,``);
                    }
                    sourceUrlDownloadSavaPath = that.common.node.path.join(currentSaveDir,privateQueryField.replace(/\?.+$/,``));
                    //如果是..开头的相对路径则不用替换
                    transformCode = privateQueryField;
                } else {
                    transformCode = transformCode.replace(/^\/+/,``);
                    sourceUrlDownloadSavaPath = that.common.node.path.join(currentSaveDir,sourceUrlDownloadSavaPath);
                }
            }

            //同源域名或者静态资源强制下载
            //根据系统默认层级来做限制 
            //that.option.level
            if(checkDownloadLevel){
                let 
                level = that.option.level+1,
                checkUrlLevel = mergeUrl
                ;

                while(level >= 0){
                    level -- ;
                    checkUrlLevel = that.common.node.path.join(checkUrlLevel,"../");
                }
                //超出层级
                pageLevelNotOverflow = /[\.\\\/]+$/.test(that.common.node.path.parse(checkUrlLevel).base);
            }

            if( (isStaticSource || isHomologousDomain) && pageLevelNotOverflow /*超出层级则不添加*/){

                console.log(`\n`);
                console.log(`NewDownload\t url\t:\t${mergeUrl}`);
                console.log(`\t\t save\t:\t${sourceUrlDownloadSavaPath}`);

                that.option.DownloadQueueURL.add({
                    mergeUrl : mergeUrl,//下载地址
                    savePath : sourceUrlDownloadSavaPath,
                    isStaticSource : true//不是静态资源
                });
            }

        }else{
            //如果是base64,系统开启前提下,需要转成图片
            if( that.option.base64ToPng  ){

                let
                base64 = privateQueryField.replace(/^data:image\/\w+;base64,/, ""),
                imageFileName = that.common.core.encrypt.md5(base64)+".png",
                base64Buffer = Buffer.alloc(base64.length,base64, 'base64')
                ;

                sourceUrlDownloadSavaPath = that.common.node.path.join(currentSaveDir,imageFileName);
                transformCode = `${imageFileName}`;

                if(Buffer.isBuffer(base64Buffer)){
                    that.common.core.file.writeFile(sourceUrlDownloadSavaPath,base64Buffer)
               }
            }
        }
/*                console.log(`currentDowloadUrl\t\t`,currentDowloadUrl);
        console.log(`imageBackgorundUrl\t\t`,imageBackgorundUrl);
        console.log(`mergeUrl\t\t\t`,mergeUrl);
        console.log(`isSuper\t\t\t\t`,isSuper);
        console.log(`transformCode\t\t\t`,transformCode);
        console.log(`sourceUrlDownloadSavaPath\t`,sourceUrlDownloadSavaPath);*/

        replaceSourceHTml = replaceSourceHTml.replace(queryField,transformCode);

        return {
            queryField,//原来被查找到的字符串
            isSuper,//是否是顶级目录 
            isHomologousDomain,//是同源域名
            absoluteUrlA,// `//`开头的绝对地址
            absoluteUrlB,// `http`开头的绝对地址
            isDataBase64,// 是一个base64文件
            isRelativeUrl,//是一个相对路径
            sourceUrlDownloadSavaPath,//根据远程路径计算出的本地路径
            replaceSourceHTml//被处理的源文档
        }
    }
}

//http://demo.cssmoban.com/cssthemes4/bkt_8_Victoria/index.html


module.exports = index;