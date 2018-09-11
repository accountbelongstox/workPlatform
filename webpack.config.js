const
	path = require("path")
;

module.exports = {
	entry:{
		//ddrunmodule_module_microsoft:"./framework/microsoft/index.class.ts"
        //,vendor:["lodash"]
	},
	output:{
		filename:"[name].js"
	},
	module:{
		rules:[
			{
				test:/\.js$/,
				use:{
					loader:"babel-loader",
					options:{
						presets:[
							["env",{//babel-preset-env
								modules:false,
								targets:{
                                    node: "9.9.0"
								}
							}]
						]
					}
				},
				exclude:"/node_modules/"
			},
            {
                //TypeScript 编译配置文件 ./windows.json.js
                test:/\.tsx?$/,
                use:[
/*                    {
                    	loader: 'babel-loader'
					},*/
                    {
                        loader:"awesome-typescript-loader",
                        options: {
                            // 加快编译速度
                            transpileOnly: true,
                            // 指定特定的ts编译配置，为了区分脚本的ts配置
                            configFile: path.resolve(__dirname, './windows.json.js')
                        }
                    }
				]
            }
		]
	}
}