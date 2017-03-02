function submitForm() {
    $('#status').html("Uploading...");
    var fd = new FormData($('#fileinfo').get()[0]);
    fd.append("label", "WEBUPLOAD");
    // var logDef = "HTTP_METHOD,URL,HTTP_VERSION,ORIGIN_HEADER,SSL_CIPHER,SSL_PROTOCOL,LB_NAME,TIMESTAMP,CLIENT_IP:port,BACKEND_IP:port,request_processing_time,backend_processing_time,response_processing_time,elb_status_code,backend_status_code,received_bytes,sent_bytes";
    var logDef = $('#logpattern').val().trim();
    $('#status').html("Processing...");
    $.ajax({
        url: "/upload",
        type: "POST",
        beforeSend: function(request) {
            request.setRequestHeader("logdef", logDef);
        },
        data: fd,
        processData: false,
        contentType: false
    }).done(function(data) {
        if (data.downloadFilePath) {
            $('#status').html("Processing done. Downloading file");
            window.open('/download?downloadFilePath=' + data.downloadFilePath, '_self');
            $('#status').html("File downloaded.");
        } else {
            console.log("Unable to process");
            $('#status').html("Unable to process.");
        }
    });
    return false;
}
