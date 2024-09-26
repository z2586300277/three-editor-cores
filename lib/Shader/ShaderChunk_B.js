import * as THREE from 'three'
import { getCommonUniforms, UV_VERTEX_HEAD, getFormatFragHeader } from './ShaderApi.js'

/* 流光闪电 */
export function getLightningShader(DOM) {

    const uniforms = getCommonUniforms(DOM)

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value

    const glslProps = {

        vertexHeader: UV_VERTEX_HEAD,

        fragHeader: getFormatFragHeader(uniforms) + 'varying vec2 vUv; \n',

        fragFunc: `
            float hash11(float p)
            {
                p = fract(p * .1031);
                p *= p + 33.33;
                p *= p + p;
                return fract(p);
            }
            float hash12(vec2 p)
            {
                vec3 p3 = fract(vec3(p.xyx) * .1031);
                p3 += dot(p3, p3.yzx + 33.33);
                return fract((p3.x + p3.y) * p3.z);
            }
            mat2 rotate2d(float theta)
            {
                float c = cos(theta);
                float s = sin(theta);
                return mat2(
                    c, -s,
                    s, c
                );
            }
            float noise(vec2 p)
            {
                vec2 ip = floor(p);
                vec2 fp = fract(p);
                float a = hash12(ip);
                float b = hash12(ip + vec2(1, 0));
                float c = hash12(ip + vec2(0, 1));
                float d = hash12(ip + vec2(1, 1));
                
                vec2 t = smoothstep(0.0, 1.0, fp);
                return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
            }
            float fbm(vec2 p)
            {
                float value = 0.0;
                float amplitude = 0.5;
                for (int i = 0; i < 8; ++i)
                {
                    value += amplitude * noise(p);
                    p *= rotate2d(0.45);
                    p *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }
        `,

        fragBody: `
            vec2 uv = gl_FragCoord.xy / iResolution.xy; 
            if (hasUv) uv *= vUv;
            uv = 2.0 * uv - 1.0;
            uv.x *= iResolution.x / iResolution.y;
            uv += 2.0 * fbm(uv+0.8*iTime) - 1.0;
            float dist = abs(uv.x);
            vec3 col = vec3(0.2, 0.3, 0.8) * pow(mix(0.0, 0.07, hash11(iTime)) / dist, 1.0);
            col = pow(col, vec3(1.0));  
        `,

        pointFragIn: `vec3 effect_color = col;`,

        lightFragEnd: ` vec4 diffuseColor = vec4( mix(diffuse, col * mixColor * vec3(intensity, intensity, intensity) , mixRatio), opacity );`

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '流光闪电' }

}

/* 火焰燃烧 */
export function getFireShader(DOM) {

    const uniforms = getCommonUniforms(DOM)

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value

    const glslProps = {

        vertexHeader: UV_VERTEX_HEAD,

        fragHeader: getFormatFragHeader(uniforms) + 'varying vec2 vUv; \n',

        fragFunc: `
            const vec3 c = vec3(1, 0, -1);
            const mat2 m = .4 * mat2(4, 3, -3, 4);
            float hash12(vec2 p)
            {
                vec3 p3  = fract(vec3(p.xyx) * .1031);
                p3 += dot(p3, p3.yzx + 33.33);
                return fract(dot(p3.xy, p3.zz));
            }
            float lfnoise(vec2 t)
            {
                vec2 i = floor(t);
                t = c.xx * smoothstep(0., 1., fract(t));
                vec2 v1 = 2. * mix(vec2(hash12(i), hash12(i + c.xy)), vec2(hash12(i + c.yx), hash12(i + c.xx)), t.y) - 1.;
                return mix(v1.x, v1.y, t.x);
            }
            float fbm(vec2 uv)
            {
                vec2 uv0 = uv;
                uv = uv * vec2(5., 2.) - vec2(-2., -.25) - 3.1 * iTime * c.yx;
                float f = 1.,
                    a = .5,
                    c = 2.5;
                
                for(int i = 0; i < 5; ++i) {
                    uv.x -= .15 * clamp(1. - pow(uv0.y, 4.), 0., 1.) * lfnoise(c * (uv + float(i) * .612 + iTime));
                    c *= 2.;
                    f += a * lfnoise(uv + float(i) * .415);
                    a /= 2.;
                    uv *= m;
                }
                return f / 2.;
            }
            `,

        fragBody: `
            vec2 uv = gl_FragCoord.xy / iResolution.xy; 
            if (hasUv) uv *= vUv;
            vec3 col = clamp(1.5 * pow(clamp(pow(fbm(uv), 1. + 4. * clamp(uv.y * uv.y, 0., 1.)) * 1.5, 0., 1.) * c.xxx, vec3(1, 3, 6)), 0., 1.);
        `,

        pointFragIn: `vec3 effect_color = col;`,

        lightFragEnd: `vec4 diffuseColor = vec4( mix(diffuse, col * mixColor * vec3(intensity, intensity, intensity) , mixRatio), opacity );`

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '火焰燃烧' }

}

