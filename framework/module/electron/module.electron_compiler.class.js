/*
@func 编译HTML的类.用来模拟模版编译,扩展加入比如 include等标签
* */

class compiler{

    constructor(load){

    }

    build(html_name='index.html',callback){
        let 
            that = this,
            html_template = that.load.core.path.html_template,
            html_file = (function (){
                if(that.load.node.fs.existsSync(html_name)){
                    html_template = that.load.node.path.parse(html_name).dir;
                    return html_name;
                }else{
                    return that.load.node.path.join(html_template,html_name);
                }
            })(),
            tags = [`include`,`data`],//支持的标签
            replaceArr = []
        ;
        that.option.html_template = html_template;
        if(!that.load.node.fs.existsSync(html_file)){
            console.log(`Error : nod find html template -> ${html_file}`);
            html_file = that.load.node.path.join(html_template,'404.html');
        }
        let
            html_basename = that.load.node.path.basename(html_file),
            hash_file_name =  that.load.module.encrypt.md5( html_basename ),
            compiler_file = that.load.node.path.join( html_template, `f_compiler_${hash_file_name}_${html_basename}`)
        ;
        /**
         * @tools 如果文件已经存在,则直接使用,无须再次编译.
         * @type
         */
        let 
            platform_config = that.load.config.platform,
            debug = platform_config.base.local.debug
        ;
        if(that.load.node.fs.existsSync(compiler_file) && !debug){
            if(f)f(compiler_file);
            return true;
        }
        //通过无BOM方式读取该网页
        that.load.module.file.removeBOM(html_file,(html)=>{
            /*
            @explain 此处为支持编译的标签
            @... 以后需要扩展修改此处即可
            */
            html = html.toString();
            tags.forEach((tag)=>{
                let
                    tagToRegText = that.load.module.string.strToRegText(tag),
                    tabMatchReg = new RegExp(`\\{\\s*${tagToRegText}\\s*\\(.+?\\)\\s*\\}`,'ig'),//用来查找标签的正则,全局查询
                    allNeedComplierTagTextArr = html.match(tabMatchReg)
                ;

                if( allNeedComplierTagTextArr ){
                    allNeedComplierTagTextArr.forEach( (allNeedCompileTagText)=>{
                        let
                            CompileItem = allNeedCompileTagText.replace(/.+?\(|\).+/ig,``)
                        ;
                        CompileItem = that.load.module.string.trim(CompileItem);
                        replaceArr.push({
                            tag:allNeedCompileTagText,
                            path:CompileItem
                        });
                    });
                }
            });
            that.writeComplierHtmlSync(compiler_file,html,replaceArr,callback);
        });
    }

    /*

    @func 同步无BOM写入网页 
    */
    writeComplierHtmlSync(compiler_file,html,replaceArr,f=null){
        let 
            that = this,
            $=that.load.node.cheerio.load(html),
            ele_a =$('a')
        ;

        for(let p in ele_a){
            try{
                $(ele_a[p]).attr("href","javascript:alert(234);")
            }catch (e) {
                
            }
        }

        (function replaceWriteHTML(len){
            if(len >= replaceArr.length){
                that.load.node.fs.writeFile(compiler_file,html,"utf8",()=>{
                    if(f){
                        f(compiler_file);
                    }
                });
            }else{
                let
                    replaceItem = replaceArr[len],
                    templateHTMLPath = that.load.node.path.join(that.option.html_template,replaceItem.path),
                    replaceContent
                ;
                if(that.load.node.fs.existsSync(templateHTMLPath)){
                    replaceContent = that.load.node.fs.readFileSync(templateHTMLPath);
                    replaceContent = replaceContent.toString();
                }
                if(replaceContent){
                    html = html.replace(replaceItem.tag,replaceContent);
                }
                replaceWriteHTML(++len);
            }
        })(0);
    }
}

module.exports = compiler;