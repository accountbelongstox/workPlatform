class fileC{
	constructor(common){
        common.get_core('string');
        common.get_core('array');
        common.get_core('console');
        common.get_node("crypto");
        common.get_node('iconv-lite');
        common.get_node('path');
        common.get_node('fs');
        common.get_node('url');
        common.get_support('file');
    }
    /*
    @func 获取一个文件的md5值 
    */
    md5(path,callback){
        let 
        that = this
        ;

        if(that.isFileSync(path)){

            let
            rs = that.common.node.fs.createReadStream(path),
            hash = that.common.node.crypto.createHash('md5')
            ;

            rs.on('data', hash.update.bind(hash));

            rs.on('end', function () {
                if(callback)callback(hash.digest('hex'));
            });
        }else{
            if(callback)callback(null);
        }
    }
    /*
    @func 判断是是一个exe可执行文件
    */
    isExeFile(path){
        let
        that = this,
        ext = that.common.node.path.parse(path).ext.replace(/^\.+/ig,""),
        exts = that.common.support.file.exe.extend
        ;
        if(that.common.core.array.findX(exts,ext)){
            return true;
        }
        return false;
    }

    /*
    @func 创建一个文件的上级目录
    */
    mkFileDirSync(path){
        let
        that = this,
        dir = that.common.node.path.parse(path).dir
        ;
        if(dir)that.mkdirSync(dir);
    }


    /*
    @func 判断是是一个文本说明文件
    */
    isDocFile(path,exists=false){
        let
        that = this,
        ext = that.common.node.path.parse(path).ext.replace(/^\.+/ig,""),
        exts = that.common.support.file.documentation.extend
        ;
        if(exists){
            if(!that.isFileSync(path))return false;
        }
        if(that.common.core.array.findX(exts,ext)){
            return true;
        }
        return false;
    }

    /*
    @func 判断是是一个压缩文件
    */
    isZipFile(path,exists=false){
        let
        that = this,
        ext = that.common.node.path.parse(path).ext.replace(/^\.+/ig,""),
        exts = that.common.support.file.zip.extend
        ;
        if(exists){
            if(!that.isFileSync(path))return false;
        }
        if(that.common.core.array.findX(exts,ext)){
            return true;
        }
        return false;
    }

    
    /*
    @func 扫描目录下的文件
    */
    scanGetFileSync(dir){
        let
        that = this,
        dirs = that.common.node.fs.readdirSync(dir),
        files = []
        ;

        dirs.forEach((file)=>{
            let
            filePath = that.common.node.path.join(dir,file)
            ;
            if(that.isFileSync(filePath)){
                files.push(filePath);
            }
        });
        return files;
    }

    /*
    @func 该程序是一个普通程序,有文件夹和普通文件
    */
    isNormalProgram(softDir){
        let
        that = this,
        folders = 0,
        docs = 0,
        files = 0,
        notDoc = 0
        ;
        that.common.node.fs.readdirSync(softDir).forEach((file)=>{
            let
            filePath = that.common.node.path.join(softDir,file)
            ;
            if(that.isFileSync(filePath)){
                files++;
            }
            if(that.isDocFile(filePath)){
                docs++;
            }
            if(that.isDirSync(filePath))folders++;
        });
        notDoc = files - docs;
        if(notDoc)return true;
        return false;
    }

    /*
    @func 判断该目录下只有一个exe文件
    */
    isOneExeFile(softDir){
        let
        that = this,
        folders = 0,
        docs = 0,
        exeFiles = [],
        files = 0,
        notDoc = 0
        ;

        that.common.node.fs.readdirSync(softDir).forEach((file)=>{
            let
            filePath = that.common.node.path.join(softDir,file)
            ;
            if(that.isFileSync(filePath)){
                files++;
            }
            if(that.isExeFile(filePath)){
                exeFiles.push(filePath);
            }
            if(that.isDocFile(filePath)){
                docs++;
            }
            if(that.isDirSync(filePath))folders++;
        });
        notDoc = files - docs;
        if(notDoc < 2 && !folders)return exeFiles[0];
        return false;
    }


    /*
    @func 宽松判断该目录下只有一个exe文件,不限制文件夹的数量
    */
    isOneExeFileX(softDir){
        let
        that = this,
        exeFiles = [],
        files = 0
        ;
        that.common.node.fs.readdirSync(softDir).forEach((file)=>{
            let
            filePath = that.common.node.path.join(softDir,file)
            ;
            if(that.isExeFile(filePath)){
                files++;
                exeFiles.push(filePath);
            }
        });
        if(files ==1)return exeFiles[0];
        return false;
    }

    /*
    @func 判断该目录下只有一个文件夹
    */
    isOneFolder(softDir){
        let
        that = this,
        exts = that.common.support.file.documentation.extend,
        folders = 0,
        folderFile = [],
        docs = 0,
        files = 0,
        notDoc = 0
        ;

        that.common.node.fs.readdirSync(softDir).forEach((file)=>{
            let
            filePath = that.common.node.path.join(softDir,file)
            ;
            if(that.isFileSync(filePath)){
                files++;
            }
            if(that.isDocFile(filePath)){
                docs++;
            }
            if(that.isDirSync(filePath)){
                folderFile.push(filePath);
                folders++;
            }
        })
        notDoc = files - docs;

        if(!notDoc && folders == 1)return folderFile[0];
        return false;
    }


    /*
    @func 判断是否是一个路径
    */
    isDirSync(dir){

        let 
        that = this
        ;
        if(!dir)return false;
        if(that.common.node.fs.existsSync(dir)){
            let stat = that.common.node.fs.lstatSync(dir).isDirectory();
            return stat;
        }else{
            return false;
        }
    }

    /*
    @func 判断是否存在
    */
    existsSync(dir){
        let 
        that = this
        ;
        if(!dir)return false;
        if(that.common.node.fs.existsSync(dir)){
            return dir;
        }else{
            return false;
        }
    }
    /*
    @func 判断是否是一个路径
    */
    isDir(dir,fn){

        let
            that = this
        ;

        that.common.node.fs.stat(dir,(err,stat)=>{
            if(err){
                if(fn)fn(false);
            }else{
                if(stat.isDirectory()){
                    if(fn)fn(true);
                }else{
                    if(fn)fn(false);
                }
            }
        });
    }

    /*
    @func 判断一组文件是否都是存在
    */
    isFilesSync(dirs,...args){
        if(typeof dirs == "string"){
            dirs = [dirs];
            dirs = dirs.concat(args)
        }
        let
        that = this
        ;
        for(let len = 0;len<dirs.length;len++){
            let
                dir = dirs[len]
            ;
            if(!that.isFileSync(dir)){
                return false
            }
        }
        return true;
    }

    /*
    @func 判断是否是一个文件
    */
    isFileSync(dir){

        let
            that = this
        ;
        if(that.common.node.fs.existsSync(dir) && that.common.node.fs.lstatSync(dir).isFile()){
            return true;
        }else{
            return false;
        }
    }

    /*
    @func 判断是否是一个文件异步
    */
    isFile(dir,fn){
        let
            that = this
        ;
        that.common.node.fs.exists(dir,(exists)=>{
            if(exists){
                that.common.node.fs.stat(dir,(err,stat)=>{
                    if(err){
                        if(fn)fn(false);
                    }else{
                        if(stat.isFile()){
                            if(fn)fn(true);
                        }else{
                            if(fn)fn(false);
                        }
                    }
                });
            }else{
                if(fn)fn(false);
            }
        });
    }


    /**
     * @tools 递归创建目录 同步方法
     */
    mkdirSync(dirname) {
        let 
        that = this
        ;
        dirname = that.common.core.string.trim(dirname,[`"`,`'`]);
        if (that.common.node.fs.existsSync(dirname) && that.common.node.fs.lstatSync(dirname).isDirectory() ) {
            return true;
        } else {
            if (that.mkdirSync(that.common.node.path.dirname(dirname))) {
                that.common.node.fs.mkdirSync(dirname);
                return true;
            }
        }
    }

    /**
     * @tools 递归创建目录 异步方法
     */
    mkdir(dirname,callback) {
        let
            that = this
        ;
        that.common.node.fs.exists(dirname, function (exists) {
            if (exists) {
                if(callback)callback(null);
            } else {
                that.mkdir(that.common.node.path.dirname(dirname), function () {
                    that.common.node.fs.mkdir(dirname, callback);
                });
            }
        });
    }

    /*
    @func 创建一个文件
    */
    touch(file,callback){
        let
            that = this
        ;
        file = this.trim(file,[`"`,`'`]);
        let
            fileDir = that.common.node.path.parse(file).dir
        ;
        that.mkdir(fileDir,()=>{
            that.isFile(file,(exists)=>{
                if(!exists){
                    that.common.node.fs.writeFile(file,"",{encoding:"utf8"},callback);
                }else{
                    if(callback)callback();
                }
            });
        });
        return true;
    }
    /*
    @func 创建一个文件
    */
    touchSync(file){
        let
            that = this
        ;
        file = this.trim(file,[`"`,`'`]);
        let
            fileDir = that.common.node.path.parse(file).dir
        ;
        that.mkdirSync(fileDir);
        if(!that.isFileSync(file)){
            that.common.node.fs.writeFileSync(file,"",{encoding:"utf8"});
        }
        return true;
    }

    /*
    @func 连接一个路径

    */
    pathJoin(p,ext="",Symbol=""){
        
        let 
        that = this
        ;
        p = that.common.core.string.trim(p,[`"`,`'`]);
        p = that.common.node.path.join(p,ext);
        p = that.common.node.path.normalize(p).replace(/\\/ig,"/");;
        p = `${Symbol}${p}${Symbol}`;
        return p;
    }


    /**
     * @tools 删除一个文件
     */
    deleteFileSync(filepath){
        let
        that = this
        ;
        if(that.isFileSync(filepath)){
            try{
                that.common.node.fs.unlinkSync(filepath);
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
        }
        return false;
    }

    /**
     * @tools 删除一个文件
     */
    deleteFile(filepath,callback){
        let
        that = this
        ;

        that.isFile(filepath,(isFile)=>{
            if(isFile){
                that.common.node.fs.unlink(filepath,(err)=>{
                    if(err){
                        console.log(err);
                    }
                    if(callback)callback(err);
                });
            }else{
                if(callback)callback();
            }
        });
    }


    /**
     * @tools 删除一个文件夹
     */
    deletedir(fileUrl){
        let that = this;
        let files = that.common.node.fs.readdirSync(fileUrl);//读取该文件夹
        files.forEach(function(file){
            let stats = that.common.node.fs.statSync(fileUrl+'/'+file);
            if(stats.isDirectory()){
                that.deletedir(fileUrl+'/'+file);
            }else{
                that.common.node.fs.unlinkSync(fileUrl+'/'+file);
            }
        });
        this.emptydir(fileUrl);
    }

    /**
     * @tools 删除一个文件夹
     */
    deleteDirSync(fileUrl){
        let that = this;
        let files = that.common.node.fs.readdirSync(fileUrl);//读取该文件夹
        files.forEach(function(file){
            let stats = that.common.node.fs.statSync(fileUrl+'/'+file);
            if(stats.isDirectory()){
                that.deletedir(fileUrl+'/'+file);
            }else{
                that.common.node.fs.unlinkSync(fileUrl+'/'+file);
            }
        });
        this.emptydir(fileUrl);
    }

    /**
     * @tools 读取一个单一文件夹,需要调函数
     */
    readdir(dir,fn){
        let 
        that = this
        ;
        let d = []
        try{
            d = that.common.node.fs.readdirSync(dir);
        }catch(e){
            console.log(e)
        }
        if(fn)fn(d);
        if(!fn)return d;
    }


    /**
     * @tools 读取文件夹,指定层级读取，需要回调函数
     */
    readdirs(dirPath,sc,fn,Column=false/*是否分栏*/)
    {
        let 
        newReadArr = [
            [dirPath]
        ],
        that = this
        ;
        if(!sc)sc = 1;
        for(let i = 0;i<sc;i++){
            let 
            a = [],
            newReadDirArr = newReadArr[i]
            ;
            if(!newReadDirArr)break;
            for(let k=0;k<newReadDirArr.length;k++){
                let 
                newReadDirString = newReadDirArr[k],
                _dirs = []
                ;
                if(that.common.node.fs.lstatSync(newReadDirString).isDirectory()){
                    _dirs = that.common.node.fs.readdirSync(newReadDirString);
                }
                for(let p=0;p<_dirs.length;p++){
                    _dirs[p] = that.common.node.path.join(newReadDirString,_dirs[p]);
                }
                a = a.concat(_dirs);
            }
            if(a.length > 0)newReadArr.push(a);
        }
        newReadArr.splice(0,1);
        if(!Column){
            let a = [];
            for(let i = 0;i<newReadArr.length;i++){
                a = a.concat(newReadArr[i]);
            }
            newReadArr = a;
        }
        if(fn)fn(newReadArr);
        if(!fn)return newReadArr;
    }

    /*
    @func 写入一个文件
    */
    writeFile(p,content,encodeObj,fn){
        let 
        that = this,
        encode = 'utf8',
        parentDir = that.common.node.path.join(p,"../")
        ;
        if(typeof encodeObj == `function`){
            fn = encodeObj;
        }

        if(typeof encodeObj == `object`){
            encode = encodeObj.encode;
        }

        if(typeof encodeObj == `string`){
            encode = encodeObj;
        }

        encode = encode.toLowerCase();
        //转换编码
        content = that.common.node[`iconv-lite`].encode(content, encode);

        that.isDir(parentDir,(isDir)=>{
            if(!isDir){
                that.mkdir(parentDir,(err)=>{
                    writeF();
                });
            }else{
                writeF();
            }
        });

        function writeF(){
            that.common.node.fs.writeFile(p,content, function (e) {
                if(e)console.log(e);
                if(fn)fn(e);
            });
        }
    }

    /*
    @func 写入一个文件
    */
    writeFileSync(p,content,opt){
        let
        that = this,
        parentDir = that.common.node.path.join(p,"../")
        ;
        that.mkFileDirSync(p);
        if(!opt)opt={encoding:"utf8"};
        that.common.node.fs.writeFileSync(p,content,opt);
    }


    /*
    @func 递归读取文件夹
    */
    deepReadDir(dir,fn){

        let 
        that = this
        ;

    }


    /**
     * @tools 清空一个文件夹
     */
    cleardir(fileUrl){
        let that = this;
        let files = that.common.node.fs.readdirSync(fileUrl);//读取该文件夹
        files.forEach(function(file){
            let stats = that.common.node.fs.statSync(fileUrl+'/'+file);
            if(stats.isDirectory()){
                that.cleardir(fileUrl+'/'+file);
            }else{
                that.common.node.fs.unlinkSync(fileUrl+'/'+file);
            }
        });
        this.transform_cleardir(fileUrl);
    }

    /**
     * @tools 中间函数
     */
    transform_cleardir(fileUrl){
        let that = this;
        let files = that.common.node.fs.readdirSync(fileUrl);
        if(files.length>0){
            files.forEach(function(fileName)
            {
                let fileDirPath = that.common.node.path.join(fileUrl,fileName);
                that.emptydir(fileDirPath);
            });
        }
    }

    /**
     * @tools 删除所有的空文件夹
     */
    emptydir(fileUrl){
        let that = this;
        let files = that.common.node.fs.readdirSync(fileUrl);
        if(files.length>0){
            let tempFile = 0;
            files.forEach(function(fileName)
            {
                tempFile++;
                that.emptydir(fileUrl+'/'+fileName);
            });
            if(tempFile == files.length){//删除母文件夹下的所有字空文件夹后，将母文件夹也删除
                that.common.node.fs.rmdirSync(fileUrl);
            }
        }else{
            that.common.node.fs.rmdirSync(fileUrl);
        }
    }

    /**
     * @tools 清空下级空文件夹
     */
    deleteChildrenEmptyDir(fileUrl,fn){
        let
            that = this,
            files = that.common.node.fs.readdirSync(fileUrl)
        ;
        if(files){
            files.forEach((d,i)=>{
                let
                    childrenFolder = that.common.node.path.join(fileUrl,d)
                ;
                if(that.isEmptydir(childrenFolder)){
                    that.common.node.fs.rmdir(childrenFolder,(e)=>{
                        if(e)console.log(e);
                        if(fn)fn(e);
                    });
                }
            });
        }
    }

    /**
     * @tools 判断一个文件夹是否为空
     */
    isEmptydir(fileUrl){
        let that = this;
        let files = that.common.node.fs.readdirSync(fileUrl);
        if(files.length>0){
            return false;
        }else{
            return true;
        }
    }

    //读取一个文件
    readFile(p){
        let 
        that = this
        ;

        if(!that.common.node.fs.existsSync(p)){
            console.log(`(readFile) not find file...`);
            return null;
        }
        let t = that.common.node.fs.readFileSync(p,"utf8").toString();
        return t;
    }

    //读取一个文件
    readFileSync(p){
        
        let 
        that = this
        ;

        if(!that.common.node.fs.existsSync(p)){
            console.log(`(readFile) not find file...`);
            return null;
        }
        let t = that.common.node.fs.readFileSync(p,"utf8").toString();
        return t;
    }

    //复制一个文件夹
    copy(source,target,fn){
        
        let 
        that = this
        ;

        let dirs = [];
        //如果传入不是数组,则处理为一个二维数组,以便递归调用.
        if( !(source instanceof Array) ){
            dirs.push([source,target]);
        }else{
            //已经是数组的情况下,检查是否二维数组.不是则要处理.
            if( !source[0][0] ){
                dirs.push([source[0],source[1]]);
            }
            if( source[0][0] ){
                dirs=source;
            }

            //将函数移位.
            if(target instanceof Function){
                fn = target;
            }
        }

        (function _copy(i){
            let source = that.common.node.path.normalize(dirs[i][0]);
            source = source.replace(/\/$|\\$/,"");
            let target = that.common.node.path.normalize(dirs[i][1]);

            let copy = child_process_spawn(`xcopy`,[`${source}`,`${target}`,`/E`,`/Y`,`/C`,`/H`]);
            copy.stdout.on('data', function (data) {
                console.log('spawn_stdout: ' + data);
            });

            copy.stderr.on('data', function (data) {
                console.log('spawn_stderr: ' + data);
            });

            copy.on('exit', function (code) {
                i++;
                if(i<dirs.length){
                    _copy(i);
                }else{
                    if(fn)fn(code);
                }
            });
        })(0);
    }

    /*
    @func 是一个文件路径
    */
    isFilePath(path){
        let
        that = this
        ;
        if(that.isFileSync(path)){
            return true;
        }
        if(that.isDirSync(path)){
            return false;
        }
        if(that.common.node.path.parse(path).ext.length && that.common.node.path.parse(path).ext.length < 5){
            return true;
        }else{
            return false;
        }
    }

    /**
     * @func 删除一个文件或目录同步
     * @param path
     */
    deleteSync(path){
        let
            that = this
        ;
        if(that.isDirSync(path)){
            that.deleteDirSync(path);
        }else{
            that.deleteFileSync(path);
        }
    }

    //重命名一个文件
    rename(path,newPath,callback,force=false){
        let
            that = this,
            pathParse = that.common.node.path.parse(path),
            targetExists = that.common.node.fs.existsSync(newPath)
        ;
        //非强制转换时
        if(!force && targetExists){
            that.common.core.console.error(`Target exists . please use (force=true) param.`);
            if(callback)callback();
        }else{
            let
                newPathParse = that.common.node.path.parse(newPath)
            ;
            //同路径则更名
            if(pathParse.root.toLowerCase() == newPathParse.root.toLowerCase()){
                //取得另一个临时路径,用于临时路径的
                let
                    pathTmp = path,
                    tmpParse = that.common.node.path.parse(pathTmp),
                    dirRoot = tmpParse.root,
                    tmpPathArray = pathTmp.split(/[\\\/]+/).splice(1),
                    newTmpPathname = tmpPathArray.splice(-2).join(`_`),
                    newTmpPath = that.common.node.path.join(dirRoot,tmpPathArray.join(`/`)+`/`+newTmpPathname)
                ;
                that.common.node.fs.rename(path,newTmpPath,function(err){
                    if(err)console.log(err);
                    if(targetExists){
                        that.deleteSync(newPath);
                    }
                    that.common.node.fs.rename(newTmpPath,newPath,function(err){
                        if(callback)callback(err);
                    })
                });
                //不同路径则复制,为了避免冲突,复制前需要先改名
            }else{
                //使用此函数是为了防复制过程中卡掉
                let fn = ()=>{
                    try{
                        that.deleteDirSync(path);
                    }catch(e){

                    }
                    if(callback)callback();
                }
                that.node_copy({
                    source:path,
                    target:newPath
                },fn);
            }
        }
    }


    /*
    @func 使用node来复制一个文件夹
    @param boolean force 是否强制复制
    @param string SourceDir 源文件夹
    @param string targetDir 目标文件夹
    */
    node_copy(option,callback=null,test=""){
        /*
        *
        * 1.每个排入的复制都要按队例进行,当上一个队列复制完后,再继续一下们.队列存入 that.option.nodecopy.waitcopylist
        * */
        let
            that = this,
            {
                source,//源文件夹
                target,//目标文件夹
                cover,//强制覆盖
                highWaterMark//写入速度
            } = option
        ;

        if(!that.option.nodecopy){
            // --------------------------------------------------------------------------
            that.option.nodecopy = {
                //等待复制的源及目标队列
                waitCopySourceAndTargetList:new Set(),
                //允许进入复制队列
                allowCopyList : true,
                //函数迭代列表
                callbackSet :[]
            };
            // 给队列生成迭代器 -----------------------------------------------------------
            that.option.nodecopy.waitCopySourceAndTargetListIterator = that.common.core.array.iterator(that.option.nodecopy.waitCopySourceAndTargetList);
            // 顶级队列统计
            that.option.nodecopy.copySourceAndTargetListCount = 0;
        }

        if(!this.fileCount)this.fileCount=0;

        //即有目标也有源文件夹时,添加到复制队列
        if(target && source){
            that.option.nodecopy.waitCopySourceAndTargetList.add({
                source,
                target
            });
        }

        that.option.nodecopy.callbackSet.push(callback);

        (function StartCopy(data,test=""){            

            // console.log(`allowCopyList =>${that.option.nodecopy.allowCopyList} / copySourceAndTargetListCount => ${that.option.nodecopy.copySourceAndTargetListCount} waitCopySourceAndTargetList.size => ${that.option.nodecopy.waitCopySourceAndTargetList.size} test =>${test}`);
            //如果当前队列没有结束,由不允许下一个进入.
            if(that.option.nodecopy.allowCopyList){
                //在队列进行时,设置为不允许一下个进入
                that.option.nodecopy.allowCopyList = false;

                //如果总队列复制次数已经大于当前的总队列大小,则不再迭代数据,以防数据被多迭代一次造成不同步
                if(  that.option.nodecopy.copySourceAndTargetListCount >= that.option.nodecopy.waitCopySourceAndTargetList.size  ) {

                    //全部总队列复制结束
                    //重新开启允许复制
                    that.option.nodecopy.allowCopyList = true;
                    //总队列统计重新归0
                    that.option.nodecopy.copySourceAndTargetListCount = 0;
                }else{
                    
                    let
                        //每次取一个复制源及目标最顶层队列
                        currentFolder = that.option.nodecopy.waitCopySourceAndTargetListIterator.next(),
                        //等待复制的被扫描出的文件队列
                        waitCopyFilesList = new Set(),
                        waitCopyFilesListIterator = that.common.core.array.iterator(waitCopyFilesList)
                    ;

                    if(!currentFolder.done){
                        //将顶级路径添加到队列复制路径
                        waitCopyFilesList.add(currentFolder.value);
                        that.common.core.console.success(`StartCopy:\n\tsource:\t${currentFolder.value.source} \n\ttarget:\t${currentFolder.value.target}\n\tinfo:\t${JSON.stringify(data)}`);

                        //开始扫路径下的文件夹
                        (function scanFolders(j){
                            let
                                currentFolder = waitCopyFilesListIterator.next()
                            ;
                            //扫描结束
                            if(currentFolder.done){
                                //将扫出的文件重新迭代,用于复制队列
                                let
                                    copyFilesListIterator = that.common.core.array.iterator(waitCopyFilesList)
                                ;
                                (function executeCopyFilesList(k,p){
                                    let
                                        currentCopyFileList = copyFilesListIterator.next()
                                    ;
                                    if(currentCopyFileList.done){
                                        //所有复制队列结束. 可以重新将顶层目标/源文件夹载入队列
                                        that.option.nodecopy.copySourceAndTargetListCount++;
                                        that.option.nodecopy.allowCopyList = true;
                                        data = {
                                            copyList:that.option.nodecopy.copySourceAndTargetListCount,//复制队列总数
                                            scanList:(j-1) ? (j-1) : j,//扫描出的文件/文件夹总数数
                                            fileList:k,//扫描出的文件总数数
                                            folderList:(p-1) ? (p-1) : p//扫描出的文件夹总数数
                                        };

                                        let
                                        callback = that.option.nodecopy.callbackSet.splice(0,1)
                                        ;
                                        if(callback)callback = callback[0];
                                        StartCopy(data,"next");
                                        //执行回调
                                        if(callback)callback(data);
                                    }else{

                                        let
                                            {
                                                source,
                                                target
                                            } = currentCopyFileList.value
                                        ;
                                        that.isDir(source,(isDir)=>{
                                            //如果是文件夹,则要建立
                                            if(isDir){

                                                p++;
                                                //通过检测源路径来建立目标路径
                                                that.common.node.fs.exists(target,(exists)=>{
                                                    if(!exists){
                                                        that.mkdir(target,()=>{
                                                            //建立完成,则进入下一次
                                                            executeCopyFilesList(k,p);
                                                        });
                                                    }else{
                                                        //目录存在,直接进入下一次
                                                        executeCopyFilesList(k,p);
                                                    }
                                                });

                                            }else{
                                                //如果是文件则调用复制
                                                k++;
                                                try{
                                                    let
                                                        targetParentDir = that.common.node.path.parse(target).dir
                                                    ;
                                                    //通过检测源路径来建立目标路径
                                                    that.common.node.fs.exists(targetParentDir,(exists)=>{
                                                        if(!exists){
                                                            that.mkdir(targetParentDir,(err)=>{
                                                                //建立完成,进入读取文件流,并回调下一次
                                                                createFile(source,target,()=>{
                                                                    executeCopyFilesList(k,p);
                                                                });
                                                            });
                                                        }else{
                                                            //目录存在,进入读取文件流,并回调下一次
                                                            createFile(source,target,()=>{
                                                                executeCopyFilesList(k,p);
                                                            });
                                                        }
                                                    });

                                                }catch(e){
                                                    console.log(e);
                                                    //出错.继续下一次
                                                    executeCopyFilesList(k,p);
                                                }
                                            }
                                        });
                                    }
                                    
                                })(0,0);
                            }else{
                                let
                                    source = currentFolder.value.source,
                                    target = currentFolder.value.target
                                ;
                                j++;
                                //如果是文件夹,继续下级扫描
                                that.isDir(source,(isDir)=>{
                                    if(isDir){

                                        that.common.node.fs.readdir(source,(err,newFolders)=>{
                                            //先对文件遍历
                                            if(err){
                                                console.log(err);
                                            }else{
                                                //添加到队例,继续搜索
                                                newFolders.forEach((thisOneFolder,index)=>{
                                                    let
                                                        o = {
                                                            source:that.common.node.path.join(source,thisOneFolder),
                                                            target:that.common.node.path.join(target,thisOneFolder)
                                                        }
                                                    ;
                                                    //添加到扫描队伍
                                                    waitCopyFilesList.add(o);
                                                });
                                            }
                                            //一个文件扫结束.继续调用扫一下个
                                            scanFolders(j);
                                        });
                                    }else{
                                        //一个文件扫结束.继续调用扫一下个
                                        scanFolders(j);
                                    }
                                });

                            }
                        })(0);
                    }
                }
            }
        })({ copyList:0,/*复制队列总数*/ scanList:0,/*扫描出的文件/文件夹总数数*/ fileList:0, /*扫描出的文件总数数*/ folderList:0/*扫描出的文件夹总数数*/ });

        //异步执行文件对流复制
        function createFile(source,target,fn){
            that.common.node.fs.exists(target,(exists)=>{
                if(!exists || cover /*强制覆盖*/){
                    //如果文件不存在,则创建
                    that.common.node.fs.writeFile(target,"",(err)=>{
                        if(!err){
                            try{
                                //建立完成,则进入下一次
                                let
                                    readerStream  = that.common.node.fs.createReadStream(source),
                                    writerStream  = that.common.node.fs.createWriteStream(target)
                                ;
                                //是否指定编码
                                //readerStream.setEncoding('UTF8');
                                readerStream.on('data',(chunk)=>{
                                    writerStream.write(chunk);
                                });
                                readerStream.on('end',()=>{
                                    writerStream.end();
                                });
                                writerStream.on('finish',()=>{
                                    //复制完成,则进入下一次
                                    if(fn)fn();
                                });
                            }catch(_err){
                                //对流出错,直接进入下一次
                                console.log(_err);
                                if(fn)fn();
                            }
                        }else{
                            console.log(err);
                            //创建文件出错,直接进入下一次
                            if(fn)fn();
                        }
                    });
                }else{
                    //目标文件存在,直接进入下一次
                    if(fn)fn();
                }
            });
        }
    }

    /**
     * @func 从主要路径连接次要路径,并递归查找直到找到
     * @param pathMain
     * @param pathAdditional
     */
    queryPathJoin(pathMain,pathAdditional){
        let
            that = this,
            NotFindPath = false
        ;
        if(!that.option.queryPathJoinObject){
            that.option.queryPathJoinObject = {
                pathAdditional
            }
        }
        if(!pathAdditional){
            NotFindPath = true;
            pathAdditional = that.option.queryPathJoinObject.pathAdditional;
        }
        pathMain = that.common.core.string.trim(pathMain);
        pathAdditional = that.common.core.string.trim(pathAdditional);
        let
            additionalPathname = pathAdditional.replace(/^.+?\:/,``),
            additionalPathSplitArray = [],
            checkPath = ``,
            queryJoinResult
        ;
        additionalPathSplitArray = additionalPathname.split(/[\\\/]+/);
        additionalPathSplitArray = that.common.core.array.filter(additionalPathSplitArray);
        additionalPathname = additionalPathSplitArray.join(`/`);
        checkPath = that.common.node.path.join(pathMain,additionalPathname);
        if(NotFindPath){
            return checkPath;
        }
        if(that.common.node.fs.existsSync(checkPath)){
            return checkPath;
        }else{
            return that.queryPathJoin(pathMain,additionalPathSplitArray.splice(1).join(`/`));
        }
    }

    /**
     * @func 从一个路径下查找另一个路径直到找到
     * @param path
     * @param file
     * @param queryResult
     * @returns {*}
     */
    queryPathSync(path,file,queryResult = null){
        let
            that = this,
            files = that.common.core.file.isDirSync(path) ? that.common.node.fs.readdirSync(path) : [],
            fullPath = that.common.node.path.join(path,file)
        ;

        if(that.isDirSync(fullPath)){
            return fullPath;
        }

        if(queryResult){
            return queryResult;
        }

        for(let i =0;i<files.length;i++){
            let
            fileOne = files[i],
            fileOnePath = that.common.node.path.join(path,fileOne)
            ;
            if(that.isDirSync(fileOnePath)){
                queryResult = that.queryPathSync(fileOnePath,file,queryResult);
            }else{
                if(fileOne == file){
                    return fileOnePath;
                }
            }
        };

        return queryResult;
    }

    /*
    @func 查找文件直到找到
    */
    queryFileSync(path,file,queryResult = null){
        let
            that = this
        ;
        if(that.isFileSync(file)){
            return file;
        }else{
            that.common.core.console.waring(`Not Find ${file}, continue.`);
        }
        let
            files = that.common.core.file.isDirSync(path) ? that.common.node.fs.readdirSync(path) : [],
            fullPath = that.common.node.path.join(path,file)
        ;

        if(that.isFileSync(fullPath)){
            return fullPath;
        }else{
            that.common.core.console.waring(`Not Find ${fullPath}, continue.`);
        }

        if(queryResult){
            return queryResult;
        }

        for(let i =0;i<files.length;i++){
            let
            fileOne = files[i],
            fileOnePath = that.common.node.path.join(path,fileOne)
            ;
            if(that.isDirSync(fileOnePath)){
                queryResult = that.queryFileSync(fileOnePath,file,queryResult);
            }else{
                if(fileOne == file){
                    return fileOnePath;
                }
            }
        };

        return queryResult;
    }

    /*
    @func 判断是否是一个合法路径
    */
    isPath(path){
        let
        that = this
        ;

        if(typeof path != "string"){
            return false;
        }

        if(path.length > 1024){
            return false;
        }

        if(that.common.node.path.parse(path).root){
            return true
        }
        return false
    }

    /*
    @func 取得临时目录
    */
    getTmpDir(pathname=null){
        let
            that = this,
            tmpDir = that.common.config.platform.base.local.tmpDir
        ;
        if(pathname){
            tmpDir = that.common.node.path.join(tmpDir,pathname);
        }
        return tmpDir;
    }
}

module.exports = fileC;