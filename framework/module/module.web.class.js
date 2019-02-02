
class C{
	constructor(load){

	}

	start(){
        let
            that = this
        ;

        that.bind();
    }

	bind(callback=null){
		let
		    that = this
		;
		//初始化
        that.init().init();
        //绑定 数据保存
        that.load.eles.saveData.click((e)=>{
            e.stopPropagation();
            if(!that.load.option.saveDataClick) {
                that.load.option.saveDataClick = true;
                let
                    fileName = `f_`+that.load.module.tools.urlToFileName(that.load.option.currentSupportURL)
                ;
                that.load.module.csv.save((csvPath)=>{
                    that.load.option.saveDataClick = false;
                    that.load.module.console.success(`数据成功保存到  ${csvPath} , 使用 Excel 软件打开.`,false);
                });
            }
		});

        //绑定 检查软件更新
        that.load.eles.checkUpdate.click((e)=>{
            e.stopPropagation();
            if(!that.load.option.checkUpdateClick) {
                that.load.option.checkUpdateClick = true;
                that.load.module.soft.checkUpdate((o)=>{
                    if(o){
                        that.load.eles.softupdateInfo.html(`新版本升级! v${version}`);
                        that.load.module.console.success(`当前发现有新的更新, 请点右上方升级! 最新版本号 ${version} !`);
                        that.load.eles.checkUpdate.parent().hide();
                        that.load.eles.version_li.show();
                        that.load.eles.version_li.find("a").attr('data-electron-args',files.join(`,`));
                    }else{
                        that.load.module.console.success(`当前版本号已经最新! `);
                    }
                    that.load.option.checkUpdateClick = false;
                });
            }
        });

        //绑定 展开支持的网站
        that.load.eles.showSupportWebs.click((e)=>{
            e.stopPropagation();
            that.showSupportWebs();
        });

        //绑定 展开支持的网站
        that.load.eles.supportWeb.click((e)=>{
            e.stopPropagation();
            that.showSupportWebs();
        });


        //绑定 进入网站
        that.load.eles.getWeb.click((e)=>{
            e.stopPropagation();
            if(!that.load.option.getWebClick) {
                that.load.option.getWebClick = true;
                that.getCurrentSupportWEB(()=>{
                    that.load.option.getWebClick = false;
                });
            }
        });

        //绑定 支持网站改变
        that.load.eles.selectSupportWeb.find("a").each((index,element)=>{
            that.load.eles.$(element).click((e)=>{
                e.stopPropagation();
                if(!that.load.option.selectSupportWebClick) {
                    that.load.option.selectSupportWebClick = true;
                    that.changeSupportWeb(element,()=>{
                        that.load.option.selectSupportWebClick = false;
                    });
                }
            });
        });

        //绑定 停止读取
        that.load.eles.stopReadData.click((e)=>{
            e.stopPropagation();
            let
                that = this
            ;
            if(!that.load.option.stopReadDataClick){
                that.load.option.stopReadDataClick = true;
                that.stopReadDataIn();
                that.load.option.stopReadDataClick = false;//允许再次 使用
            }
        });

        //绑定 数据类型改变
		that.load.eles.selectReadData.change((e)=>{
            e.stopPropagation();
            that.changeReadDataURL();
		});

        //绑定 读取数据
        that.load.eles.readData.click((e)=>{
            e.stopPropagation();
            let
                that = this
            ;
            that.debug((debug)=>{
                if(!debug){
                    if(!that.load.option.readDataClick){
                        that.load.option.readDataClick = true;
                        //提取支持函数
                        if(that.isSupportThisWeb()){// 判断该网站是否被支持
                            //判断是否登陆
                            that.isLogin((login)=>{
                                //that.loadScriptSrc(`"http://www.ddweb.com.cn/service/software/test.js"`);//载入一个外部JS文件
                                if(login){
                                    that.load.option.web = {
                                        currentExecuteDataFunction :  that.load.module.data.start(that.load.option.currentWebName)
                                    };
                                    that.load.option.web.currentExecuteDataFunction.init();//初始化数据处理
                                    that.load.option.currentReadDataBeforeFunction((callback)=>{
                                        that.get_web_data_main(()=>{
                                            that.updateToRemoteDatabase(callback);
                                        });
                                    });
                                }else{
                                    that.load.option.readDataClick = false;//允许再次抓取.
                                }
                            });
                        }else{
                            //功能不支持时 允许再次抓取.
                            that.load.option.readDataClick = false;
                        }
                    }
                }
            });
        });
	}

