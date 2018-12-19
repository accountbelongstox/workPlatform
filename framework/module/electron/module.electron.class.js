class electronIpcMain{
    constructor(load){

    }

    //创建一个窗口
    createWindow(){
        let
            that = this.that,//此处的 that 来源于 electron.app 的赋值.因为该值在App 里不能直接调用
            BrowserWindow = that.load.node.electron.BrowserWindow,
            Menu = that.load.node.electron.Menu
        ;
        //创建浏览器窗口
        that.load.window = new BrowserWindow({
            width: that.option.width,
            minWidth: that.option.minWidth,
            height: that.option.height,
            minHeight: that.option.minHeight,
            frame: that.option.frame,
            autoHideMenuBar: that.option.autoHideMenuBar
        });
        Menu.setApplicationMenu(null);
        that.load.module.electron_compiler.build(that.option.url,function(buildHTML){
            // 加载应用的 index.html
            that.load.window.loadURL(that.load.node.url.format({
                pathname: buildHTML,
                protocol: 'file:',
                slashes: true
            }));
        });

        // 关闭window时触发下列事件.
        that.load.window.on('closed', () => {
            // 取消引用 window 对象，通常如果应用支持多窗口，则会将
            // 窗口存储在数组中,现在应该进行删除了.
            that.load.window = null;
        });
        //启动事件监听
        that.load.window.webContents.on('dom-ready',()=>{
            that.electronListener();
        });
    }

    //初始化
    init(object){
        let
            that = this,
            get = (name,v=null)=>{
                if(object && object[name]){
                    return object[name];
                }else{
                    return v;
                }
            },
            url = get(`url`),
            width = get(`width`,1350),
            height = get(`height`,1002),
            minWidth = get(`minWidth`,width),
            minHeight = get(`minHeight`,height),
            frame = get(`frame`,false),
            autoHideMenuBar = get(`autoHideMenuBar`,true)
        ;
        that.option.url = (()=>{
            if(!url){
                that.load.console.error(`not electron page index.html`);
                throw (new Error(`not electron page index.html `));
            }
            let
                full_path = that.load.node.path.join(that.load.path.html_template,`/${url}`),
                index_path = that.load.node.path.join(that.load.path.html_template,`/${url}/index.html`)
            ;
            if(that.load.module.file.isFileSync(full_path)){
                return full_path;
            }else if(that.load.module.file.isFileSync(index_path)){
                return index_path;
            }else{
                that.load.console.error(`not find electron page index.html in ${index_path}`);
                throw (new Error(`not find electron page index.html `));
            }
        })();

        that.option.width = width;
        that.option.height = height;
        that.option.minWidth = minWidth;
        that.option.minHeight = minHeight;
        that.option.frame = frame;
        that.option.autoHideMenuBar = autoHideMenuBar;

        that.load.node.electron.app.that = that;
        // 当 electron 完成初始化并准备创建浏览器窗口时调用此方法
        // 部分 API 只能使用于 ready 事件触发后。
        that.load.node.electron.app.on('ready', that.createWindow);
        // 所有窗口关闭时退出应用.
        that.load.node.electron.app.on('window-all-closed', () => {
            // macOS 中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
            if(process.platform !== 'darwin'){
                that.load.node.electron.app.quit()
            }
        });
        that.load.node.electron.app.on('activate', ()=>{
            // macOS 中点击 Dock 图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
            if (that.load.window === null) {
                that.createWindow(that);
            }
        });
    }

    //由HTML启动的监听事件
    //绑定格式   class="electron-ipc-xxxx"
    //数据传递   data-electron-ipc-args="xxx|xxx"
    //回调函数   data-electron-ipc-callback="xxx|xxx"
    HTMLListener(){
        let
            that = this,
            documentAll = that.load.document.all
        ;
        for(let p in documentAll){
            let
                documentItem = documentAll[p],
                ele = (function (){
                    let
                        eltItem = null
                    ;
                    if(documentItem){
                        try{
                            eltItem = that.load.$(documentItem);
                        }catch(err){
                            console.log(err);
                            eltItem = null;
                        }
                    }
                    return eltItem;
                })(),
                className = (function (){
                    if(ele){
                        return ele.attr('class');
                    }else{
                        return null;
                    }
                })()
            ;
            if(className){
                let
                    classNames = className.split(/\s+/),
                    callback = ele.data('electron-callback')
                ;
                classNames.forEach((classNameItem)=>{
                    let
                        ipcRegExp = /^electron\-/i,
                        eventTypeExp = /(?<=electron\-).+?(?=\-)/i,
                        ipcReplace = /^electron\-[a-zA-Z0-9]+\-/i,
                        eventName = classNameItem.replace(ipcReplace,``).toLowerCase()
                    ;
                    if(classNameItem.match(ipcRegExp)){
                        console.log(`Ipc 事件绑定 => ${classNameItem}`);
                        let
                            eventType = (classNameItem.match(eventTypeExp))[0]
                        ;
                        if(eventType === "ipc"){//发送绑定
                            ele.click((event)=>{
                                event.stopPropagation();
                                let
                                    arg = (function (){
                                        let
                                            args = ele.data('electron-args')
                                        ;

                                        if(args){
                                            if(args.includes(`|`)){
                                                args = args.split(/\|+/);
                                            }else if(args.includes(`,`)){
                                                args = args.split(/\,+/);
                                            }
                                        }
                                        if(args && (`length` in args) && args.length === 1){
                                            args = args[0];
                                        }
                                        return args;
                                    })()
                                ;
                                that.load.option[`${eventName}CallbackName`] = callback;
                                if(!that.load.option[eventName]){
                                    that.load.option[eventName] = true;
                                    that.load.node.electron.ipcRenderer.send("electronListener",{
                                        arg,
                                        sendIpc:eventName,
                                        callback
                                    });
                                }
                            });
                        }else if(eventType === "click"){//点击事件绑定
                            ele.click((event)=>{
                                event.stopPropagation();
                                let
                                    args = (function (){
                                        let
                                            arg = ele.data('electron-args')
                                        ;

                                        if(arg){
                                            if(arg.includes(`|`)){
                                                arg = arg.split(/\|+/);
                                            }else if(arg.includes(`,`)){
                                                arg = arg.split(/\,+/);
                                            }
                                        }
                                        if(arg && (`length` in arg) && arg.length === 1){
                                            arg = arg[0];
                                        }
                                        return arg;
                                    })()
                                ;
                                that.load.event(eventName,args);
                            });
                        }
                        that.load.node.electron.ipcRenderer.on(eventName, (event, arg) => {
                            let
                                callbackName = that.load.option[`${eventName}CallbackName`],
                                callbackModule = that.load.module["event-electron"],
                                callbackFunction = callbackModule[callbackName]
                            ;
                            console.log(`${eventName} => 执行完毕! 回调数据 => `,arg);
                            that.load.option[eventName] = false;//执行完后允许再次执行
                            if(callbackFunction){
                                callbackFunction(arg,event);
                            }
                        });
                    }
                });
            }
        }
    }

    //NODE electron 监听事件
    //当有该方法的时候就监听,没有则跳过
    electronListener(){
        let
            that = this,
            ipcMain = that.load.node.electron.ipcMain,
            globalShortcuts = that.load.config.platform.base.electron.globalShortcut
        ;
        ipcMain.on("electronListener", (event, arg) => {
            let
                sendIpc = arg.sendIpc,
                args = arg.arg ? arg.arg : null,
                appFunction = (function (){
                    let
                        app = that.load.node.electron.app[sendIpc]
                    ;
                    if(!app){
                        app = that.load.window[sendIpc];
                    }
                    return app;
                })()
            ;
            console.log(`Ipc on => ${sendIpc}`);
            if(appFunction){
                appFunction();
            }else{
                let
                    listenerFunction = that.load.module[`event-electron`][sendIpc]
                ;
                if(listenerFunction){
                    listenerFunction(that , args, (result)=>{
                        //执行完后告诉子进程
                        if(result === undefined){
                            result = true;
                        }
                        that.load.window.webContents.send(sendIpc, result);
                    }, event);

                }
            }
        });
        //监听快捷键
        //that.load.event("openDevTools");
        for(let p in globalShortcuts){
            let
                globalShortcutItem = globalShortcuts[p]
            ;
            let
                event = globalShortcutItem,
                args = null,
                callback
            ;
            if(typeof globalShortcutItem === "object"){
                event = globalShortcutItem.event;
                if("args" in globalShortcutItem){
                    args = globalShortcutItem.args;
                }
                if("callback" in globalShortcutItem){
                    callback = globalShortcutItem.callback;
                }
            }
            console.log(`register event => ${p}`);
            that.load.node.electron.globalShortcut.register(p, function () {
                /*                electron.dialog.showMessageBox({
                                    type: 'info',
                                    message: '成功!',
                                    detail: '你按下了一个全局注册的快捷键绑定.',
                                    buttons: ['好的']
                                })*/
                that.load.event(event,args,callback);
            })
        }
    }




    
    run2(){


        /*that.option 是传入的参数*/
        /*创建windows窗口*/

        let 
        that = this
        ;
/*        that.option.app.on('ready',()=>{
            _window = new that.option.BrowserWindow({
                //width: 1200,
                width: 2200,
                height: 900,
                minWidth: 1200,
                minHeight: 900,
                title: "工作平台 - 动点世纪(ddweb.com.cn) v1.0",
                autoHideMenuBar: true,
                frame: false
            });
        });*/
        that.option.app.on('ready',()=>{
            let _window = new that.option.BrowserWindow({
                //width: 1200,
                width: 2200,
                height: 900,
                minWidth: 1200,
                minHeight: 900,
                title: "工作平台 - 动点世纪(ddweb.com.cn) v1.0",
                autoHideMenuBar: true,
                frame: false
            });

            that.load.module.compiler.build('index.html',function(dir){
                _window.loadURL(that.load.node.url.format({
                    pathname: dir,
                    protocol: 'file:',
                    slashes: true
                }));

                //打开调试工具
                _window.webContents.openDevTools();
            });

            //帮助代码
            let help = new that.option.BrowserWindow({
                width: 400,
                height: 400,
                show: false,
                autoHideMenuBar: true,
                frame:false,
                resizable:false,
            });

            that.load.module.compiler.build(`help.html`,function(dir){
                help.loadURL(that.load.node.url.format({
                    pathname: dir,
                    protocol: 'file:',
                    slashes: true
                }));
            });
            help.loadURL("file://"+__dirname+'/html/');
            let ipcOnEles={
                help//将多余元素传入监听表
            }

            /*
            @explain 引入监听模型 
            */
            that.option._window = _window;
            that.
            /*
            @explain 启动监听
            */
            that.load.module.listen.on();
        });
        /*--------------session-------------------*/
        /*定义菜单*/
        that.option.Menu.setApplicationMenu(null);

    }


}

module.exports = electronIpcMain;