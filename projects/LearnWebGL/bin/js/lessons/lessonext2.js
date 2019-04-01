var LESSONS;
(function (LESSONS) {
    /**
     * 第六课  纹理贴图
     */
    var lesson6 = (function () {
        function lesson6() {
            LESSONS._watcher.name = "第六课 纹理贴图";
            this.initWebGL();
        }
        /**
         * 1. initWebGL
         */
        lesson6.prototype.initWebGL = function () {
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
            //设置顶点的相关信息
            var n = this.initVertexBuffers(webgl);
            //配置纹理
            if (!this.initTextures(webgl, n)) {
                console.log("无法配置纹理");
                return;
            }
        };
        /**
         * 2.Shader
         * @param webgl:WebGLRenderingContext
         */
        lesson6.prototype.initShader = function (webgl) {
            //顶点着色器
            var vertexShaderSource = "\n            attribute vec4 a_Position; //\u9876\u70B9\n            attribute vec2 a_TexCoord;//\u7EB9\u7406\u5750\u6807\n            varying vec2 v_TexCoord;//\u63D2\u503C\u540E\u7EB9\u7406\u5750\u6807\n            void main() { \n                gl_Position = a_Position;//\u9010\u9876\u70B9\u5904\u7406\n                gl_PointSize = 10.0;\n                v_TexCoord = a_TexCoord;//\u7EB9\u7406\u5750\u6807\u63D2\u503C\u8BA1\u7B97\n            } \n\n            ";
            //片段着色器
            var fragmentShaderSource = "\n\n            precision mediump float; // \u7CBE\u5EA6\u9650\u5B9A-\u6240\u6709float\u7C7B\u578B\u6570\u636E\u7684\u7CBE\u5EA6\u662Flowp\n            uniform sampler2D u_Sampler;//\u7EB9\u7406\u56FE\u7247\u50CF\u7D20\u6570\u636E\n            varying vec2 v_TexCoord;//\u63A5\u6536\u63D2\u503C\u540E\u7684\u7EB9\u7406\u5750\u6807\n            uniform vec4 color;\n            uniform float num;\n            void main() {\n                //\u91C7\u96C6\u7EB9\u7D20\uFF0C\u9010\u7247\u5143\u8D4B\u503C\u50CF\u7D20\u503C\n                // gl_FragColor = texture2D(u_Sampler,v_TexCoord);\n\n                // vec4 sum = vec4(0.0);\n                // vec2 size = vec2(0.02,0.02);\n                // sum += texture2D(u_Sampler, v_TexCoord - 0.4 * size) * 0.05;\n                // sum += texture2D(u_Sampler, v_TexCoord - 0.3 * size) * 0.09;\n                // sum += texture2D(u_Sampler, v_TexCoord - 0.2 * size) * 0.12;\n                // sum += texture2D(u_Sampler, v_TexCoord - 0.1 * size) * 0.15;\n                // sum += texture2D(u_Sampler, v_TexCoord             ) * 0.16;\n                // sum += texture2D(u_Sampler, v_TexCoord + 0.1 * size) * 0.15;\n                // sum += texture2D(u_Sampler, v_TexCoord + 0.2 * size) * 0.12;\n                // sum += texture2D(u_Sampler, v_TexCoord + 0.3 * size) * 0.09;\n                // sum += texture2D(u_Sampler, v_TexCoord + 0.4 * size) * 0.05;\n                \n                // vec4 vectemp = vec4(0,0,0,0);\n                // vec4 substract = vec4(0,0,0,0);\n                // vectemp = (sum - substract);\n\n                // float alpha = texture2D(u_Sampler, v_TexCoord).a;\n                // if(alpha < 0.05) { gl_FragColor = vec4(0 , 0 , 0 , 0); }\n                // else { gl_FragColor = vectemp; }\n\n                vec4 src_color = texture2D(u_Sampler,v_TexCoord).rgba;\n                if(src_color.r>=0.99&&src_color.g>=0.99&&src_color.b>=0.99){\n                    src_color.a=0.0;\n                }\n                float gray = dot(src_color.rgb, vec3(0.8, 0.9, 0.85));\n                gl_FragColor = vec4(src_color.r+0.08, src_color.g+0.08, src_color.b+0.08, src_color.a+0.015);\n            }\n\n            ";
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
        lesson6.prototype.initVertexBuffers = function (webgl) {
            var verticesSizes = new Float32Array([
                //四个顶点的位置和纹理数据
                -0.5, 0.5, 0.0, 1.0,
                -0.5, -0.5, 0.0, 0.0,
                0.5, 0.5, 1.0, 1.0,
                0.5, -0.5, 1.0, 0.0
            ]);
            // 创建并绑定缓冲区
            var VBO = webgl.createBuffer(); //创建一个VBO顶点Buffer
            if (!VBO) {
                console.error("无法创建缓冲区");
                return -1;
            }
            webgl.bindBuffer(webgl.ARRAY_BUFFER, VBO); //绑定
            webgl.bufferData(webgl.ARRAY_BUFFER, verticesSizes, webgl.STATIC_DRAW); //填充数据
            // 
            webgl.useProgram(this.shaderProgram);
            var n = 4;
            //获取地址
            var a_Position = webgl.getAttribLocation(this.shaderProgram, 'a_Position');
            //获取数组一个值所占的字节数
            var fsize = verticesSizes.BYTES_PER_ELEMENT;
            //将顶点坐标的位置赋值
            webgl.vertexAttribPointer(a_Position, 2, webgl.FLOAT, false, fsize * 4, 0);
            webgl.enableVertexAttribArray(a_Position);
            //将顶点的纹理坐标分配给a_TexCoord并开启它
            var a_TexCoord = webgl.getAttribLocation(this.shaderProgram, "a_TexCoord");
            //将纹理坐标赋值
            webgl.vertexAttribPointer(a_TexCoord, 2, webgl.FLOAT, false, fsize * 4, fsize * 2);
            webgl.enableVertexAttribArray(a_TexCoord);
            return n;
        };
        /**
         * 4. 创建纹理对象 并调用纹理绘制方法
         * @param webgl :WebGLRenderingContext
         * @param n
         */
        lesson6.prototype.initTextures = function (webgl, n) {
            var self = this;
            //创建纹理对象
            var texture = webgl.createTexture();
            //获取u_Sampler的存储位置
            var u_Sampler = webgl.getUniformLocation(this.shaderProgram, "u_Sampler");
            //创建Image对象，并绑定加载完成事件
            var image = new Image();
            image.onload = function () {
                self.loadTexture(webgl, n, texture, u_Sampler, image);
            };
            image.src = "./assert/logo.png";
            return true;
        };
        /**
         * 5.设置纹理相关信息供WebGL使用，并进行绘制
         * @param webgl
         * @param n
         * @param texture
         * @param u_Sampler
         * @param image
         */
        lesson6.prototype.loadTexture = function (webgl, n, texture, u_Sampler, image) {
            //对纹理图像进行y轴反转
            webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, 1);
            //开启0号纹理单元
            webgl.activeTexture(webgl.TEXTURE0);
            //向target绑定纹理对象
            webgl.bindTexture(webgl.TEXTURE_2D, texture);
            //配置纹理参数 gl.NEAREST	gl.LINEAR
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
            //gl.REPEAT 、gl.MIRRORED_REPEAT 、gl.CLAMP_TO_EDGE
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE); //修改x轴为镜像对称式的重复纹理
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE); //修改了y轴使用纹理图像的边缘值
            //设置纹素格式，jpg格式对应gl.RGB、 gl.RGBA 、gl.ALPHA、gl.LUMINANCE、gl.LUMINANCE_ALPHA
            /**
             * 第五个参数:纹理数据格式 UNSIGNED_BYTE:表示无符号整形，每一个颜色分量占据1字节

                UNSIGNED_SHORT_5_6_5:表示RGB，每一个分量分别占据占据5,6,5比特

                UNSIGNED_SHORT_4_4_4_4:表示RGBA，每一个分量分别占据占据4,4,4,4比特

                UNSIGNED_SHORT_5_5_5_1:表示RGBA，每一个分量分别占据占据5比特，A分量占据1比特
             */
            webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_SHORT_4_4_4_4, image);
            //将0号纹理传递给着色器
            webgl.uniform1i(u_Sampler, 0);
            //绘制
            webgl.clearColor(0.5, 0.5, 0.5, 1.0);
            webgl.clear(webgl.COLOR_BUFFER_BIT);
            webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, n);
        };
        lesson6.prototype.updateFarme = function (dt) {
        };
        return lesson6;
    }());
    LESSONS.lesson6 = lesson6;
})(LESSONS || (LESSONS = {}));
