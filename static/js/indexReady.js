//-------------------------------------------------
let id2title = new Map();
let id2autor = new Map();
let id4compArrIdx;
let id4compArrSize;
let id4compArr;

let history = new Array();
let lastHoverIdx;
let lastHoverVid;

//-------------------------------------------------
function historyPop(){
    console.log(history);
    if(history.length != 0){
        $("#console").html(history.pop());
    }
    else{
        $("#console").html(NULL);
    }
}

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

//-------------------------------------------------

function makeBar(vid, segComs){
    let divWidthAll = 320 - 20;
    let divHeight = 20;

    let divWidth = (divWidthAll / segComs.length).toFixed(4);
    let code = '<br /><div style="text-align: center;">';
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

function clickId4compMove(){
    console.log(id4compArr);
    console.log(id4compArrSize);
    $(".prev").on("click", function(){
        if(id4compArrIdx > 1){
            id4compArrIdx--;
            let tmp = `${id4compArr[id4compArrIdx - 1]}<div class="id4compMove"><span class="prev"> prev </span>` +
                `<span> ${id4compArrIdx} </span><span class="next"> next </span></div>`;
            $('#console').html(tmp);
            clickId4compMove();
        }
    });
    $(".next").on("click", function(){
        if(id4compArrIdx < id4compArrSize){
            id4compArrIdx++;
            let tmp = `${id4compArr[id4compArrIdx - 1]}<div class="id4compMove"><span class="prev"> prev </span>` +
                `<span> ${id4compArrIdx} </span><span class="next"> next </span></div>`;
            $('#console').html(tmp);
            clickId4compMove();
        }
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
                let videoInfos = new Array();
                for(let id of videoId){
                    videoInfos.push({title:id2title.get(id[0]), idx:id[1], id:id[0]});
                }
                videoInfos.sort(function(a, b){
                    if(a.title < b.title) return 1;
                    else if(a.title > b.title) return -1;
                    else {
                        if(a.idx > b.idx) return 1;
                        else return -1;
                    }
                });
                let MAXIDX = 10;
                //만약 해당 kc를 가진 영상이 너무 많으면
                if(videoInfos.length > MAXIDX){
                    id4compArr = new Array();
                    let idx = 0;
                    id4compArrSize = parseInt(videoInfos.length / MAXIDX);
                    for(let videoInfo of videoInfos){
                        code += `<div class="id4comp" data-vid=${videoInfo.id} data-idx=${videoInfo.idx} data-title='${videoInfo.title}'>${titleDrop(videoInfo.title, 25)}의 ${parseInt(videoInfo.idx)+1}번째</div> <br />`;
                        idx++;
                        if(idx == MAXIDX){
                            id4compArr.push(code);
                            code = "";
                            idx = 0;
                        }
                    }
                    
                    id4compArrIdx = 1;
                    let tmp = `${id4compArr[0]}<div class="id4compMove"><span class="prev"> prev </span>` +
                    `<span> ${id4compArrIdx} </span><span class="next"> next </span></div>`;
                    $('#console').html(tmp);
                    history.push(tmp);
                    clickId4compMove();
                }

                //적다면
                else{
                    for(let videoInfo of videoInfos){
                        code += `<div class="id4comp" data-vid=${videoInfo.id} data-idx=${videoInfo.idx} data-title='${videoInfo.title}'>${titleDrop(videoInfo.title, 25)}의 ${parseInt(videoInfo.idx)+1}번째</div> <br />`;
                    }
                    $('#console').html(code);
                    history.push(code);
                }
            }
        });
        clickId4Comp();
    });
}

function horverBar(){
    $(".bar").on("mouseenter", function(){
        let code = '<div class="comp">' + $(this).data('c0')+ '</div>' + '<br />' +
        '<div class="comp">' + $(this).data('c1')+ '</div>' + '<br />' +
        '<div class="comp">' + $(this).data('c2')+ '</div>' + '<br />' +
        '<div class="comp">' + $(this).data('c3')+ '</div>' + '<br />' +
        '<div class="comp">' + $(this).data('c4')+ '</div>' + '<br />';
        $('#console').html(code);
        if($(this).data('vid') != lastHoverVid && $(this).data('idx') != lastHoverIdx){
            history.push(code);
            lastHoverVid = $(this).data('vid');
            lastHoverIdx = $(this).data('idx');
        }
        clickComp();
    });
}

//-------------------------------------------------

function clickBack(){
    $("#consoleBack").on("click", function(){
        historyPop();
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
    id2title = new Map();
    id2autor = new Map();
    
    history = new Array();
    history.push("NULL");
    lastHoverIdx = "-1";
    lastHoverVid = "-1";

    $("#windowVideo").hide();
    $("#windowVideoBlock").hide();
    //비디오 리스트 요청(내부)
    standby();
    clickThum();
    horverBar();
    clickBar();
    
    clickBack();

    $("#btnClose").on("click", function(){
        let src = "http://www.youtube.com/embed/?enablejsapi=1&origin=http://example.com"+
            "&autoplay=1";
        $("#windowVideo").children('iframe').attr("src", src);
        $("#windowVideo").hide()
        $("#windowVideoBlock").hide()
    });



    $("#loading").hide()
});