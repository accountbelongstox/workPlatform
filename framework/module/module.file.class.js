class fileC{
    constructor(o){
    }
    /*
    @func 计算一个文件的MD5值
    */
    md5(path,callback){
        let
            that = this
        ;

        if(that.isFileSync(path)){
            let
                rs = that.load.node.fs.createReadStream(path),
                hash = that.load.node.crypto.createHash('md5')
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
            ext = that.load.node.path.parse(path).ext.replace(/^\.+/ig,""),
            exts = that.load.support.file.exe.extend
        ;
        if(that.load.module.array.findX(exts,ext)){
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
            dir = that.load.node.path.parse(path).dir
        ;
        if(dir)that.mkdirSync(dir);
    }


    /*
    @func 判断是是一个文本说明文件
    */
    isDocFile(path,exists=false){
        let
            that = this,
            ext = that.load.node.path.parse(path).ext.replace(/^\.+/ig,""),
            exts = that.load.support.file.documentation.extend
        ;
        if(exists){
            if(!that.isFileSync(path))return false;
        }
        if(that.load.module.array.findX(exts,ext)){
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
            ext = that.load.node.path.parse(path).ext.replace(/^\.+/ig,""),
            exts = that.load.support.file.zip.extend
        ;
        if(exists){
            if(!that.isFileSync(path))return false;
        }
        if(that.load.module.array.findX(exts,ext)){
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
            dirs = that.load.node.fs.readdirSync(dir),
            files = []
        ;

        dirs.forEach((file)=>{
            let
                filePath = that.load.node.path.join(dir,file)
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
        that.load.node.fs.readdirSync(softDir).forEach((file)=>{
            let
                filePath = that.load.node.path.join(softDir,file)
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

        that.load.node.fs.readdirSync(softDir).forEach((file)=>{
            let
                filePath = that.load.node.path.join(softDir,file)
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
        that.load.node.fs.readdirSync(softDir).forEach((file)=>{
            let
                filePath = that.load.node.path.join(softDir,file)
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
            exts = that.load.support.file.documentation.extend,
            folders = 0,
            folderFile = [],
            docs = 0,
            files = 0,
            notDoc = 0
        ;

        that.load.node.fs.readdirSync(softDir).forEach((file)=>{
            let
                filePath = that.load.node.path.join(softDir,file)
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
        if(that.load.node.fs.existsSync(dir)){
            let stat = that.load.node.fs.lstatSync(dir).isDirectory();
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
        if(that.load.node.fs.existsSync(dir)){
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

        that.load.node.fs.stat(dir,(err,stat)=>{
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
        return that.isFile(dir,null);
    }

    /*
    @func 判断是否是一个文件异步
    */
    isFile(dir,fn=null){
        let
            that = this
        ;
        if(fn){//异步
            that.load.node.fs.exists(dir,(exists)=>{
                if(exists){
                    that.load.node.fs.stat(dir,(err,stat)=>{
                        if(err){
                            console.log(err);
                            if(fn)fn(false);
                        }else{
                            if(fn)fn( (stat.isFile()) );
                        }
                    });
                }else{
                    if(fn)fn(false);
                }
            });
        }else{//同步
            return (that.load.node.fs.existsSync(dir) && that.load.node.fs.lstatSync(dir).isFile());
        }
    }


    /**
     * @tools 递归创建目录 同步方法
     */
    mkdirSync(dirname) {
        let
            that = this
        ;
        dirname = that.load.module.string.trim(dirname,[`"`,`'`]);
        if (that.load.node.fs.existsSync(dirname) && that.load.node.fs.lstatSync(dirname).isDirectory() ) {
            return true;
        } else {
            if (that.mkdirSync(that.load.node.path.dirname(dirname))) {
                that.load.node.fs.mkdirSync(dirname);
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
        that.load.node.fs.exists(dirname, function (exists) {
            if (exists) {
                if(callback)callback(null);
            } else {
                that.mkdir(that.load.node.path.dirname(dirname), function () {
                    that.load.node.fs.mkdir(dirname, callback);
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
            fileDir = that.load.node.path.parse(file).dir
        ;
        that.mkdir(fileDir,()=>{
            that.isFile(file,(exists)=>{
                if(!exists){
                    that.load.node.fs.writeFile(file,"",{encoding:"utf8"},callback);
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
            fileDir = that.load.node.path.parse(file).dir
        ;
        that.mkdirSync(fileDir);
        if(!that.isFileSync(file)){
            that.load.node.fs.writeFileSync(file,"",{encoding:"utf8"});
        }
        return true;
    }

    /**
     * @func 连接一个路径
     **/
    pathJoin(p,ext="",Symbol=""){

        let
            that = this
        ;
        p = that.load.module.string.trim(p,[`"`,`'`]);
        p = that.load.node.path.join(p,ext);
        p = that.load.node.path.normalize(p).replace(/\\/ig,"/");;
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
                that.load.node.fs.unlinkSync(filepath);
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
                that.load.node.fs.unlink(filepath,(err)=>{
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
        let files = that.load.node.fs.readdirSync(fileUrl);//读取该文件夹
        files.forEach(function(file){
            let stats = that.load.node.fs.statSync(fileUrl+'/'+file);
            if(stats.isDirectory()){
                that.deletedir(fileUrl+'/'+file);
            }else{
                that.load.node.fs.unlinkSync(fileUrl+'/'+file);
            }
        });
        this.emptydir(fileUrl);
    }

    /**
     * @tools 删除一个文件夹
     */
    deleteDirSync(fileUrl){
        let that = this;
        let files = that.load.node.fs.readdirSync(fileUrl);//读取该文件夹
        files.forEach(function(file){
            let stats = that.load.node.fs.statSync(fileUrl+'/'+file);
            if(stats.isDirectory()){
                that.deletedir(fileUrl+'/'+file);
            }else{
                that.load.node.fs.unlinkSync(fileUrl+'/'+file);
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
            d = that.load.node.fs.readdirSync(dir);
        }catch(e){
            console.log(e)
        }
        if(fn)fn(d);
        if(!fn)return d;
    }


    /**
     * @tools 读取文件夹,指定层级读取，需要回调函数
     */
    readdirs(dirPath,fn,Column=false/*是否分栏*/){
        let
            that = this,
            newReadArr = [
                dirPath
            ],
            len = 0,
            dirs=[],
            result = null,
            files=[]
        ;
        while(len < newReadArr.length){
            let
                newReadPathString = newReadArr[len],
                _dirs = []
            ;
            try{
                if(that.load.node.fs.lstatSync(newReadPathString).isDirectory()){
                    _dirs = that.load.node.fs.readdirSync(newReadPathString);
                    _dirs.forEach((_dirItem,index)=>{
                        _dirs[index] = that.load.node.path.join(newReadPathString,_dirItem);
                    });
                    newReadArr = newReadArr.concat(_dirs);
                    dirs.push(newReadPathString);
                }else{
                    files.push(newReadPathString);
                }
            }catch(err){
                console.log(err);
                files.push(newReadPathString);
            }
            len++;
        }
        dirs = that.load.module.array.filter(dirs);
        files = that.load.module.array.filter(files);
        if(Column){
            result = {
                dirs,files
            }
        }else{
            result = dirs.concat(files);
        }
        if(fn){
            fn(result);
        }else{
            return result;
        }
    }

    /*
    @func 写入一个文件 不推荐直接写入buffer
    */
    writeFile(file_path,content,encodeObj,callback){
        let
            that = this,
            encode = 'utf8',
            parentDir = that.load.node.path.join(file_path,"../"),
            writeFileNode = (p,c,cb)=>{
                that.load.node.fs.writeFile(p,c, {encoding:`binary`}, function (e) {
                    if(e)console.log(e);
                    if(cb)cb(e);
                });
            }
        ;
        if(Buffer.isBuffer(content)){
            content = content.toString();
        }
        if(encodeObj instanceof Function){
            callback = encodeObj;
            encodeObj = null;
        }
        if(encodeObj){
            if(typeof encodeObj === `object`){
                encode = encodeObj.encoding;
            }
            if(typeof encodeObj === `string`){
                encode = encodeObj;
            }
        }
        content = that.load.module.string.to(content,encode);
        if(callback){//异步写入
            that.isDir(parentDir,(isDir)=>{
                if(!isDir){
                    that.mkdir(parentDir,(err)=>{
                        writeFileNode(file_path,content,callback);
                    });
                }else{
                    writeFileNode(file_path,content,callback);
                }
            });
        }else{
            that.mkdirSync(parentDir);
            that.load.node.fs.writeFileSync(file_path,content,{encoding:`binary`});
        }
    }

    /*
    @func 写入一个文件
    */
    writeFileSync(file_path,content,encodeObj){
        let
            that = this
        ;
        that.writeFile(file_path,content,encodeObj);
    }


    /*
    @func 递归读取文件夹
    */
    deepReadDir(dir,callback){
        let
            that = this
        ;
    }


    /**
     * @tools 清空一个文件夹
     */
    cleardir(fileUrl){
        let that = this;
        let files = that.load.node.fs.readdirSync(fileUrl);//读取该文件夹
        files.forEach(function(file){
            let stats = that.load.node.fs.statSync(fileUrl+'/'+file);
            if(stats.isDirectory()){
                that.cleardir(fileUrl+'/'+file);
            }else{
                that.load.node.fs.unlinkSync(fileUrl+'/'+file);
            }
        });
        this.transform_cleardir(fileUrl);
    }

    /**
     * @tools 中间函数
     */
    transform_cleardir(fileUrl){
        let that = this;
        let files = that.load.node.fs.readdirSync(fileUrl);
        if(files.length>0){
            files.forEach(function(fileName)
            {
                let fileDirPath = that.load.node.path.join(fileUrl,fileName);
                that.emptydir(fileDirPath);
            });
        }
    }

    /**
     * @tools 删除所有的空文件夹
     */
    emptydir(fileUrl){
        let
            that = this,
            files = that.load.node.fs.readdirSync(fileUrl)
        ;
        if(files.length>0){
            let tempFile = 0;
            files.forEach(function(fileName)
            {
                tempFile++;
                that.emptydir(fileUrl+'/'+fileName);
            });
            if(tempFile == files.length){//删除母文件夹下的所有字空文件夹后，将母文件夹也删除
                that.load.node.fs.rmdirSync(fileUrl);
            }
        }else{
            that.load.node.fs.rmdirSync(fileUrl);
        }
    }
    emptyDir(fileUrl){
        let
            that = this
        ;
        return that.emptydir(fileUrl);
    }

    /**
     * @tools 清空下级空文件夹
     */
    deleteChildrenEmptyDir(fileUrl,fn){
        let
            that = this,
            files = that.load.node.fs.readdirSync(fileUrl)
        ;
        if(files){
            files.forEach((d,i)=>{
                let
                    childrenFolder = that.load.node.path.join(fileUrl,d)
                ;
                if(that.isEmptydir(childrenFolder)){
                    that.load.node.fs.rmdir(childrenFolder,(e)=>{
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
        let files = that.load.node.fs.readdirSync(fileUrl);
        return (files.length < 1);
    }

    /**
     * @func 读取一个文件, 支持 同步  异步读取,支持GBK读取
     * @param file_path
     * @param option_or_callback
     * @param callback
     */
    readFile(file_path,option_or_callback,callback){
        let
            that = this,
            not_file = `(readFile) not find file...`,
            encoding = "utf8"
        ;
        if(option_or_callback instanceof Function || !option_or_callback){
            callback = option_or_callback;
            encoding = "utf8";
        }
        if(typeof option_or_callback === "object"){
            encoding = option_or_callback.encoding;
        }
        if(typeof option_or_callback === "string"){
            encoding = option_or_callback;
        }
        if(encoding.toUpperCase() === "GBK"){
            encoding = "GBK";
        }
        //异步读取
        if(callback){
            that.load.node.fs.exists(p,(exists)=>{
                if(exists){
                    that.load.node.fs.readFile(file_path,{encoding:`binary`},(data)=>{
                        data = that.load.module.string.to(data,encoding);
                        if(callback)callback(data);
                    });
                }else{
                    console.log(not_file);
                    if(callback)callback(null);
                }
            });
        }else{ //同步读取
            if(that.load.node.fs.existsSync(file_path)){
                let
                    data = that.load.node.fs.readFileSync(file_path,{encoding:`binary`})
                ;
                data = Buffer.from(data,`binary`);
                data = that.load.module.string.to(data,encoding);
                return data;
            }else{
                console.log(not_file);
                return null;
            }
        }
    }

    /**
     * @func 读取一个文件同步版,支持 GBK
     * @param file_path
     * @param option
     * @returns {*}
     */
    readFileSync(file_path,option){
        let
            that = this
        ;
        return that.readFile(file_path,option,null);
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
            let
                dir = dirs[i][0],
                dirNormalize = that.load.node.path.normalize(dir),
                source = dirNormalize.replace(/\/$|\\$/,""),
                target = dirNormalize,
                copy = child_process_spawn(`xcopy`,[`${source}`,`${target}`,`/E`,`/Y`,`/C`,`/H`])
            ;
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
        if(that.load.node.path.parse(path).ext.length && that.load.node.path.parse(path).ext.length < 5){
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
            pathParse = that.load.node.path.parse(path),
            targetExists = that.load.node.fs.existsSync(newPath)
        ;
        //非强制转换时
        if(!force && targetExists){
            that.load.module.console.error(`Target exists . please use (force=true) param.`);
            if(callback)callback();
        }else{
            let
                newPathParse = that.load.node.path.parse(newPath)
            ;
            //同路径则更名
            if(pathParse.root.replace(/\\/g,`/`).toLowerCase() == newPathParse.root.replace(/\\/g,`/`).toLowerCase()){
                //取得另一个临时路径,用于临时路径的
                let
                    pathTmp = path,
                    tmpParse = that.load.node.path.parse(pathTmp),
                    newPathParse = that.load.node.path.parse(newPath),
                    dirRoot = tmpParse.root,
                    tmpPathArray = pathTmp.split(/[\\\/]+/).splice(1),
                    newTmpPathname = tmpPathArray.splice(-2).join(`_`),
                    renameTmpDir = ".rename.tmp",
                    renameTmpRoot = that.load.node.path.join(dirRoot,renameTmpDir),
                    newTmpPath = that.load.node.path.join(renameTmpRoot,(tmpPathArray.join(`_`)+`_`+newTmpPathname).replace(/\s+/ig,`_`))
                ;
                that.mkdirSync(renameTmpRoot);
                that.load.module.console.info(`node fs rename ${path} to ${newTmpPath}.`);
                that.load.node.fs.rename(path,newTmpPath,function(err){
                    that.load.module.console.info(`node fs rename ${path} to ${newTmpPath} success.`,4);
                    if(err)console.log(err);
                    if(targetExists){
                        that.deleteSync(newPath);
                    }
                    if(!that.isDirSync(newPathParse.dir)){
                        that.mkdirSync(newPathParse.dir);
                    }
                    that.load.module.console.info(`node fs rename ${newTmpPath} to ${newPath}.`);
                    that.load.node.fs.rename(newTmpPath,newPath,function(err){
                        that.load.module.console.info(`node fs rename ${newTmpPath} to ${newPath} success.`,4)
                        that.deleteDirSync(renameTmpRoot);
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
                    that.load.module.console.info(`node copy source:"${path}" to target:"${newPath}" success.`,4);
                    if(callback)callback();
                }
                that.load.module.console.info(`node copy source:"${path}" to target:"${newPath}".`);
                that.node_copy(path,newPath,fn);
            }
        }
    }
    /**
     @func 使用node来复制一个文件夹
     @param sourceDir 源文件夹
     @param targetDir 目标文件夹
     @param callback 回调函数
     **/
    node_copy(sourceDir,targetDir,callback){
        let
            that = this,
            copyObject ={sourceDir,targetDir,callback},
            copyArrayTemp = []
        ;

        if(!that.option.nodeCopyList){
            that.option.nodeCopyList = [
                copyObject
            ];
        }else{
            that.option.nodeCopyList.push(copyObject);
        }
        (function copy(len){
            copyArrayTemp = that.option.nodeCopyList.splice(0,1);
            if( copyArrayTemp.length ) {
                let
                    copyObjectOne = copyArrayTemp[0],
                    scanResult = that.readdirs(copyObjectOne.sourceDir,null,true),
                    removeSymbolReg = /\\+/ig,
                    fileListSourceDirToTargetDirKeyValue = []
                ;
                for(let p in scanResult){
                    let
                        scanResultOne = scanResult[p]
                    ;
                    scanResultOne.forEach((item,index)=>{
                        let
                            _item = item.replace(removeSymbolReg,`/`)
                        ;
                        copyObjectOne.sourceDir = copyObjectOne.sourceDir.replace(removeSymbolReg,`/`);
                        _item = _item.replace(copyObjectOne.sourceDir,``);
                        _item = that.load.node.path.join(copyObjectOne.targetDir,_item);
                        scanResultOne[index] = _item;
                        if(p === "dirs"){
                            that.mkdirSync(_item);
                        }
                        if(p === "files"){
                            fileListSourceDirToTargetDirKeyValue.push({
                                source:item,
                                target:_item
                            });
                        }
                    });
                }
                (function copyFile(fileLen){
                    let
                        fileAllLen = fileListSourceDirToTargetDirKeyValue.length
                    ;
                    if( fileLen < fileAllLen) {
                        let
                            fileObject = fileListSourceDirToTargetDirKeyValue[fileLen],
                            readStream = that.load.node.fs.createReadStream(fileObject.source),
                            writeStream = that.load.node.fs.createWriteStream(fileObject.target),
                            next = true
                        ;
                        readStream.on('data', function(chunk) { // 当有数据流出时，写入数据
                            if (writeStream.write(chunk) === false) { // 如果没有写完，暂停读取流
                                readStream.pause();
                            }
                        });
                        writeStream.on('drain', function() { // 写完后，继续读取
                            readStream.resume();
                        });

                        readStream.on('end', function() { // 当没有数据时，关闭数据流
                            that.load.module.console.info(`Copy ${fileLen+1}/${fileAllLen} : "${fileObject.source}"->"${fileObject.target}" success.`,6);
                            writeStream.end();
                            if(next){
                                next = false;
                                copyFile(++fileLen);
                            }
                        });
                        readStream.on('error', function(err){
                            that.load.module.console.error(err.stack);
                            if(next){
                                next = false;
                                copyFile(++fileLen);
                            }
                        });
                    }else{
                        that.load.module.console.success(`node copy finish. files:${fileAllLen},dirs:${scanResult.dirs.length}`);
                        let
                            nextSet = new Set([copy,copyObjectOne.callback]),
                            nextIterator = that.load.module.array.iterator(nextSet),
                            execSort = 0
                        ;
                        (function executeCallback(){
                            let
                                next = nextIterator.next()
                            ;
                            if(!next.done)
                            {
                                executeCallback();
                                switch (execSort) {
                                    case 0:
                                        execSort++;
                                        if(next.value)next.value(scanResult);
                                        break;
                                    case 1:
                                        execSort++;
                                        next.value(++len);
                                        break;
                                }
                            }
                        })();
                    }
                })(0);
            }else{
                that.option.nodeCopyList = null;
                that.load.module.console.success(`node copy list finish.`);
            }
        })(0);
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
        pathMain = that.load.module.string.trim(pathMain);
        pathAdditional = that.load.module.string.trim(pathAdditional);
        let
            additionalPathname = pathAdditional.replace(/^.+?\:/,``),
            additionalPathSplitArray = [],
            checkPath = ``,
            queryJoinResult
        ;
        additionalPathSplitArray = additionalPathname.split(/[\\\/]+/);
        additionalPathSplitArray = that.load.module.array.filter(additionalPathSplitArray);
        additionalPathname = additionalPathSplitArray.join(`/`);
        checkPath = that.load.node.path.join(pathMain,additionalPathname);
        if(NotFindPath){
            return checkPath;
        }
        if(that.load.node.fs.existsSync(checkPath)){
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
            files = that.load.module.file.isDirSync(path) ? that.load.node.fs.readdirSync(path) : [],
            fullPath = that.load.node.path.join(path,file)
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
                fileOnePath = that.load.node.path.join(path,fileOne)
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

    /**
     * @func 查找文件直到找到
     */
    queryFileSync(path,file,queryResult = null){
        let
            that = this
        ;
        if(that.isFileSync(file)){
            return file;
        }else{
            that.load.module.console.waring(`Not Find ${file}, continue.`);
        }
        let
            files = that.load.module.file.isDirSync(path) ? that.load.node.fs.readdirSync(path) : [],
            fullPath = that.load.node.path.join(path,file)
        ;
        if(that.isFileSync(fullPath)){
            return fullPath;
        }else{
            that.load.module.console.waring(`Not Find ${fullPath}, continue.`);
        }
        if(queryResult){
            return queryResult;
        }
        for(let i =0;i<files.length;i++){
            let
                fileOne = files[i],
                fileOnePath = that.load.node.path.join(path,fileOne)
            ;
            if(that.isDirSync(fileOnePath)){
                queryResult = that.queryFileSync(fileOnePath,file,queryResult);
            }else{
                if(fileOne === file){
                    return fileOnePath;
                }
            }
        }
        return queryResult;
    }

    /**
     * @func 在一个文件里查找一行字符串
     * @param filePath
     * @param text
     * @returns {null,string}
     */
    queryTextLineInFile(filePath,text){
        let
            that = this,
            fileContent,
            fileLines,
            fileSplitReg = /[\r\n]+/,
            textRegText = that.load.module.string.strToRegText(text),
            textReg = new RegExp(`${textRegText}`),
            queryTextResult = ``
        ;
        if(that.isFileSync(filePath)){
            fileContent = that.readFileSync(filePath);
            fileLines = fileContent.split(fileSplitReg);
            fileLines.forEach((fileLine)=>{
                if(fileLine.test(textReg)){
                    queryTextResult = fileLine;
                }
            });
            return queryTextResult;
        }else{
            return null
        }
    }

    /*
    @func 判断是否是一个合法路径
    */
    isPath(path){
        let
            that = this,
            //路径里禁止出现的字符
            ignores = `*?"<>|`.split(/\B/),
            isIgnore = false,
            pathParse = null
        ;
        path = that.load.module.string.trimX(path);
        pathParse = that.load.node.path.parse(path);
        if(typeof path !== "string"){
            return false;
        }
        ignores.forEach((ignore)=>{
            if(path.includes(ignore)){
                isIgnore = true;
            }
        });
        if( isIgnore ){
            return false;
        }else if( pathParse.root && !(/\s/.test(pathParse.base)) ){
            return true;
        }else{
            return false;
        }
    }

    /**
     * @func 将路径格式化为一种形式
     * @param path
     */
    pathFormat(...paths){
        let
            that = this,
            pathJoin = ``
        ;
        paths.forEach((path)=>{
            pathJoin = that.load.node.path.join(pathJoin,path)
        });
        pathJoin = pathJoin.replace(/\\+/ig,`/`);
        pathJoin = pathJoin.replace(/\/+/ig,`/`);
        pathJoin = pathJoin.replace(/\/$/ig,``);
        return pathJoin
    }

    /*
    @func 取得临时目录
    */
    getTmpDir(pathname=null){
        let
            that = this,
            tmpDir = that.load.config.platform.base.local.tmpDir
        ;
        if(pathname){
            tmpDir = that.load.node.path.join(tmpDir,pathname);
        }
        return tmpDir;
    }


    /*
    @func 通过无BOM的方式读取html文件
    */
    removeBOM(htmlPath,callback){

        let
            that = this
        ;

        if(!that.load.node.fs.existsSync(htmlPath)){
            console.log(`read - error : not find ${htmlPath}.`)
            return `<!-- not find ${htmlPath} -->`;
        }
        let
            html=that.load.node.fs.readFileSync(htmlPath)
        ;
        if( html[0].toString(16).toLowerCase() === "ef" && html[1].toString(16).toLowerCase() === "bb" && html[2].toString(16).toLowerCase() === "bf" ) {
            html = html.slice(3);
            //发现bom就覆盖原文件.
            that.load.node.fs.writeFileSync(htmlPath,html.toString(),'utf8');
        }
        html = html.toString();
        if(callback)callback(html);
    }


    /**
     * @func
     * @param zipPath
     * @param unzipPath
     * @param callback
     */
    unzip(zipPath,unzipPath,callback){
        let
            that = this
        ;
        if(!that.load.node.fs.existsSync(unzipPath)){
            that.mkdirSync(unzipPath);
        }
        // 解压缩
        that.load.node.compressing.zip.uncompress(zipPath,unzipPath)
            .then(() => {
                console.log(`unzip file ${zipPath} to ${unzipPath} success!`);
                if(callback)callback(true);
            })
            .catch(err => {
                console.log(`unzip err!`,err);
                if(callback)callback(false);
            });
    }

}

module.exports = fileC;