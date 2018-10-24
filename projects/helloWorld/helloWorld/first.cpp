#include "pch.h"
#include "first.h"


first::first(int argc, char **argv)
{
	printf("first:%d,%s\n", argc, argv[0]);
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_RGBA | GLUT_SINGLE);
	glutInitWindowPosition(0, 0);
	glutInitWindowSize(480, 640);
	glutCreateWindow("¹þà¶");
	glutSetWindowTitle("¹þà¶");

	if (glewInit()) {
		printf("unable to init glew\n");
	}

	init();

	glutDisplayFunc(display);
	glutMainLoop();
}


first::~first()
{
}

void first::init()
{

}

void first::display(void) 
{
	glClear(GL_COLOR_BUFFER_BIT);


	glFlush();

}