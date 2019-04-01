// import Matrix4 from "../../lib/Matrix4";
namespace LESSONS{
    /**
     * 第五课  初识Shader
     */
    export class lesson5{
        private m_webgl:WebGLRenderingContext;
        private shaderProgram: WebGLProgram | null
        private canvas:HTMLCanvasElement|any
        constructor(){
            _watcher.name = "第五课 初识Shader";
            /**
             * 1.获取WebGL的绘图上下文 canvas，webgl 初始配置
             * 2.Shader 顶点着色器，片段着色器 。链接到着色器WebGLProgram
             * 3.创建并绑定顶点缓冲区WebGLBuffer（shaderProgram）
             * 4.draw 获取修改shaderProgram属性，然后绘制drawArrays
             */

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
            //顶点着色器
            var vertexShaderSource: string = `

            attribute vec4 a_Position; //顶点
            uniform mat4 u_MvpMatrix;//模型视点投影矩阵
            attribute vec4 a_Color;
            varying vec4 v_color;// 连接片元着色器
            void main() { 
                gl_Position = u_MvpMatrix * a_Position;
                v_color=a_Color;//传递给片元着色器变量
            } 

            `;

            //片段着色器
            var fragmentShaderSource: string = `

            precision mediump float; // 精度限定
            varying vec4 v_color; //从顶点着色器接收
            void main() {
                gl_FragColor = v_color;
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








            //
            /**
             * 混合缓冲区(包括顶点，颜色) 54个点
             */
            var verticeColors=new Float32Array([
                0.0,  1.0,  -2.0,  0.3,  1.0,  0.4,
                -0.5, -1.0,  -2.0,  0.3,  1.0,  0.4,
                0.5, -1.0,  -2.0,  1.0,  0.4,  0.4, 

                0.0,  1.0,  -1.0,  1.0,  1.0,  0.4,
                -0.5, -1.0,  -1.0,  1.0,  1.0,  0.4,
                0.5, -1.0,  -1.0,  1.0,  0.4,  0.4, 

                0.0,  1.0,   0.0,  0.4,  0.4,  1.0,
                -0.5, -1.0,   0.0,  0.4,  0.4,  1.0,
                0.5, -1.0,   0.0,  1.0,  0.4,  0.4, 
            ]);

            // 创建并绑定缓冲区
            var VBO: WebGLBuffer | null = webgl.createBuffer();//创建一个VBO顶点Buffer
            webgl.bindBuffer(webgl.ARRAY_BUFFER, VBO);//绑定
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(verticeColors), webgl.STATIC_DRAW);//填充数据
            // 
            webgl.useProgram(shaderProgram);






            // 每个元素的字节
            var FSIZE = verticeColors.BYTES_PER_ELEMENT;
            // 获取顶点位置
            var a_Position = webgl.getAttribLocation(shaderProgram, 'a_Position');
            // (地址,每个顶点分量的个数<1-4>,数据类型<整形，符点等>,是否归一化,指定相邻两个顶点间字节数<默认0>,指定缓冲区对象偏移字节数量<默认0>)
            webgl.vertexAttribPointer(a_Position, 3, webgl.FLOAT, false, 6*FSIZE, 0);
            // Enable the assignment to a_Position variable
            webgl.enableVertexAttribArray(a_Position);

            // 获取a_Color变量的存储地址并赋值
            /**
            *   参数：
                index
                指定要修改的顶点属性的索引值
                size
                指定每个顶点属性的组件数量。必须为1、2、3或者4。初始值为4。（如position是由3个（x,y,z）组成，而颜色是4个（r,g,b,a））
                type
                指定数组中每个组件的数据类型。可用的符号常量有GL_BYTE, GL_UNSIGNED_BYTE, GL_SHORT,GL_UNSIGNED_SHORT, GL_FIXED, 和 GL_FLOAT，初始值为GL_FLOAT。
                normalized
                指定当被访问时，固定点数据值是否应该被归一化（GL_TRUE）或者直接转换为固定点值（GL_FALSE）。
                stride
                指定连续顶点属性之间的偏移量。如果为0，那么顶点属性会被理解为：它们是紧密排列在一起的。初始值为0。
                pointer
                指定第一个组件在数组的第一个顶点属性中的偏移量。该数组与GL_ARRAY_BUFFER绑定，储存于缓冲区中。初始值为0；
             */

            var a_Color = webgl.getAttribLocation(shaderProgram, 'a_Color');
            webgl.vertexAttribPointer(a_Color, 3, webgl.FLOAT, false, 6*FSIZE, 3*FSIZE);
            webgl.enableVertexAttribArray(a_Color);


            // 设置背景颜色
            webgl.clearColor(1.0, 1.0, 1.0, 1.0);
            // 开启隐藏面消除
            webgl.enable(webgl.DEPTH_TEST);

            _listenerFrame.addListener(this,this.updateFarme);


        
        }

        modelMatrix:Matrix4 = new Matrix4(0); // 模型矩阵
        viewMatrix:Matrix4 = new Matrix4(0);  // 视点矩阵
        projMatrix:Matrix4 = new Matrix4(0);  // 投影矩阵
        mvpMatrix:Matrix4 = new Matrix4(0);   // 用于相乘用
        angle:number=0;
        private draw(){
            //var modelMatrix = mat4.create(); // 模型矩阵

            var u_MvpMatrix = this.m_webgl.getUniformLocation(this.shaderProgram, 'u_MvpMatrix');
            if(!u_MvpMatrix) { 
                console.log('Failed to get the storage location of u_MvpMatrix');
                return;
            }
            // 执行动画

            // 获取a_Color变量的存储地址并赋值
            var a_Color = this.m_webgl.getAttribLocation(this.shaderProgram, 'a_Color');
            // this.m_webgl.vertexAttribPointer(a_Color, 3, this.m_webgl.FLOAT, false, 6*FSIZE, 2*FSIZE);
            // this.m_webgl.enableVertexAttribArray(a_Color);
            
            // 设置背景颜色
            this.m_webgl.clearColor(1.0, 1.0, 1.0, 1.0);
            // 开启隐藏面消除
            this.m_webgl.enable(this.m_webgl.DEPTH_TEST);
            // 旋转位移 等于绕原点Y旋转
            this.modelMatrix.setRotate((this.angle++)%360,0,1,0);
            this.modelMatrix.translate(1, 0, 1);
            // (视点，观察目标点，上方向)
            this.viewMatrix.setLookAt(0, 0, 10, //摄像机坐标
                                    0, 0, 0, //目标坐标
                                    1, 1, 0  //UP角度
                                    );
            // 投影矩阵(fov可视空间底面和顶面夹角<大于0>,近裁截面宽高比,近裁截面位置<大于0>,远裁截面位置<大于0> )
            this.projMatrix.setPerspective(30, this.canvas.width/this.canvas.height, 1, 100);
            // 矩阵相乘
            this.mvpMatrix.set(this.projMatrix);
            this.mvpMatrix.multiply(this.viewMatrix);
            this.mvpMatrix.multiply(this.modelMatrix);

            let _mvpMatrix:any = this.mvpMatrix.elements;
            // 赋值
            this.m_webgl.uniformMatrix4fv(u_MvpMatrix, false,<Float32Array>(_mvpMatrix));


            //清屏|清深度缓冲
            this.m_webgl.clear(this.m_webgl.COLOR_BUFFER_BIT | this.m_webgl.DEPTH_BUFFER_BIT);
            // 启用多边形偏移，避免深度冲突
            this.m_webgl.enable(this.m_webgl.POLYGON_OFFSET_FILL);

            // (基本图形，第几个顶点，执行几次)，修改基本图形项可以生成点，线，三角形，矩形，扇形等
            this.m_webgl.drawArrays(this.m_webgl.TRIANGLES, 0, 9);


            //位移后，再将前面3个三角形重新绘制
            // this.modelMatrix.translate(-1, 0, 0);
            // this.mvpMatrix.set(this.projMatrix);
            // this.mvpMatrix.multiply(this.viewMatrix);
            // this.mvpMatrix.multiply(this.modelMatrix);

            // _mvpMatrix = this.mvpMatrix.elements;
            // this.m_webgl.uniformMatrix4fv(u_MvpMatrix, false, <Float32Array>(_mvpMatrix));
            //设置偏移量
            this.m_webgl.polygonOffset(1.0, 1.0);
            this.m_webgl.drawArrays(this.m_webgl.TRIANGLES, 0, 9);
        }

        updateFarme(dt:number){
            this.draw();
        }

        

    }
}