/* 流光栅格 */
export function getStreamerGrid(DOM) {

    const uniforms = getCommonUniforms(DOM)

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value

    const glslProps = {

        vertexHeader: UV_VERTEX_HEAD,

        fragHeader: getFormatFragHeader(uniforms) + 'varying vec2 vUv; \n',

        fragFunc: `
            vec3 palette( float t ) {
                vec3 a = vec3(0.5, 0.5, 0.5);
                vec3 b = vec3(0.5, 0.5, 0.5);
                vec3 c = vec3(1.0, 1.0, 1.0);
                vec3 d = vec3(0.263,0.416,0.557);
            
                return a + b*cos( 6.28318*(c*t+d) );
            }
        `,

        fragBody: `
            vec2 vv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
            if (hasUv) vv = vUv;
            vec2 vv0 = vv;
            vec3 finalColor = vec3(0.0);
            for (float i = 0.0; i < 4.0; i++) {
                vv = fract(vv * 1.5) - 0.5;
                float d = length(vv) * exp(-length(vv0));
                vec3 col = palette(length(vv0) + i*.4 + iTime*.4);
                d = sin(d*8. + iTime)/8.;
                d = abs(d);
                d = pow(0.01 / d, 1.2);
                finalColor += col * d;
            }
        `,

        pointFragIn: `vec3 effect_color = finalColor;`,

        lightFragEnd: `vec4 diffuseColor = vec4( mix(diffuse, finalColor * mixColor * vec3(intensity, intensity, intensity) , mixRatio), opacity );`

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '流光栅格' }

}

/* 着色天空 */
export function getShaderSky(DOM) {

    const uniforms = {

        topColor: { value: new THREE.Color(0x0077ff), type: 'color', unit: 'vec3' },

        bottomColor: { value: new THREE.Color('aliceblue'), type: 'color', unit: 'vec3' },

        offset: { value: 400, type: 'number', unit: 'float' },

        exponent: { value: 0.6, type: 'number', unit: 'float' },

        ...getCommonUniforms(DOM)

    }

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value

    const glslProps = {

        vertexHeader: `
            varying vec3 vWorldPosition;
            void main() {
                vec4 sworldPosition = modelMatrix * vec4( position, 1.0 );
                vWorldPosition = sworldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );`
        ,

        fragHeader: getFormatFragHeader(uniforms) + 'varying vec2 vUv; \n' + 'varying vec3 vWorldPosition; \n',

        fragBody: `
            float h = normalize( vWorldPosition + offset ).y;
            vec4 diffuseColor = vec4( mix( bottomColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) ), 1.0 );
        `

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '着色天空' }

}

