/**
 * Created by v-lyf on 2015/8/16.
 */
/*定义 返回数据的类型*/

function BaseReturnInfo(type,msg,data){
    this.type=type;
    this.msg=msg;
    this.data=data;
}

module.exports=BaseReturnInfo;