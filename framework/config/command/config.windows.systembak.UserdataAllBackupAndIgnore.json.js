class AalBackupC{

	run(){
		return {
			ignore:[],
			childrenDir:{
					 "*": {
						ignore: [
							/^AMD/i,
							/^ATI/i,
							/^Application\s*Data/i,
							/^History/i,
							/^Microsoft/i,
							/^Packages/i,
							/^Temp/i,
							/^Temporary\s*Internet\s*Files/i,
							/^VirtualStore/i,
							/^Adobe/i,
							/^Macromedia/i,
							/^Visual\s*Studio/i,
							/^Intenret\s*Explorer/i,
						]
					}
				}
			}
		;
	}
}

module.exports = AalBackupC;