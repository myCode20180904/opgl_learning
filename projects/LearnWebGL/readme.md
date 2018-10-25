# [【WebGL】H5开发3D引擎：TS项目创建](https://blog.csdn.net/sjt223857130/article/details/80064400)

## 开发环境搭建
1. 获取安装Visual Studio Code
2. 安装 nodejs
3. 验证环境并获取typescript语言
```
node -v 
npm -v  
tsc -v
```

## 项目创建和hello_world
1. 创建TestWebGL文件夹并用vscode打开
2. 创建package.json `$ npm init `
3. 创建 tsconfig.json `$ tsc --init`
4. src,库目录：lib,输出目录：bin
5. 编写第一个ts文件：Main.ts
6. 初步配置tsconfig.json
```
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": false,
        "sourceMap": false,
        "outDir":"bin/js/"
    },
    "exclude": [
        "node_modules",/* 忽略npm模块. */
        "bin"/* 忽略bin目录. */
    ]
}
```
7. 初步配置 package.json
```
{
  "name": "learnwebgl",
  "version": "1.0.0",
  "description": "学习WebGL",
  "main": "index.js",
  /**"tsc:w": "tsc -w"        
  * 以监控模式运行TypeScript编译器。后台始终保持进程。
  * 一旦TypeScript文件变化即会重编译
  */
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "tsc:w":"tsc -w",
    "web": "lite-server -c configs/http-config.json"
  },
  "author": "zohar",
  "license": "ISC",
  "dependencies": {}
}

```
`$ npm run tsc:w` //自动编译
`$ npm run web` //lite-server服务器读取这个配置（* 9.）

8. 编写html文件调用生成的js文件
```
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
 
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Document</title>
    <script type="text/javascript" src="js/Main.js"></script>
</head>
 
<body>
    <img src="" id="img"/>
    <canvas id='my-canvas' width='480' height='400'>
        对不起，您的浏览器未支持H5内容.
    </canvas>
</body>
 
</html>

```

9. 安装web浏览的http服务插件：lite-server `$ npm install -g lite-server --save-dev`

10. configs/http-config.json
```
{
"port":8000,
"files":[""],
"startPath":"./bin/index.html",
"server":{"baseDir":"./"}
}

```
`$ lite-server -c configs/http-config.json`

## 升级vscode内置TS版本： typescript.tsdk

## Canvas之2D绘图篇

## [glMatrix引用](http://glmatrix.net/docs/index.html)
- JS代码转换d.ts
```
npm i dtsmake -g
npm i tern --save-dev
dtsmake -s fileame.js


```