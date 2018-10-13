<?php 

class ffmpeg{
	
	public $path = '';//源文件夹
	public $savePath = "";//目标文件夹
	public $sshSave = null;//将运行结果保存为 SHH文件
	public $exec = true;//是否直接执行,或是保存到SSH另行执行
	public $overflow = true;//是否覆盖
	public $isCopyUnlinkSource = false;//复制文件后是否删除源文件
	public $picMaxX = 1000;//压缩后图片的最大宽
	public $picMaxY = 1000;//压缩后图片的最大高
	public $picPrefix = "";//压缩后图片名称前缀
	public $ffmpeg = true;//是否使用 ffmpeg 处理
	public $html = false;//使用HTML的形式显示 
	public $cn = false;//使用中文显示
		
	private $sshLen = 0;
	private $fileLen = 0;
	private $dirLen = 0;
	private $mkdirLen = 0;
	private $sshOpen = null;
	
	function __construct($path=null,$savePath=null){
		ini_set('gd.jpeg_ignore_warning', true);
		$this->path = $path;
		$this->savePath = $savePath;
	}
	
	/*
	*func 复制一个文件到另一个文件
	*/
	public function copy($filePath=null,$targetPath=null){
		if($filePath !== null && $targetPath !== null){
			//如果源文件存在
			if(file_exists($filePath)){
				//是目录则递归
				if(is_dir($filePath)){
					$this->path = $filePath;
					$this->savePath = $targetPath;
					//是文件则直接执行
					$this->scan(function ($filePath,$targetPath){
						$this->copyFn($filePath,$targetPath);
					});
				}else{
					$this->copyFn($filePath,$targetPath);
				}
			}else{
				//源文件不存在时
				die("source dir not exists.");
			}
		}else{
			$this->scan(function ($filePath,$targetPath){
				$this->copyFn($filePath,$targetPath);
			});
		}
	}
	
	/**
	 * @function 等比缩放函数(以保存的方式实现)
	 * @param string $picname 被缩放的处理图片源
	 * @param int $maxX 缩放后图片的最大宽度
	 * @param int $maxY 缩放后图片的最大高度
	 * @param string $pre 缩放后图片名的前缀名
	 * @return string 返回后的图片名称(带路径),如a.jpg --> s_a.jpg
	 */
	public function pic($filePath=null,$targetPath=null)
	{	
		if($filePath !== null && $targetPath !== null){
			//如果源文件存在
			if(file_exists($filePath)){
				//是目录则递归
				if(is_dir($filePath)){
					$this->path = $filePath;
					$this->savePath = $targetPath;
					//是文件则直接执行
					$this->scan(function ($filePath,$targetPath){
						$this->picFn($filePath,$targetPath);
					});
				}else{
					$this->picFn($filePath,$targetPath);
				}
			}else{
				//源文件不存在时
				die("source dir not exists.");
			}
		}else{
			$this->scan(function ($filePath,$targetPath){
				$this->picFn($filePath,$targetPath);
			});
		}
	}
	
	//copy附加函数
	public function copyFn($filePath,$targetPath){
		if(!$this->overflow && file_exists($targetPath)){
			if($this->cn){
				$this->echoInfo($this->fileLen." <=> 文已经压缩过, 跳过... \"".$targetPath."\"");
			}else{
				$this->echoInfo($this->fileLen." <=> file exists, ignore... \"".$targetPath."\"");
			}
		}else{
			$this->echoInfo($this->fileLen." <=> copy \"".$filePath."\" to \"".$targetPath."\"");
			copy($filePath,$targetPath);
			if($this->isCopyUnlinkSource){
				@unlink($filePath);
			}
		}
	}
	//P[IC符加函数
	public function picFn($filePath,$targetPath){
		
		$maxX = $this->picMaxX;
		$maxY = $this->picMaxY;
		$pre = $this->picPrefix;
		$ffmpeg = $this->ffmpeg;
		$showTargetPath = preg_replace("/.+?\//","",$targetPath);
		
		//如果不允许覆盖,并且文件存在,则跳过
		if(!$this->overflow && file_exists($targetPath)){
			$newPicName = false;
			if($this->cn){
				$this->echoInfo($this->fileLen." <=> 文件已经压缩过且存在, 忽略... \"".$showTargetPath."\"");
			}else{
				$this->echoInfo($this->fileLen." <=> file exists, ignore... \"".$showTargetPath."\"");
			}
		}else{
			$info = @getimagesize($filePath); //获取图片的基本信息
			//判断图片资源类型并创建对应图片资源
			$im = $this->getPicType($info[2],$filePath);
			if($im){
				$width = $info[0];//获取宽度
				$height = $info[1];//获取高度
				$ssh = "";
				if($width > $maxX || $height > $maxY){
					//计算缩放比例
					$scale = ($maxX/$width)>($maxY/$height)?$maxY/$height:$maxX/$width;
					//计算缩放后的尺寸
					$sWidth = floor($width*$scale);
					$sHeight = floor($height*$scale);
					if($ffmpeg){
						$ssh = 'ffmpeg -hide_banner -i "'.$filePath.'" -vf "scale='.$sWidth.':'.$sHeight.'" -pix_fmt pal8 "'.$targetPath.'" -y';
					}else{
						$this->echoInfo($this->fileLen." <=> file in PHP execute... \"".$showTargetPath."\"");
						//创建目标图像资源
						$nim = imagecreatetruecolor($sWidth,$sHeight);
						//等比缩放
						imagecopyresampled($nim,$im,0,0,0,0,$sWidth,$sHeight,$width,$height);
						//输出图像
						$newPicName = $this->outputImage($filePath,$pre,$nim);
						//释放图片资源
						imagedestroy($im);
						imagedestroy($nim);
					}
				}else{
					if($ffmpeg){
						$ssh = 'ffmpeg -hide_banner -i "'.$filePath.'" -pix_fmt pal8 "'.$targetPath.'" -y';
					}else{
						if($this->cn){
							$this->echoInfo($this->fileLen." <=> file normal!. width=".$width." height=".$height." PHP ignore... \"".$showTargetPath."\"");
						}else{
							$this->echoInfo($this->fileLen." <=> 文件正常,不需要压缩!. width=".$width." height=".$height." PHP ignore... \"".$showTargetPath."\"");
						}
					}
				}
				if($ssh){
					$this->sshLen++;
					if($this->exec){
						$out = exec($ssh);
						print_r($out);
					}else{
						$this->writeSSH($ssh);
						$this->echoInfo("sshLen:".$this->sshLen."; fileLen:".$this->fileLen."; dirLen:".$this->dirLen."; mkdirLen:".$this->mkdirLen.";");
					}
				}
			}else{
				if($this->cn){
					$this->echoInfo($this->fileLen." <=> 文件类型不是图片, 忽略... \"".$showTargetPath."\"");
				}else{
					$this->echoInfo($this->fileLen." <=> file type not is image, ignore... \"".$showTargetPath."\"");
				}
			}
		}
		if(!isset($newPicName)){
			$newPicName = null;
		}
		return $newPicName;
	}

