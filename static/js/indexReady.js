function id2title(vid){
    let ret;
    $.ajax({
        url: "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" + vid,
        type: "GET",
        async: false,
        dataType: "json",
        contentType: "application/json",
        success: function(res){
            ret = res.title;
        }
    });
    return ret;
}

//-------------------------------------------------


//-------------------------------------------------

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
        `data-c3=${coms[3]} data-c4=${coms[4]} data-idx=${idx}` +
        '></div>';
        idx++;
    }
    code += '</div>'
    return code;
}

function titleDrop(title, sizeMax){
    let ret = title;
    if(title.length > sizeMax){
        ret = title.substr(0, sizeMax-3) + "...";
    }
    return ret;
}

function makevideoSet(vid, title, segComs){
    let code = `<div class="thumSet" style="float: left; margin: 20px;">`+
            `<img data-vid="${vid}" data-title="${title}" class="thumImg" src="https://img.youtube.com/vi/${vid}/mqdefault.jpg"` +
            '</img>'+
            `<div class="thumTitle" style="text-align: center;">${titleDrop(title, 40)}</div>` +
            makeBar(segComs) +
            '</div>'+
        '<div style="width:200px; position: relative; float: left;"></div>';
        return code;
}

function standby(){
    $.ajax({
        url: "/getVideos",
        type: "POST",
        async: false,
        dataType: "json",
        contentType: "application/json",
        success: function(res){
            for(let vid of res.videoIds){
                let title = id2title(vid);
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
                });
            }
        }
    });
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

//-------------------------------------------------

function horverBar(){
    $(".bar").on("mouseenter", function(){
        let code = '<div class="comp">' + $(this).data('c0')+ '</div>' + '<br />' +
        '<div class="comp">' + $(this).data('c1')+ '</div>' + '<br />' +
        '<div class="comp">' + $(this).data('c2')+ '</div>' + '<br />' +
        '<div class="comp">' + $(this).data('c3')+ '</div>' + '<br />' +
        '<div class="comp">' + $(this).data('c4')+ '</div>' + '<br />';
        $('#console').html(code)
        clickComp();
    });
}

function clickBar(){
    $(".bar").on("click", function(){
        let time = Number($(this).data('idx')) * 60 * 5;
 
        let sel = $(this).parent().parent().children('img');
        let yid = sel.data('vid');
        let title = sel.data('title');

        let src = "http://www.youtube.com/embed/" + yid + "?enablejsapi=1&origin=http://example.com&autoplay=1&mute=1&start=" + time;
        $("#windowVideo").children('iframe').attr("src", src);
        $("#windowVideo").children('#videoTitle').text(title);
        $("#windowVideoBlock").show();
        $("#windowVideo").show();
    });
}

function clickId4Comp(){
    $(".id4comp").on("click", function(){
        let time = Number($(this).data('idx')) * 60 * 5;
        let yid = $(this).data('vid');
        let title = $(this).data('title');
        let src = "http://www.youtube.com/embed/" + yid + "?enablejsapi=1&origin=http://example.com&autoplay=1&mute=1&start=" + time;
        $("#windowVideo").children('iframe').attr("src", src);
        $("#windowVideo").children('#videoTitle').text(title);
        $("#windowVideoBlock").show();
        $("#windowVideo").show();
    });
}

function clickComp(){
    $(".comp").on("click", function(){
        let code = "";
        let comp = $(this).text();
        $(this).text("로딩중");
        $.ajax({
            url: "/getKC_Videos",
            type: "POST",
            async: false,
            dataType: "json",
            data: JSON.stringify({comp: comp}),
            contentType: "application/json",
            success: function(res){
                let videoId = res.videoIds;
                for(let id of videoId){
                    let title = id2title(id[0]);
                    code += `<div class="id4comp" data-vid=${id[0]} data-idx=${id[1]} data-title='${title}'>${titleDrop(title, 20)}의 ${id[1]}번째</div> <br />`
                }
            }
        });
        $('#console').html(code);
        clickId4Comp();
    });
}

//-------------------------------------------------
$(document).keydown(function(event){
    $(document).keydown(function(event) {
        if ( event.keyCode == 27 || event.which == 27 ) {
            let src = "http://www.youtube.com/embed/?enablejsapi=1&origin=http://example.com"+
                "&autoplay=1";
            $("#windowVideo").children('iframe').attr("src", src);
            $("#windowVideo").hide()
            $("#windowVideoBlock").hide()
        }
    });
});

$(document).ready(function(){
    $("#windowVideo").hide();
    $("#windowVideoBlock").hide();
    //비디오 리스트 요청(내부)
    standby();
    clickThum();
    horverBar();
    clickBar();
    //clickComp();

    $("#btnClose").on("click", function(){
        let src = "http://www.youtube.com/embed/?enablejsapi=1&origin=http://example.com"+
            "&autoplay=1";
        $("#windowVideo").children('iframe').attr("src", src);
        $("#windowVideo").hide()
        $("#windowVideoBlock").hide()
    });



    $("#loading").hide()
});