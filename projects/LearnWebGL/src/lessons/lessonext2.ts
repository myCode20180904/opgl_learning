namespace LESSONS{
    /**
     * 第六课  纹理贴图
     */
    export class lesson6{
        private m_webgl:WebGLRenderingContext;
        private shaderProgram: WebGLProgram | null
        private canvas:HTMLCanvasElement|any
        constructor(){
            _watcher.name = "第六课 纹理贴图";

            this.initWebGL();
        }
        /**
         * 1. initWebGL 
         */
        private initWebGL(){
            let canvas:HTMLCanvasElement|any = getCanvas("my-canvas-3d");
            this.canvas = canvas;
            //获取WebGL的绘图上下文
            var webgl:WebGLRenderingContext = create3DContext(canvas);
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

            if(!this.initTextures(webgl,n)){

                console.log("无法配置纹理");

                return;

            }

        


        }

        /**
         * 2.Shader
         * @param webgl:WebGLRenderingContext 
         */
        initShader(webgl:WebGLRenderingContext){
            //顶点着色器
            var vertexShaderSource: string = `

            attribute vec4 a_Position; //顶点
            attribute vec2 a_TexCoord;//纹理坐标
            varying vec2 v_TexCoord;//插值后纹理坐标
            void main() { 
                gl_Position = a_Position;//逐顶点处理
                v_TexCoord = a_TexCoord;//纹理坐标插值计算
            } 

            `;

            //片段着色器
            var fragmentShaderSource: string = `

            precision mediump float; // 精度限定-所有float类型数据的精度是lowp
            uniform sampler2D u_Sampler;//纹理图片像素数据
            varying vec2 v_TexCoord;//接收插值后的纹理坐标
            void main() {
                //采集纹素，逐片元赋值像素值
                gl_FragColor = texture2D(u_Sampler,v_TexCoord);
            }

            `;

            // 生成并编译顶点着色器和片段着色器
            // =========================================================================

            // 首先是创建和编译顶点着色器
            var vertexShader: WebGLShader | null = webgl.createShader(webgl.VERTEX_SHADER);
            webgl.shaderSource(vertexShader, vertexShaderSource);
            webgl.compileShader(vertexShader);//编译
            // 检查着色器代码是否发生编译错误
            if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
                var log: string | null = webgl.getShaderInfoLog(vertexShader);
                webgl.deleteShader(vertexShader);
                console.error("错误：编译vertex顶点着色器发生错误：" + log);
                return;
            }

            // 片段着色器
            var fragmentShader: WebGLShader | null = webgl.createShader(webgl.FRAGMENT_SHADER);
            webgl.shaderSource(fragmentShader, fragmentShaderSource);
            webgl.compileShader(fragmentShader);//编译
            // 检查着色器代码是否发生编译错误
            if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
                var log: string | null = webgl.getShaderInfoLog(fragmentShader);
                webgl.deleteShader(fragmentShader);
                console.error("错误：编译fragment片段着色器发生错误：" + log);
                return;
            }

            // 链接到着色器
            var shaderProgram: WebGLProgram | null = webgl.createProgram();
            this.shaderProgram = shaderProgram;
            webgl.attachShader(shaderProgram, vertexShader);//导入顶点着色器
            webgl.attachShader(shaderProgram, fragmentShader);//导入片断着色器
            webgl.linkProgram(shaderProgram);//链接到着色器
            // 检查链接时，是否发生错误
            if (!webgl.getProgramParameter(shaderProgram, webgl.LINK_STATUS)) {
                var log: string | null = webgl.getProgramInfoLog(shaderProgram);
                console.error("错误：链接到着色器时发生错误：" + log);
                return;
            }
            //链接完成后可以释放源
            webgl.deleteShader(vertexShader);
            webgl.deleteShader(fragmentShader);
        }

        
        /**
         * 3. 顶点 属性
         * @param webgl 
         */
        private initVertexBuffers(webgl:WebGLRenderingContext) {

            var verticesSizes = new Float32Array([

                //四个顶点的位置和纹理数据

                -0.5,0.5,0.0,1.0,

                -0.5,-0.5,0.0,0.0,

                0.5,0.5,1.0,1.0,

                0.5,-0.5,1.0,0.0

            ]);

            // 创建并绑定缓冲区
            var VBO: WebGLBuffer | null = webgl.createBuffer();//创建一个VBO顶点Buffer
            if(!VBO){
                console.error("无法创建缓冲区");
                return -1;
            }
            webgl.bindBuffer(webgl.ARRAY_BUFFER, VBO);//绑定
            webgl.bufferData(webgl.ARRAY_BUFFER, verticesSizes, webgl.STATIC_DRAW);//填充数据
            // 
            webgl.useProgram(this.shaderProgram);

    

            var n:number = 4;
            //获取地址
            var a_Position:GLint = webgl.getAttribLocation(this.shaderProgram, 'a_Position');
            //获取数组一个值所占的字节数
            var fsize = verticesSizes.BYTES_PER_ELEMENT;
            //将顶点坐标的位置赋值
            webgl.vertexAttribPointer(a_Position,2,webgl.FLOAT,false,fsize*4,0);
            webgl.enableVertexAttribArray(a_Position);

    

            //将顶点的纹理坐标分配给a_TexCoord并开启它
            var a_TexCoord = webgl.getAttribLocation(this.shaderProgram,"a_TexCoord");

            //将纹理坐标赋值
            webgl.vertexAttribPointer(a_TexCoord,2,webgl.FLOAT,false,fsize*4,fsize*2);
            webgl.enableVertexAttribArray(a_TexCoord);

            return n;

        }


        /**
         * 4. 创建纹理对象 并调用纹理绘制方法
         * @param webgl :WebGLRenderingContext
         * @param n 
         */
        private initTextures(webgl:WebGLRenderingContext,n) {
            let self = this;

            //创建纹理对象
            var texture:WebGLTexture = webgl.createTexture();
            //获取u_Sampler的存储位置
            var u_Sampler:WebGLUniformLocation = webgl.getUniformLocation(this.shaderProgram,"u_Sampler");

            //创建Image对象，并绑定加载完成事件
            var image = new Image();
            image.onload = function () {
                self.loadTexture(webgl,n,texture,u_Sampler,image);
            };
            image.src = "./assert/logo.png";

            return true;

        }


        /**
         * 5.设置纹理相关信息供WebGL使用，并进行绘制
         * @param webgl 
         * @param n 
         * @param texture 
         * @param u_Sampler 
         * @param image 
         */
        private loadTexture(webgl:WebGLRenderingContext,n,texture:WebGLTexture,u_Sampler:WebGLUniformLocation,image:HTMLImageElement) {

            //对纹理图像进行y轴反转
            webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL,1);
            //开启0号纹理单元
            webgl.activeTexture(webgl.TEXTURE0);
            //向target绑定纹理对象
            webgl.bindTexture(webgl.TEXTURE_2D,texture);

            //配置纹理参数 gl.NEAREST	gl.LINEAR
            webgl.texParameteri(webgl.TEXTURE_2D,webgl.TEXTURE_MIN_FILTER,webgl.LINEAR);

            //gl.REPEAT 、gl.MIRRORED_REPEAT 、gl.CLAMP_TO_EDGE
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);//修改x轴为镜像对称式的重复纹理
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);//修改了y轴使用纹理图像的边缘值

            //设置纹素格式，jpg格式对应gl.RGB、 gl.RGBA 、gl.ALPHA、gl.LUMINANCE、gl.LUMINANCE_ALPHA
            /**
             * 第五个参数:纹理数据格式 UNSIGNED_BYTE:表示无符号整形，每一个颜色分量占据1字节

                UNSIGNED_SHORT_5_6_5:表示RGB，每一个分量分别占据占据5,6,5比特

                UNSIGNED_SHORT_4_4_4_4:表示RGBA，每一个分量分别占据占据4,4,4,4比特

                UNSIGNED_SHORT_5_5_5_1:表示RGBA，每一个分量分别占据占据5比特，A分量占据1比特
             */
            webgl.texImage2D(webgl.TEXTURE_2D,0,webgl.RGBA,webgl.RGBA,webgl.UNSIGNED_SHORT_4_4_4_4,image);

            //将0号纹理传递给着色器
            webgl.uniform1i(u_Sampler,0);

            //绘制
            webgl.clearColor(1.0,1.0,1.0,1.0);
            webgl.clear(webgl.COLOR_BUFFER_BIT);
            webgl.drawArrays(webgl.TRIANGLE_STRIP,0,n);

        }



        updateFarme(dt:number){

        }

    }
}