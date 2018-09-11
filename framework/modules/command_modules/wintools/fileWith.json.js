const zipConfig = require(`../zip/zipFiles.json`)
//获得所有zip文件的扩展名
let zipFileExt = []
for(let p in zipConfig){
    zipFileExt.push(p)
}

//console.log(zipFileExt)

module.exports = {
    Bandizip:{
        fileExt:zipFileExt,
        command:`"D:\\Program Files\\Bandizip\\Bandizip.exe" "%1"`,
        icon:`D:\\Program Files\\Bandizip\\icons\\default\\%fileExt%.ico`,
        description:`%fileExt%压缩文件`
    }
}