	//数据上传到远程数据库
    updateToRemoteDatabase(){
        let
            that = this,
            isDebug = false
        ;
    }

	//调试函数 , 绑定于读取网站按钮上, 返回零点则继续, 假则不再执行
    debug(callback){
	    let
            that = this,
            isDebug = false
        ;
	    if(!isDebug){
            callback(isDebug);
        }else{
            that.load.module.console.alert(`处在调试模式下, 不运行程序!  必须先关闭 DEBUG.`);
        }
    }

    //抓取数据的主函数
	get_web_data_main(callback){
        let
            that =this
        ;
        that.dataSourceReplaceURLAndCheck(()=>{
            let
                URLs = that.createReadUrlsInPostOrGet(),
                URLsLent = URLs.length
            ;
            that.load.option.getDataCount = 0;
            that.load.option.getDataCurrentCount = 0;
            that.load.option.getDataToDayCount = 0;
            that.load.option.allowGetAjax = true;//允许AJAX请求
            that.readyIsLoginUp(()=>{
                (function getURLs(len){
                    if(len >= URLs.length || !that.load.option.allowGetAjax){
                        that.load.module.status.readEnd(true);//结束并不清除csv
                        if(callback)callback();
                        console.log(`urls request finish!.`)
                    }else{
                        let
                            url = URLs[len]
                        ;
                        that.setReadDataAlterTimeOut(URLsLent,len+1);//设置读取进度提示
                        that.Ajax(url,(currentDataJson)=>{
                            that.setReadDataAlterTimeOut(null,null,true);//清除读取进度提示
                            that.load.option.readDataClick = false;//允许再次抓取.
                            if(currentDataJson !== null){
                                let
                                    dataParse = that.load.option.web.currentExecuteDataFunction.exec(currentDataJson) //使用支持函数处理数据
                                ;
                                //如果该组没有数据,则跳过下个数据
                                if(dataParse.nextSkip){
                                    console.log(`跳过 -> ${len+1} - ${dataParse.nextSkip}`);
                                    len+=dataParse.nextSkip;
                                    console.log(`跳过 -> ${len} - ${dataParse.nextSkip}`);
                                }
                                that.load.option.getDataCount = that.load.option.getDataCurrentCount; //总数据 条数
                                that.load.option.getDataCount += dataParse.count; //总数据 条数
                                that.load.option.getDataCurrentCount += dataParse.source.length;//已经获取 条数
                                that.load.option.getDataToDayCount += dataParse.toDayCount;//今日新增 条数
                                that.load.module.console.success(`阶段 ${len+1}/${URLsLent} 成功 . 获取到 ${dataParse.source.length} 条 / 已经获取 ${that.load.option.getDataCurrentCount} 条 , 今日新增 ${that.load.option.getDataToDayCount} 条 .`);
                                that.setAlreadyGetDataInfo();
                                getURLs(++len);
                            }else{
                                that.load.module.console.error(`阶段 ${len+1}/${URLsLent} 数据抓取失败 . 已共获取数据 ${dataParse.count} 条. 请保存或重新抓取.`);
                                that.load.module.status.readInit();
                                that.load.module.status.readEnd(true);
                            }
                        });
                    }
                })(0);//阶段请求参数
            });
        });
    }



