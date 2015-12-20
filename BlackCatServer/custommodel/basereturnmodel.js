/**
 * Created by v-lyf on 2015/8/16.
 */
/*���� �������ݵ�����*/

function BaseReturnInfo(type,msg,data,extrainfo){
    this.type=type;
    this.msg=msg;
    this.data=data;
    this.extra=extrainfo;
}

module.exports=BaseReturnInfo;