<?php 

class ffmpeg{
	
	public $path = '';
	public $savePath = "";
	public $sshSave = "";
	public $exec = true;
	public $overflow = true;
	
	private $sshLen = 0;
	private $fileLen = 0;
	private $dirLen = 0;
	private $mkdirLen = 0;
	private $sshOpen = null;
	
	function __construct($path=null,$savePath=null,$sshSave=null,$overflow=true){
		ini_set('gd.jpeg_ignore_warning', true);
		$this->path = $path;
		$this->savePath = $savePath;
		$this->sshSave = $sshSave;
		$this->overflow = $overflow;
	}
	
	/*
	*func 扫描一个目录下的所有图片文件
	*/
	public function scan($path=null){
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
			if(is_dir($filePath)){
				$mkdirPath = str_replace($this->path,$this->savePath,$filePath);
				//echo $mkdirPath."\n";
				if (!file_exists($mkdirPath)){
					$this->mkdirLen++;
					mkdir($mkdirPath,0777,true);
				}
				$this->dirLen++;
				$this->scan($path.'/'.$file);
			}else{
				$this->fileLen++;
				$this->scalePic($filePath,1000,1000);
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
			echo "not set ssh file path.\n";
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
	public function scalePic($picname,$maxX=100,$maxY=100,$pre='',$ffmpeg=true)
	{
		$targetPicName = str_replace($this->path,$this->savePath,$picname);
		//如果不允许覆盖,并且文件存在,则跳过
		if(!$this->overflow && file_exists($targetPicName)){
			$newPicName = false;
			echo $this->fileLen." <=> file exists, ignore... \"".$targetPicName."\"\n";
		}else{
			$info = @getimagesize($picname); //获取图片的基本信息
			//判断图片资源类型并创建对应图片资源
			$im = $this->getPicType($info[2],$picname);
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
						$ssh = 'ffmpeg -hide_banner -i "'.$picname.'" -vf "scale='.$sWidth.':'.$sHeight.'" -pix_fmt pal8 "'.str_replace($this->path,$this->savePath,$picname).'" -y';
					}else{
						//创建目标图像资源
						$nim = imagecreatetruecolor($sWidth,$sHeight);
						//等比缩放
						imagecopyresampled($nim,$im,0,0,0,0,$sWidth,$sHeight,$width,$height);
						//输出图像
						$newPicName = $this->outputImage($picname,$pre,$nim);
						//释放图片资源
						imagedestroy($im);
						imagedestroy($nim);
					}
				}else{
					if($ffmpeg){
						$ssh = 'ffmpeg -hide_banner -i "'.$picname.'" -pix_fmt pal8 "'.str_replace($this->path,$this->savePath,$picname).'" -y';
					}
				}
				if($ssh){
					$this->sshLen++;
					if($this->exec){
						$out = exec($ssh);
						print_r($out);
					}else{
						$this->writeSSH($ssh);
						echo "sshLen:".$this->sshLen."; fileLen:".$this->fileLen."; dirLen:".$this->dirLen."; mkdirLen:".$this->mkdirLen.";\n";
					}
				}
			}
		}
		if(!isset($newPicName)){
			$newPicName = null;
		}
		return $newPicName;
	}
	//ffmpeg -hide_banner -i "D:/51idc.png" -pix_fmt pal8 "D:/51idc2.png" -y
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
	public function haohaoScanPic(){
		$public_path = "/home/haohaodata/domains/haohaodata.localhost/public_html/";
		$sshPath = "/home/haohaodata/domains/haohaodata.localhost/public_html/ffmpreg.sh";
		$targetDir = "/home2/www/";
		$dirs = scandir($public_path);
		foreach($dirs as $p){
			if($p != "upload" && $p != "." && $p != ".."){
				$newPath = $public_path."/".$p;
				if(is_dir($newPath)){
					echo $newPath."\n";
					$newTargetPath = $targetDir.$p;
					echo $newTargetPath."\n";
					$this->path = $newPath;
					$this->savePath = $newTargetPath;
					$this->sshSave = $sshPath;
					$ffmpegClass->scan();
				}
			}
		}
	}
}


$ffmpegClass = new ffmpeg('/home/haohaodata/domains/haohaodata.localhost/public_html/upload',"/home2/www/upload",null,false);
$ffmpegClass->exec = true;
$ffmpegClass->scan();