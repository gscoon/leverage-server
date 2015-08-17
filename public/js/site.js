var site = {
    processURL: window.location.origin + '/process',

    onload: function(){
        this.setPlaidMenu();
        this.fakePost();
    },

    setPlaidMenu: function(){
        var linkHandler = Plaid.create({
            env: 'tartan',
            clientName: 'Client Name',
            key: 'test_key',
            product: 'auth',
            onLoad: function(){
                // The Link module finished loading.
                console.log('The Link module finished loading');
                //linkHandler.open();
            },
            onSuccess: function(public_token){
                // Send your public_token to your app server here.
                console.log('Public token here: ' + public_token);
                site.sendUserToken(public_token);
            },
            onExit: function(){
                // The user exited the Link flow.
                console.log('The user exited the Link flow.');
            },
        });

        $('#showMenu').on('click', function(){
            linkHandler.open();
        });
    },

    sendUserToken: function(publicToken){
        this.sendPost('new_user', {token: publicToken}, function(res){
            console.log(res);
        });
    },

    fakePost: function(){
        this.sendPost('new_user', {token:'test,bofa,connected'}, function(res){
            console.log(res);
        });
    },

    sendPost: function(which, data, callback){
        $.ajax({
            url: this.processURL + '?which=' + which,
            type:'POST',
            data: data
        }).done(callback);
    }
};

$(site.onload.bind(site));