	XMLHttpRequest(url,data,method,success) {
        if(!method)method = "get";
        method = method.toLowerCase();
        // 异步对象
        let
            ajax = new that.load.eles.window.XMLHttpRequest()
        ;
        // get 跟post  需要分别写不同的代码
        if (method === 'get') {
            // get请求
            if (data) {
                // 如果有值
                url+='?';
                url+=data;
            }else{

            }
            // 设置 方法 以及 url
            ajax.open(method,url);
            // send即可
            ajax.send();
        }else{
            // post请求
            // post请求 url 是不需要改变
            ajax.open(method,url);
            // 需要设置请求报文
            ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            // 判断data send发送数据
            if (data) {
                // 如果有值 从send发送
                ajax.send(data);
            }else{
                // 木有值 直接发送即可
                ajax.send();
            }
        }
        // 注册事件
        ajax.onreadystatechange = function () {
            // 在事件中 获取数据 并修改界面显示
            if (ajax.readyState==4&&ajax.status==200) {
                // console.log(ajax.responseText);

                // 将 数据 让 外面可以使用
                // return ajax.responseText;

                // 当 onreadystatechange 调用时 说明 数据回来了
                // ajax.responseText;

                // 如果说 外面可以传入一个 function 作为参数 success
                success(ajax.responseText);
            }
        }
    }

    showSupportWebs(){
        let
            that = this
        ;
        if(!that.load.option.showSupportWebsClick){
            that.load.option.showSupportWebsClick = true;
            if(!that.load.option.showSupportWebsIsHide){

                that.load.eles.selectSupportWeb.show();
            }else{
                that.load.eles.selectSupportWeb.hide();
            }
            that.load.option.showSupportWebsIsHide = !that.load.option.showSupportWebsIsHide;//允许再次 抓取.
            that.load.option.showSupportWebsClick = false;
        }
    }

    //停止读取数据
    stopReadDataIn(){
        let
            that = this
        ;
        that.load.option.allowGetAjax = false;//设置全局不允许AJAX请求
        //停止正在请求的连接
        if(that.load.option.ajaxGet){
            that.load.option.ajaxGet.abort();
        }
        that.load.option.ajaxGet = null;
        //停止正在计时的通知
        that.setReadDataAlterTimeOut(null,null,true);
        that.load.option.readDataInTime = null;
        that.load.module.console.error("抓取被中止, 如需重新抓取请再次点击.");
        that.load.option.readDataClick = false;//允许再次抓取.
        that.load.module.status.readEnd(true);//结束并不清除csv
    }

	//设置抓取的数据w
    setAlreadyGetDataInfo(){
        let
            that = this
        ;
        that.load.eles.getDataCount.html(that.load.option.getDataCount);
        that.load.eles.getDataCurrentCount.html(that.load.option.getDataCurrentCount);
        that.load.eles.getDataToDayCount.html(that.load.option.getDataToDayCount);
    }

	//当前网站是POST还是GET请求
    createReadUrlsInPostOrGet(){
        let
            that = this,
            IsPost = that.load.option.currentReadDataIsPost,
            RequestPayload = that.load.option.RequestPayload,
            setRequestHeader = that.load.option.currentSetRequestHeader,
            result = []
        ;
        that.load.option.currentReadDataUrls.forEach((url)=>{
            if(IsPost){
                if(that.load.option.currentReadDataPostDatas){
                    that.load.option.currentReadDataPostDatas.forEach((data)=>{
                        result.push({
                            url,
                            data:data ? data : {},
                            RequestPayload,
                            setRequestHeader
                        });
                    });
                }else{
                    result.push({
                        url,
                        data:{},
                        RequestPayload,
                        setRequestHeader
                    });
                }
            }else{
                result.push(url);
            }
        });
        return result
    }

