let files = {
	exe:{
		extend:['EXE','BAT']
	},
	zip:{
		extend:['7z','XZ','BZIP2','GZIP','TAR','ZIP','WIM','AR','ARJ','CAB','CHM','CPIO','CramFS','DMG','EXT','FAT','GPT','HFS','IHEX','ISO','LZH','LZMA','MBR','MSI','NSIS','NTFS','QCOW2','RAR','RPM','SquashFS','UDF','UEFI','VDI','VHD','VMDK','XAR','Z','7Z','ZIPX','TGZ','GZ','ACE','AES','ALZ','BH','BIN','BZ','BZ2','Compound','EGG','IMG','ISZ','LHA','LZ','PMA','RAR5','SFX','TBZ','TBZ2','TLZ','TXZ','XPI','ZPAQ']
	},
	image:{
		extend:['bmp','ico','dib','rle','emf','gif','jpg','jpeg','jpe','jif','pcx','dcx','pic','png','tga','tif','tiffxif','wmf','jfif','BMP','DIB','EMF','GIF','ICB','ICO','JPG','JPEG','PBM','PCD','PCX','PGM','PNG','PPM','PSD','PSP','RLE','SGI','TGA','TIF','bmp','jpg','png','tiff','gif','pcx','tga','exif','fpx','svg','psd','cdr','pcd','dxf','ufo','eps','ai','raw','WMF','webp','Webp','BMP','PCX','TIFF','GIF','JPEG','TGA','EXIF','FPX','SVG','PSD','CDR','PCD','DXF','UFO','EPS','AI','PNG','HDRI','RAW','WMF','FLIC','EMF','ICO']
	},
	html:{
		extend:['js','css','xml','json','html','htm']
	},
	file:{
		extend:[]
	},
	//文本说明文件
	documentation:{
		extend:["txt","md","html","link","doc","docx","wps",`md`]
	}
}

module.exports = files;