	/*
	*func 扫描一个目录下的所有图片文件
	*/
	public function scan($thisFn=null,$path=null){
		if(!$path)$path = $this->path;
		// 打开目录
		$dh = opendir($path);
		// 循环读取目录
		while(($file = readdir($dh)) !== false){
			// 先要过滤掉当前目录'.'和上一级目录'..'
			if($file == '.' || $file == '..') continue;
			// 为了能够显示中文目录/文件，需要进行转码
			// 如果该文件仍然是一个目录，进入递归
			$filePath = $path.'/'.$file;
			$targetPath = str_replace($this->path,$this->savePath,$filePath);
			
			if(is_dir($filePath)){
				//echo $mkdirPath."\n";
				if (!file_exists($targetPath)){
					$this->mkdirLen++;
					mkdir($targetPath,0777,true);
				}
				$this->dirLen++;
				$this->scan($thisFn,$path.'/'.$file);
			}else{
				$this->fileLen++;
				if($thisFn){
					$thisFn($filePath,$targetPath);
				}
			}
		}
	}
	
	//打开需要保存命令的文件
	public function writeSSH($content=""){
		if($this->sshOpen === null){
			if($this->sshSave){
				$this->sshOpen = fopen($this->sshSave,"a+");
			}
		}
		if($this->sshOpen){
			fwrite($this->sshOpen,$content."\r\n");
		}else{
			$this->echoInfo("not set ssh file path.");
		}
	}
	
	/**
	 * function 判断并返回图片的类型(以资源方式返回)
	 * @param int $type 图片类型
	 * @param string $picname 图片名字
	 * @return 返回对应图片资源
	 */
	public function getPicType($type,$picname)
	{
		$im=null;
		switch($type)
		{
			case 1:  //GIF
				$im = imagecreatefromgif($picname);
				break;
			case 2:  //JPG
				$im = imagecreatefromjpeg($picname);
				break;
			case 3:  //PNG
				$im = imagecreatefrompng($picname);
				break;
			case 4:  //BMP
				$im = imagecreatefromwbmp($picname);
				break;
			default:
				$im = null;
				break;
		}
		return $im;
	}

	/**
	 * function 输出图像
	 * @param string $picname 图片名字
	 * @param string $pre 新图片名前缀
	 * @param resourse $nim 要输出的图像资源
	 * @return 返回新的图片名
	 */
	public function outputImage($picname,$pre,$nim)
	{
		$info = getimagesize($picname);
		$picInfo = pathInfo($picname);
		$newPicName = $picInfo['dirname'].'/'.$pre.$picInfo['basename'];//输出文件的路径
		switch($info[2])
		{
			case 1:
				imagegif($nim,$newPicName);
				break;
			case 2:
				imagejpeg($nim,$newPicName);
				break;
			case 3:
				imagepng($nim,$newPicName);
				break;
			case 4:
				imagewbmp($nim,$newPicName);
				break;
		}
		return $newPicName;
	}
	
	/*
	@ function 好好数据精简
	*/
	public function echoInfo($info){
		$prefix = "\r\n";
		if($this->html){
			$prefix = "<br />";
		}
		echo $info.$prefix;
	}
}


$ffmpegClass = new ffmpeg('/home/haohaodata/domains/c.linghuaqiandai.cn/public_html/upload',"/home/haohaodata/domains/c.linghuaqiandai.cn/public_html/upload");
//$ffmpegClass = new ffmpeg('/home/haohaodata/domains/haohaodata.localhost/public_html/upload',"/home2/www/upload",null,false);
$ffmpegClass->ffmpeg = false;
$ffmpegClass->overflow = false;
$ffmpegClass->html = true;
$ffmpegClass->cn = true;
$ffmpegClass->pic();