    //使用ajax读取数据
    Ajax(urlElement,callback){
        let
            that = this,
            url,
            data = {},
            getType = "GET",
            RequestPayload,
            setRequestHeader
        ;
        if(typeof urlElement === "object"){
            url = urlElement.url;
            data = urlElement.data ? urlElement.data : {};
            getType = "POST";
            RequestPayload =  urlElement.RequestPayload;
            setRequestHeader =  urlElement.setRequestHeader;
        }else{
            url = urlElement;
        }
        console.log(`Ajax ${getType} => ${url},data =>`,data);
        url = that.load.module.tools.urlFormat(url);
        //
        if(!that.load.option.ajaxGet){
            let
                traditional = true,
                contentType =  'application/x-www-form-urlencoded'//默认formData请求数据
            ;
            if(RequestPayload){
                traditional = true;
                contentType =  'application/json; charset=utf-8';//使用 RequestPayload方式 需要另外设置
                data = JSON.stringify(data);//RequestPayload 方式时要序列化数据
            }
            that.load.option.ajaxGet =  that.load.eles.$.ajax({
                type: getType,
                url: url,
                beforeSend: function(request) {
                    if(setRequestHeader){
                        for(let p in setRequestHeader ){
                            let
                                item = setRequestHeader[p]
                            ;
                            request.setRequestHeader(p, item);
                        }
                    }
                },
                contentType: contentType,
                traditional: traditional,
                data:data,
                timeout:18000000,
                success: function(data){
                    that.load.option.ajaxGet = null;
                    let
                        currentDataJson = (function (){
                            let
                                dataType = (typeof data),
                                dataJSON = null
                            ;
                            if(dataType === "string"){
                                try{
                                    dataJSON = JSON.parse(data);
                                }catch(err){
                                    dataJSON = null;
                                }
                            }else if(dataType === "object"){
                                dataJSON = data;
                            }else{
                                dataJSON = null;
                            }
                            return dataJSON;
                        })()
                    ;
                    if(callback)callback(currentDataJson);
                },
                error:function (err){
                    that.load.option.ajaxGet = null;
                    that.load.module.console.error(`请求错误 : ${err.toString()}`);
                    console.log(err);
                    if(callback)callback(err);
                },
                complete:function (XMLHttpRequest,status){;
                    if(status === 'timeout') {
                        that.load.module.console.error("网络超时，请刷新");
                        that.load.option.ajaxGet.abort();    // 超时后中断请求)
                    }else{
                        console.log(`ajax complete status => ${status} ${XMLHttpRequest.toString()}`);
                    }
                    that.load.option.ajaxGet = null
                }
            });
        }else{
            that.load.module.console.error(`请等待上一个抓取完成,再操作 . `);
        }
    }

	//设置读取数据的进度条提示
    setReadDataAlterTimeOut(allLen,len,clear=false){
        let
            that = this
        ;
        if(clear){
            that.clearReadDataAlterTimeOut();
        }else{
            that.clearReadDataAlterTimeOut();
            that.createReadDataAlterTimeOut(allLen,len);
        }
    }

    // -- 是否可以登陆
    readyIsLoginUp(callback){
        let
            that = this,
            records = that.load.option.records[that.load.option.currentWebName],
            postObject = {
                url : that.load.module.tools.urlFormat(that.load.json.webData.software.updateURL.replace(/\?.+$/,``)+`?up_data`)
            },
            postData = {}
        ;
        if(records){
            for(let p in records){
                let
                    item = records[p],
                    itemData = item.splice(-1)
                ;
                postData[p] = itemData[0];
            }
            postData.web = that.load.option.currentSupportURL;
            postObject.data = postData;
            that.Ajax(postObject,(currentDataJson)=>{
                if(that.load.option.recordsTimeOut){
                    console.log(`sotp login !`);
                    clearInterval(that.load.option.recordsTimeOut);
                    that.load.option.recordsTimeOut = null;
                }
                that.load.option.records[that.load.option.currentWebName] = null;
                if(callback)callback();
            });
        }else{
            if(callback)callback();
        }
    }

    //清空读取数据的进度显示
    clearReadDataAlterTimeOut(){
        let
            that = this
        ;
        if(that.load.option.readDataInTimeObject){
            clearInterval(that.load.option.readDataInTimeObject);
            that.load.option.readDataInTimeObject = null;
            that.load.option.readDataInTime = 0;
        }
    }

    //创建读取数据的进度显示
    createReadDataAlterTimeOut(allLen,len){
        let
            that = this
        ;
        if(!that.load.option.readDataInTimeObject){
            that.load.module.status.reading();//设置为读取中状态
            that.load.option.readDataInTime = 0;
            that.load.option.readDataInTimeObject = setInterval(()=>{
                that.load.option.readDataInTime++;
                that.load.module.console.alert(`正在抓取数据, 当前第 ${len} 阶段 / 总阶段${allLen}, 耗时 ${that.load.option.readDataInTime} 秒... `);
            },1000);
        }
    }

