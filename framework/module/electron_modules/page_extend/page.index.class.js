
class index extends page{

    constructor(){
        super();
        console.log("index.js");
        console.log(this.$);
    }
}

module.exports = new index();