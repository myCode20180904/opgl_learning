//LESSONS命名空间
namespace LESSONS{

    /**
     * created 装饰器
     * @param val 
     */
    export function created(val: any):any{
        if (val == null)
        {
            return;
        }
        console.info("创建课程：",val);
    }

    /**
     * learn 监听装饰器
     * @param val 
     */
    function learnWatch(val: any|Function|string){
        if (val == null)
        {
            return;
        }
        /**
         * 这才是真正装饰器
         */
        return (target: any, propertyKey: string) => {
            console.info("开始听课:",target.constructor.name,":",propertyKey);
            var key = "_" + propertyKey;
            //属性设置
            Object.defineProperty(target, propertyKey, {
                get: function(){
                    return this[key]; //相当于this._propertyKey
                },
                set: function(value){
                    var oldValue = this[key];
                    this[key] = value;
                    //回调方法
                    var type = typeof val;
                    if (type == "function"){
                        val(propertyKey, oldValue, this[key]);
                    } else if (type == "string" && this[val] != null){
                        this[val](propertyKey, oldValue, this[key]);
                    } else{
                        console.log("learnWatch:类" + target.constructor.name + "不存在方法：" + val);
                    }
                },
                enumerable: true,
                configurable: true
            });
        }
    }

    /**
     * watcher
     */
    class watcher{
        @learnWatch('chang')//装饰器监听name的变化
        name:string;

        constructor(){

        }
        //数值变化时回调
        private chang(id, oldVal, newVal)
        {
            console.log("课程"+id + '由 ' + oldVal + ' 变为 ' + newVal);
        }

        //
    };
    export var _watcher = new watcher();

    /**
     * 监听回调事件
     */
    class listenerEvent{
        target:any;
        callFuns:Array<Function> = new Array();

        dt:Array<number> = new Array();
        passdt:Array<number> = new Array();
        constructor(target,callFun,dt?:number){
            this.target = target;
            this.callFuns.push(callFun);
            this.passdt.push(0);
            if(dt){
                this.dt.push(dt);
            }else{
                this.dt.push(16.66666);
            }
        }
    }

    /**
     * listenFrame 逐帧的监听
     */
    class listenerFrame{
        /**
         * 
         */
        private listeners:{[key:string]:listenerEvent} = {};
        constructor(){
            var deltaTime: number = 0.0;// 当前帧与上一帧的时间差
            var lastFrame: number = 0.0;// 上一帧的时间
            
            //帧循环
            let _listeners = this.listeners;
            var animate: any = function (time: number) {
                //计算当前帧时间
                
                var currentFrame: number = new Date().getTime();
                deltaTime = currentFrame - lastFrame;
                
                /**
                 * 处理监听函数
                 */
                for(let key in _listeners){
                    if(_listeners[key]){
                        const _tar = _listeners[key].target;
                        if(!_tar){
                            continue
                        }
                        for (let ikey in _tar) {
                            let index = _listeners[key].callFuns.indexOf(_tar[ikey]);
                            if(index>=0){
                                _listeners[key].passdt[index]+=deltaTime;
                                if(_listeners[key].passdt[index]>=_listeners[key].dt[index]){
                                    _listeners[key].passdt[index] = 0;
                                    _tar[ikey](deltaTime);
                                }
                            }
                        }
                       
                    }
                }

                lastFrame = currentFrame;

                //启用帧循环
                window.requestAnimationFrame(animate);
            
            }
            animate(0);

        }

