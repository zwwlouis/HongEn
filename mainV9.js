$(document).ready(function () {
    var container = document.getElementById("container");
    document.body.addEventListener('touchstart', touchstart, false);
    document.body.addEventListener('touchmove', touchmove, false);
    document.body.addEventListener('touchend', touchend, false);

    //小球数量
    var objNum = $('.word').length;
    // 小球位置
    var objPos = [];
    //初始化图标位置，定义alpha与phi脚来确定小球的位置
    var angelGroups = [[Math.PI*3/4, Math.PI*5/4], [Math.PI  / 4, Math.PI / 4], [Math.PI/ 6, -Math.PI/3], [Math.PI / 2, Math.PI*3 / 4], [Math.PI, Math.PI  / 2],[Math.PI / 7, Math.PI*3 / 4], [Math.PI, Math.PI  / 3]];
    //球半径
    // var ballRadius = 80;
    var ballRadius = 200;
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
    printBalls();

    //自动旋转：
    // var rotateMoveId = setInterval(function(){
    //     var xDistance = getRandom(0, 1);
    //     var yDistance = getRandom(0, 1);
    //     moveToRot(xDistance, xDistance);
    // }, 100)


    var moveObj = {
        xStart: 0, yStart: 0, xDistance: 0, yDistance: 0
    }

    var deviceWidth = $(window).width();

    /**
     * 打印所有小球
     */
    function printBalls() {
        for (var i = 0; i < objNum; i++) {
            index = i + 1;
            x = objPos[i][0];
            y = objPos[i][1];
            z = objPos[i][2];
            $('.num' + index).css({
                'transform': 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)'
            });
        }
    }

    function touchstart(event) {
        var event = event || window.event;
        var touch = event.targetTouches[0];
        moveObj.xStart = touch.clientX;
        moveObj.yStart = touch.clientY;
        console.info("start at x",touch.clientX,"  y ",touch.clientY);
        // clearInterval(rotateMoveId);
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
        // rotateMoveId = setInterval(function(){
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
        xRotMat = [[1, 0, 0], [0, Math.cos(xAng), Math.sin(xAng)], [0, -Math.sin(xAng), Math.cos(xAng)]];

        yRotMat = [[Math.cos(yAng), 0, -Math.sin(yAng)],
                    [0, 1, 0],
                    [Math.sin(yAng), 0, Math.cos(yAng)]];
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


    //点击图标旋转
    var targetGroups = document.getElementsByClassName('word');
    for (var k = 0, len = $('.word').length; k < len; k++) {
        targetGroups[k].addEventListener('click', moveToCenter.bind(this, k), false);
    }
    function moveToCenter(index) {
        // moveToTargetAngAdvance(index, Math.PI / 2, Math.PI / 2, Math.PI / 30);
        var fastMoveId = setInterval((function(index){
                //目标移动角度
                 var theta = Math.PI/2;
                 var phi = Math.PI/2;
                //var theta = Math.PI*3/4; 
                //var phi = Math.PI*5/4;
                //每步需要旋转的度数
                var delta = Math.PI/30;
                var oriTheta, oriPhi;
                var tempArr = calPosAng(index);
                oriTheta = tempArr[0];
                oriPhi = tempArr[1];
                //计算需要旋转的方位角差值
                var theta2Rot = theta - oriTheta;
                var phi2Rot = phi - oriPhi;
                //计算需要的步数
                var step = Math.floor(Math.max(Math.abs(theta2Rot / delta), Math.abs(phi2Rot / delta)));
                if (step==0) {
                    clearInterval(fastMoveId);
                    return;
                }
                //每步需要旋转的方位角
                var dTheta = theta2Rot / step;
                var dPhi = phi2Rot / step;
                // console.log(dTheta - delta, dPhi - delta);
                var x, z;
                var k = 0;
                return function() {
                    k++;
                    // console.log(k, step);
                    x = objPos[index][0];
                    z = objPos[index][2];
                    rotateByArbitraryVec([z, 0, -x], -dTheta);
                    var tempAng = calPosAng(index);
                    var degTheta = tempAng[0]/Math.PI*180;
                    var degPhi = tempAng[1]/Math.PI*180;
                    var alterPhi = tempAng[1] - oriPhi;
                    //绕y轴旋转角度
                    var yAng = (dPhi-alterPhi)/Math.PI*180;
                    rotateByArbitraryVec([0, 1, 0], dPhi-alterPhi);
                    tempAng = calPosAng(index);
                    degTheta = tempAng[0]/Math.PI*180;
                    degPhi = tempAng[1]/Math.PI*180;
                    oriPhi = tempAng[1];
                    // console.info("方位角[", oriTheta, ",", oriPhi, "]");
                    printBalls();
                    if (Math.abs(k - step) <= 0.001 ) {
                        // console.log('here');
                        clearInterval(fastMoveId);
                    }
                }
        })(index), 30)
    }


    // /**
    //  * 根据需要第物体需要旋转的方位角，计算其需要绕x,y轴旋转角度
    //  * @param i
    //  * @param theta
    //  * @param phi
    //  */
    // function calXYRotAng(i, theta, phi) {
    //     //对坐标归一化
    //     var x = objPos[i][0];
    //     var y = objPos[i][1];
    //     var z = objPos[i][2];
    //     var r = Math.sqrt(x * x + y * y + z * z);
    //     x = x / r;
    //     y = y / r;
    //     z = z / r;
    //     var coe1 = -y * x / (1 - y * y);
    //     var coe2 = -z / Math.sqrt(x * x + z * z);
    //     var xRotAng;
    //     //当系数2过小时，不用做对x轴的旋转
    //     if (Math.abs(coe2) < 0.01) {
    //         xRotAng = 0;
    //     } else {
    //         xRotAng = theta / coe2;
    //     }
    //     if (xRotAng > 0.1) {
    //         xRotAng = 0;
    //     }
    //     var yRotAng = phi - xRotAng * coe1;
    //     if (yRotAng > 0.1) {
    //         yRotAng = 0;
    //     }
    //     return [xRotAng, yRotAng];
    // }

    // /**
    //  * 计算第i个物体方位角
    //  * @param i
    //  */
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
            oriPhi = Math.acos(x / Math.sqrt(x*x+z*z));
        } else {
            oriPhi = -Math.acos(x / Math.sqrt(x*x+z*z));
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
        var r = Math.sqrt(a*a+b*b+c*c);
        a = a/r;
        b = b/r;
        c = c/r;
        var rotMat = [[a * a + (1 - a * a) * cos, a * b * (1 - cos) + c * sin, a * c * (1 - cos) - b * sin],
                    [a * b * (1 - cos) - c * sin, b * b + (1 - b * b) * cos, b * c * (1 - cos) + a * sin],
                    [a * c * (1 - cos) + b * sin, b * c * (1 - cos) - a * sin, c * c + (1 - c * c) * cos]];
        //对所有物体一次操作
        for (var i = 0, len = objNum; i < len; i++) {
           var result = matmul(rotMat, objPos[i]);
           objPos[i][0] = result[0];
           objPos[i][1] = result[1];
           objPos[i][2] = result[2];
        }
    }


})