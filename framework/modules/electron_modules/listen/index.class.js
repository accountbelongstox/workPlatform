
class ipcMainOn{
    constructor(o){
    }

    get_listen_list(){
        let 
        that = this
        ;

        this.all_listener = [{
            description:"退出程序",
            register_key:"",
            ipc_main_on:"window-all-closed",
            func:()=>{
                that.option.app.quit();
            }
        },{
            description:"最小化 ",
            register_key:"",
            ipc_main_on:"window-mini ",
            func:()=>{
                that.option._window.minimize();
            }
        },{
            description:"最大化 ",
            register_key:"",
            ipc_main_on:" show-window",
            func:()=>{
                that.option._window.maximize();
            },
        },{
            description:"还原 ",
            register_key:"",
            ipc_main_on:" orignal-window",
            func:()=>{
                that.option._window.unmaximize();
            }
        },{
            description:" 帮助中心(显示)",
            register_key:"",
            ipc_main_on:" app-help-show",
            func:()=>{
                this.is_ele_fn("help","show");
            }
        },{
            description:"  帮助中心(隐藏)",
            register_key:"",
            ipc_main_on:" app-help-hide",
            func:()=>{
                this.is_ele_fn("help","hide");
            }
        },{
            description:"  将a标签转为使用electron内置切换页面 ",
            register_key:"",
            ipc_main_on:"app-transform-page",
            func:(event, arg)=>{
                let 
                html_template = that.o.path.html_template+arg
                ;
                that.o.module.compiler.build(html_template,function(dir){
                    that.option._window.loadURL(that.o.node.url.format({
                        pathname: dir,
                        protocol: 'file:',
                        slashes: true
                    }))
                });
            }
        }
        ];
        return this.all_listener;
    }

    on(){

        let 
        all_listener = this.get_listen_list()
        ;

        this.auto_on(all_listener,this.globalShortcut);
    }

    /**
     *@tools 批量注册监听事件,和快捷键事件.
     */

    auto_on(listens,globalShortcut){

        let 
        that = this
        ;

        for(let i=0;i<listens.length;i++){
            let 
            p = listens[i],
            ipc_main_on = p.ipc_main_on.replace(/\s/ig,"")
            ;

            that.option.ipcMain.on(ipc_main_on,function(event, arg){
                p.func(event, arg);
            });

            let register_key = p.register_key.replace(/\s/ig,"");
            if(register_key){
                that.option.electron.globalShortcut.register(register_key,function(){
                    p.func();
                });
            }

        }
    }

    /*
    @func 判断是否是一个指定的函数,比如：
    */
    is_ele_fn(name,fn){
        if(this.hasOwnProperty(name)) {
            this[name]();
            return;
        }
        console.log(`${name} not function ${fn}`)
    }

}


module.exports = ipcMainOn;