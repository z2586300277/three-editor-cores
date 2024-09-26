import * as THREE from 'three'
import { getFormatFragHeader, Shader_Library_Particles } from '../../Shader/ShaderApi'

/* 创建粒子 */
export function createParticleMesh(scene, DOM, CommonFrameList, parameters) {

    const geometry = createParticleGeometry(parameters)

    const material = createParticleMaterial(DOM, parameters)

    const mesh = new THREE.Points(geometry, material);

    mesh.parameters = parameters

    mesh.frameAnimationRender = () => {

        mesh.geometry.geometryRender?.()

        mesh.material.materialRender?.()

    }

    mesh.isParticleMesh = true

    scene.add(mesh)

    CommonFrameList.push(mesh)

    return mesh

}

/* 生成粒子效果 数量 内半径  外半径  */
export function createParticleGeometry(parameters) {

    if (parameters.outer - parameters.inner < 1) return new THREE.BufferGeometry()

    // 粒子位置
    const positions = new Float32Array(parameters.particlesSum * 3);

    // 粒子速度
    const velocities = new Float32Array(parameters.particlesSum * 3);

    const setVelocities = {

        '全随机': (i) => {

            velocities[i * 3] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

            velocities[i * 3 + 1] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

            velocities[i * 3 + 2] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

        },

        '随机向上': (i) => {

            velocities[i * 3] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

            velocities[i * 3 + 1] += Math.abs((Math.random() - 0.5) * parameters.maxVelocity / 100000)

            velocities[i * 3 + 2] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

        },

        '随机向下': (i) => {

            velocities[i * 3] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

            velocities[i * 3 + 1] -= Math.abs((Math.random() - 0.5) * parameters.maxVelocity / 100000)

            velocities[i * 3 + 2] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

        },

        '直线匀速向上': (i) => {

            velocities[i * 3] = 0

            velocities[i * 3 + 1] += parameters.maxVelocity / 2 / 100000

            velocities[i * 3 + 2] = 0

        },

        '直线匀速向下': (i) => {

            velocities[i * 3] = 0

            velocities[i * 3 + 1] -= parameters.maxVelocity / 2 / 100000

            velocities[i * 3 + 2] = 0

        }

    }[parameters.sportType]

    function getPosition() {

        let x, y, z

        do {

            x = Math.random() * 2 * parameters.outer - parameters.outer;

            y = Math.random() * 2 * parameters.outer - parameters.outer;

            z = Math.random() * 2 * parameters.outer - parameters.outer;

        } while (Math.abs(x) <= parameters.inner && Math.abs(y) <= parameters.inner && Math.abs(z) <= parameters.inner);

        return [x, y, z]

    }

    for (let i = 0; i < parameters.particlesSum; i++) {

        positions.set(getPosition(), i * 3)

    }

    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    geometry.geometryRender = () => {

        for (let i = 0; i < parameters.particlesSum; i++) {

            setVelocities(i)

            positions[i * 3] += velocities[i * 3];

            positions[i * 3 + 1] += velocities[i * 3 + 1];

            positions[i * 3 + 2] += velocities[i * 3 + 2];

            if (
                Math.abs(positions[i * 3]) > parameters.outer ||
                Math.abs(positions[i * 3 + 1]) > parameters.outer ||
                Math.abs(positions[i * 3 + 2]) > parameters.outer ||
                Math.abs(positions[i * 3]) < parameters.inner &&
                Math.abs(positions[i * 3 + 1]) < parameters.inner &&
                Math.abs(positions[i * 3 + 2]) < parameters.inner
            ) {

                const [x, y, z] = getPosition()

                positions[i * 3] = x

                positions[i * 3 + 1] = y

                positions[i * 3 + 2] = z

                velocities[i * 3] = 0

                velocities[i * 3 + 1] = 0

                velocities[i * 3 + 2] = 0

            }

        }

        geometry.attributes.position.needsUpdate = true;

    }

    return geometry

}

/* 生成粒子材质 */
export function createParticleMaterial(DOM, parameters) {

    const { uniforms, glslProps, ShaderAnimateRender } = Shader_Library_Particles[parameters.shaderCodeName](DOM)

    const _uniforms = {

        pointTexture: {

            value: new THREE.TextureLoader().load(parameters.mapUrl),

            type: 'texture',

            unit: 'sampler2D'

        },

        size: {

            value: 100,

            type: 'number',

            unit: 'float'

        },

        discardVal: {

            value: 0.5,

            type: 'number',

            unit: 'float'

        },

        opacity: {

            value: 1,

            type: 'opacity',

            unit: 'float'

        },

        // 衰减
        isdecaySize: {

            value: true,

            type: 'bool',

            unit: 'bool',

        },

    }

    const uniforms_all = Object.assign(uniforms, _uniforms)

    const material = new THREE.ShaderMaterial({

        uniforms: uniforms_all,

        vertexShader: `

        uniform float size;

        uniform bool isdecaySize;

        void main() {

            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

            gl_PointSize = isdecaySize ? size * ( 300.0 / -mvPosition.z ) : size;

            gl_Position = projectionMatrix * mvPosition;

        } `,

        fragmentShader: getFormatFragHeader(uniforms_all) + (glslProps.fragFunc || ``) + `

        void main() {

            vec2 vUv = gl_PointCoord.xy - .5;` +

            glslProps.fragBody +

            glslProps.pointFragIn +

            `vec3 useColor = effect_color;
            vec4 textureColor = texture2D( pointTexture, gl_PointCoord );
            if (textureColor.a < discardVal) discard;
            else useColor *= textureColor.rgb;
            gl_FragColor = vec4( mix( mixColor, useColor * vec3( intensity, intensity, intensity), mixRatio ) , opacity );
        }`,

        transparent: true,

        depthTest: true,

        blending: THREE.AdditiveBlending

    })

    material.materialRender = ShaderAnimateRender

    return material

}

