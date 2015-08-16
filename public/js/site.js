$(function(){
    var linkHandler = Plaid.create({
        env: 'tartan',
        clientName: 'Client Name',
        key: 'test_key',
        product: 'auth',
        onLoad: function(){
            // The Link module finished loading.
            console.log('The Link module finished loading');
        },
        onSuccess: function(public_token){
            // Send your public_token to your app server here.
            console.log('Public token here: ' + public_token);

        },
        onExit: function(){
            // The user exited the Link flow.
            console.log('The user exited the Link flow.');
        },
    });

    $('#showMenu').on('click', function(){
        linkHandler.open();
    });
});
