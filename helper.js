$(function () {
    window.on_all_image_loaded = ({ envs = [document], callback = null }) => {
        let done_count = 0

        const add_done = () => {
            done_count += 1
            if (done_count === envs.length) {
                callback()
            }
        }

        for (const env of envs) {
            var $imgs = $('img', env), total = $imgs.length, sum = 0
            if (total == 0) {
                add_done()
            } else {
                $imgs.each(function() {
                    var img = new Image();
                    img.src = $(this).attr('src')
                    img.onload = function() {
                        sum++;
                        if (sum === total) {
                            add_done()
                        }
                    }
                })
            }
        }
        
    }
})