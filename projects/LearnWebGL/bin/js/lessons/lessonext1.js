// import Matrix4 from "../../lib/Matrix4";
var LESSONS;
(function (LESSONS) {
    /**
     * 第五课
     */
    var lesson5 = (function () {
        function lesson5() {
            LESSONS._watcher.name = "第五课";
            console.info("lesson5");
            var canvas = LESSONS.getCanvas("my-canvas-3d");
            //获取WebGL的绘图上下文
            var webgl = LESSONS.create3DContext(canvas);
            if (webgl == null) {
                console.log("错误：无法获取到 WebGL 上下文！");
                return;
            }
            this.m_webgl = webgl;
            //设置WebGL渲染区域尺寸
            webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
            //顶点着色器
            var vertexShaderSource = "\n\n            attribute vec4 a_Position; //\u9876\u70B9\n            uniform mat4 u_MvpMatrix;//\u6A21\u578B\u89C6\u70B9\u6295\u5F71\u77E9\u9635\n            attribute vec4 a_Color;\n            varying vec4 v_color;// \u8FDE\u63A5\u7247\u5143\u7740\u8272\u5668\n            void main() { \n                gl_Position = u_MvpMatrix * a_Position;\n                v_color=a_Color;//\u4F20\u9012\u7ED9\u7247\u5143\u7740\u8272\u5668\u53D8\u91CF\n            } \n\n            ";
            //片段着色器
            var fragmentShaderSource = "\n\n            precision mediump float; // \u7CBE\u5EA6\u9650\u5B9A\n            varying vec4 v_color; //\u4ECE\u9876\u70B9\u7740\u8272\u5668\u63A5\u6536\n            void main() {\n                gl_FragColor = v_color;\n            }\n\n            ";
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
            //
            /**
             * 混合缓冲区(包括顶点，颜色)
             */
            var verticeColors = new Float32Array([
                0.0, 1.0, -2.0, 0.3, 1.0, 0.4,
                -0.5, -1.0, -2.0, 0.3, 1.0, 0.4,
                0.5, -1.0, -2.0, 1.0, 0.4, 0.4,
                0.0, 1.0, -1.0, 1.0, 1.0, 0.4,
                -0.5, -1.0, -1.0, 1.0, 1.0, 0.4,
                0.5, -1.0, -1.0, 1.0, 0.4, 0.4,
                0.0, 1.0, 0.0, 0.4, 0.4, 1.0,
                -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
                0.5, -1.0, 0.0, 1.0, 0.4, 0.4,
            ]);
            // 创建并绑定缓冲区
            var VBO = webgl.createBuffer(); //创建一个VBO顶点Buffer
            webgl.bindBuffer(webgl.ARRAY_BUFFER, VBO); //绑定
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(verticeColors), webgl.STATIC_DRAW); //填充数据
            // 每个元素的字节
            var FSIZE = verticeColors.BYTES_PER_ELEMENT;
            // 获取顶点位置
            var a_Position = webgl.getAttribLocation(shaderProgram, 'a_Position');
            // (地址,每个顶点分量的个数<1-4>,数据类型<整形，符点等>,是否归一化,指定相邻两个顶点间字节数<默认0>,指定缓冲区对象偏移字节数量<默认0>)
            webgl.vertexAttribPointer(a_Position, 3, webgl.FLOAT, false, 6 * FSIZE, 0);
            // Enable the assignment to a_Position variable
            webgl.enableVertexAttribArray(a_Position);
            // 获取a_Color变量的存储地址并赋值
            var a_Color = webgl.getAttribLocation(shaderProgram, 'a_Color');
            webgl.vertexAttribPointer(a_Color, 3, webgl.FLOAT, false, 6 * FSIZE, 2 * FSIZE);
            webgl.enableVertexAttribArray(a_Color);
            var u_MvpMatrix = webgl.getUniformLocation(shaderProgram, 'u_MvpMatrix');
            if (!u_MvpMatrix) {
                console.log('Failed to get the storage location of u_MvpMatrix');
                return;
            }
            this.draw();
            // 设置背景颜色
            webgl.clearColor(0.0, 0.0, 0.0, 1.0);
            // 开启隐藏面消除
            webgl.enable(webgl.DEPTH_TEST);
            // 画出三角形
            webgl.useProgram(shaderProgram);
            webgl.bindBuffer(webgl.ARRAY_BUFFER, VBO);
            var modelMatrix = new Matrix4(0); // 模型矩阵
            var viewMatrix = new Matrix4(0); // 视点矩阵
            var projMatrix = new Matrix4(0); // 投影矩阵
            var mvpMatrix = new Matrix4(0); // 用于相乘用
            var angle = 0;
            // 执行动画
            (function animate() {
                // 设置背景颜色
                webgl.clearColor(0.0, 0.0, 0.0, 1.0);
                // 开启隐藏面消除
                webgl.enable(webgl.DEPTH_TEST);
                // 画出三角形
                webgl.useProgram(shaderProgram);
                webgl.bindBuffer(webgl.ARRAY_BUFFER, VBO);
                // 旋转位移 等于绕原点Y旋转
                modelMatrix.setRotate((angle++) % 360, 0, 1, 0);
                modelMatrix.translate(1, 0, 1);
                // (视点，观察目标点，上方向)
                viewMatrix.setLookAt(-0.25, -0.25, 5, 0, 0, -100, 0, 1, 0);
                // 投影矩阵(fov可视空间底面和顶面夹角<大于0>,近裁截面宽高比,近裁截面位置<大于0>,远裁截面位置<大于0> )
                projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
                // 矩阵相乘
                mvpMatrix.set(projMatrix);
                mvpMatrix.multiply(viewMatrix);
                mvpMatrix.multiply(modelMatrix);
                var _mvpMatrix = mvpMatrix.elements;
                // 赋值
                webgl.uniformMatrix4fv(u_MvpMatrix, false, (_mvpMatrix));
                //清屏|清深度缓冲
                webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
                // 启用多边形偏移，避免深度冲突
                webgl.enable(webgl.POLYGON_OFFSET_FILL);
                // (基本图形，第几个顶点，执行几次)，修改基本图形项可以生成点，线，三角形，矩形，扇形等
                webgl.drawArrays(webgl.TRIANGLES, 0, 9);
                //位移后，再将前面3个三角形重新绘制
                modelMatrix.translate(-1, 0, 0);
                mvpMatrix.set(projMatrix);
                mvpMatrix.multiply(viewMatrix);
                mvpMatrix.multiply(modelMatrix);
                _mvpMatrix = mvpMatrix.elements;
                webgl.uniformMatrix4fv(u_MvpMatrix, false, (_mvpMatrix));
                //设置偏移量
                webgl.polygonOffset(1.0, 1.0);
                webgl.drawArrays(webgl.TRIANGLES, 0, 9);
                requestAnimationFrame(animate);
            }());
        }
        lesson5.prototype.draw = function () {
            var modelMatrix = mat4.create(); // 模型矩阵
        };
        lesson5.prototype.updateFarme = function (dt) {
        };
        return lesson5;
    }());
    LESSONS.lesson5 = lesson5;
})(LESSONS || (LESSONS = {}));
