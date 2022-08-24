function makeBar(segComs){
    segSize = segComs.length;
    console.log(segSize);
}

function makeVedioSet(vid, title){
    let code = `<div><img id="${vid}" class="thumImg" src="https://img.youtube.com/vi/${vid}/mqdefault.jpg"` +
        '</img>'+
        `<div class="thumTitle">${title}</div>` +
        '</div>';
        return code;
}

$(document).ready(function(){
    $("#windowVedio").hide()
    //비디오 리스트 요청(내부)
    $.ajax({
        url: "/getVideos",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function(res){
            for(let vid of res.vedioIds){
                //비디오 타이틀 요청(외부)
                $.ajax({
                    url: "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" + vid,
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json",
                    success: function(res){
                        let title = res.title;
                        //컴포넌트 리스트 요청(내부)
                        $.ajax({
                            url: "/getVideoSegKCS",
                            type: "POST",
                            dataType: "json",
                            data: JSON.stringify({vid: vid}),
                            contentType: "application/json",
                            success: function(res){
                                let segComs = res.segComs;
                                makeBar(segComs);
                                let code = makeVedioSet(vid, title);
                                $("#listVideo").append(code);
                            }
                        })
                    }
                }); 
            }
        }
    }); 

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