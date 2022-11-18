//-------------------------------------------------
let id2title;
let id2autor;
let id2comp;
//-------------------------------------------------

function id2info_push(vid){
    let ret;
    $.ajax({
        url: "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" + vid,
        type: "GET",
        async: false,
        dataType: "json",
        contentType: "application/json",
        success: function(res){
            ret = res;
        }
    });
    id2title.set(vid, ret.title);
    id2autor.set(vid, ret.author_name);
    return [ret.title, ret.author_name];
}

function abspos(e){
    this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
    this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
    return this;
}

function titleDrop(title, sizeMax){
    let ret = title;
    if(title.length > sizeMax){
        ret = title.substr(0, sizeMax-3) + "...";
    }
    return ret;
}

//-------------------------------------------------

function makeBar(vid, segComs){
    let divWidthAll = 320 - 0;
    let divHeight = 20;
    
    let divWidth = (divWidthAll / segComs.length).toFixed(2) - 2.2;
    let code = '<div style="text-align: center;">';
    let idx = 0;
    for(let coms of segComs){   
        code += `<div class="bar" style="width:${divWidth}px; height:${divHeight}px;` +
        'border:1px solid; display: inline-block;" ' +
        `data-vid=${vid} ` +
        `data-c0=${coms[0]} data-c1=${coms[1]} data-c2=${coms[2]} ` +
        `data-c3=${coms[3]} data-c4=${coms[4]} data-idx=${idx}` +
        '></div>';
        idx++;
    }
    code += '</div>'
    return code;
}

function makevideoSet(vid, title, segComs){
    let code = `<div class="thumSet" data-vid="${vid}" data-title="${title}" style="float: left; margin: 20px; height: 180px; width: 320px; background-image: url(https://img.youtube.com/vi/${vid}/mqdefault.jpg);">`+
            `<div class="thumSetTarget" style="width: 320px; height: 10px"></div>`+
            `<div class="videoTitleSmall">${titleDrop(title, 35)}</div>` +
            `<div class="thumSetTargetBig" style="height: 128px"></div>`+
            makeBar(vid, segComs) +
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
                let [title, autor] = id2info_push(vid);
                $.ajax({
                    url: "/getVideoSegKCS",
                    type: "POST",
                    async: false,
                    dataType: "json",
                    data: JSON.stringify({vid: vid}),
                    contentType: "application/json",
                    success: function(res){
                        let segComs = res.segComs;
                        id2comp.set(vid, segComs);
                        let code = makevideoSet(vid, title, segComs);
                        $("#listVideo").append(code);
                    }
                });
            }
        }
    });
}

function standby1(){
    $.ajax({
        url: "/getVideoR1s",
        type: "POST",
        async: false,
        dataType: "json",
        contentType: "application/json",
        success: function(res){
            if (res.videoRecomms.length > 0)
            {
                for(let videoRecomm of res.videoRecomms){
                    let vid = videoRecomm[0];
                    let title = id2title.get(vid);
                    let segComs = id2comp.get(vid);
                    let code = makevideoSet(vid, title, segComs);
                    $("#listVideoR1").append(code);
                }
            }
        }
    });
}

function standby2(){
    $.ajax({
        url: "/getVideoR2s",
        type: "POST",
        async: false,
        dataType: "json",
        contentType: "application/json",
        success: function(res){
            if (res.videoRecomms.length > 0)
            {
                for(let videoRecomm of res.videoRecomms){
                    let vid = videoRecomm[0];
                    let title = id2title.get(vid);
                    let segComs = id2comp.get(vid);
                    let code = makevideoSet(vid, title, segComs);
                    $("#listVideoR2").append(code);
                }
            }
        }
    });
}

function clickThum(){
    $(".thumSetTarget").on("click", function(){
        let sel = $(this).parent();
        let vid = $(sel).data('vid');
        let title = $(sel).data('title');
        let src = "http://www.youtube.com/embed/" + vid + "?enablejsapi=1&origin=http://example.com&autoplay=1&mute=1";
        $.ajax({
            url: "/getWho",
            type: "POST",
            async: false,
            dataType: "json",
            data: JSON.stringify({msg : "plz"}),
            contentType: "application/json",
            success: function(res){
                if(res.id != 'ANONYMOUSE'){
                    $.ajax({
                        url: "/eventClick",
                        type: "POST",
                        async: false,
                        dataType: "json",
                        data: JSON.stringify({vid : vid, comps : id2comp.get(vid)}),
                        contentType: "application/json",
                        success: function(res){
                            console.log("ok");
                        }
                    });
                }
            }
        });

        $("#windowVideo").children('iframe').attr("src", src);
        $("#windowVideo").children('#videoTitle').text(title);
        $("#windowVideoBlock").show();
        $("#windowVideo").show();
        $("#btnClose").show();
    });
}

