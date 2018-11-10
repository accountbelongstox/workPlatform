class SC{
    /**
     * @tools 执行cmd命令
     */
    exec(command,callback,showInfo = false){
        if( !(command instanceof Array) ){
            command = [command]
        }
        let
            output = [],
            that = this
        ;

        (function exec_cmd(len){
            if(len  >= command.length){
                //如果只有一次命令返回,则直接返回无须数组
                if(output.length < 2){
                    output  = output.join(``);
                }
                output = that.exists(output);
                if(callback)callback(output);
            }else{
                let
                    cmd = command[len]
                ;
                that.load.node.child_process.exec(cmd, { encoding: binaryEncoding }, function(err, StdOpt, stderr){
                    StdOpt =  that.load.node[`iconv-lite`].decode(Buffer.alloc(StdOpt.length,StdOpt, binaryEncoding), encoding);
                    stderr =  that.load.node[`iconv-lite`].decode(Buffer.alloc(stderr.length,stderr, binaryEncoding), encoding);
                    output.push(StdOpt);
                    if( err  )console.log("Error:\n"+err);
                    if( StdOpt && ( !callback || showInfo) )console.log(StdOpt);
                    if( stderr )console.log("StdErr:\n"+stderr);
                    exec_cmd(++len);
                });
            }
        })(0);
    }

    /*
    @func 执行命令同步版
    */
    execSync(command){
        if( !(command instanceof Array) ){
            command = [command]
        }

        let
            output = [],
            that = this
        ;

        for(let i=0;i<command.length;i++){
            let cmd = command[i];
            try{
                let e = that.load.node.child_process.execSync(cmd, { encoding: binaryEncoding });
                e = e.toString("utf8");
                e = that.load.module.string.trim(e,[`\n`,`\r`]);
                console.log(e);
                output.push(e);
            }catch(err){
                console.log("error:");
                console.log(err);
            }
        }
        return output;
    }

    /**
     * @tools 执行cmd命令
     */
    spawn(command,fn){
        if( !(command instanceof Array) ){
            command = [command]
        }
        let
            output = [],
            that = this
        ;
        if(command.length > 0 ){
            (function spawn_cmd(i){
                let
                    cmd = command[i],
                    symbolSplit = cmd.match(/\".+?\"/ig),
                    splitToken = `^*^*^`
                ;

                if(symbolSplit){
                    symbolSplit.forEach((symbolSplitOne)=>{
                        cmd = cmd.replace(symbolSplitOne,` ${splitToken} `)
                    });
                }
                let
                    splitCmds = cmd.split(/\s+/),
                    cmds = []
                ;
                splitCmds.forEach((cmdOne)=>{
                    let
                        _cmdOne = cmdOne
                    ;
                    if(cmdOne.includes(splitToken) && (_cmdOne = symbolSplit.splice(0,1)) ){
                        _cmdOne = _cmdOne[0];
                    }
                    if(_cmdOne){
                        _cmdOne = that.load.module.string.trim(_cmdOne);
                        cmds.push(_cmdOne);
                    }
                });
                let
                    command_c = (cmds.splice(0,1))[0],
                    parmas = cmds,
                    c = that.load.node.child_process.spawn(command_c,parmas)
                ;
                c.stdout.on('data', function (data) {
                    if(!fn){
                        console.log('spawn_stdout: ' + data);
                    }
                });
                c.stderr.on('data', function (data) {
                    if(!fn){
                        console.log('spawn_stderr: ' + data);
                    }
                });
                c.on('exit', function (code) {
                    i++;
                    if(i<command.length){
                        spawn_cmd(i);
                    }else{
                        if(fn)fn(code);
                    }
                });
            })(0)
        }
    }

    /**
     * @tools 执行cmd命令
     */
    execFile(command,callback,showInfo){
        if( !(command instanceof Array) ){
            command = [command]
        }
        let
            that = this,
            errorArray = []
        ;
        (function spawn_cmd(i){
            if(i >= command.length){
                if(errorArray.length == 1){
                    errorArray = errorArray.join(``);
                }
                if(callback)callback(errorArray);
            }else{
                let
                    cmd = command[i]
                ;
                cmd = cmd.match(/[^\"](.+?)\s|[^\"](.+?)$|\"(.+?)\"/ig);
                for(let i=0;i<cmd.length;i++){
                    cmd[i] = cmd[i].replace(/^\"|\"$/,"");
                }
                let
                    command_c = cmd[0],
                    parmas = cmd.splice(1)
                ;
                that.load.node.child_process.execFile(command_c,parmas, (error, stdout, stderr) => {
                    if (error) {
                        console.log(error);
                    }
                    if (stderr) {
                        console.log(stderr);
                    }
                    if (showInfo && stdout) {
                        console.log(stdout);
                    }
                    errorArray.push(stdout);
                    spawn_cmd(++i);
                });
            }
        })(0);
    }

    /**
     * @func 执行一个程序或文件,同步版
     */

    execFileSync(command,callback,showInfo=false){
        if( !(command instanceof Array) ){
            command = [command]
        }
        let
            that = this
        ;
        (function spawn_cmd(i){
            if(i >= command.length){
                if(callback)callback();
            }else{
                let
                    cmd = command[i]
                ;
                cmd = cmd.match(/[^\"](.+?)\s|[^\"](.+?)$|\"(.+?)\"/ig);
                for(let i=0;i<cmd.length;i++){
                    cmd[i] = cmd[i].replace(/^\"|\"$/,"");
                }
                let
                    command_c = cmd[0],
                    parmas = cmd.splice(1)
                ;
                that.load.node.child_process.spawn(command_c,parmas);
                spawn_cmd(++i);
            }
        })(0);
    }

}

module.exports = SC;