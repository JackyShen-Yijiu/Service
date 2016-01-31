/**
 * Created by v-yaf_000 on 2016/1/31.
 */
// 支付包发送通知

// 参数说明网
    //https://doc.open.alipay.com/doc2/detail.htm?spm=0.0.0.0.Lc515P&treeId=59&articleId=103666&docType=1
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var aliPayNoticeSchema= new Schema({
    "discount":String,    //折扣
    "payment_type": String,//支付类型。默认值为：1（商品购买）。
    "subject": String,   //商品的标题/交易标题/订单标题/订单关键字等。它在支付宝的交易明细中排在第一列，对于财务对账尤为重要。是请求时对应的参数，原样通知回来。
    "trade_no": String,   //该交易在支付宝系统中的交易流水号。最短16位，最长64位。
    "buyer_email": String, //买家支付宝账号
    "gmt_create": String,   //交易创建时间
    "notify_type": String,  //notify_type	通知类型	String	通知的类型。	不可空	trade_status_sync
    "quantity": String,     //quantity	购买数量	Number	购买数量，固定取值为1（请求时使用的是total_fee）。	可空	1
    "out_trade_no":String,   // 商户网站唯一订单号	String(64)	对应商户网站的订单系统中的唯一订单号，非支付宝交易号。需保证在商户网站中的唯一性。
                                // 是请求时对应的参数，原样返回。	可空	0822152226127
    "seller_id": String,      //卖家支付宝用户号	String(30)	卖家支付宝账号对应的支付宝唯一用户号。以2088开头的纯16位数字。	不可空	2088501624816263
    "notify_time": String,      // 通知时间	Date	通知的发送时间。格式为yyyy-MM-dd HH:mm:ss。
    "body": String,                 //商品描述	String(512)	该笔订单的备注、描述、明细等。对应请求时的body参数，原样通知回来。	可空
    "trade_status": String,      //trade_status	交易状态	String	交易状态，取值范围请参见“交易状态”。	不可空	TRADE_SUCCESS
    "is_total_fee_adjust": String,   //is_total_fee_adjust	是否调整总价	String(1)	该交易是否调整过价格。	可空	N
    "total_fee": String,     //total_fee	交易金额	Number	该笔订单的总金额。请求时对应的参数，原样通知回来。
    "gmt_payment": String,   //交易付款时间	Date	该笔交易的买家付款时间。格式为yyyy-MM-dd HH:mm:ss。
    "seller_email": String,  //卖家支付宝账号	String(100)	卖家支付宝账号，可以是email和手机号码
    "price":String,   //商品单价	Number	price等于total_fee（请求时使用的是total_fee）。
    "buyer_id": String, //buyer_id	买家支付宝用户号	String(30)	买家支付宝账号对应的支付宝唯一用户号。以2088开头的纯16位数字。	不可空	2088602315385429
    "notify_id": String,    //notify_id	通知校验ID	String	通知校验ID
    "use_coupon": String,  // 是否使用红包买家	String(1)	是否在交易过程中使用了红包。	可空
    "sign_type": String,   //签名方式	String	固定取值为RSA。	不可空	RSA
    "sign": String,  // 签名	String
    is_deal:{type:Number,default:0}, //  是否处理  0 未处理 1 已处理  2 处理失败  3 暂时不用处理
    dealreamk:String,
});

aliPayNoticeSchema.index({trade_no: 1});
module.exports = mongoose.model('alipaynotice', aliPayNoticeSchema);