class fileC{
	constructor(o){
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
            rs = that.o.node.fs.createReadStream(path),
            hash = that.o.node.crypto.createHash('md5')
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
        ext = that.o.node.path.parse(path).ext.replace(/^\.+/ig,""),
        exts = that.o.support.file.exe.extend
        ;
        if(that.o.tool.array.findX(exts,ext)){
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
        dir = that.o.node.path.parse(path).dir
        ;
        if(dir)that.mkdirSync(dir);
    }


    /*
    @func 判断是是一个文本说明文件
    */
    isDocFile(path,exists=false){
        let
        that = this,
        ext = that.o.node.path.parse(path).ext.replace(/^\.+/ig,""),
        exts = that.o.support.file.documentation.extend
        ;
        if(exists){
            if(!that.isFileSync(path))return false;
        }
        if(that.o.tool.array.findX(exts,ext)){
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
        ext = that.o.node.path.parse(path).ext.replace(/^\.+/ig,""),
        exts = that.o.support.file.zip.extend
        ;
        if(exists){
            if(!that.isFileSync(path))return false;
        }
        if(that.o.tool.array.findX(exts,ext)){
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
        dirs = that.o.node.fs.readdirSync(dir),
        files = []
        ;

        dirs.forEach((file)=>{
            let
            filePath = that.o.node.path.join(dir,file)
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
        that.o.node.fs.readdirSync(softDir).forEach((file)=>{
            let
            filePath = that.o.node.path.join(softDir,file)
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

        that.o.node.fs.readdirSync(softDir).forEach((file)=>{
            let
            filePath = that.o.node.path.join(softDir,file)
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
        that.o.node.fs.readdirSync(softDir).forEach((file)=>{
            let
            filePath = that.o.node.path.join(softDir,file)
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
        exts = that.o.support.file.documentation.extend,
        folders = 0,
        folderFile = [],
        docs = 0,
        files = 0,
        notDoc = 0
        ;

        that.o.node.fs.readdirSync(softDir).forEach((file)=>{
            let
            filePath = that.o.node.path.join(softDir,file)
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
        if(that.o.node.fs.existsSync(dir)){
            let stat = that.o.node.fs.lstatSync(dir).isDirectory();
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
        if(that.o.node.fs.existsSync(dir)){
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

        that.o.node.fs.stat(dir,(err,stat)=>{
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
        if(that.o.node.fs.existsSync(dir) && that.o.node.fs.lstatSync(dir).isFile()){
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
        that.o.node.fs.exists(dir,(exists)=>{
            if(exists){
                that.o.node.fs.stat(dir,(err,stat)=>{
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
        dirname = that.o.tool.string.trim(dirname,[`"`,`'`]);
        if (that.o.node.fs.existsSync(dirname) && that.o.node.fs.lstatSync(dirname).isDirectory() ) {
            return true;
        } else {
            if (that.mkdirSync(that.o.node.path.dirname(dirname))) {
                that.o.node.fs.mkdirSync(dirname);
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
        that.o.node.fs.exists(dirname, function (exists) {
            if (exists) {
                if(callback)callback(null);
            } else {
                that.mkdir(that.o.node.path.dirname(dirname), function () {
                    that.o.node.fs.mkdir(dirname, callback);
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
            fileDir = that.o.node.path.parse(file).dir
        ;
        that.mkdir(fileDir,()=>{
            that.isFile(file,(exists)=>{
                if(!exists){
                    that.o.node.fs.writeFile(file,"",{encoding:"utf8"},callback);
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
            fileDir = that.o.node.path.parse(file).dir
        ;
        that.mkdirSync(fileDir);
        if(!that.isFileSync(file)){
            that.o.node.fs.writeFileSync(file,"",{encoding:"utf8"});
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
        p = that.o.tool.string.trim(p,[`"`,`'`]);
        p = that.o.node.path.join(p,ext);
        p = that.o.node.path.normalize(p).replace(/\\/ig,"/");;
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
                that.o.node.fs.unlinkSync(filepath);
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
                that.o.node.fs.unlink(filepath,(err)=>{
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
        let files = that.o.node.fs.readdirSync(fileUrl);//读取该文件夹
        files.forEach(function(file){
            let stats = that.o.node.fs.statSync(fileUrl+'/'+file);
            if(stats.isDirectory()){
                that.deletedir(fileUrl+'/'+file);
            }else{
                that.o.node.fs.unlinkSync(fileUrl+'/'+file);
            }
        });
        this.emptydir(fileUrl);
    }

    /**
     * @tools 删除一个文件夹
     */
    deleteDirSync(fileUrl){
        let that = this;
        let files = that.o.node.fs.readdirSync(fileUrl);//读取该文件夹
        files.forEach(function(file){
            let stats = that.o.node.fs.statSync(fileUrl+'/'+file);
            if(stats.isDirectory()){
                that.deletedir(fileUrl+'/'+file);
            }else{
                that.o.node.fs.unlinkSync(fileUrl+'/'+file);
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
            d = that.o.node.fs.readdirSync(dir);
        }catch(e){
            console.log(e)
        }
        if(fn)fn(d);
        if(!fn)return d;
    }




    /**
     * @tools 读取文件夹,指定层级读取，需要回调函数
     */
    readdirs(dirPath,fn,Column=false/*是否分栏*/)
    {
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
                if(that.o.node.fs.lstatSync(newReadPathString).isDirectory()){
                    _dirs = that.o.node.fs.readdirSync(newReadPathString);
                    _dirs.forEach((_dirItem,index)=>{
                        _dirs[index] = that.o.node.path.join(newReadPathString,_dirItem);
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
        dirs = that.o.tool.array.filter(dirs);
        files = that.o.tool.array.filter(files);
        if(Column){
            result = {
                dirs,files
            }
        }else{
            result = dirs.concat(files);
        }
        if(fn)fn(result);
        if(!fn)return result;
    }

    /*
    @func 写入一个文件
    */
    writeFile(p,content,encodeObj,fn){
        let 
        that = this,
        encode = 'utf8',
        parentDir = that.o.node.path.join(p,"../")
        ;
        if(typeof encodeObj === `function`){
            fn = encodeObj;
        }

        if(typeof encodeObj === `object`){
            encode = encodeObj.encoding;
        }

        if(typeof encodeObj === `string`){
            encode = encodeObj;
        }

        encode = encode.toLowerCase();
        //转换编码
        content = that.o.node[`iconv-lite`].encode(content, encode);

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
            that.o.node.fs.writeFile(p,content, function (e) {
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
            encoding = 'utf8'
        ;
        that.mkFileDirSync(p);
        if(!opt){
            opt={encoding};
        }
        content = that.o.node["iconv-lite"].encode(content, encoding);
        that.o.node.fs.writeFileSync(p,content,opt);
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
        let files = that.o.node.fs.readdirSync(fileUrl);//读取该文件夹
        files.forEach(function(file){
            let stats = that.o.node.fs.statSync(fileUrl+'/'+file);
            if(stats.isDirectory()){
                that.cleardir(fileUrl+'/'+file);
            }else{
                that.o.node.fs.unlinkSync(fileUrl+'/'+file);
            }
        });
        this.transform_cleardir(fileUrl);
    }

    /**
     * @tools 中间函数
     */
    transform_cleardir(fileUrl){
        let that = this;
        let files = that.o.node.fs.readdirSync(fileUrl);
        if(files.length>0){
            files.forEach(function(fileName)
            {
                let fileDirPath = that.o.node.path.join(fileUrl,fileName);
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
            files = that.o.node.fs.readdirSync(fileUrl)
        ;
        if(files.length>0){
            let tempFile = 0;
            files.forEach(function(fileName)
            {
                tempFile++;
                that.emptydir(fileUrl+'/'+fileName);
            });
            if(tempFile == files.length){//删除母文件夹下的所有字空文件夹后，将母文件夹也删除
                that.o.node.fs.rmdirSync(fileUrl);
            }
        }else{
            that.o.node.fs.rmdirSync(fileUrl);
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
            files = that.o.node.fs.readdirSync(fileUrl)
        ;
        if(files){
            files.forEach((d,i)=>{
                let
                    childrenFolder = that.o.node.path.join(fileUrl,d)
                ;
                if(that.isEmptydir(childrenFolder)){
                    that.o.node.fs.rmdir(childrenFolder,(e)=>{
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
        let files = that.o.node.fs.readdirSync(fileUrl);
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

        if(!that.o.node.fs.existsSync(p)){
            console.log(`(readFile) not find file...`);
            return null;
        }
        let t = that.o.node.fs.readFileSync(p,"utf8").toString();
        return t;
    }

    //读取一个文件
    readFileSync(p){
        
        let 
        that = this
        ;

        if(!that.o.node.fs.existsSync(p)){
            console.log(`(readFile) not find file...`);
            return null;
        }
        let t = that.o.node.fs.readFileSync(p,"utf8").toString();
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
            let
                dir = dirs[i][0],
                dirNormalize = that.o.node.path.normalize(dir),
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
        if(that.o.node.path.parse(path).ext.length && that.o.node.path.parse(path).ext.length < 5){
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
            pathParse = that.o.node.path.parse(path),
            targetExists = that.o.node.fs.existsSync(newPath)
        ;
        //非强制转换时
        if(!force && targetExists){
            that.o.tool.console.error(`Target exists . please use (force=true) param.`);
            if(callback)callback();
        }else{
            let
                newPathParse = that.o.node.path.parse(newPath)
            ;
            //同路径则更名
            if(pathParse.root.replace(/\\/g,`/`).toLowerCase() == newPathParse.root.replace(/\\/g,`/`).toLowerCase()){
                //取得另一个临时路径,用于临时路径的
                let
                    pathTmp = path,
                    tmpParse = that.o.node.path.parse(pathTmp),
                    newPathParse = that.o.node.path.parse(newPath),
                    dirRoot = tmpParse.root,
                    tmpPathArray = pathTmp.split(/[\\\/]+/).splice(1),
                    newTmpPathname = tmpPathArray.splice(-2).join(`_`),
                    renameTmpDir = ".rename.tmp",
                    renameTmpRoot = that.o.node.path.join(dirRoot,renameTmpDir),
                    newTmpPath = that.o.node.path.join(renameTmpRoot,(tmpPathArray.join(`_`)+`_`+newTmpPathname).replace(/\s+/ig,`_`))
                ;
                that.mkdirSync(renameTmpRoot);
                that.o.tool.console.info(`node fs rename ${path} to ${newTmpPath}.`);
                that.o.node.fs.rename(path,newTmpPath,function(err){
                    that.o.tool.console.info(`node fs rename ${path} to ${newTmpPath} success.`,4);
                    if(err)console.log(err);
                    if(targetExists){
                        that.deleteSync(newPath);
                    }
                    if(!that.isDirSync(newPathParse.dir)){
                        that.mkdirSync(newPathParse.dir);
                    }
                    that.o.tool.console.info(`node fs rename ${newTmpPath} to ${newPath}.`);
                    that.o.node.fs.rename(newTmpPath,newPath,function(err){
                        that.o.tool.console.info(`node fs rename ${newTmpPath} to ${newPath} success.`,4)
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
                    that.o.tool.console.info(`node copy source:"${path}" to target:"${newPath}" success.`,4);
                    if(callback)callback();
                }
                that.o.tool.console.info(`node copy source:"${path}" to target:"${newPath}".`);
                that.node_copy(path,newPath,fn);
            }
        }
    }
    /*
    @func 使用node来复制一个文件夹
    @param boolean force 是否强制复制
    @param string SourceDir 源文件夹
    @param string targetDir 目标文件夹
    */
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
                        _item = that.o.node.path.join(copyObjectOne.targetDir,_item);
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
                            readStream = that.o.node.fs.createReadStream(fileObject.source),
                            writeStream = that.o.node.fs.createWriteStream(fileObject.target),
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
                            that.o.tool.console.info(`Copy ${fileLen+1}/${fileAllLen} : "${fileObject.source}"->"${fileObject.target}" success.`,6);
                            writeStream.end();
                            if(next){
                                next = false;
                                copyFile(++fileLen);
                            }
                        });
                        readStream.on('error', function(err){
                            that.o.tool.console.error(err.stack);
                            if(next){
                                next = false;
                                copyFile(++fileLen);
                            }
                        });
                    }else{
                        that.o.tool.console.success(`node copy finish. files:${fileAllLen},dirs:${scanResult.dirs.length}`);
                        let
                            nextSet = new Set([copy,copyObjectOne.callback]),
                            nextIterator = that.o.tool.array.iterator(nextSet),
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
                that.o.tool.console.success(`node copy list finish.`);
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
        pathMain = that.o.tool.string.trim(pathMain);
        pathAdditional = that.o.tool.string.trim(pathAdditional);
        let
            additionalPathname = pathAdditional.replace(/^.+?\:/,``),
            additionalPathSplitArray = [],
            checkPath = ``,
            queryJoinResult
        ;
        additionalPathSplitArray = additionalPathname.split(/[\\\/]+/);
        additionalPathSplitArray = that.o.tool.array.filter(additionalPathSplitArray);
        additionalPathname = additionalPathSplitArray.join(`/`);
        checkPath = that.o.node.path.join(pathMain,additionalPathname);
        if(NotFindPath){
            return checkPath;
        }
        if(that.o.node.fs.existsSync(checkPath)){
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
            files = that.o.tool.file.isDirSync(path) ? that.o.node.fs.readdirSync(path) : [],
            fullPath = that.o.node.path.join(path,file)
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
            fileOnePath = that.o.node.path.join(path,fileOne)
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
            that.o.tool.console.waring(`Not Find ${file}, continue.`);
        }
        let
            files = that.o.tool.file.isDirSync(path) ? that.o.node.fs.readdirSync(path) : [],
            fullPath = that.o.node.path.join(path,file)
        ;
        if(that.isFileSync(fullPath)){
            return fullPath;
        }else{
            that.o.tool.console.waring(`Not Find ${fullPath}, continue.`);
        }
        if(queryResult){
            return queryResult;
        }
        for(let i =0;i<files.length;i++){
            let
            fileOne = files[i],
            fileOnePath = that.o.node.path.join(path,fileOne)
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
            textRegText = that.o.tool.string.strToRegText(text),
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

        path = that.o.tool.string.trimX(path);
        pathParse = that.o.node.path.parse(path);

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
            pathJoin = that.o.node.path.join(pathJoin,path)
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
            tmpDir = that.o.config.platform.base.local.tmpDir
        ;
        if(pathname){
            tmpDir = that.o.node.path.join(tmpDir,pathname);
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

        if(!that.o.node.fs.existsSync(htmlPath)){
            console.log(`read - error : not find ${htmlPath}.`)
            return `<!-- not find ${htmlPath} -->`;
        }
        let
            html=that.o.node.fs.readFileSync(htmlPath)
        ;


        if( html[0].toString(16).toLowerCase() == "ef" && html[1].toString(16).toLowerCase() == "bb" && html[2].toString(16).toLowerCase() == "bf" ) {
            html = html.slice(3);
            //发现bom就覆盖原文件.
            that.o.node.fs.writeFileSync(htmlPath,html.toString(),'utf8');
        }
        html = html.toString();
        if(callback)callback(html);
    }
}

module.exports = fileC;