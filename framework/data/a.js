let 
	o = ["id","fdsf"]
;

function isObject(arr){
	let
		r = false,
		that = this
	;
	if(arr instanceof Object){
		console.log(arr.length);
		if(!arr.length){
			r = true;
		}
	}
	return r;
}
console.log(isObject(o));