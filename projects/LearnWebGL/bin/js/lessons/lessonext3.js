var LESSONS;
(function (LESSONS) {
    /**
     * 第六课  纹理贴图
     */
    var lesson7 = (function () {
        function lesson7() {
            LESSONS._watcher.name = "第柒课 ";
            this.initWebGL();
        }
        /**
         * 1. initWebGL
         */
        lesson7.prototype.initWebGL = function () {
            var canvas = LESSONS.getCanvas("my-canvas-3d");
            this.canvas = canvas;
            //获取WebGL的绘图上下文
            var webgl = LESSONS.create3DContext(canvas);
            if (webgl == null) {
                console.log("错误：无法获取到 WebGL 上下文！");
                return;
            }
            this.m_webgl = webgl;
            //设置WebGL渲染区域尺寸
            webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
            //
            this.initShader(webgl);
            if (!this.shaderProgram) {
                return;
            }
            webgl.useProgram(this.shaderProgram);
            //设置顶点的相关信息
            var n = this.initVertexBuffers(webgl);
            if (n < 0) {
                return;
            }
            // Set clear color and enable hidden surface removal
            webgl.clearColor(0.0, 0.0, 0.0, 1.0);
            webgl.enable(webgl.DEPTH_TEST);
            // MVP
            // Get the storage location of u_MvpMatrix
            var u_MvpMatrix = webgl.getUniformLocation(this.shaderProgram, 'u_MvpMatrix');
            if (!u_MvpMatrix) {
                console.log('Failed to get the storage location of u_MvpMatrix');
                return;
            }
            // Set the eye point and the viewing volume
            var mvpMatrix = new Matrix4(0);
            mvpMatrix.setTranslate(1, 0, 1);
            mvpMatrix.setPerspective(30, 1, 1, 100);
            mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
            // Pass the model view projection matrix to u_MvpMatrix
            var _mvpMatrix = mvpMatrix.elements;
            webgl.uniformMatrix4fv(u_MvpMatrix, false, _mvpMatrix);
            // Clear color and depth buffer
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            // Draw the cube
            webgl.drawElements(webgl.TRIANGLES, n, webgl.UNSIGNED_BYTE, 0);
            // webgl.drawArrays(webgl.TRIANGLES, n, webgl.UNSIGNED_BYTE);
        };
        /**
         * 2.Shader
         * @param webgl:WebGLRenderingContext
         */
        lesson7.prototype.initShader = function (webgl) {
            //顶点着色器
            var vertexShaderSource = "\n            attribute vec4 a_Position;//\u9876\u70B9\n            uniform mat4 u_MvpMatrix;//\u6A21\u578B\u89C6\u70B9\u6295\u5F71\u77E9\u9635\n            attribute vec4 a_Color;\n            varying vec4 v_Color;// \u8FDE\u63A5\u7247\u5143\u7740\u8272\u5668\n            void main() { \n                gl_Position = u_MvpMatrix * a_Position;\n                v_Color = a_Color;//\u4F20\u9012\u7ED9\u7247\u5143\u7740\u8272\u5668\u53D8\u91CF\n            } \n\n            ";
            //片段着色器
            var fragmentShaderSource = "\n            precision mediump float; // \u7CBE\u5EA6\u9650\u5B9A\n            varying vec4 v_Color; //\u4ECE\u9876\u70B9\u7740\u8272\u5668\u63A5\u6536\n            void main() {\n                //\u91C7\u96C6\u7EB9\u7D20\uFF0C\u9010\u7247\u5143\u8D4B\u503C\u50CF\u7D20\u503C\n                gl_FragColor = v_Color;\n            }\n\n            ";
            // 生成并编译顶点着色器和片段着色器
            // =========================================================================
            // 首先是创建和编译顶点着色器
            var vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
            webgl.shaderSource(vertexShader, vertexShaderSource);
            webgl.compileShader(vertexShader); //编译
            // 检查着色器代码是否发生编译错误
            if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
                var log = webgl.getShaderInfoLog(vertexShader);
                webgl.deleteShader(vertexShader);
                console.error("错误：编译vertex顶点着色器发生错误：" + log);
                return;
            }
            // 片段着色器
            var fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
            webgl.shaderSource(fragmentShader, fragmentShaderSource);
            webgl.compileShader(fragmentShader); //编译
            // 检查着色器代码是否发生编译错误
            if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
                var log = webgl.getShaderInfoLog(fragmentShader);
                webgl.deleteShader(fragmentShader);
                console.error("错误：编译fragment片段着色器发生错误：" + log);
                return;
            }
            // 链接到着色器
            var shaderProgram = webgl.createProgram();
            this.shaderProgram = shaderProgram;
            webgl.attachShader(shaderProgram, vertexShader); //导入顶点着色器
            webgl.attachShader(shaderProgram, fragmentShader); //导入片断着色器
            webgl.linkProgram(shaderProgram); //链接到着色器
            // 检查链接时，是否发生错误
            if (!webgl.getProgramParameter(shaderProgram, webgl.LINK_STATUS)) {
                var log = webgl.getProgramInfoLog(shaderProgram);
                console.error("错误：链接到着色器时发生错误：" + log);
                return;
            }
            //链接完成后可以释放源
            webgl.deleteShader(vertexShader);
            webgl.deleteShader(fragmentShader);
        };
        /**
         * 3. 顶点 属性
         * @param webgl
         */
        lesson7.prototype.initVertexBuffers = function (webgl) {
            // Create a cube
            //    v6----- v5
            //   /|      /|
            //  v1------v0|
            //  | |     | |
            //  | |v7---|-|v4
            //  |/      |/
            //  v2------v3
            var verticesColors = new Float32Array([
                // Vertex coordinates and color
                1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,
                -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,
                1.0, -1.0, 1.0, 1.0, 1.0, 0.0,
                1.0, -1.0, -1.0, 0.0, 1.0, 0.0,
                1.0, 1.0, -1.0, 0.0, 1.0, 1.0,
                -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,
                -1.0, -1.0, -1.0, 0.0, 0.0, 0.0 // v7 Black
            ]);
            // Indices of the vertices
            var indices = new Uint8Array([
                0, 1, 2, 0, 2, 3,
                0, 3, 4, 0, 4, 5,
                0, 5, 6, 0, 6, 1,
                1, 6, 7, 1, 7, 2,
                7, 4, 3, 7, 3, 2,
                4, 7, 6, 4, 6, 5 // back
            ]);
            // 创建并绑定缓冲区
            var vertexColorBuffer = webgl.createBuffer(); //创建一个VBO顶点Buffer
            var indexBuffer = webgl.createBuffer(); //创建一个VBO顶点Buffer
            if (!vertexColorBuffer || !indexBuffer) {
                console.error("无法创建缓冲区");
                return -1;
            }
            webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexColorBuffer); //绑定
            webgl.bufferData(webgl.ARRAY_BUFFER, verticesColors, webgl.STATIC_DRAW); //填充数据
            var FSIZE = verticesColors.BYTES_PER_ELEMENT;
            //将顶点坐标的位置赋值
            var a_Position = webgl.getAttribLocation(this.shaderProgram, 'a_Position');
            webgl.vertexAttribPointer(a_Position, 3, webgl.FLOAT, false, FSIZE * 6, 0);
            webgl.enableVertexAttribArray(a_Position);
            var a_Color = webgl.getAttribLocation(this.shaderProgram, "a_Color");
            webgl.vertexAttribPointer(a_Color, 3, webgl.FLOAT, false, FSIZE * 6, FSIZE * 3);
            webgl.enableVertexAttribArray(a_Color);
            // Write the indices to the buffer object
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, indices, webgl.STATIC_DRAW);
            return indices.length;
        };
        lesson7.prototype.updateFarme = function (dt) {
        };
        return lesson7;
    }());
    LESSONS.lesson7 = lesson7;
})(LESSONS || (LESSONS = {}));
