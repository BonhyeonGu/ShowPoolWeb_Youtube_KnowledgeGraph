function standby(){
    $.ajax({
        url: "/getVideos",
        type: "POST",
        async: false,
        dataType: "json",
        contentType: "application/json",
        success: function(res){
            for(let vid of res.videoIds){
                //비디오 타이틀 요청(외부)
                $.ajax({
                    url: "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" + vid,
                    type: "GET",
                    async: false,
                    dataType: "json",
                    contentType: "application/json",
                    success: function(res){
                        let title = res.title;
                        //컴포넌트 리스트 요청(내부)
                        $.ajax({
                            url: "/getVideoSegKCS",
                            type: "POST",
                            async: false,
                            dataType: "json",
                            data: JSON.stringify({vid: vid}),
                            contentType: "application/json",
                            success: function(res){
                                let segComs = res.segComs;
                                let code = makevideoSet(vid, title, segComs);
                                $("#listVideo").append(code);
                            }
                        })
                    }
                }); 
            }
        }
    }); 
}

function makeBar(segComs){
    let divWidthAll = 320 - 20;
    let divHeight = 20;

    let divWidth = (divWidthAll / segComs.length).toFixed(4);
    let code = '<br /><div style="text-align: center;">';
    let idx = 0;
    for(let coms of segComs){   
        code += `<div class="bar" style="width:${divWidth}px; height:${divHeight}px;` +
        'border:1px solid; display: inline-block;" ' +
        `data-idx=${idx} ` +
        `data-c0=${coms[0]} data-c1=${coms[1]} data-c2=${coms[2]} ` +
        `data-c3=${coms[3]} data-c4=${coms[4]}` +
        '></div>';
        idx++;
    }
    code += '</div>'
    return code;
}

function titleDrop(title){
    let sizeMax = 40, ret = title;
    if(title.length > sizeMax){
        ret = title.substr(0, sizeMax-3) + "...";
    }
    return ret;
}

function makevideoSet(vid, title, segComs){
    let code = `<div class="thumSet" style="float: left; margin: 20px;">`+
            `<img data-vid="${vid}" data-title="${title}" class="thumImg" src="https://img.youtube.com/vi/${vid}/mqdefault.jpg"` +
            '</img>'+
            `<div class="thumTitle" style="text-align: center;">${titleDrop(title)}</div>` +
            makeBar(segComs) +
            '</div>'+
        '<div style="width:200px; position: relative; float: left;"></div>';
        return code;
}

function horverBar(){
    $(".bar").on("mouseenter", function(){
        let code = '<div class="comp">' + $(this).data('c0')+ '</div>' + '<br />' +
        '<div class="comp">' + $(this).data('c1')+ '</div>' + '<br />' +
        '<div class="comp">' + $(this).data('c2')+ '</div>' + '<br />' +
        '<div class="comp">' + $(this).data('c3')+ '</div>' + '<br />' +
        '<div class="comp">' + $(this).data('c4')+ '</div>' + '<br />';
        $('#console').html(code)
    });
}

function clickBar(){
    $(".comp").on("click", function(){
        let yid = $(this).data('vid');
        let title = $(this).data('title');
        let src = "http://www.youtube.com/embed/" + yid + "?enablejsapi=1&origin=http://example.com&autoplay=1&mute=1";
        $("#windowVideo").children('iframe').attr("src", src);
        $("#windowVideo").children('#videoTitle').text(title);
        $("#windowVideoBlock").show();
        $("#windowVideo").show();
    });
}

function clickComp(){
    
}

function clickThum(){
    $(".thumImg").on("click", function(){
        let yid = $(this).data('vid');
        let title = $(this).data('title');
        let src = "http://www.youtube.com/embed/" + yid + "?enablejsapi=1&origin=http://example.com&autoplay=1&mute=1";
        $("#windowVideo").children('iframe').attr("src", src);
        $("#windowVideo").children('#videoTitle').text(title);
        $("#windowVideoBlock").show();
        $("#windowVideo").show();
    });
}

$(document).ready(function(){
    $("#windowVideo").hide();
    $("#windowVideoBlock").hide();
    //비디오 리스트 요청(내부)
    standby();
    clickThum();
    horverBar();

    $("#btnClose").on("click", function(){
        let src = "http://www.youtube.com/embed/?enablejsapi=1&origin=http://example.com"+
            "&autoplay=1";
        $("#windowVideo").children('iframe').attr("src", src);
        $("#windowVideo").hide()
        $("#windowVideoBlock").hide()
    });

    
    $("#loading").hide()
});