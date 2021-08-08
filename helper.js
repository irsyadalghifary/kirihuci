$(function () {
    window.on_all_image_loaded = ({ env = document, callback = null }) => {
        var $imgs = $('img', env), total = $imgs.length, sum = 0
        console.log(`total ${total}`)
        if (total == 0) {
            callback()
        } else {
            $imgs.each(function() {
                var img = new Image();
                img.src = $(this).attr('src')
                img.onload = function() {
                    sum++;
                    if (sum === total) {
                        callback()
                    }
                }
            })
        }
    }
})