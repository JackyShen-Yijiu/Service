/**
 * Created by v-yaf_000 on 2015/12/22.
 */
var url = require('url');

var adminFunc = {
    setPageInfo : function(req,res,currentLink,extradata,textindex){

        var searchKey = '';
        if(req.url){
            var params = url.parse(req.url,true);
            searchKey = params.query.searchKey?params.query.searchKey:"";
        }
        console.log(searchKey);
        return {
            extradata:extradata,
            textindex:textindex,
            searchKey : searchKey,
            schoolid:"",
            currentLink : currentLink,
            layout : 'public/adminTemple'
        }

    },
 setSchoolPageInfo : function(req,res,currentLink,extradata,textindex){

    var searchKey = '';
    if(req.url){
        var params = url.parse(req.url,true);
        searchKey = params.query.searchKey?params.query.searchKey:"";
    }
     var schoolid=req.session.schoolid;
    return {
        extradata:extradata,
        schoolid:schoolid,
        textindex:textindex,
        searchKey : searchKey,
        currentLink : currentLink+"?schoolid="+schoolid,
        layout : 'public/schoolTemple'
    }

}
};
module.exports = adminFunc;