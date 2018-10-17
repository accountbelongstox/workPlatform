/**
 * @console 全局公共函数.
 */
class consoleC{
    constructor(o){
    }
    /*
    * @func 抛出错误并停止
    * */
    stop(...arg){
        console.log('Throw error : '.red);
        let
            content=""
        ;
        arg.forEach((c,i)=>{
            if(typeof c === "object"){
                c = c.join(`\n`);
            }
            content+=c;
        });
        throw content;
    }

    /*
    * @func 在同一行打印
    * */
    process(...arg){
        let
        that = this
        ;
        let
            type = parseInt(arg[arg.length-1])
        ;
        if(type !==type){
            type = 1;
        }else{
            arg.splice(arg.length-1,1);
        }

        arg.forEach((c,i)=>{
            if(typeof c === "object"){
                c = c.join(`\n`);
            }
            //删除光标所在行
            that.o.node.readline.clearLine(process.stdout, 0);
            //移动光标到行首
            that.o.node.readline.cursorTo(process.stdout, 0, 0);
            that.info(c,type);
            //process.stdout.write( c, 'utf-8');
        });
    }

    /*
    * @func 输出一条错误信息
    * */
    error(...arg){
        console.log('Error : '.red);
        arg.forEach((c,i)=>{
            if(typeof c === "object"){
                c = c.join(`\n`);
            }
            console.log(`${c}`.red);
        })
    }

    /*
    * @func 输出一条警告信息
    * */
    waring(...arg){
        arg.forEach((c,i)=>{
            if(typeof c === "object"){
                c = c.join(`\n`);
            }
            c = `Waring : ${c}`;
            console.log(`${c}`.yellow);
        })
    }

    /*
    * @func 输入一条信息
    * */
    success(...arg){
        console.log('Success : '.green);
        arg.forEach((c,i)=>{
            if(typeof c === "object"){
                c = c.join(`\n`);
            }
            console.log(`${c}`.green);
        })
    }

    /*
    * @func 输入一条信息
    * */
    info(...arg){
        let
            type = parseInt(arg[arg.length-1])
        ;
        if(type !==type){
            type = 1;
        }else{
            arg.splice(arg.length-1,1);
        }
        switch (type) {
            case 1:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.white);
                });
                break;
            case 2:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.yellow);
                });
                break;
            case 3:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.blue);
                });
                break;
            case 4:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.green);
                });
                break;
            case 5:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.cyan);
                });
                break;
            case 6:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.grey);
                });
                break;
            case 7:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.magenta);
                });
                break;
            case 8:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.red);
                });
                break;
            default:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(c);
                });
                break;
        }
    }

    /*
    * @func 输入一条带背景色的信息
    * */
    background(...arg){
        let
            type = parseInt(arg[arg.length-1])
        ;
        if(type !==type){
            type = 1;
        }else{
            arg.splice(arg.length-1,1);
        }
        switch (type) {
            case 1:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.bgBlack);
                });
                break;
            case 2:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.bgRed);
                });
                break;
            case 3:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.bgGreen);
                });
                break;
            case 4:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.bgYellow);
                });
                break;
            case 5:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.bgBlue);
                });
                break;
            case 6:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.bgMagenta);
                });
                break;
            case 7:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.bgCyan);
                });
                break;
            case 8:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.bgWhite);
                });
                break;
            default:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(c);
                });
                break;
        }
    }
    /*
    * @func 输入一条带style的信息
    * */
    style(...arg){
        let
            type = parseInt(arg[arg.length-1])
        ;
        if(type !==type){
            type = 1;
        }else{
            arg.splice(arg.length-1,1);
        }
        switch (type) {
            case 1:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.reset);
                });
                break;
            case 2:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.bold);
                });
                break;
            case 3:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.dim);
                });
                break;
            case 4:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.italic);
                });
                break;
            case 5:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.underline);
                });
                break;
            case 6:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.hidden);
                });
                break;
            case 7:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.strikethrough);
                });
                break;
            default:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(c);
                });
                break;
        }
    }
    /*
    * @func 输入一条带extras的信息
    * */
    extras(...arg){
        let
            type = parseInt(arg[arg.length-1])
        ;
        if(type !==type){
            type = 1;
        }else{
            arg.splice(arg.length-1,1);
        }
        switch (type) {
            case 1:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.rainbow);
                });
                break;
            case 2:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.zebra);
                });
                break;
            case 3:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.america);
                });
                break;
            case 4:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.trap);
                });
                break;
            case 5:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(`${c}`.random);
                });
                break;
            default:
                arg.forEach((c,i)=>{
                    if(typeof c === "object"){
                        c = c.join(`\n`);
                    }
                    console.log(c);
                });
                break;
        }
    }
}

module.exports = consoleC;