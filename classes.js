const OFFSET = 30
const START_X = 0
const START_Y = 0
const START_Z = 0

const M4 = {
    identity: function () {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    },

    projection: function (width, height, depth) {
        return [
            2 / width, 0, 0, 0,
            0, 2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, -1, 1,
        ];
    },

    translation: function (tx, ty, tz) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1,
        ];
    },

    rotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        var matx = [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ]
        var maty = [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ]
        var matz = [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
        let res = M4.multiply(matx, maty)
        res = M4.multiply(res, matz)
        return res
    },

    scaling: function (sx, sy, sz) {
        return [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1,
        ];
    },

    multiply: function (a, b) {
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b31 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    },
}


class ShapeBuilder {

    mesh;
    gl;

    constructor(gl) {
        this.gl = gl
        this.mesh = []
    }

    make3DPrism(gl, offsetVec, dimensionVec) {
        let originOffsetX = offsetVec[0]
        let originOffsetY = offsetVec[1]
        let originOffsetZ = offsetVec[2]

        let width = dimensionVec[0]
        let height = dimensionVec[1]
        let depth = dimensionVec[2]

        let L = START_X + OFFSET * originOffsetX
        let R = START_X + OFFSET * (width + originOffsetX)
        let U = START_Y - OFFSET * originOffsetY
        let D = START_Y - OFFSET * (height + originOffsetY)
        let B = START_Z + OFFSET * originOffsetZ
        let F = START_Z + OFFSET * (depth + originOffsetZ)

        let vertices = [
            [L, D, F],
            [L, U, F],
            [R, U, F],
            [R, D, F],
            [L, D, B],
            [L, U, B],
            [R, U, B],
            [R, D, B]
        ];

        let quads = [
            [1, 0, 3, 2],
            [2, 3, 7, 6],
            [3, 0, 4, 7],
            [6, 5, 1, 2],
            [4, 5, 6, 7],
            [5, 4, 0, 1]
        ]

        for (let q of quads) {
            let a = q[0]
            let b = q[1]
            let c = q[2]
            let d = q[3]

            let indices = [a, b, c, a, c, d];

            for (var i = 0; i < indices.length; ++i) {
                let tesselatedVertices = vertices[indices[i]]
                for (let vertex of tesselatedVertices) {
                    this.mesh.push(vertex);
                }
            }
        }

        return this
    }

    build() {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.mesh),
            gl.STATIC_DRAW);
        return this.mesh
    }

}

