#pragma once
//开始
//glut
//添加include  C:\Program Files(x86)\Windows Kits\10\Include\10.0.17134.0\um\gl
//添加LIB  C:\Program Files (x86)\Windows Kits\10\Lib\10.0.17134.0\um
//添加dll  C:\Windows\SysWOW64

//glew
//属性- 链接器 - 附加库目录 glew32.lib 、glew32s.lib
//属性- 链接器 - 附加依赖项 glew32.lib
//添加dll  C:\Windows\SysWOW64 
#include <GL/glew.h>
#include <GL/GL.h>
#include <GL/GLU.h>
#include <GL/glut.h>