/* 水面着色 */
export function getShaderWaterPlane(DOM) {

    const uniforms = {

        EPSILON: { value: 1e-3, type: 'number', unit: 'float' },

        SEA_BASE: { value: new THREE.Color(0.11, 0.19, 0.22), type: 'color', unit: 'vec3' },

        SEA_WATER_COLOR: { value: new THREE.Color(0.55, 0.9, 0.7), type: 'color', unit: 'vec3' },

        NUM_STEPS: { value: 6, type: 'number', unit: 'int' },

        ITER_GEOMETRY: { value: 2, type: 'number', unit: 'int' },

        ITER_FRAGMENT: { value: 5, type: 'number', unit: 'int' },

        SEA_HEIGHT: { value: 0.5, type: 'number', unit: 'float' },

        SEA_CHOPPY: { value: 3.0, type: 'number', unit: 'float' },

        SEA_SPEED: { value: 1.9, type: 'number', unit: 'float' },

        SEA_FREQ: { value: 0.24, type: 'number', unit: 'float' },

        iResolution: { type: 'vec2', value: new THREE.Vector2(DOM.clientWidth, DOM.clientHeight), unit: 'vec2' },

        iTime: { type: 'number', value: 1.0, unit: 'float' },

        speed: { type: 'number', value: 0.01, unit: 'float' },

        intensity: { type: 'number', unit: 'float', value: 1 },

        hasUv: { type: 'bool', unit: 'bool', value: false }

    }

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value

    const glslProps = {

        vertexHeader: UV_VERTEX_HEAD,

        fragHeader: getFormatFragHeader(uniforms) + 'varying vec2 vUv; \n',

        fragFunc: `
            #define  EPSILON_NRM (1. / iResolution.x)
            #define SEA_TIME (iTime * SEA_SPEED)
            mat2 octave_m = mat2(1.7,1.2,-1.2,1.4);
            const float KEY_SP    = 32.5/256.0;
            vec3 rgb2hsv(vec3 c)
            {
                vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
                vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
                vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
                float d = q.x - min(q.w, q.y);
                float e = 1.0e-10;
                return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
            }
            vec3 hsv2rgb(vec3 c)
            {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            mat3 fromEuler(vec3 ang) {
                vec2 a1 = vec2(sin(ang.x),cos(ang.x));
                vec2 a2 = vec2(sin(ang.y),cos(ang.y));
                vec2 a3 = vec2(sin(ang.z),cos(ang.z));
                mat3 m;
                m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
                m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
                m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
                return m;
            }
            float hash( vec2 p ) {
                float h = dot(p,vec2(127.1,311.7));	
                return fract(sin(h)*83758.5453123);
            }
            
            float noise( in vec2 p ) {
                vec2 i = floor( p );
                vec2 f = fract( p );	
                vec2 u = f*f*(3.0-2.0*f);
                return -1.0+2.0*mix( 
                            mix( hash( i + vec2(0.0,0.0) ), 
                                hash( i + vec2(1.0,0.0) ), 
                                    u.x),
                            mix( hash( i + vec2(0.0,1.0) ), 
                                hash( i + vec2(1.0,1.0) ), 
                                    u.x), 
                            u.y);
            }
            float diffuseL(vec3 n,vec3 l,float p) {
                return pow(dot(n,l) * 0.4 + 0.6,p);
            }
            float specularS(vec3 n,vec3 l,vec3 e,float s) {    
                float nrm = (s + 8.0) / (3.1415 * 8.0);
                return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
            }
            
            float sea_octave(vec2 uv, float choppy) {
                uv += noise(uv);
                vec2 wv = 1.0-abs(sin(uv)); 
                vec2 swv = abs(cos(uv));  
                wv = mix(wv,swv,wv);
                return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
            }
            float mapL(vec3 p) {
                float freq = SEA_FREQ;
                float amp = SEA_HEIGHT;
                float choppy = SEA_CHOPPY;
                vec2 uv = p.xz; uv.x *= 0.75;
                
                float d, h = 0.0;    
                for(int i = 0; i < ITER_GEOMETRY; i++) {
                    d = sea_octave((uv+iTime)*freq,choppy);
                    h += d * amp; 
                    uv *=  octave_m;   
                    freq *= 1.9; 
                    amp *= 0.22;
                    choppy = mix(choppy,1.0,0.2);
                }
                return p.y - h;
            }
            float map_detailed(vec3 p) {
                float freq = SEA_FREQ;
                float amp = SEA_HEIGHT;
                float choppy = SEA_CHOPPY;
                vec2 uv = p.xz; uv.x *= 0.75;
                float d, h = 0.0;    
                for(int i = 0; i < ITER_FRAGMENT; i++) {
                    d = sea_octave((uv+iTime)*freq,choppy);
                    d += sea_octave((uv-iTime)*freq,choppy);
                    h += d * amp; 
                    uv *= octave_m/1.2;
                    freq *= 1.9;
                    amp *= 0.22;
                    choppy = mix(choppy,1.0,0.2);
                }
                return p.y - h;
            }
            vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {  
                float fresnel = 1.0 - max(dot(n,-eye),0.0);
                fresnel = pow(fresnel,3.0) * 0.45;
                vec3 refracted = SEA_BASE + diffuseL(n,l,80.0) * SEA_WATER_COLOR * 0.27; 
                vec3 color = refracted;
                float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
                color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.15 * atten;
                color += vec3(specularS(n,l,eye,90.0))*0.5;
                return color;
            }
            vec3 getNormal(vec3 p, float eps) {
                vec3 n;
                n.y = map_detailed(p);
                n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y; 
                n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
                n.y = eps; 
                return normalize(n);
            }
            float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {  
                float tm = 0.0;
                float tx = 500.0; 
                float hx = mapL(ori + dir * tx);
                if(hx > 0.0) return tx;   
                float hm = mapL(ori + dir * tm); 
                float tmid = 0.0;
                for(int i = 0; i < NUM_STEPS; i++) { 
                    tmid = mix(tm,tx, hm/(hm-hx));
                    p = ori + dir * tmid; 
                            
                    float hmid = mapL(p); 
                    if(hmid < 0.0) { 
                        tx = tmid;
                        hx = hmid;
                    } else {
                        tm = tmid;
                        hm = hmid;
                    }
                }
                return tmid;
            }
        `,

        fragBody: `
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            uv.y -= 2.0;
            if (hasUv) uv = vUv;
            float time = iTime * 0.0;
            float roll = PI + sin(iTime)/14.0 + cos(iTime/2.0)/14.0 ;
            float pitch = PI*1.021 + (sin(iTime/2.0)+ cos(iTime))/40.0 
                + (1./iResolution.y - .8)*PI/3.0  ;
            float yaw = 1./iResolution.x * PI * 4.0;
            vec3 ang = vec3(roll,pitch,yaw);
            vec3 ori = vec3(0.0,3.5,time*3.0);
            vec3 dir = normalize(vec3(uv.xy,-1.6)); 
            dir = normalize(dir) * fromEuler(ang);
            vec3 p;
            heightMapTracing(ori,dir,p);
            vec3 dist = p - ori;
            vec3 n = getNormal(p,  dot(dist,dist)  * EPSILON_NRM  );
            vec3 light = normalize(vec3(0.0,1.0,0.8)); 
            vec3 seaColor = getSeaColor(p,n,light,dir,dist);
        `,

        lightFragEnd: `vec4 diffuseColor = vec4( seaColor * vec3(intensity, intensity, intensity), opacity );`

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '水面着色' }

}

