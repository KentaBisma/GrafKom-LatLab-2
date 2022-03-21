"use strict";

var canvas;
var gl;

var primitiveType;
var offset = 0;
var count = 12;

var colorUniformLocation;
var translation = [200, 200]; //top-left of rectangle
var angle = 0;
var angleInRadians = 0;
var scale = [1.0, 1.0, 1.0]; //default scale
var matrix;
var matrixLocation;
var translationMatrix;
var rotationMatrix;
var scaleMatrix;
var moveOriginMatrix; //move origin to 'center' of the letter as center of rotation
var projectionMatrix;

var movement = 1;
var currentposition = 0;
var scalefactor = 0.005;
var currentscale = 0.005;
var middlewidth = 0;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var letterbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, letterbuffer);


    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    colorUniformLocation = gl.getUniformLocation(program, "u_color");

    matrixLocation = gl.getUniformLocation(program, "u_matrix");
    middlewidth = Math.floor(gl.canvas.width / 2);

    primitiveType = gl.TRIANGLES;
    render(); //default render
}

function render() {
    currentposition += movement;
    currentscale += scalefactor;

    if (currentposition > middlewidth) {
        currentposition = middlewidth;
        movement = -movement;

    };
    if (currentposition < 0) {
        currentposition = 0;
        movement = -movement;
    };

    if (currentscale > 2) {
        currentscale = 2.0;
        scalefactor = -scalefactor;
    };

    if (currentscale < 0.005) {
        currentscale = 0.005;
        scalefactor = -scalefactor;
    };

    angle += 2.0;

    gl.clear(gl.COLOR_BUFFER_BIT);

    drawletterI();
    drawletterD();

    requestAnimationFrame(render); //refresh

}


function drawletterI() {
    count = setGeometry(gl, 1).length; //number of vertices 
    translation = [middlewidth - 120, -gl.canvas.height / 2, 600];
    angleInRadians = (angle * Math.PI / 180); //rotating counter clockwise

    matrix = M4.identity();
    projectionMatrix = M4.projection(gl.canvas.width, gl.canvas.height, 2400);
    translationMatrix = M4.translation(
        translation[0] - currentposition,
        translation[1] - currentposition,
        translation[2] - currentposition);
    rotationMatrix = M4.rotation(-angleInRadians);
    scaleMatrix = M4.scaling(
        scale[0] + currentscale,
        scale[1] + currentscale,
        scale[2] + currentscale);
    moveOriginMatrix = M4.translation(0, 90, -15);

    // Multiply the matrices.
    matrix = M4.multiply(matrix, projectionMatrix)
    matrix = M4.multiply(matrix, translationMatrix);
    matrix = M4.multiply(matrix, rotationMatrix);
    matrix = M4.multiply(matrix, scaleMatrix);
    matrix = M4.multiply(matrix, moveOriginMatrix);

    //set color
    gl.uniform4f(colorUniformLocation, 1, 0, 0, 1);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    //gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays(primitiveType, offset, count / 3);
}

function drawletterD() {
    count = setGeometry(gl, 2).length; //number of vertices 
    translation = [middlewidth, -gl.canvas.height / 2, 600];
    angleInRadians = (angle * Math.PI / 180); //rotating counter clockwise

    matrix = M4.identity();
    projectionMatrix = M4.projection(gl.canvas.width, gl.canvas.height, 2400);
    translationMatrix = M4.translation(
        translation[0] + currentposition,
        translation[1] + currentposition,
        translation[2] + currentposition);
    rotationMatrix = M4.rotation(angleInRadians);
    scaleMatrix = M4.scaling(
        scale[0] + currentscale,
        scale[1] + currentscale,
        scale[2] + currentscale);
    moveOriginMatrix = M4.translation(0, 90, 15);

    // Multiply the matrices.
    matrix = M4.multiply(matrix, projectionMatrix)
    matrix = M4.multiply(matrix, translationMatrix)
    matrix = M4.multiply(matrix, rotationMatrix);
    matrix = M4.multiply(matrix, scaleMatrix);
    matrix = M4.multiply(matrix, moveOriginMatrix);


    //set color
    gl.uniform4f(colorUniformLocation, 1, 1, 1, 1);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    //gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays(primitiveType, offset, count / 3);
}

function setGeometry(gl, shape) {
    let builder = new ShapeBuilder(gl)
    switch (shape) {
        case 1:
            return builder
                .make3DPrism(gl, [0, 0, 0], [3, 1, 1])
                .make3DPrism(gl, [1, 1, 0], [1, 4, 1])
                .make3DPrism(gl, [0, 5, 0], [3, 1, 1])
                .build();
        case 2:
            return builder
                .make3DPrism(gl, [0, 0, 0], [4, 1, 1])
                .make3DPrism(gl, [0.5, 1, 0], [1, 4, 1])
                .make3DPrism(gl, [0, 5, 0], [4, 1, 1])
                .make3DPrism(gl, [4, 1, 0], [1, 4, 1])
                .make3DPrism(gl, [3.5, 0.5, 0], [1, 1, 1])
                .make3DPrism(gl, [3.5, 4.5, 0], [1, 1, 1])
                .build();
    }
}

