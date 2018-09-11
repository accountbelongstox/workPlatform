/*
@func 编译HTML的类.用来模拟模版编译,扩展加入比如 include等标签
* */

class compiler{

    constructor(common){
        
        common.get_node('fs');
        common.get_node('path');
        common.get_core('string');
        common.get_core('encrypt');
        common.get_config();
    }


    build(html_name='index.html',f){
        let 
        that = this,
        html_template = this.common.core.appPath.html_template,
        html_file = that.common.node.path.join(html_template,html_name)
        ;
 

        if(!that.common.node.fs.existsSync(html_file)){
            console.log(`Error : nod find html template -> ${html_file}`);
            html_file = that.common.node.path.join(html_template,'404.html');
        }

        let 
        html_path = that.common.node.path.dirname(html_file),
        html_basename = that.common.node.path.basename(html_file),
        hash_file_name =  that.common.core.encrypt.md5( html_basename ),
        compiler_file = that.common.node.path.join( html_path, `_compiler_${hash_file_name}_${html_basename}` ),
        extend=""
        ;

        /**
         * @tools 如果文件已经存在,则直接使用,无须再次编译.
         * @type
         */
        let 
        platform_config = that.common.config.platform,
        debug = platform_config.base.local.debug
        ;
        if(that.common.node.fs.existsSync(compiler_file) && !debug){
            if(f)f(compiler_file);
            return true;
        }

        //通过无BOM方式读取该网页
        let
        html = that.readHTMLSync(html_file)
        ;

        /*
        @func 加载扩展js类.模版页的JS类均写在目录下的 page_extend_modules下 
        */
        extend += `
        \n
        /*
        @func 该类是模版的公共类,调用该类的run方法,并传入页面路由,则下级会自动启用
        */
        <script type="text/javascript">
        const
        common = require("../../public/common.class.js")
        ;
        common.get_module("page_extend",2);
        common.module["page_extend"].run("${html_name}");
        </script>
        \n
        `;
        html +=extend;


        /*
        @explain 此处为支持编译的标签
        @... 以后需要扩展修改此处即可
        */
        const 
        supportCompileTag = [
            {
                tag : `include`,
                handleFn : (sourceHtml,content)=>{
                    let 
                    newHTML = that.common.node.path.join( html_path,content),
                    newHTMLContent = that.readHTMLSync(newHTML)
                    ;
                    html = html.split(sourceHtml).join(newHTMLContent);
                }
            },
            {
                tag : `template_config`,
                handleFn : (sourceHtml,content)=>{
                    let 
                    HTMLName = that.common.node.path.parse(html_name).name,
                    configJson = platform_config.base.electron.window.template,
                    r = configJson[HTMLName]
                    ;

                    if(r){
                        r = r[content]
                    }

                    if(!r)r = `<!-- not find the config ${content} -->`

                    html = html.split(sourceHtml).join(r);
                }
            }
        ]
        ;

        //---------------------------------------------------------------------------------------------------
        for(let i=0;i<supportCompileTag.length;i++){

            let
            compilerTag = supportCompileTag[i],
            tag = compilerTag.tag,//支持编译的标签
            handleFn = compilerTag.handleFn,//处理函数
            tagToRegText = that.common.core.string.strToRegText(tag),
            tabMatchReg = new RegExp(`\\{\\s*${tagToRegText}\\s*\\(.+?\\)\\s*\\}`,'ig'),//用来查找标签的正则,全局查询
            tabContentReg = new RegExp(`\\{\\s*${tagToRegText}\\s*\\((.+?)\\)\\s*\\}`,'i'),//用来查找模版标签传入内容的正由,只查询一次
            allNeedComplierTagTextArr = html.match(tabMatchReg),
            need_compile = []
            ;

            if( allNeedComplierTagTextArr ){

                for(let j = 0; j<allNeedComplierTagTextArr.length;j++){



                    let 
                    sourceHtml = allNeedComplierTagTextArr[j],/*得取具体网页.*/
                    queryContent = sourceHtml.match(tabContentReg)
                    ;


                    if(queryContent){
                        queryContent = queryContent.length > 1 ? queryContent[1] : '';
                    }

                    queryContent = that.common.core.string.trim(queryContent);

                    //传入对应的处理函数进行处理.开始编译
                    handleFn(sourceHtml,queryContent);
                }

            }
        }
        //---------------------------------------------------------------------------------------------------
        that.writeComplierHtmlSync(compiler_file,html,f);
        return compiler_file;
        //---------------------------------------------------------------------------------------------------
    }

    /*

    @func 同步无BOM写入网页 
    */
    writeComplierHtmlSync(compiler_file,html,f=null){
        let 
        that = this,
        is_a_tag_name = html.match(/\<a\s*.+?\>/ig)
        ;
        if(is_a_tag_name){
            /*
            @func 对于有href并且是网页的a标签,进行编译
            */
            for(let i=0;i<is_a_tag_name.length;i++){
                let text = is_a_tag_name[i];
                let href_arr = text.match(/href\=(.+?)[\s|\>]/i);
                if(href_arr.length > 1){
                    let 
                    href = href_arr[1],
                    hrefNotSymbol = that.common.core.string.trim( href_arr[1] ),
                    head_Sharp = hrefNotSymbol.match(/^(\#|javascript\:)/ig)
                    ;
                    //对没有#号的href替换处理.
                    let tem_text = "";
                    if(!head_Sharp){
                        tem_text = text.split(href_arr[0]).join(`data-app-transform-page="${hrefNotSymbol}" href="javascript:void(0);"`);
                        html = html.split(text).join(tem_text);
                    }
                }
            }
        }

        //移除BOM
        if( html[0].toString(16).toLowerCase() == "ef" && html[1].toString(16).toLowerCase() == "bb" && html[2].toString(16).toLowerCase() == "bf" ) {
            html = html.slice(3);
        }

        that.common.node.fs.writeFileSync(compiler_file,html,"utf8");

        if(f){
            f(compiler_file);
        }
        return compiler_file;
    }


    /*
    @func 通过无BOM的方式读取html文件
    */
    readHTMLSync(htmlPath){    

        let 
        that = this
        ;

        if(!that.common.node.fs.existsSync(htmlPath)){
            console.log(`read - error : not find ${htmlPath}.`)
            return `<!-- not find ${htmlPath} -->`;
        }

        let 
        html=that.common.node.fs.readFileSync(htmlPath)
        ;

        if( html[0].toString(16).toLowerCase() == "ef" && html[1].toString(16).toLowerCase() == "bb" && html[2].toString(16).toLowerCase() == "bf" ) {
            html = html.slice(3);
            //发现bom就覆盖原文件.
            that.common.node.fs.writeFileSync(htmlPath,html.toString(),'utf8');
        }

        html = html.toString();
        return html;
    }
}

module.exports = compiler;