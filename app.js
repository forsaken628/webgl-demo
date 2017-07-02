/**
 * Created by forsa on 2017/5/20.
 */
/*globals alert, mat4, console */
var init = function () {
    "use strict";
    var gl = null;
    var v3PositionIndex = 0;
    var colorIndex = 1;

    function shaderSourceFromScript(scriptID) {
        var shaderScript = document.getElementById(scriptID);
        if (shaderScript === null) {
            return "";
        }
        var sourceCode = "";
        var child = shaderScript.firstChild;
        while (child) {
            if (child.nodeType === Node.TEXT_NODE) {
                sourceCode += child.textContent;
            }
            child = child.nextSibling;
        }
        return sourceCode;
    }

    function Data(data) {
        this.data = data;
        this.position = this.getPosition();
        this.index = this.getIndex();
    }

    Data.prototype.getPosition = function () {
        var l = this.data.length;
        var arr = [];
        var b, j, w;
        var bb = 0.8, jj = 0.5, ww = 1;
        //var max = Math.max.apply(null, this.data);
        var max = 10;

        b = bb * 2 / (ww * l + jj * (l - 1) + bb * 2);
        j = jj * 2 / (ww * l + jj * (l - 1) + bb * 2);
        w = ww * 2 / (ww * l + jj * (l - 1) + bb * 2);
        var i, offset;
        for (i = 0; i < l; i += 1) {
            //正面四点
            offset = i * 48;
            arr[offset] = b + i * (j + w) - 1;
            arr[offset + 1] = -1;
            arr[offset + 2] = 0.1;
            arr[offset + 3] = 0;
            arr[offset + 4] = 0;
            arr[offset + 5] = 0;

            arr[offset + 6] = arr[offset];
            arr[offset + 7] = this.data[i] * 2.0 / max - 1;
            arr[offset + 8] = 0.1;
            arr[offset + 9] = 0;
            arr[offset + 10] = 0;
            arr[offset + 11] = 1;

            arr[offset + 12] = arr[offset] + w;
            arr[offset + 13] = -1;
            arr[offset + 14] = 0.1;
            arr[offset + 15] = 0;
            arr[offset + 16] = 1;
            arr[offset + 17] = 0;

            arr[offset + 18] = arr[offset] + w;
            arr[offset + 19] = this.data[i] * 2.0 / max - 1;
            arr[offset + 20] = 0.1;
            arr[offset + 21] = 0;
            arr[offset + 22] = 1;
            arr[offset + 23] = 1;

            //背面四点
            arr[offset + 24] = b + i * (j + w) - 1;
            arr[offset + 25] = -1;
            arr[offset + 26] = -0.1;
            arr[offset + 27] = 1;
            arr[offset + 28] = 0;
            arr[offset + 29] = 0;

            arr[offset + 30] = arr[offset];
            arr[offset + 31] = this.data[i] * 2.0 / max - 1;
            arr[offset + 32] = -0.1;
            arr[offset + 33] = 1;
            arr[offset + 34] = 0;
            arr[offset + 35] = 1;

            arr[offset + 36] = arr[offset] + w;
            arr[offset + 37] = -1;
            arr[offset + 38] = -0.1;
            arr[offset + 39] = 1;
            arr[offset + 40] = 1;
            arr[offset + 41] = 0;

            arr[offset + 42] = arr[offset] + w;
            arr[offset + 43] = this.data[i] * 2.0 / max - 1;
            arr[offset + 44] = -0.1;
            arr[offset + 45] = 0.8;
            arr[offset + 46] = 0.8;
            arr[offset + 47] = 0.8;
        }
        return new Float32Array(arr);
    };

    Data.prototype.getIndex = function () {
        var l = this.data.length;
        var arr = [];
        var i, offset0, offset1;
        for (i = 0; i < l; i += 1) {
            offset0 = i * 36;
            offset1 = i * 8;
            //正面
            arr[offset0] = offset1 + 1;
            arr[offset0 + 1] = offset1;
            arr[offset0 + 2] = offset1 + 2;

            arr[offset0 + 3] = offset1 + 1;
            arr[offset0 + 4] = offset1 + 2;
            arr[offset0 + 5] = offset1 + 3;
            //右面
            arr[offset0 + 6] = offset1 + 3;
            arr[offset0 + 7] = offset1 + 2;
            arr[offset0 + 8] = offset1 + 6;

            arr[offset0 + 9] = offset1 + 7;
            arr[offset0 + 10] = offset1 + 3;
            arr[offset0 + 11] = offset1 + 6;
            //后面
            arr[offset0 + 12] = offset1 + 5;
            arr[offset0 + 13] = offset1 + 6;
            arr[offset0 + 14] = offset1 + 4;

            arr[offset0 + 15] = offset1 + 5;
            arr[offset0 + 16] = offset1 + 7;
            arr[offset0 + 17] = offset1 + 6;
            //左面
            arr[offset0 + 18] = offset1 + 1;
            arr[offset0 + 19] = offset1 + 4;
            arr[offset0 + 20] = offset1;

            arr[offset0 + 21] = offset1 + 1;
            arr[offset0 + 22] = offset1 + 5;
            arr[offset0 + 23] = offset1 + 4;
            //顶面
            arr[offset0 + 24] = offset1 + 1;
            arr[offset0 + 25] = offset1 + 3;
            arr[offset0 + 26] = offset1 + 7;

            arr[offset0 + 27] = offset1 + 7;
            arr[offset0 + 28] = offset1 + 5;
            arr[offset0 + 29] = offset1 + 1;
            //底面
            arr[offset0 + 30] = offset1;
            arr[offset0 + 31] = offset1 + 6;
            arr[offset0 + 32] = offset1 + 2;

            arr[offset0 + 33] = offset1 + 6;
            arr[offset0 + 34] = offset1;
            arr[offset0 + 35] = offset1 + 4;
        }
        return new Uint8Array(arr);
    };

    Data.prototype.draw = function () {
        if (gl === null) {
            return;
        }
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var triangleBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.position, gl.STATIC_DRAW);
        //console.log(this.position);

        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.index, gl.STATIC_DRAW);

        gl.vertexAttribPointer(v3PositionIndex, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(colorIndex, 3, gl.FLOAT, false, 24, 12);

        gl.enableVertexAttribArray(v3PositionIndex);
        gl.enableVertexAttribArray(colorIndex);

        //webgl.drawArrays(webgl.TRIANGLES, 0, 3);
        gl.drawElements(gl.TRIANGLES, this.index.length, gl.UNSIGNED_BYTE, 0);
        gl.flush();
    };

    return function () {
        var myCanvasObject = document.getElementById("myCanvas");
        gl = myCanvasObject.getContext("webgl");
        gl.viewport(0, 0, myCanvasObject.clientWidth, myCanvasObject.clientHeight);
        var vertex = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertex, shaderSourceFromScript("shader-vs"));
        gl.compileShader(vertex);
        if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
            alert("error:vertexShaderObject");
            return;
        }
        var fragment = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragment, shaderSourceFromScript("shader-fs"));
        gl.compileShader(fragment);
        if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
            alert("error:fragmentShaderObject");
            return;
        }
        var program = gl.createProgram();
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            alert("error:programObject");
            return;
        }
        gl.useProgram(program);

        var modelViewMatrix = mat4.create();
        mat4.lookAt(modelViewMatrix, [1, 2, -5], [0, 0, 0], [0, 1, 0]);
        var ModelViewMx = gl.getUniformLocation(program, "ModelViewMx");
        gl.uniformMatrix4fv(ModelViewMx, false, modelViewMatrix);

        var projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, Math.PI / 6, myCanvasObject.width / myCanvasObject.height, 0.1, 100);
        var ProjectionMx = gl.getUniformLocation(program, "ProjectionMx");
        gl.uniformMatrix4fv(ProjectionMx, false, projectionMatrix);
        gl.bindAttribLocation(program, v3PositionIndex, "v3Position");
        gl.bindAttribLocation(program, colorIndex, "color");
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        var d = new Data([0, 0, 0, 0, 0]);
        d.draw();
        var nowArr = d.data;
        var newArr = [];
        var i;
        for (i = 0; i < nowArr.length; i += 1) {
            newArr[i] = Math.random() * 10;
        }
        setInterval(function () {
            var v = 0.1;
            var i;
            for (i = 0; i < nowArr.length; i += 1) {
                if (Math.abs(newArr[i] - nowArr[i]) < v) {
                    newArr[i] = Math.random() * 5;
                }
                nowArr[i] += (newArr[i] > nowArr[i] ? v : -v);
            }
            var d = new Data(nowArr);
            d.draw();
        }, 60);
    };
}();