/* 热力图 */
export function getHeatMapShader(DOM, _uniforms) {

    const uniform1 = {

        iResolution: { type: 'vec2', value: new THREE.Vector2(DOM.clientWidth, DOM.clientHeight), unit: 'vec2' },

        iTime: { type: 'number', value: 1.0, unit: 'float' },

        speed: { type: 'number', value: 0.01, unit: 'float' },

        intensity: { type: 'number', unit: 'float', value: 1 },

        mixRatio: { type: 'number', unit: 'float', value: 0.5 },

        mixColor: { type: 'color', unit: 'vec3', value: new THREE.Color(0xffffff) },

        hasUv: { type: 'bool', unit: 'bool', value: false },

        HEAT_MAX: { value: 10, type: 'number', unit: 'float' },

        PointRadius: { value: 0.42, type: 'number', unit: 'float' },

        PointsCount: { value: 1, type: 'number-array', unit: 'int' },

        c1: { value: new THREE.Color(0x000000), type: 'color', unit: 'vec3' },

        c2: { value: new THREE.Color(0x000000), type: 'color', unit: 'vec3' },

        uvY: { value: 1, type: 'number', unit: 'float' },

        uvX: { value: 1, type: 'number', unit: 'float' },

    }

    const uniform2 = { Points: { value: [new THREE.Vector3(0., 0., 10.)], type: 'vec3-array', unit: 'vec3' } }

    const uniforms = { ...uniform1, ...uniform2 }

    if (_uniforms) {

        Object.keys(_uniforms).forEach((key) => uniforms[key].value = _uniforms[key].value)

    }

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value

    const glslProps = {

        vertexHeader: `varying vec2 vUv; \n void main() { \n vUv = uv;`,

        fragHeader: Object.keys(uniform1).map(i => 'uniform ' + uniforms[i].unit + ' ' + i + ';').join('\n') + 'varying vec2 vUv; \n' + 'uniform vec3 Points[' + uniform1.PointsCount.value + '];' + `
             vec3 gradient(float w, vec2 uv) {
                w = pow(clamp(w, 0., 1.) * 3.14159 * .5, .9);
                return vec3(sin(w), sin(w * 2.), cos(w))* 1.1 + mix(c1, c2, w) * 1.1; 
            }
        `,

        fragBody: `
            vec2 uv = (2. * gl_FragCoord.xy - iResolution.xy) / min(iResolution.x, iResolution.y);
            if (hasUv) uv = vUv;
            uv.xy *= vec2(uvX, uvY);
            float d = 0.;
            for (int i = 0; i < PointsCount; i++) {
                vec3 v = Points[i];
                float intensity = v.z / HEAT_MAX;
                float pd = (1. - length(uv - v.xy) / PointRadius) * intensity;
                d += pow(max(0., pd), 2.);
            }
            vec3 c = gradient(d, uv);
        `,

        lightFragEnd: `vec4 diffuseColor = vec4( mix(diffuse, c * mixColor * vec3(intensity, intensity, intensity) , mixRatio), opacity );`

    }

    function updateShaderProgram(uniforms) {

        return getHeatMapShader(DOM, uniforms)

    }

    return { uniforms, glslProps, ShaderAnimateRender, updateShaderProgram, shaderProgramsCodeName: '热力图' }

}
