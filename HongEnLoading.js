$(document).ready(function () {
    
    //数字加载部分
    (function(){
        var sum = 0;
        var loadingId = setInterval(function(){
            var step = getRandom(10, 50);
            sum = sum >=100 ? 100 : sum + step;
            $('.track').html(sum + '%');
            if (sum == 100) {
                clearInterval(loadingId);
            }
        }, 100)
    })()

    //文字加载部分
    descriptionShow(".description", 1000);
    
})

function getRandom(a, b) {
    return Math.floor((b - a)*Math.random() + a);
}
function descriptionShow(className, speed) {
    $(className).fadeIn(speed);
}