$(document).ready(function(){
    $("#windowVedio").hide()

    $("#btnInp").on("click", function(){
        let url = $("#url").val().split("v=")[1]
        if(url.includes("&")){
            url = url.split("&")[0];
        }
        src = "http://www.youtube.com/embed/" + url + "?enablejsapi=1&origin=http://example.com";
        $("#player").attr("src", src);
        setInterval(function(){
            $.ajax({
                url: "/statusJsonOutput",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                success: function(resultData){
                    $("#status").html(resultData.s);
                }
            });    
        }, 1000);
    });

    $("#btnClose").on("click", function(){
        $("#windowVedio").hide()
    });
    $("#btnStart").on("click", function(){
        let yid = "jsYwFizhncE"
        let src = "http://www.youtube.com/embed/" + yid + "?enablejsapi=1&origin=http://example.com";
        $("#windowVedio").children('iframe').attr("src", src);
        $("#windowVedio").show()
    });
});