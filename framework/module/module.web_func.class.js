class JC{
	constructor(load){
	}

	getCurrentReadObject(){
        let
            that = this,
            currentReadDataName =  that.load.eles.selectReadData.val(),
            supportWebURL = that.load.json.webData.supportWebURL,
            dataSource = supportWebURL[that.load.option.currentWebName].dataSource,
            data = dataSource[currentReadDataName]
        ;
        that.load.option.currentReadDataName =currentReadDataName;//当前读取的数据的名字
        that.load.option.currentReadDataBeforeFunction = data.beforeFunction ? data.beforeFunction :  (c)=>{c()};//开始前是否有执行函数
        that.load.option.currentReadDataUrls = that.load.module.array.isArray( data.url) ? data.url : [data.url];//读取的数据的URL
        that.load.option.currentReadDataIsPost = data.post ? true : false;//是否POST读取
        that.load.option.currentReadDataPostDatas = (function (){
            if(data.data){
                return that.load.module.array.isArray( data.data ) ? data.data : [data.data];
            }
            else
            {
                return null;
            }
        })();//POST发送数据
        that.load.option.currentSetRequestHeader = data.setRequestHeader? data.setRequestHeader:{};
        that.load.option.RequestPayload = data.RequestPayload ? true: false;//是否以RequestPayload方式发送数据

        data.dataSourceName = that.load.option.currentWebName;//当前数据名称
        that.load.option.currentDataSource = data;
        return data;
    }

	//读取当前的网站名
    getCurrentWebNameInURL(){
        let
            that = this,
            data = that.load.json.webData.supportWebURL,
			clearHTTP = /\s*http\:\/\/|\s+$/ig,
            WebNameInURL = ``,
            currentSupportURL = that.load.eles.supportWeb.html()
        ;
        currentSupportURL = currentSupportURL.replace(clearHTTP,``);
        for(let o in data){
            let
                oneWebName = data[o],
                url = oneWebName.url
            ;
            url = url.replace(clearHTTP,``);
            if(currentSupportURL == url){
                WebNameInURL = o;
            }
        }
        that.load.option.currentSupportURL = that.load.module.tools.urlFormat(currentSupportURL);
        return WebNameInURL;
	}

    //第一个网站名字
    oneHtmlName(){
        let
            that = this,
            data = that.load.json.webData.supportWebURL,
            oneWebName
        ;
        for(let o in data){
            oneWebName = o;
            break
        }
        return oneWebName;
    }

    //第一个支持网站
    firstSupportWebURL(){
        let
            that = this,
            data = that.load.json.webData.supportWebURL,
            firstSupportWebURL
        ;
        for(let o in data){
            firstSupportWebURL = data[o].url;
            break
        }
        return firstSupportWebURL;
    }

    createSupportWebHtml(){
	    console.log(this.load.config)
		let 
		that = this,
		data = that.load.json.webData.supportWebURL,
		supportWebHtml = ""
		;
        for(let o in data){
            let
                listTwo = data[o],
                url = listTwo.url
            ;
            supportWebHtml += `<li><a href="javascript:;" data-url="${url}"><i class="icon-plus"></i><span>${url}</span></a></li>`;

        }
        that.load.eles.selectSupportWeb.html(supportWebHtml );
		return supportWebHtml;
	}


	createReadDataHtml(){
        let
            that = this,
            data = that.load.json.webData.supportWebURL,
            currentWebName = that.getCurrentWebNameInURL(),
            selectReadDataHtml = ""
        ;

        that.load.option.currentWebName = currentWebName;
        for(let o in data){
            if(currentWebName === o) {
                let
                    listTwo = data[o],
                    dataSource = listTwo.dataSource
                ;
                for (let k in dataSource) {
                    let
                        dataSourceItem = dataSource[k]
                    ;
                    selectReadDataHtml += `<option value="${k}">${dataSourceItem.description}</option>`;
                }
            }
        }
        that.load.eles.selectReadData.html(selectReadDataHtml);
        return selectReadDataHtml;
	}
}

module.exports = JC; 