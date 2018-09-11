class networkC{


    constructor(common){
        common.get_support('file');

        common.get_node('path');
        common.get_node('url');
        common.get_node('request');
        common.get_node('progress-stream');
        /*
        common.get_node('https');
        common.get_node('http');
        */
        common.get_core('encrypt');
        common.get_core('array');
        common.get_core('file');

        common.get_config();
    }


    /**
     * @func 请求一个网页,自动按http 或 https请求
     */
    HTMLGet(option, fn) {
        let
        that = this,
        encoding = option.encoding?option.encoding:"utf-8",
        protocol = that.common.node.url.parse(option.url).protocol.replace(/\:/ig,``),
        getFn,
        request_timer,
        req
        ;

        require('request')({url:option.url,gzip:true}, function (err,response,body) {
            if (fn) fn(body);
        });
    }


    /**
     * @func 根据URL获取一个本地保存地址
     @param [urlAddress,{staticSource:是否是静态文件地址}]
     */

    URLGetLocalSaveAddress(downloadUrl,basicSavePath,mkdir=false,returnDir=false){

        downloadUrl = this.common.core.string.trim(downloadUrl,[`/`,`\\`]);
        downloadUrl = this.formatUrl(downloadUrl);
        downloadUrl = downloadUrl.replace(/\?.+$/,``);

        let
        that = this,
        basicURL = that.getUrlRoot(downloadUrl),
        basicURLPaser = that.common.node.url.parse(basicURL),
        downloadUrlParse =  that.common.node.url.parse(downloadUrl),
        urlPathName = downloadUrlParse.pathname.replace(/^\//,``)
        ;

        //没有基本路径时,将下载地址作为一个路径返回
        if(!basicSavePath){
            //console.log(basicURLPaser.hostname+`/`+urlPathName.replace(/^\//,``),112313)
            let
            childrenPath = basicURLPaser.hostname+`/`+urlPathName.replace(/^\//,``)
            ;
            childrenPath = childrenPath.replace(/\?.+$/,``);
            return childrenPath;
        }

        if(!urlPathName)urlPathName="index.html";

        let
        savePath = that.common.node.path.join(basicSavePath, basicURLPaser.hostname),
        dir = ``
        ;

        savePath = that.common.node.path.join(savePath, urlPathName);
        dir = that.common.node.path.parse(savePath).dir;

        if(mkdir){
            that.common.core.file.mkdirSync(dir);
        }else if(returnDir){
            return dir;
        }
        return savePath;
    }

    /*
    @func 取得URL地址的根部份
    */
    getUrlRoot(downloadUrl){
        return this.formatUrl(downloadUrl,null,true);
    }


    /**
     * @func 格式化url 并取得该URL是否是根目录
     * @param web_url
     */
    formatUrlAndGetIsSuper(downloadUrl,basicURL=null){

        let
        that = this
        ;

        return that.formatUrl(downloadUrl,basicURL,false,true);
    }

    /**
     * @func 连接一个URL地址
     */
     urlJoin(currentSaveDir,privateQueryField){
        let
        that = this,
        pathParentSymbol = privateQueryField.replace(/\w.+$/,``),
        //检查是否达到顶层
        isPathTop = that.common.node.path.join(currentSaveDir,pathParentSymbol).length < currentSaveDir.length
        ;
        //达到顶级时 ../ 不能再作合成.因此最高只能以顶级域名为根目录
        if(isPathTop){
            privateQueryField = privateQueryField.replace(/^[\.\/\\]+/,``);
        }
        let
        sourceUrlDownloadSavaPath = that.common.node.path.join(currentSaveDir,privateQueryField.replace(/\?.+$/,``))
        ;

        return sourceUrlDownloadSavaPath;
     }

    /**
     * @func 格式化url首当其冲取得基础路径.
     * @param web_url
     */
    formatUrl(downloadUrl,basicURL=null,getUrlRoot=false,getSuper=false/*判断是否是根目录*/) {


        if(basicURL) {
            basicURL =this.formatUrl(basicURL,null,false);
        }

        downloadUrl = this.common.core.string.trim(downloadUrl);

        let
        that = this,
        benchmarkUrl = basicURL?basicURL:downloadUrl,//基准URL
        //处理一下没有带http开头的URL.此类URL一律当作http处理.
        benchmarkUrlParse = that.common.node.url.parse(benchmarkUrl),
        benchmarkPathParse = that.common.node.path.parse(benchmarkUrl),
        benchmarkPathParseDir = (benchmarkUrlParse.pathname.length > 1 ) ? benchmarkPathParse.dir : benchmarkUrlParse.href,
        protocol = benchmarkUrlParse.protocol ? benchmarkUrlParse.protocol : "http:",
        isSuper = true
        ;

        //处理 `//`开头的URL 直接转为 http开头的URL地址
        if (downloadUrl.match(/^\/{2,}/i)) {
            downloadUrl = downloadUrl.replace(/^\/+/,   `${protocol}//` );
        }
        
        let
        isDownloadUrlUrlParse = that.common.node.url.parse(downloadUrl)
        ;

        //如果默认URL没有协议
        //则以基准的协议为准
        if(!isDownloadUrlUrlParse.protocol){
            //有基本URL,则需要根据原URL是顶级还是相对来处理
            if(basicURL){
                let 
                primaryUrl = ""
                ;
                //如果是 `/` 开头,则需要连接基准URL的根路径
                if(downloadUrl.match(/^\/{1}/i) ){
                    //console.log(`absolute`)
                    downloadUrl = downloadUrl.replace(/^\//,``);
                    primaryUrl = that.formatUrl(basicURL,null,true).replace(/\/+$/,``);
                    downloadUrl = primaryUrl + "/" + downloadUrl;
                //如果是./ 或者../开头
                }else if(downloadUrl.match(/^\.{1,}\//i) ){
                    isSuper = false;//该URL不是指向根目录
                    downloadUrl = that.urlJoin(benchmarkPathParseDir,isDownloadUrlUrlParse.pathname);
                    downloadUrl = downloadUrl.replace(/\:[\/\\]{1}/,`://`);

                //如果无任何开头,则需要连接基准URL的全路径
                }else if(downloadUrl.match(/^[^\/]/i) ){
                    isSuper = false;//该URL不是指向根目录
                    primaryUrl = (benchmarkPathParse.dir.includes(benchmarkUrlParse.hostname) ) ? benchmarkPathParseDir : benchmarkUrlParse.href;
                    primaryUrl = primaryUrl.replace(/\/+$/,``);
                    downloadUrl = primaryUrl + "/" + downloadUrl;

                }
            //如果没有基本URL,则拼接原本的URL即可
            }else{
                downloadUrl = protocol + "//" + downloadUrl;
            }
        }

        downloadUrl = downloadUrl.replace(/\\/ig,`/`);
        //只获取根地址
        if(getUrlRoot){
            return protocol + "//" + benchmarkUrlParse.hostname;
        }

        if(getSuper){
            return {
                isSuper,
                downloadUrl
            }
        }
        return downloadUrl;
    }


    /*
    @func 判断该URL是否是一个静态资源,依赖于 support 里的文件扩展名对比
    */

    isStaticSourceUrl(url){
        let
        that = this,
        fileExts = [],
        ext = that.common.node.path.parse(url).ext.replace(/\./,'')
        ;
        for(let p in that.common.support.file){
            let 
            tmp = that.common.support.file[p]
            ;
            if('extend' in tmp){
                fileExts = fileExts.concat(tmp.extend)
            }
        }
        fileExts = that.common.core.array.unique(fileExts);
        if(fileExts.find(  n => n.replace(/\./,'') == ext)) return true;
        return false;
    }


    /*
    @func 下载一个文件
    */
    downFile(option,fn=null){
        let 
            that = this,
            dowUrl = option["url"],
            savePath = option["save"],
            force = option["force"],
            fileName = that.common.node.path.parse(dowUrl).base,
            downUrlParse = that.common.node.url.parse(dowUrl),
            saveDir = that.common.node.url.parse(dowUrl).path,
            savePathDir = ""
        ;
        //如果没有指定存放地址,则下载将被存放到临时文件中
        if(!savePath){
            savePath = that.common.node.path.join(that.common.config.platform.base.workDir.application,".dowm")
        }
        
        if(!saveDir){
            saveDir = that.common.node.url.parse(dowUrl).pathname;
        }

        savePath = that.common.node.path.join(savePath,saveDir);
        //得到保存地址的父目录,以便于创建
        savePathDir = that.common.node.path.parse(savePath).dir;

        if(!that.common.core.file.isFileSync(savePath) || force == true){

            //创建保存目录
            that.common.core.file.mkdirSync(savePathDir);

            //创建文件流
            let stream = that.common.node.fs.createWriteStream(savePath);

            let options = {
                url:dowUrl,  
                encoding:null//当请求的是二进制文件时，一定要设置  
            }  
            that.common.node.request.get(options).on('response',function (response){//显示进度条  
                let proStream = that.common.node['progress-stream']({  
                    length: response.headers['content-length'],  
                    time: 500 /* ms */  
                });  
                  
                proStream.on('progress', function(progress) {
                    let percentage = Math.round(progress.percentage)  
                    console.log(`down[${fileName}]: ${showProgress(progress)} `);
                });  
                that.common.node.request.get(options).pipe(proStream).pipe(stream).on("close", function (err) {
                    if(fn)fn(savePath);
                });//先pipe到proStream再pipe到文件的写入流中  
            })

        }else{
            console.log(`done! file exists: ${savePath} , force down require params force in true!`);
            if(fn)fn(savePath);
        }

        /*
        @func 显示进度条
        */
        function showProgress(p){
            let percentage = Math.round(p.percentage),
            pInt = parseInt(percentage/10)+1,
            speed = parseInt(p.speed/1000),
            s = "-",
            str=""
            ;

            for(let i=0;i<pInt;i++){
                str+=s;
            }
            return `${str}  ${percentage}%  ${speed}kb/s`;
        }
    } 
}


module.exports = networkC;