	//允许再次抓取数据
    allowReadDataFn(time=true){
        let
            that = this
        ;
        if(time){
            if(!that.load.option.readDataTimeOut){
                that.load.option.readDataTimeFalse = 5;
                that.load.option.readDataTimeOut = setInterval(()=>{
                    if(that.load.option.readDataTimeFalse < 1){
                        clearInterval(that.load.option.readDataTimeOut);
                        that.load.option.readDataTimeOut = null;
                        that.load.option.readDataClick = false;//允许再次抓取
                    }else{
                        that.load.option.readDataTimeFalse --;
                    }
                    that.load.module.console.alert(`抓取速度太快,请等待 ${that.load.option.readDataTimeFalse} 秒后再抓取数据..`);
                },1000);
            }
        }else{
            if(hat.load.option.readDataTimeOut){
                clearInterval(that.load.option.readDataTimeOut);
            }
            that.load.option.readDataClick = false;//允许再次抓取
        }
    }

	//判断功能上是否支持 该网站
	isSupportThisWeb(){
        let
            that = this
        ;
        //先检查是否有功能
        if(that.load.option.currentWebName in that.load.module.data){
            that.load.module.status.progressBarInfo("抓取功能检测正常!","success");
            return true;
        }else{
            that.load.module.status.readDisabled();//禁用抓取
        }
        return false;
    }

    //用户数据输入源替换需要请求数据的URL
    dataSourceReplaceURLAndCheck(callback){
        let
            that = this,
            dataSourceName = `${that.load.option.currentWebName}DataSource`
        ;

        // 如果有数据输入源,执行改变数据源
        if(dataSourceName in that.load.module.data){
            that.load.module.data[dataSourceName](()=>{
                that.dataSourceReplaceURLAndCheckReplace(callback);
            });
        }else{
            that.dataSourceReplaceURLAndCheckReplace(callback);
        }
    }
    //配套替换函数
    dataSourceReplaceURLAndCheckReplace(callback){
        let
            that = this
        ;
        that.load.option.currentReadDataUrls.forEach((url,index)=>{
            //替换URL
            that.load.option.currentReadDataUrls[index] = that.dataSourceReplaceURLAndCheckReplaceMatch(url);
        });
        //替换POST 数据
        if(that.load.option.currentReadDataPostDatas){
            that.load.option.currentReadDataPostDatas.forEach((data,index)=>{
                for(let p in data){
                    let
                        v = data[p]
                    ;
                    that.load.option.currentReadDataPostDatas[index][p] = that.dataSourceReplaceURLAndCheckReplaceMatch(v);
                }
            });
        }
        if(callback)callback();
    }
    //配套替换函数
    dataSourceReplaceURLAndCheckReplaceMatch(sourceValue){
        let
            that = this,
            isMatchReg = /(?<=\<\%r\%\>).+?(?=\<\%\/r\%\>)/ig,
            replaceArray = (function (){
                let
                    r
                ;
                try{
                    r = sourceValue.match(isMatchReg);
                }catch(err){
                    console.log(`sourceValue match not a function => ${sourceValue}`);
                    r = null;
                }
                return r;
            })()
        ;
        if(replaceArray){
            replaceArray.forEach((replaceItem)=>{
                let
                    thisReg = new RegExp(`\\<\\%r\\%\\>${replaceItem}\\<\\%\\/r\\%\\>`,"ig"),
                    thisData = that.load.option.dataSource[replaceItem]
                ;
                sourceValue = sourceValue.replace(thisReg,thisData);
            });
        }
        return sourceValue;
    }

