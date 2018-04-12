$(document).ready(function () {
    var request;
    $('#quiz-form')[0].reset();

    // $(".button-collapse").sideNav();
    $('#quiz-form').submit(function (event) {

        event.preventDefault();

        if (request) {
            request.abort();
        }
        function jQFormSerializeArrToJson(formSerializeArr) {
            var jsonObj = {};
            jQuery.map(formSerializeArr, function (n, i) {
                jsonObj[n.name] = n.value;
            });

            return jsonObj;
        }
        var serializedArr = $("#quiz-form").serializeArray();
        var properJsonObj = jQFormSerializeArrToJson(serializedArr);
        
        request = $.ajax({
            url: "http://localhost:3000/users/quiz/result",
            type: "post",
            dataType: "json",
            data: properJsonObj
        });

        request.done(function (response, textStatus, jqXHR) {
            console.log(JSON.stringify(response));
            window.location = "http://localhost:3000/users/home";
        });

        request.fail(function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        });
        request.always(function () {
            console.log('Success or failure occured');
        });
    });
});