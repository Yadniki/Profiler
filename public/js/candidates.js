$(document).ready(function () {
    $(".send-email").on('click',function(){
        var closestEmail = $(this).closest('.candidate-email').text();
        var finalName = $(this).parent().parent().find('.candidate-name').text();
        var finalEmail = closestEmail.substring(0,closestEmail.length-4);
        console.log(finalName);
        $(this).addClass('disabled');
        var request;

        if(request)
        {
            request.abort();
        }
            
        request = $.ajax({
            url: "http://localhost:3000/employer/email",
            type: "post",
            dataType: "json",
            data: {
                email : finalEmail,
                name : finalName
            } 
        });

        request.done(function (response) {
            console.log(JSON.stringify(response));
            
        });

        request.fail(function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        });
        request.always(function () {
            console.log('Success or failure occured');
        });
    });
});