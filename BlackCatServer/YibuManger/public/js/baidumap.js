/**
 * Created by v-yaf_000 on 2015/12/18.
 */


var map = new BMap.Map("allmap");
var point = new BMap.Point(116.331398,39.897445);
map.enableScrollWheelZoom();
map.centerAndZoom(point,12);

function myFun(result){
    var cityName = result.name;
    map.setCenter(cityName);
    // alert("当前定位城市:"+cityName);
}
var LocalCity=function(){
var myCity = new BMap.LocalCity();
myCity.get(myFun);
}
LocalCity();


 var geoc = new BMap.Geocoder();
map.addEventListener("click", function(e){
    var pt = e.point;
    geoc.getLocation(pt, function(rs){
        map.centerAndZoom(pt, 16);
        map.clearOverlays();
        map.addOverlay(new BMap.Marker(pt));
        var addComp = rs.addressComponents;
        $("#province").val(addComp.province);
        $("#city").val(addComp.city);
        $("#longitude").val(pt.lng);
        $("#latitude").val(pt.lat);
        $("#address").val(addComp.province + addComp.city + addComp.district  + addComp.street  + addComp.streetNumber);
        $("#address").change();
    });
});
var setPoint=function(log,lat){
    var point = new BMap.Point(log,lat);
    map.centerAndZoom(point,16);
    map.clearOverlays();
    map.addOverlay(new BMap.Marker(point));
};
var setaddress=function(address){
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(address, function(point){
        if (point) {
            map.centerAndZoom(point, 16);
            map.clearOverlays();
            map.addOverlay(new BMap.Marker(point));
            geoc.getLocation(point, function(rs){
                var addComp = rs.addressComponents;
                $("#province").val(addComp.province);
                $("#city").val(addComp.city);
                $("#longitude").val(pt.lng);
                $("#latitude").val(pt.lat);
            });
        }else{
            alert("您选择地址没有解析到结果!");
            map.centerAndZoom(point, 16);  //找不到则重新定位到城市
        }
    }, "");
}