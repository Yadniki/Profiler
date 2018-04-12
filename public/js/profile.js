$(document).ready(function () {
    var score_c = parseInt(document.getElementById(scoreC).innerHTML());
    console.log(score_c);
    var score_sql = parseInt(document.getElementById(scoreSql).innerHTML());
    console.log(score_sql);
    var score_java = parseInt(document.getElementById(scoreJava).innerHTML());
    console.log(score_java);
    var widthA = (score_c / 5) * 100;
    $('#scoreC').css({
        'width': widthA + '%'
    });
    var widthB = (score_sql / 5) * 100;
    $('#scoreSql').css({
        'width': widthB + '%'
    });
    var widthC = (score_java / 5) * 100;
    $('#scoreJava').css({
        'width': widthC + '%'
    });
});