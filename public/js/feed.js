var chickenFeed = new function(){
    $(start)

    function start(){
		console.log(feedRows);
        $('.feed_row').each(function(i, row){
            var feedTitle = $(row).find('.feed_title').text();
            console.log(feedTitle);
        })
        updateTimeSince('data-feed-ts');
    }
}
