"use strict"

const 
common = require("../public/common.class.js")
;

/*
* @function 程序的主入口文件
* @import base.js
* @construction //base.js 基本入口
*               //core 核心类
*               //config 配置文件
*               //bin 必须的文件
* @arch 仅支持64位构架.
* */

class base{
    constructor(){

        common.get_core("windows");
        common.get_core("func");

        common.get_node("electron");
        common.get_node("fs");
        common.get_node("path");

    }

    run(){
        let
        that = this,
        electron = common.node.electron,
        {    
            app,
            ipcMain,
            BrowserWindow,
            Menu
        } = common.node.electron,
        option = {
            app,
            ipcMain,
            BrowserWindow,
            Menu,
            electron
        }
        ;
        /*
        @explain 非管理员模式下直接弹出对话框,并拒绝启动.
        */
        if(!common.core.windows.IsAdmin()){
            console.log('please run is admin....');
            return;
        }
        common.run_module("init",2,option);
    }
}


module.exports = base;