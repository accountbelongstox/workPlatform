class electronIpcMain{
    constructor(o){
    }

    /*
    @func 载入
    */
    run(){


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

            that.o.module.compiler.build('index.html',function(dir){
                _window.loadURL(that.o.node.url.format({
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

            that.o.module.compiler.build(`help.html`,function(dir){
                help.loadURL(that.o.node.url.format({
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
            that.o.module.listen.on();
        });
        /*--------------session-------------------*/
        /*定义菜单*/
        that.option.Menu.setApplicationMenu(null);

    }


}

module.exports = electronIpcMain;