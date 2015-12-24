/**
 * Created by v-yaf_000 on 2015/12/18.
 */


var uploader = Qiniu.uploader({
    runtimes: 'html5,flash,html4',
    browse_button: 'picklogimg',
    //container: 'container',
    //drop_element: 'container',
    max_file_size: '10mb',
    flash_swf_url: 'js/plupload/Moxie.swf',
    dragdrop: true,
    chunk_size: '4mb',
    uptoken_url: '/admin/manage/qiniuuptoken',
    //   uptoken : 'JCWkTVQECf4AVb6dMkPPOrnS_jstVcjsmJzaRB82:DahNRjtUGZPpNeSZ6N_N8Sxs2BQ=:eyJzY29wZSI6ImJsYWNrY2F0IiwiZGVhZGxpbmUiOjE0NTAzNTUzMTR9',
    domain: 'http://7xnjg0.com1.z0.glb.clouddn.com/',
    // unique_names: true,
    // save_key: true,
    // x_vars: {
    //     'id': '1234',
    //     'time': function(up, file) {
    //         var time = (new Date()).getTime();
    //         // do something with 'time'
    //         return time;
    //     },
    // },
    auto_start: true,
    init: {
        'FilesAdded': function(up, files) {
            //$('table').show();
            //$('#success').hide();
            //plupload.each(files, function(file) {
            //    var progress = new FileProgress(file, 'fsUploadProgress');
            //    progress.setStatus("等待...");
            //});
        },
        'BeforeUpload': function(up, file) {
            //var progress = new FileProgress(file, 'fsUploadProgress');
            //var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
            //if (up.runtime === 'html5' && chunk_size) {
            //    progress.setChunkProgess(chunk_size);
            //}
        },
        'UploadProgress': function(up, file) {
            //var progress = new FileProgress(file, 'fsUploadProgress');
            //var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
            //progress.setProgress(file.percent + "%", up.total.bytesPerSec, chunk_size);

        },
        'UploadComplete': function() {

        },
        'FileUploaded': function(up, file, info) {
            //var progress = new FileProgress(file, 'fsUploadProgress');
            //progress.setComplete(up, info);
            var res = $.parseJSON(info);
            var domain = up.getOption('domain');
            var url = domain + encodeURI(res.key);
            $('#logimgimg').attr('src',url);
            $('#logimg').val(url);
        },
        'Error': function(up, err, errTip) {
            alert(err.message)
        },
         'Key': function(up, file) {
            var key = (new Date()).getTime()+"."+file.name.split('.').pop().toLowerCase();
            // do something with key
            return key
        }
    }
});

uploader.bind('FileUploaded', function() {
    console.log('hello man,a file is uploaded');
});