        /**
         * addListener
         * @param target 
         * @param func 
         */
        public addListener(target:any,func:Function,dt?:number){
            if(this.listeners[target.constructor.name]){
                this.listeners[target.constructor.name].callFuns.push(func);
                this.listeners[target.constructor.name].passdt.push(0);
                if(dt){
                    this.listeners[target.constructor.name].dt.push(dt);
                }else{
                    this.listeners[target.constructor.name].dt.push(16.66666);
                }
            }else{
                this.listeners[target.constructor.name] = new listenerEvent(target,func,dt);
            }
        }
        /**
         * removeListener
         * @param target 
         * @param func 
         */
        public removeListener(target:any,func:Function){
            let arr:Array<Function> = this.listeners[target.constructor.name].callFuns;
            let index = arr.indexOf(func)
            if(index>=0){
                arr.splice(index,1);
            }

        }
        /**
         * 
         * @param target 
         */
        public removeAllListener(target:any){
            delete this.listeners[target.constructor.name];
        }
    }
    export var _listenerFrame = new listenerFrame();


    /**
     * getCanvas
     * 获取canvas
     * @returns canvas:HTMLCanvasElement|any
     */
    export var getCanvas = function(name):HTMLCanvasElement|any{
        var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(name);
        if(!canvas){
            console.log("错误：无法获取到 Canvas 元素！");
            return null;
        }
        return canvas;
    }
    
    /**
     * create3DContext
     * 获取一个兼容的webgl上下文
     * @param canvas 
     * @returns webgl:WebGLRenderingContext
     */
    export var create3DContext = function(canvas: HTMLCanvasElement): WebGLRenderingContext | any {
        var names: string[] = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        for (var i = 0; i < names.length; i++) {
            try {
                var context: WebGLRenderingContext = <WebGLRenderingContext>canvas.getContext(names[i]);
                if (context) {
                    return context;
                }
            } catch (e) { }
        }
        return null;
    }
 
    /**
     * 第一课 Canvas
     */
    export class lesson1{
 
        constructor(){
            _watcher.name = "第一课 Canvas";
            //通过元素id来获取对象
            var canvas:HTMLCanvasElement = getCanvas("my-canvas-2d");
            if(!canvas){
                console.log("错误：无法获取到 Canvas 元素！");
                return;
            }
 
            //获取一个绘图上下文，这里我们的参数是：2d。表明我们绘制二维图形
            var context:CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");
            //设置填充颜色为蓝色
            context.fillStyle='rgba(0,0,255,1.0)';
            //使用填充颜色填充矩形
            context.fillRect(120,10,150,150);
 
        }
    }

    /**
     * 第二课 webgl
     */
    export class lesson2{
        constructor(){
            _watcher.name = "第二课 webgl";
            //获取WebGL的绘图上下文
            var webgl:WebGLRenderingContext = create3DContext(getCanvas("my-canvas-3d"));
            if (webgl == null) {
                console.log("错误：无法获取到 WebGL 上下文！");
                return;
            }

            
            //清空指定<canvas>的颜色
            webgl.clearColor(0.0,0.0,0.0,1.0);
            
            //清空<canvas>
            webgl.clear(webgl.COLOR_BUFFER_BIT);
        }

    }