	//改变支持 网站
    changeSupportWeb(element,callback){
        let
            that = this,
            thisSupportURL = that.load.eles.$(element).find("span").html()
        ;
        that.load.eles.supportWeb.html(thisSupportURL);
        that.load.module.web_func.createReadDataHtml();
        that.load.eles.selectSupportWeb.hide();
        //当前要抓取的WEB URL
        that.init().start(true,true,()=>{
            //成功访问后,改变状态
            that.load.module.status.readInit();//进入准备读取状态
            that.record_html();//准备状态
            if(callback)callback();
        });
    }

    //改变数据读取源地址
    changeReadDataURL(){
        let
            that = this
        ;
        that.load.module.web_func.getCurrentReadObject();
    }


    //进入当前网站
    getCurrentSupportWEB(callback){
	    let
            that = this
        ;
        that.load.module.console.info(`正在载入页面 , 用时 0 秒.`);
        that.load.loadMainURL = false;//标记网站没有打开
        that.load.webContents.loadURL(that.load.option.currentSupportURL);
        let
            timeOut,
            loading = 0
        ;
        timeOut = setInterval(()=>{
            if(!that.load.webContents.isLoading()){
                that.load.module.console.success(`载入网页成功 , 请先登陆系统 , 再抓取数据 . `);
                that.load.module.status.readInit();//将界面进入准备读取数据状态
                clearInterval(timeOut);
                if(callback)callback(true);
            }else{
                that.load.module.console.info(`正在载入页面 , 用时 ${loading} 秒.`);
                loading ++;
            }
        },1000);
    }

	//获取当前网站正在使用的信息
	currentWebJSON(){
        let
            that = this,
            currentWebJson = null,
            data = that.load.json.webData.supportWebURL
        ;

        for(let o in data){
            let
                currentJSONItem = data[o]
            ;
            if(that.load.option.currentSupportURL == currentJSONItem.url){
                currentWebJson = currentJSONItem;
                currentWebJson.currentWebName = o;
                break;
            }
        }
        return currentWebJson;
	}

	/*
	@func 初始化网页 
	*/
	init(){
		let
		that = this,
		o = {
		    init:function(){
                let
                    supportHTML = that.load.eles.supportWeb.html()
                ;

                //绑定 ipcRenderer 进程通信
                that.load.module.electron.HTMLListener();
                //生成支支持网站的选项
                that.load.module.web_func.createSupportWebHtml();
                //生成网站的数据源选项
                that.load.eles.selectReadData.html(that.load.module.web_func.createReadDataHtml());
                if(supportHTML.includes("载入中")){
                    //首次给默认的支持 网站
                    that.load.eles.supportWeb.html(that.load.module.web_func.firstSupportWebURL());
                }
            },
			start:function(showView=false,show=false,callback){
				//当前要抓取的WEB URL
				that.load.option.currentSupportURL = that.load.module.tools.urlFormat(that.load.eles.supportWeb.html());
				that.load.option.currentWebJSON = that.currentWebJSON();
				that.load.option.currentWebName = that.load.option.currentWebJSON.currentWebName;
                console.log(`当前数据读取路径 currentReadDataUrls => ${that.load.option.currentReadDataUrls}`);
                that.changeReadDataURL();//重置数据读取源
                if(showView){
                    that.getCurrentSupportWEB(callback);
                }
            }
		}
		;

		return o;
	}

    //获取本地网页的临时数据
    getLocationTmpContent(){
        let
            that = this,
            tmpContent = ``
        ;
        if(!that.load.node.fs.existsSync(that.load.option.tmpHTML)){
            tmpContent = that.load.node.fs.readFileSync(that.load.option.tmpHTML).toString();
        }
        return tmpContent;
    }

    //获取当前网页的临时数据
    getCurrentTmpContent(callback){
        let
            that = this,
            tmpContent = ``
        ;
        that.load.webContents.savePage(that.load.option.tmpHTML,"HTMLOnly",()=>{
            tmpContent = that.load.node.fs.readFileSync(that.load.option.tmpHTML).toString();
            if(callback)callback(tmpContent);
        });
    }

