$(document).ready(function () {
    descriptionShow(".description", 3000);
    var judgeNum = true; //判断动画是否执行完成
    $(".HongEnWord").on('click', function () {
        move(".word_1", -200, -200, 1000);
        move(".word_2", -200, 20000, 4000);
        move(".word_3", -2000, 20000, 4000);
        move(".word_4", -200, -200, 1001);
        move(".word_5", 400, -200, 1002);
        move(".word_6", 400, 2000, 1003);
        move(".word_7", 500, -200, 1004);
        move(".word_8", 600, -300, 1005);
        move(".word_9", 600, -400, 1006);
        move(".word_10", 700, 2000, 1007);
        move(".word_11", 800, 2000, 1008);
        move(".word_12", 700, -2000, 1009);
        move(".word_13", 800, 2000, 1010);
        move(".word_14", 1200, -2000, 1011);
        move(".word_15", 1200, 2000, 1012);
        move(".word_16", 1500, -2000, 1013);
        move(".word_17", 1500, 2000, 1014);
        move(".word_17", 1500, -2000, 1015);
        if (judgeNum) {
            judgeNum = false;
            var timeId = setTimeout(function () {
                $(".HongEnWord").empty();
                $(".HongEnWord").addClass("stage");
                $(".HongEnWord").removeClass("HongEnWord");
                createNewPage(".stage", 7);
            }, 1000)
        }

    })

    var moveObj = {
        xStart: 0,
        yStart: 0,
        xDistance: 0,
        yDistance: 0
    }
    var rotateMoveId;

    // 小球位置
    var objPos = [];
    //初始化图标位置，定义alpha与phi脚来确定小球的位置,数组第一位代表phi，第二位代表alpha。
    var angelGroups = [
        [Math.PI*0.45836, Math.PI*0.67143],
        [Math.PI*3.2 / 5, Math.PI*4.9 / 6],
        [Math.PI / 3, Math.PI*4.4 / 5],
        [Math.PI*2.2 / 3, Math.PI * 3/ 4],
        [Math.PI*0.7 / 3, Math.PI / 2],
        [Math.PI*1.2 / 2, Math.PI / 2],
        [Math.PI / 6, Math.PI*4.3 / 5]
    ];
    //球半径
    var ballRadius = 400;
    //对小球做初始渲染
    for (var i = 0, len = angelGroups.length; i < len; i++) {
        var sina = Math.sin(angelGroups[i][0]);
        var sinb = Math.sin(angelGroups[i][1]);
        var cosa = Math.cos(angelGroups[i][0]);
        var cosb = Math.cos(angelGroups[i][1]);
        var x = ballRadius * sina * cosb;
        var y = ballRadius * cosa;
        var z = ballRadius * sina * sinb;
        objPos.push([x, y, z]);
    }

    function ballMove() {
        var container = document.getElementById("container");
        document.body.addEventListener('touchstart', touchstart, false);
        document.body.addEventListener('touchmove', touchmove, false);
        document.body.addEventListener('touchend', touchend, false);



        printBalls();
        //自动旋转：
        // rotateMoveId = setInterval(function () {
        //     var xDistance = getRandom(0, 1);
        //     var yDistance = getRandom(0, 1);
        //     moveToRot(xDistance, xDistance);
        // }, 100)




        // var deviceWidth = $(window).width();

        //点击图标旋转
        var targetGroups = document.getElementsByClassName('word');
        for (var k = 0, len = $('.word').length; k < len; k++) {
            targetGroups[k].addEventListener('click', moveToCenter.bind(this, k), false);
        }
    }

    function descriptionShow(className, speed) {
        $(className).fadeIn(speed);
    }

    function move(className, top, left, speed) {
        speed = speed ? speed : 1000;
        $(className).animate({
            top: top / 100 + "rem",
            left: left / 100 + "rem"
        }, speed, 'linear', function () {});
    }

    function createNewPage(className, count) {
        var $div = $("<div></div>");
        $div.attr({
            id: 'container'
        });
        $(className).append($div);
        for (var i = 1; i <= count; i++) {
            var $newDiv = $("<div></div>");
            $newDiv.addClass("word");
            $newDiv.addClass("num" + i);
            $("#container").append($newDiv);
        }
        ballMove();
    }



    /**
     * 打印所有小球
     */
    function printBalls() {
        for (var i = 0; i < $('.word').length; i++) {
            index = i + 1;
            x = objPos[i][0];
            y = objPos[i][1];
            z = objPos[i][2];
            $('.num' + index).css({
                'transform': 'translate3d(' + x / 100 + 'rem,' + y / 100 + 'rem,' + z / 100 + 'rem)'
            });
        }
    }

    function touchstart(event) {
        var event = event || window.event;
        var touch = event.targetTouches[0];
        moveObj.xStart = touch.clientX;
        moveObj.yStart = touch.clientY;
        clearInterval(rotateMoveId);
    }

    function touchmove(event) {
        var event = event || window.event;
        var touch = event.targetTouches[0];
        event.preventDefault();
        moveObj.xDistance = touch.clientX - moveObj.xStart;
        moveObj.yDistance = touch.clientY - moveObj.yStart;
        moveToRot(moveObj.xDistance, moveObj.yDistance);
        moveObj.xStart = touch.clientX;
        moveObj.yStart = touch.clientY;
        event.stopPropagation()
    }

    function touchend(event) {
        var event = event || window.event;
        var touch = event.targetTouches[0];
        // console.log('end!');
        moveObj.xDistance = 0;
        moveObj.yDistance = 0;
        // rotateMoveId = setInterval(function () {
        //     moveToRot(0.1, 0.1);
        // }, 100);
    }

    function getRandom(a, b) {
        // console.log(a + Math.random()* (b - a));
        return a + Math.random() * (b - a);
    }

    /**
     * 通过屏幕移动量进行旋转
     * @param xDistance
     * @param yDistance
     * @param j
     */
    function moveToRot(xDistance, yDistance) {
        //计算需要旋转的角度
        var yAng = -xDistance / $(window).width() * 2 * Math.PI;
        var xAng = yDistance / $(window).width() * 2 * Math.PI;
        //对所有物体一次操作
        for (var i = 0, len = $('.word').length; i < len; i++) {
            objPos[i] = rotate(xAng, yAng, objPos[i]);
        }
        printBalls();
    }

    /**
     * 旋转函数
     * @param xAng  绕x轴旋转角度，轴向顺时针
     * @param yAng  绕y轴旋转角度，轴向顺时针
     * @param vector  待旋转向量
     */
    function rotate(xAng, yAng, vector) {
        xRotMat = [
            [1, 0, 0],
            [0, Math.cos(xAng), Math.sin(xAng)],
            [0, -Math.sin(xAng), Math.cos(xAng)]
        ];

        yRotMat = [
            [Math.cos(yAng), 0, -Math.sin(yAng)],
            [0, 1, 0],
            [Math.sin(yAng), 0, Math.cos(yAng)]
        ];
        vector = matmul(yRotMat, vector);
        vector = matmul(xRotMat, vector);
        return vector;
    }

    /**
     * 简单矩阵乘法，不做任何合法性判断
     * A为3*3矩阵  B为1*3 返回1*3矩阵
     * */
    function matmul(matA, matB) {
        var result = [];
        for (var i = 0; i < 3; i++) {
            result[i] = 0;
            for (var j = 0; j < 3; j++) {
                result[i] += matA[i][j] * matB[j];
            }
        }
        return result;
    }



    function moveToCenter(index) {
        // moveToTargetAngAdvance(index, Math.PI / 2, Math.PI / 2, Math.PI / 30);
        var fastMoveId = setInterval((function (index) {
            //目标移动角度
            var theta = Math.PI * 0.67143;
            var phi = Math.PI * 0.45836;
            //每步需要旋转的度数
            var delta = Math.PI / 30;
            var oriTheta, oriPhi;
            var tempArr = calPosAng(index);
            oriTheta = tempArr[0];
            oriPhi = tempArr[1];
            //计算需要旋转的方位角差值
            var theta2Rot = theta - oriTheta;
            var phi2Rot = phi - oriPhi;
            //计算需要的步数
            var step = Math.floor(Math.max(Math.abs(theta2Rot / delta), Math.abs(phi2Rot / delta)));
            if (step == 0) {
                clearInterval(fastMoveId);
                return;
            }
            //每步需要旋转的方位角
            var dTheta = theta2Rot / step;
            var dPhi = phi2Rot / step;
            // console.log(dTheta - delta, dPhi - delta);
            var x, z;
            var k = 0;
            return function () {
                k++;
                // console.log(k, step);
                x = objPos[index][0];
                z = objPos[index][2];
                rotateByArbitraryVec([z, 0, -x], -dTheta);
                var tempAng = calPosAng(index);
                var degTheta = tempAng[0] / Math.PI * 180;
                var degPhi = tempAng[1] / Math.PI * 180;
                var alterPhi = tempAng[1] - oriPhi;
                //绕y轴旋转角度
                var yAng = (dPhi - alterPhi) / Math.PI * 180;
                rotateByArbitraryVec([0, 1, 0], dPhi - alterPhi);
                tempAng = calPosAng(index);
                degTheta = tempAng[0] / Math.PI * 180;
                degPhi = tempAng[1] / Math.PI * 180;
                oriPhi = tempAng[1];
                // console.info("方位角[", oriTheta, ",", oriPhi, "]");
                printBalls();
                if (Math.abs(k - step) <= 0.001) {
                    clearInterval(fastMoveId);
                }
            }
        })(index), 30)
    }

    function calPosAng(i) {
        var result = [];
        var x = objPos[i][0];
        var y = objPos[i][1];
        var z = objPos[i][2];
        var r = Math.sqrt(x * x + y * y + z * z);
        //计算物体所处的两个方位角度
        var oriTheta = Math.acos(y / r);
        var oriPhi;
        if (z > 0) {
            oriPhi = Math.acos(x / Math.sqrt(x * x + z * z));
        } else {
            oriPhi = -Math.acos(x / Math.sqrt(x * x + z * z));
        }
        result.push(oriTheta);
        result.push(oriPhi);
        return result;
    }





    /**
     * 绕指定转轴进行旋转，要求转轴必须过原点
     * @param vector 转轴对应的向量
     * @param ang  旋转的角度
     */
    function rotateByArbitraryVec(vector, ang) {
        var cos = Math.cos(ang);
        var sin = Math.sin(ang);
        var a = vector[0];
        var b = vector[1];
        var c = vector[2];
        var r = Math.sqrt(a * a + b * b + c * c);
        a = a / r;
        b = b / r;
        c = c / r;
        var rotMat = [
            [a * a + (1 - a * a) * cos, a * b * (1 - cos) + c * sin, a * c * (1 - cos) - b * sin],
            [a * b * (1 - cos) - c * sin, b * b + (1 - b * b) * cos, b * c * (1 - cos) + a * sin],
            [a * c * (1 - cos) + b * sin, b * c * (1 - cos) - a * sin, c * c + (1 - c * c) * cos]
        ];
        //对所有物体一次操作
        for (var i = 0, len = $('.word').length; i < len; i++) {
            var result = matmul(rotMat, objPos[i]);
            objPos[i][0] = result[0];
            objPos[i][1] = result[1];
            objPos[i][2] = result[2];
        }
    }
})