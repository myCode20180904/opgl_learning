declare class Matrix4 {
	elements:string;

	constructor(opt_src);

	setIdentity():string;
	set(src):number;
	concat(other);
	multiply(other);
	multiplyVector3(pos):string;
	multiplyVector4(pos):string;
	transpose():string;
	setInverseOf(other):string;
	invert():string;
	setOrtho(left, right, bottom, top, near, far);
	ortho(left, right, bottom, top, near, far):string;
	setFrustum(left, right, bottom, top, near, far);
	frustum(left, right, bottom, top, near, far):string;
	setPerspective(fovy, aspect, near, far);
	perspective(fovy, aspect, near, far):string;
	setScale(x, y, z):string;
	scale(x, y, z):string;
	setTranslate(x, y, z):string;
	translate(x, y, z):string;
	setRotate(angle, x, y, z);
	rotate(angle, x, y, z):string;
	setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ):string;
	lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ):string;
	dropShadow(plane, light):string;
	dropShadowDirectionally(normX, normY, normZ, planeX, planeY, planeZ, lightX, lightY, lightZ):string;
}

// declare class Mat4 {
	
// }