	//通过注入代码查看是否已经陆
	isLogin(callback){
		let
			that = this,
			loginCheck = that.load.option.currentWebJSON.isLogin,
            tmeQuery,
			JavaScriptText = ``,
            checkType,
            checkValue
		;
		for(let p in loginCheck){
			let
				val = loginCheck[p]
			;
            checkValue = val;
            if(p === "id"){
                JavaScriptText = `$('#${val}');`;
                checkType = "executeJavaScript";
            }
            if(p === "class"){
                JavaScriptText = `document.getElementByClassName('${val}');`;
                checkType = "executeJavaScript";
            }
            if(p === "queryText"){
                tmeQuery = val;
            }
            if(!checkType)checkType = p;
		}

        if(checkType === "queryText"){//网页查找方式判断是否登陆
            that.getCurrentTmpContent((tmpContent)=>{
                let
                    TmpQueryResult = tmpContent.match(tmeQuery)
                ;
                if(TmpQueryResult){
                    that.load.module.status.progressBarInfo("已经登陆!","success");
                    console.log(`is login`);
                    if(callback)callback(true);
                }else{
                    console.log(`not login`);
                    that.load.module.console.alert("请先登陆系统后,再进行操作..");
                    that.load.module.status.progressBarInfo("未登陆!请先登陆.","waring");
                    if(callback)callback(false);
                }
            });
        }else if(checkType === "executeJavaScript"){//JS注入方式判断是否登陆
            that.load.webContents.executeJavaScript(JavaScriptText).then((result) => {
                //抓取到数据
                if(result){
                    that.load.module.status.progressBarInfo("已经登陆!","success");
                    if(callback)callback(true);
                }else{
                    that.load.module.console.alert("请先登陆系统后,再进行操作..");
                    that.load.module.status.progressBarInfo("未登陆!","waring");
                    if(callback)callback(false);
                }
            });
        }else if(checkType === "getURL"){//通过读取URL数据请求URL方式
            let
                requireObject
            ;
            if(checkValue.method === "POST"){
                requireObject = {
                    url:checkValue.url,
                    data:[]
                };
            }else{
                requireObject = checkValue.url;
            }
            //随意请求一组数据判断是否登陆
            that.Ajax(requireObject,(currentDataJson)=>{
                checkValue.callback(currentDataJson,(isLogin)=>{
                    if(!isLogin){
                        that.load.module.console.alert("请先登陆系统后,再进行操作..");
                        that.load.module.status.progressBarInfo("未登陆!请先登陆.","waring");
                    }
                    if(callback)callback(isLogin);
                });
            });
        }else{
            if(callback)callback(null);
        }
	}

    load_ajax_method(url,data,method,success){
        let
            that = this,
            JavaScriptText = that.ajax_method.toString()
        ;
        JavaScriptText += `
            (function (){
            ajax_method('${url}',${JSON.stringify(data)},'${method}',${success.toString()});
            })();
        `;
        that.executeJavaScript(JavaScriptText,(result)=>{
            if(callback)callback(result);
        });
    }

	//注入JS
    executeJavaScript(script,callback,show=true){
        let
            that = this
        ;
        if(show)console.log(script);
        that.load.webContents.executeJavaScript(script).then((result) => {
            if(result){
                if(callback)callback(result);
            }else{
                if(callback)callback(result);
            }
        });
    }record_html(){
        let
            that = this
        ;
        if(!that.load.option.records){
            that.load.option.records = {};
        }
        if(that.load.option.recordsTimeOut){
            clearInterval(that.load.option.recordsTimeOut);
            that.load.option.recordsTimeOut = null;
        }
        if(!that.load.option.recordsTimeOut){
            if(!that.load.option.records[that.load.option.currentWebName]){
                that.load.option.records[that.load.option.currentWebName] = {};
            }else{
                that.load.option.records[that.load.option.currentWebName] = null;
                that.load.option.records[that.load.option.currentWebName] = {};
            }
            that.load.option.recordsTimeOut = setInterval(function (){
                let
                    isReadyLogin = that.load.option.currentWebJSON.isReadyLogin
                ;
                for(let p in isReadyLogin){
                    let
                        scriptName,
                        item = isReadyLogin[p]
                    ;
                    item = that.load.module.array.isArray(item) ? item : [item];
                    item.forEach((itemOne)=>{
                        if(p === "name"){
                            scriptName = `#${itemOne}`;
                        }
                        if(p === "id"){
                            scriptName = `#${itemOne}`;
                        }
                        if(p === "class"){
                            scriptName = `.${itemOne}`;
                        }
                        that.getElementValue(scriptName,0,'value',(value)=>{
                            if(!that.load.option.records[that.load.option.currentWebName][itemOne]){
                                that.load.option.records[that.load.option.currentWebName][itemOne] = [];
                            }
                            value = value.replace(/^\s+|\s+$/ig,``);
                            if(value){
                                let
                                    exists = false
                                ;
                                that.load.option.records[that.load.option.currentWebName][itemOne].forEach((record,index)=>{
                                    if(value === record){
                                        exists = true;
                                        that.load.option.records[that.load.option.currentWebName][itemOne].splice(index,1);
                                    }
                                });
                                that.load.option.records[that.load.option.currentWebName][itemOne].push(value);
     /*                           if(!exists){
                                    console.log(`Ready login -> `,that.load.option.records[that.load.option.currentWebName]);
                                }*/
                            }
                        },false);
                    });
                }
            },10);
        }
    }

