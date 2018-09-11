

/*
@func 当模版被调起时,首先执行此页面
@... 同时再根据页面的路径,执行下级JS文件
@... 该页的调用由编译模版自行处理...
*/
class page{
    constructor(){
        common.get_node('fs');
        common.get_node('path');
        common.get_node('electron');
        common.get_module('listen',2);
        common.$ = require("./js/jquery-2.0.3.min.js");

        this.all_listener();
        this.a_href_transform_ipc_send();

    }


    run(pageName){
        console.log(`this page name ${pageName}`)
    }

    auto_load(action){
        if(common.node.fs.existsSync(action)){
            return require(action);
        }
    }

    /**
     * @step 将所有a标签都编译为ipc.send的代码.后续使用vue动生后台.
     * @type {Array}
     */
    a_href_transform_ipc_send(){

        let 
        that = this
        ;
/*
        common.$("[data-app-transform-page]").each(function(a,b){
            let e = common.$(b);
            let page = e.attr("data-app-transform-page");
            e.click(function(){
                console.log("app-transform-page",page);
                common.node.electron.ipcRenderer.send("app-transform-page",page);
            })
        });
        common.$("a").each(function(a,b){
            let e = common.$(b);
            let href=e.attr("href");
            if(href == "#")href=null;
            if(!e.attr("onclick") || !(e.attr("onclick") instanceof Function) && href){
                e.click(function(){
                    console.log("app-transform-page",href)
                    common.node.electron.ipcRenderer.send("app-transform-page",href);
                })
            }
            e.attr({
                href:"javascript:void(0);"
            })
        })

        */
    }

    all_listener(){
        /*
        @tools 所有需要监听的动作
        @param 将作为class加入到网页中,同时发送的参数也是该值本收,主线程接收也是该线程本身
        @return null
        @source 使用后端处理ipcMainOn监听事件.统一绑定.
         */
        let 
        that = this,
        listens = common.module.listen.get_listen_list()
        ;

        for(let i=0;i<listens.length;i++){
            let p = listens[i];
            let ipc_main_on = p.ipc_main_on.replace(/\s/ig,"");
            let func = p.func;
            let description = p.description.replace(/\s/ig,"");
            console.log(`ipcMain事件 ( ${description} ) => ${ipc_main_on} `,func);
            this.set_on(ipc_main_on);
        }

    }

    set_on(ele_selector){
        let ele_selector_filter = ele_selector.replace(/^\./,"");
        let ele = common.$(`.${ele_selector_filter}`);
        if(ele.length < 1)return false;
        let getOwn = common.$(ele)[0];
        let tag="";
        if(getOwn.hasOwnProperty("tagName")){
            tag = getOwn.tagName.toLowerCase();
        }
        switch (tag){
            case "a":
                common.$(ele).attr({
                   href:"javascript:void(0);",
                   onclick:null
                });
                break;
        }
        common.$(ele).click((event)=>{
            switch (ele_selector_filter){
                case "window-all-closed":
                    if(!confirm("您将要关闭程序,请注意保存工作.")){
                        return false;
                    }
            }
            console.log(`click => ${ele_selector_filter}`)
            common.node.electron.ipcRenderer.send(ele_selector_filter);
        });
    }
}

module.exports =  page;