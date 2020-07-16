// JavaScript source code

var MAIN_DATA;

//����ѧ�o��������Ϊ���ļo����
function yearMath2Astro(ma) {

    var astr = "";
    if (ma <= 0) {
        astr = 1 - ma + "BC";
        console.log("Mathematical year " + ma + " = Astronomical year " + astr)
        return astr;

    }
    else {
        console.log("Mathematical year " + ma + " = Astronomical year " + ma + "CE")
        return ma

    }
};




//������ѹ����ܹ����е�canvas���� context.wrapText(text,x,y,maxWidth,lineHeight)
CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {
    if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
        return;
    }

    var context = this;
    var canvas = context.canvas;

    if (typeof maxWidth == 'undefined') {
        maxWidth = (canvas && canvas.width) || 300;
    }
    if (typeof lineHeight == 'undefined') {
        lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);
    }

    // �ַ��ָ�Ϊ����
    var arrText = text.split('');
    var line = '';

    for (var n = 0; n < arrText.length; n++) {
        var testLine = line + arrText[n];
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = arrText[n];
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
};

//��ר�ⷵ��Ϊ��ɫ
function topic2Color(str) {
    switch (str) {
        case 'culture': return 'rgba(255,20,60,0.5)'; break;
        case 'philosophy': return 'rgba(255,0,0,0.5)'; break;
        case 'politic': return 'rgba(0,0,255,0.5)'; break;
        case 'tex': return 'rgba(252,215,0,0.5)'; break;


        default: return 'rgba(0,255,0,0.5)'
    }
}

//��������
function goRun() {
    //��ȡԭʼ����
    MAIN_DATA = JSON.parse(document.getElementById('rawCode').value);
    console.log(MAIN_DATA);

    printTimeLine(MAIN_DATA);
}

//Kernel
function printTimeLine(tl) {

    var Dhead = 50;/*titleԤ���ռ�*/
    var Dface = 50;/*����Ԥ���ռ�*/

    //��������
    var canvas = document.createElement('canvas');
    canvas.id = "timeline";
    canvas.width = 2*Dhead+(tl.endY - tl.startY)*tl.yearW;
    canvas.height = Dface + tl.maxRe * tl.maxSlot * tl.eventH/*�¼�Ԥ��height*/+50;
    document.getElementById('OutputZone').appendChild(canvas);
    var ctx = canvas.getContext("2d");

    var cW = canvas.width;
    var cH = canvas.height;
    

    //�������
    ctx.fillStyle = "rgba(240,248,255,0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //����title
    ctx.font = "2em Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(tl.title, cW / 2, 0)

    //����ʱ����
    ctx.beginPath();
    ctx.moveTo(0, Dface);
    ctx.lineTo(cW, Dface);
    ctx.strokeStyle = "black";
    ctx.stroke();

    //����
    ctx.font = "0.7em Georgia";
    ctx.fillStyle = "black";
    ctx.textAlign = "start";
    ctx.textBaseline = "top";

    ctx.beginPath();//�����
    ctx.moveTo(Dhead, Dface);
    ctx.lineTo(Dhead, Dface + 10);
    ctx.stroke();
    ctx.fillText(yearMath2Astro(tl.startY), Dhead, Dface - 10);

    ctx.beginPath();//�յ���
    ctx.moveTo((tl.endY-tl.startY)*tl.yearW+Number(Dhead), Dface);
    ctx.lineTo((tl.endY - tl.startY) * tl.yearW + Number(Dhead), Dface + 10);
    ctx.stroke();
    ctx.fillText(yearMath2Astro(tl.endY), ((tl.endY - tl.startY) * tl.yearW + Number(Dhead)), Dface - 10);

    //������
    for (var i = 1; i*10 < (Number(tl.endY)-Number(tl.startY)); i++) {
        ctx.beginPath();
        ctx.moveTo(Dhead + 10*i * tl.yearW, Dface);
        ctx.lineTo(Dhead + 10*i * tl.yearW, Dface + 10);
        ctx.stroke();
        ctx.fillText(yearMath2Astro(10*i + Number(tl.startY)), Dhead + 10*i * tl.yearW, Dface - 10);
    };

    //��������
    ctx.beginPath();
    ctx.moveTo(Dhead, Dface);
    ctx.lineTo(Dhead, Dface+Number(tl.maxRe*tl.maxSlot*tl.eventH));
    ctx.strokeStyle = "black";
    ctx.stroke();

    //������Ŀ
    ctx.font = "1em Georgia";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    var reNames = tl.reName.split(",");
    for (var i = 0; i < reNames.length; i++) {
        ctx.wrapText(tl.reName.split(",")[i], Dhead/2, Dface+i*Number(tl.maxSlot)*tl.eventH, Dhead,20);
    }


    //�����¼�
    var slot_count = [];
    for (var i = 0; i < reNames.length; i++) {
        slot_count[i] = 0;
    }
    function drawEvent(eve) {
        var bX = Number(eve.beginY);
        var duration = Number(eve.endY) - Number(eve.beginY);
        duration = duration * tl.yearW;
        if (duration==0) {
            duration=1
        }
        var bY = eve.re * Number(tl.maxSlot) * tl.eventH + slot_count[eve.re];

        bX = (bX-Number(tl.startY))*tl.yearW + Dface;
        bY = bY+slot_count[eve.re]*tl.eventH + Dhead;

        ctx.fillStyle = topic2Color(eve.topic);
        ctx.fillRect(bX, bY, duration, Number(tl.eventH));
        console.log(bX, bY)

        ctx.font = "0.75em Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "start";
        ctx.textBaseline = "top";
        ctx.fillText(eve.title+eve.subtitle, bX, bY+2);

        slot_count[eve.re] += 1;
        if (slot_count[eve.re]==tl.maxSlot) {
            slot_count[eve.re]=0
        }
    };
    for (var i = 0; i < tl.son.length; i++) {
        drawEvent(tl.son[i])
    };

    //����ˮӡ
    if (tl.watermark==undefined||tl.watermark=="") {
        tl.watermark="Powered by GreatBaron"
    };

    
    ctx.font = "normal small-caps 700 6em arial";    
    ctx.fillStyle = "rgba(0,0,0,0.175)";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(tl.watermark, cW / 2, cH / 2);
    

    
    

    /*
    for (var i = 0; (i*100) < (tl.endY-tl.startY); i++) {
        ctx.beginPath();
        ctx.moveTo(i*100+Dhead, Dface);
        ctx.lineTo(i*100+Dhead, Dface + 10);
        ctx.stroke();
        ctx.fillText(yearMath2Astro(i*100+tl.startY), i*100+Dhead, Dface - 10);
    }*/
   
}