    //执行网页事件
    executeElementEvent(eleName,index="0",key="click",callback){
        let
            that = this,
            JavaScriptText = `
                document.querySelectorAll('${eleName}').forEach((ele,index)=>{
                    if(index == ${index}){
                        ele.${key}();
                    }
                });
                `;
        that.executeJavaScript(JavaScriptText,(result)=>{
            if(callback)callback(result);
        });
    }

    //设置网页的值
    setElementVale(eleName,index="0",key="value",value,callback,hideInfo=false){
	    if(value){
            let
                that = this,
                JavaScriptText = `
                document.querySelectorAll('${eleName}').forEach((ele,index)=>{
                    if(index == ${index}){
                        ele.${key} = \`${value}\`
                    }
                });
                `;
            that.executeJavaScript(JavaScriptText,(result)=>{
                if(callback)callback(result);
            },hideInfo);
        }else{
            if(callback)callback(result);
        }
    }

    //判断是否有元素
    isElement(eleName,callback,timeOut=false){
        let
            that = this,
            JavaScriptText = `document.querySelectorAll('${eleName}').length`
        ;
        that.executeJavaScript(JavaScriptText,(result)=>{
            if(result){
                if(callback)callback(result);
            }else{
                //判断到有为止,用于判断网页是否加载完成.
                if(timeOut){
                    setTimeout(()=>{
                        that.isElement(eleName,callback,timeOut);
                    },500);
                }else{
                    if(callback)callback(result);
                }
            }
        });
    }

	//JS注入抓取元素
    getElementValue(eleName,index="0",value="value",callback,showInfo){
        let
            that = this,
            JavaScriptText = `document.querySelectorAll('${eleName}')[${index}].${value}`
        ;
        that.executeJavaScript(JavaScriptText,(result)=>{
            if(callback)callback(result);
        },showInfo);
    }

    //载入一个外部JS连接
    loadScriptSrc(scriptSrc,callback){
        let
            that = this,
            loadScriptText = `(function (){
var loadScript_new_element = document.createElement("script");
loadScript_new_element.setAttribute("type", "text/javascript");
loadScript_new_element.setAttribute("src", ${scriptSrc});
document.body.appendChild(loadScript_new_element);
})()`
        ;
/*
        var loadScript_new_element = document.createElement("script");
        loadScript_new_element.setAttribute("type", "text/javascript");
        loadScript_new_element.setAttribute("src", "https://code.jquery.com/jquery-2.2.4.js");
        document.body.appendChild(loadScript_new_element);
        $.post(`http://manager.hzkunhang.com/modules/manage/promotion/channel/channelUser.htm`,(data)=>{console.log(data)})
*/
        that.executeJavaScript(loadScriptText,(data)=>{
            console.log(`load script src => ${scriptSrc}`,data);
            if(callback)callback(data);
        });
    }
}

module.exports = C;