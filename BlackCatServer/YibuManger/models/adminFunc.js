/**
 * Created by v-yaf_000 on 2015/12/22.
 */
var url = require('url');

var adminFunc = {
    setPageInfo : function(req,res,currentLink){

        var searchKey = '';
        if(req.url){
            var params = url.parse(req.url,true);
            searchKey = params.query.searchKey?params.query.searchKey:"";
        }
        console.log(searchKey);
        return {
            searchKey : searchKey,
            currentLink : currentLink,
            layout : 'public/adminTemple'
        }

    }
};
module.exports = adminFunc;