function clickThumBig(){
    $(".thumSetTargetBig").on("click", function(){
        let sel = $(this).parent();
        let vid = $(sel).data('vid');
        let title = $(sel).data('title');
        let src = "http://www.youtube.com/embed/" + vid + "?enablejsapi=1&origin=http://example.com&autoplay=1&mute=1";
        $.ajax({
            url: "/getWho",
            type: "POST",
            async: false,
            dataType: "json",
            data: JSON.stringify({msg : "plz"}),
            contentType: "application/json",
            success: function(res){
                if(res.id != 'ANONYMOUSE'){
                    $.ajax({
                        url: "/eventClick",
                        type: "POST",
                        async: false,
                        dataType: "json",
                        data: JSON.stringify({vid : vid, comps : id2comp.get(vid)}),
                        contentType: "application/json",
                        success: function(res){
                            console.log("ok");
                        }
                    });
                }
            }
        });

        $("#windowVideo").children('iframe').attr("src", src);
        $("#windowVideo").children('#videoTitle').text(title);
        $("#windowVideoBlock").show();
        $("#windowVideo").show();
        $("#btnClose").show();
    });
}

//-------------------------------------------------

function clickBar(){
    $(".bar").on("click", function(){
        let time = Number($(this).data('idx')) * 60 * 5;
        let sel = $(this).parent().parent();
        let yid = sel.data('vid');
        let title = sel.data('title');
        let src = "http://www.youtube.com/embed/" + yid + "?enablejsapi=1&origin=http://example.com&autoplay=1&mute=1&start=" + time;
        console.log(src);
        $("#windowVideo").children('iframe').attr("src", src);
        $("#windowVideo").children('#videoTitle').text(title);
        $("#windowVideoBlock").show();  
        $("#windowVideo").show();
    });
}
    
function hoverBar2Not(){
    $(".btnHoverMenuClose").on("click", function(){
        $("#hoverMenu").hide();
    });
}

function hoverBar2(){
    $(".bar").on("mouseenter", function(e){
        $("#hoverMenu").hide();
        let code = "";
        for(let i=0; i<5; i++){
            code += '<div class="comp"' + 'data-c=' + $(this).data('c' + i.toString()) +
            '>' + titleDrop($(this).data('c' + i.toString()), 22) + '</div>';
        }
        code += '<div class="btnHoverMenuClose">CLOSE</div>';
        pos = abspos(e);
        readyX = pos.x+"px";
        readyY = (pos.y+10)+"px";
        $("#hoverMenu").css({"top": readyY, "left":readyX});
        $('#hoverMenu').html(code);
        $("#hoverMenu").show();
        hoverBar2Not();``
        clickComp2();
    });
}

function clickComp2(){   
    $(".comp").on("click", function(){
        window.open('https://en.wikipedia.org/wiki/' + $(this).data('c'));  
        //location.href='https://en.wikipedia.org/wiki/' + $(this).data('c');
    });
}

//-------------------------------------------------

$(document).keydown(function(event){
    $(document).keydown(function(event) {
        if ( event.keyCode == 27 || event.which == 27 ) {
            let src = "http://www.youtube.com/embed/?enablejsapi=1&origin=http://example.com"+
                "&autoplay=1";
            $("#windowVideo").children('iframe').attr("src", src);
            $("#windowVideo").hide();
            $("#windowVideoBlock").hide();
        }
    });
});

$(document).ready(function(){
    id2title = new Map();
    id2autor = new Map();
    id2comp = new Map();
    $("#btnClose").hide();
    $("#windowVideo").hide();
    $("#windowVideoBlock").hide();
    $("#hoverMenu").hide();
    //비디오 리스트 요청(내부)
    standby();
    standby1();
    standby2();
    clickThum();
    clickThumBig();
    hoverBar2();
    clickBar();

    $("#btnClose").on("click", function(){
        let src = "http://www.youtube.com/embed/?enablejsapi=1&origin=http://example.com"+
            "&autoplay=1";
        $("#windowVideo").children('iframe').attr("src", src);
        $("#btnClose").hide();
        $("#windowVideo").hide();
        $("#windowVideoBlock").hide();
    });

    $("#loading").hide();
});