    /**
     * 第三课 Triangles
     */
    export class lesson3{
        private timer:number = 0;
        private webgl:WebGLRenderingContext;
        private shaderProgram: WebGLProgram | null
        constructor(){
            _watcher.name = "第三课 Triangles";
            let canvas = getCanvas("my-canvas-3d");
            //获取WebGL的绘图上下文
            var webgl:WebGLRenderingContext = create3DContext(canvas);
            if (webgl == null) {
                console.log("错误：无法获取到 WebGL 上下文！");
                return;
            }
            this.webgl = webgl;

            
            //设置WebGL渲染区域尺寸
            webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
            //顶点着色器
            var vertexShaderSource: string = `

            attribute vec4 a_Position;

            uniform mat4 u_MVPMatrix;

            void main()
            {
                gl_Position = vec4(a_Position.x*1.0, a_Position.y, a_Position.z, 1.0);
            }
            `;

            //片段着色器
            var fragmentShaderSource: string = `

            precision mediump float;
            
            uniform vec4 ourColor;
            
            void main()
            {
                gl_FragColor = ourColor;
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

            // 创建一个三角形的顶点数据
            // =========================================================================
            var vertices: number[] = [
                -0.5, -0.5, 0.0, // left
                0.5, -0.5, 0.0, // right
                0.0, 0.5, -0.5 // top
            ];

            // 创建并绑定一个VBO对象
            var VBO: WebGLBuffer | null = webgl.createBuffer();//创建一个VBO顶点Buffer
            webgl.bindBuffer(webgl.ARRAY_BUFFER, VBO);//绑定
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertices), webgl.STATIC_DRAW);//填充数据

            //给指定的着色器变量a_Position赋值
            var a_Position:GLint = webgl.getAttribLocation(shaderProgram, 'a_Position');//获取地址
            //参数：着色器中的位置，顶点大小，数据类型，是否标准化，步长，偏移量
            webgl.vertexAttribPointer(a_Position, 3, webgl.FLOAT, false, 0, 0);
            webgl.enableVertexAttribArray(a_Position);//激活
            

            let draw = function(){
                //开始渲染
                // =========================================================================
                //清空指定<canvas>的颜色
                webgl.clearColor(1.0, 1.0, 1.0, 1.0);
                //清空<canvas>
                webgl.clear(webgl.COLOR_BUFFER_BIT);

                // 画出三角形
                webgl.useProgram(shaderProgram);
                webgl.bindBuffer(webgl.ARRAY_BUFFER, VBO);

                {
                    var vertexColorLocation: WebGLUniformLocation | null = webgl.getUniformLocation(shaderProgram, "u_MVPMatrix");
                    //模型model 视图view 投影proj
                    webgl.uniformMatrix4fv(vertexColorLocation, false,[
                        0.1,0.1,0.1,0.1,
                        0.1,0.1,0.1,0.1,
                        0.1,0.1,0.1,0.1,
                        0.1,0.1,0.1,0.1
                    ]);
                }
                

                {
                    var vertexColorLocation: WebGLUniformLocation | null = webgl.getUniformLocation(shaderProgram, "ourColor");
                    webgl.uniform4f(vertexColorLocation, 0.0, 0.0, 1.0, 1.0);
                }
                

                
                webgl.drawArrays(webgl.TRIANGLES, 0, 3);
                //渲染结束
                

            } 
            draw();

            _listenerFrame.addListener(this,this.updateFarme,50);
            


        }


        updateFarme(dt:number){
            this.timer+=dt;

            this.webgl.clearColor(0.2, 0.3, 0.3, 1.0);
            //清空<canvas>
            this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);

            //不停的更新着色器颜色
            var greenValue: number = Math.sin(this.timer/500) / 2.0 + 0.5;
            var blueValue: number = Math.sin(this.timer/1000) / 2.0 + 0.5;
            //获取像素着色器中ourColor变量的位置
            var vertexColorLocation: WebGLUniformLocation | null = this.webgl.getUniformLocation(this.shaderProgram, "ourColor");
            //给ourColor赋值变化的颜色
            this.webgl.uniform4f(vertexColorLocation, 0.0, greenValue, blueValue, 1.0);
            // 画出三角形
 
            this.webgl.drawArrays(this.webgl.TRIANGLES, 0, 3);
            this.webgl.flush();
        }

    }

    /**
     * 第四课 逐帧的监听处理
     */
    export class lesson4{
        private count:number = 0;

        constructor(){
            _watcher.name = "第四课 逐帧的监听处理";

            _listenerFrame.addListener(this,this.updateFarme);
            // _listenerFrame.addListener(this,this.updateFarme2);
            // _listenerFrame.removeAllListener(this);
            // _listenerFrame.removeListener(this,this.updateFarme2);
        }

        updateFarme(dt:number){
            console.info(this.count)
            this.count++;
            if(this.count>=60){
                _listenerFrame.removeListener(this,this.updateFarme);
            }
        }

        updateFarme2(dt:number){
            console.info("updateFarme2");
        }
    }


   
}
