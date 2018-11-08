
const 
appPath = require('../../core/app.path.class'),
func = appPath.get('func'),
{
    http ,
    https ,
    fs ,
    cheerio ,
    request ,
    path ,
    url ,
} = func.getCoreTools().GetBase()
;
let that=null;

class main{
    constructor(web_url){
        this.gets=[];
        that = this;
        this.web_url = web_url;
        this.format_url(web_url);
        //this.save_path = path.join(appPath.web_down,this.urlToDir(web_url));
        this.save_path = path.join(__dirname,this.urlToDir(web_url));
        func.mkdir(this.save_path);
    }

    /**
     * @tools 只负责下载,其他将转交给对应的处理
     */
    downUrl(url,ext){
        //用于判断文件的类型,以便用于保存,以后正则替换抓取.
        if(!ext)ext = this.isExt(url);

    }

    /**
     * @tools 将url转成目录
     */
    urlToDir(url){
        url = url.replace(/^http.+?\/\//i,"");
        url = url.replace(/\?.+/,"");
        url = url.replace(/\#.+/,"");
        url = url.replace(/\/.+/,"");
        return url;
    }

    /**
     * @tools 格式化url首当其冲取得基础路径.
     * @param web_url
     */
    format_url(web_url){
        let par_url = url.parse(web_url);
        let pathname = par_url.pathname;
        let protocol = par_url.protocol;
        let hostname = par_url.hostname;
        let basepath = pathname.match(/[\s\S]+\//i);
        if(!basepath){
            basepath = "/";
        }
        this.base_url = protocol+"//"+hostname+basepath;
    }


    get(web_url,fn) {
        let protocol = url.parse(web_url).protocol;
        let app = null;
        switch (protocol){
            case "https:":
                app = https;
                break;
            default:
                app = http;
                break;
        }
        app.get(web_url, function (res) {
            let c = '';
            res.setEncoding('utf-8');
            res.on('data', function (chunk) {
                c += chunk;
            });
            res.on('end', function () {
                let $ = cheerio.load(c);
                if(fn)fn($,c);
            });

        }).on('error', function (err) {
            console.log(err);
        });
    }



    save_resource($,c,web_url){
        let that = this;
        let source_list = ["img","link","script"];
        source_list.forEach(function(a,b){
            switch (a){
                case "link":
                    that.save_link_css($,a);
                    break;
                default:
                    that.save_src($,a);
                    break;
            }
        });


        /**
         * TODO 网页的代码如果有替换,在此处.
         */
        let source_url = web_url.replace(this.base_url,"");
        source_url = path.join(this.save_path,source_url);
        that.save_content(source_url,c);
    }

    save_link_css($,type){
        let that = this,n=0;
        $(type).each(function (index, item) {
            let src = $(item).attr('href').replace(/\s/ig,"");
            let is_http = src.match(/^http/i);
            let http_src = src.replace(/^\//,"");
            //如果不是绝对路径的图片,则拼地址
            let src_save_path = path.join( that.save_path,src);
            if(!is_http){
                http_src = that.base_url+src;
            }
            that.get_link_css(http_src,src_save_path);
            n++;
        })
        console.log(`保存了 ${n} 个文件,类型 ${type}`);
    }

    get_link_css(http_src,src_save_path,fn){
        let that = this;
        that.get(http_src,function($,c){
            that.get_css_img(c,src_save_path,http_src,fn);
        });
    }

    get_css_img(link_css,src_save_path,http_src,fn){
        let that = this;
        let all_img = link_css.match(/(?<=url\s*\().+?(?=\))/ig);
        if(all_img){
            for (let i=0;i<all_img.length;i++){
                let bg_url = all_img[i].replace(/\'|\"/ig,"");
                if(!bg_url.match(/^data\:/i)){
                    if(bg_url.match(/^http/i)){
                        let transform_css_name = bg_url.replace(/\?|\=|\:|\,|\&|\#|\//ig,"_").replace(/__/ig,"_").replace(/__/ig,"_");
                        link_css = link_css.split(bg_url).join(transform_css_name);
                        let _base_path = path.parse(src_save_path).dir;
                        let _save_path = path.join(_base_path,transform_css_name);
                        that.get_link_css(bg_url,_save_path);

                    }else{
                        let base_name_url = url.parse(bg_url).pathname;
                        let base_url =http_src.match(/[\s\S]+\//i);
                        let css_path_save = path.join(src_save_path,base_name_url);
                        let cssurl = url.resolve(base_url[0],base_name_url);
                        that.save_source(css_path_save,cssurl);
                    }
                }
            }
        }
        that.save_content(src_save_path,link_css,fn);
    }

    save_src($,type="img") {
        let that = this,n=0;
        $(type).each(function (index, item) {
            let _src_="";
            switch (type){
                case "link":
                    _src_ = $(item).attr('href');
                    break;
                default:
                    _src_ = $(item).attr('src');
                    break;
            }
            let src = _src_.replace(/\s/ig,"");
            let is_http = src.match(/^http/i);
            let http_src = src.replace(/^\//,"");
            //如果不是绝对路径的图片,则拼地址
            let src_save_path = path.join( that.save_path,src);
            if(!is_http){
                http_src = that.base_url+src;
            }
            that.save_source(src_save_path,http_src);
            n++;
        })
        console.log(`保存了 ${n} 个文件,类型 ${type}`);
    }

    save_content(src_save_path,c,fn){
        let img_save_path_parse = path.parse(src_save_path);
        this.mkdirsSync(img_save_path_parse.dir);
        fs.writeFileSync(src_save_path,c,"utf8",()=>{
            if(fn)fn();
        });
    }

    save_source(src_save_path,http_src){
        let img_save_path_parse = path.parse(src_save_path);
        this.mkdirsSync(img_save_path_parse.dir);
        request.head(http_src,function(err,res,body){
            if(err){
                console.log(err);
            }
        });
        request(http_src).pipe(fs.createWriteStream(src_save_path));
    }

    /**
     * @tools 递归创建目录 同步方法
     */
    mkdirsSync(dirname) {
        if (fs.existsSync(dirname)) {
            return true;
        } else {
            if (this.mkdirsSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }
        }
    }

}

let web_url = "http://www.17sucai.com/preview/945243/2018-02-09/oreo/index.html";
let n = new main(web_url);
module.exports = n;

