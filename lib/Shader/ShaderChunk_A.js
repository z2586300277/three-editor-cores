import * as THREE from 'three'
import { getCommonUniforms, UV_VERTEX_HEAD, getFormatFragHeader } from './ShaderApi.js'

/* 彩虹光着色器 */
export function getRainbowShader(DOM) {

    const uniforms = getCommonUniforms(DOM)

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value

    const glslProps = {

        vertexHeader: UV_VERTEX_HEAD,

        fragHeader: getFormatFragHeader(uniforms) + 'varying vec2 vUv; \n',

        fragBody: `
            vec3 c;
            float l,z=iTime;
            for(int i=0;i<3;i++) {
                vec2 uv,p=gl_FragCoord.xy/iResolution/2.0;
                uv=p;
                p-=.3;
                if(hasUv) uv=vUv;
                z+=.07;
                l=length(p);
                uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
                c[i]=.01/length(mod(uv,1.)-.5);
            }
        `,

        pointFragIn: `vec3 effect_color = c;`,

        lightFragEnd: `vec4 diffuseColor = vec4( mix(diffuse, c * mixColor * vec3(intensity, intensity, intensity) , mixRatio), opacity );`

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '彩虹光' }

}

/* 水波纹着色器 */
export function getWaterLinesShader(DOM) {

    const uniforms = {

        ...getCommonUniforms(DOM),

        TAU: { type: 'number', unit: 'float', value: 6.28318530718 },

        MAX_ITER: { type: 'number', unit: 'int', value: 5 }

    }

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value

    const glslProps = {

        vertexHeader: UV_VERTEX_HEAD,

        fragHeader: getFormatFragHeader(uniforms) + 'varying vec2 vUv; \n',

        fragBody: `
            float time = iTime * .5+23.0;
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            if(hasUv) uv = vUv;
            #ifdef SHOW_TILING
                vec2 p = mod(uv*TAU*2.0, TAU)-250.0;
            #else
                vec2 p = mod(uv*TAU, TAU)-250.0;
            #endif
            vec2 i = vec2(p);
            float c = 1.0;
            float inten = .005;
            for (int n = 0; n < MAX_ITER; n++) 
            {
                float t = time * (1.0 - (3.5 / float(n+1)));
                i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
                c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
            }
            c /= float(MAX_ITER);
            c = 1.17-pow(c, 1.4);
            vec3 colour = vec3(pow(abs(c), 8.0));
            colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);
            #ifdef SHOW_TILING
            // Flash tile borders...
            vec2 pixel = 2.0 / iResolution.xy;
            uv *= 2.0;
            float f = floor(mod(iTime*.5, 2.0)); 	// Flash value.
            vec2 first = step(pixel, uv) * f;		   	// Rule out first screen pixels and flash.
            uv  = step(fract(uv), pixel);				// Add one line of pixels per tile.
            colour = mix(colour, vec3(1.0, 1.0, 0.0), (uv.x + uv.y) * first.x * first.y); // Yellow line
            #endif
        `,

        pointFragIn: `vec3 effect_color = colour;`,

        lightFragEnd: `vec4 diffuseColor = vec4( mix(diffuse, colour * mixColor * vec3(intensity, intensity, intensity) , mixRatio), opacity );`

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '水波纹' }

}

/* 光圈扫射 */
export function getCircularRayLight() {

    const uniforms = {

        innerCircleWidth: { value: 1, type: 'number', unit: 'float' },

        circleWidth: { value: 2, type: 'number', unit: 'float' },

        circleMax: { value: 2, type: 'number', unit: 'float' },

        opacityScale: { type: 'number', unit: 'float', value: 1, min: 0, max: 8 },

        reverseOpacity: { type: 'bool', unit: 'bool', value: true },

        circleSpeed: { value: 0.01, type: 'number', unit: 'float' },

        diff: { value: new THREE.Color(0.0, 0.0, 1.0), type: 'color', unit: 'vec3' },

        color3: { value: new THREE.Color(0.0, 0.0, 1.0), type: 'color', unit: 'vec3' },

        center: { value: new THREE.Vector3(0, 0, 0), type: 'position', unit: 'vec3' },

        intensity: { value: 1, type: 'number', unit: 'float' },

        isDisCard: { value: false, type: 'bool', unit: 'bool' },

    }

    const ShaderAnimateRender = () => uniforms.innerCircleWidth.value < uniforms.circleMax.value ? uniforms.innerCircleWidth.value += uniforms.circleSpeed.value : uniforms.innerCircleWidth.value = 0

    const glslProps = {

        vertexHeader: `
            varying vec2 vUv;
            varying vec3 v_position;
            void main() {
                vUv = uv;
                v_position = position;
        `,

        fragHeader: getFormatFragHeader(uniforms) + '\n' + 'varying vec3 v_position; varying vec2 vUv;\n',

        fragBody: `
            float dis = length(v_position - center);
            vec4 diffuseColor;
            if(dis < (innerCircleWidth + circleWidth) && dis > innerCircleWidth) {
                float r = (dis - innerCircleWidth) / circleWidth;
                float cOpacity = reverseOpacity ? (innerCircleWidth / circleMax) : 1. - ( innerCircleWidth / circleMax );
                #ifdef USE_MAP
                    vec3 textureColor = texture2D(map, vUv).rgb;
                    if(isDisCard && textureColor.r < 0.1 && textureColor.g < 0.1  && textureColor.b < 0.1 ) discard;
                #endif
                diffuseColor = vec4( mix(diff, color3, r) * vec3(intensity, intensity, intensity)  , opacity * cOpacity * opacityScale);
            }
            else {
                if(isDisCard)  discard ;
                else diffuseColor = vec4( diffuse, opacity );
            }
        `

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '光圈扫射' }

}

// 晶片着色
export const getCrystalShader = (DOM) => {

    const uniforms = getCommonUniforms(DOM)

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value

    const glslProps = {

        vertexHeader: `
            varying vec3 v_position;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                v_position  =  (projectionMatrix  * vec4(position, 1.0)).xyz;
        `,

        fragHeader: getFormatFragHeader(uniforms) + 'varying vec3 v_position; \n' + 'varying vec2 vUv; \n',

        fragFunc: `
            float gTime = 0.;
            const float REPEAT = 5.0;

            // 回転行列
            mat2 rot(float a) {
                float c = cos(a), s = sin(a);
                return mat2(c,s,-s,c);
            }

            float sdBox( vec3 p, vec3 b )
            {
                vec3 q = abs(p) - b;
                return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
            }

            float box(vec3 pos, float scale) {
                pos *= scale;
                float base = sdBox(pos, vec3(.4,.4,.1)) /1.5;
                pos.xy *= 5.;
                pos.y -= 3.5;
                pos.xy *= rot(.75);
                float result = -base;
                return result;
            }

            float box_set(vec3 pos, float iTime) {
                vec3 pos_origin = pos;
                pos = pos_origin;
                pos .y += sin(gTime * 0.4) * 2.5;
                pos.xy *=   rot(.8);
                float box1 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);
                pos = pos_origin;
                pos .y -=sin(gTime * 0.4) * 2.5;
                pos.xy *=   rot(.8);
                float box2 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);
                pos = pos_origin;
                pos .x +=sin(gTime * 0.4) * 2.5;
                pos.xy *=   rot(.8);
                float box3 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);	
                pos = pos_origin;
                pos .x -=sin(gTime * 0.4) * 2.5;
                pos.xy *=   rot(.8);
                float box4 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);	
                pos = pos_origin;
                pos.xy *=   rot(.8);
                float box5 = box(pos,.5) * 6.;	
                pos = pos_origin;
                float box6 = box(pos,.5) * 6.;	
                float result = max(max(max(max(max(box1,box2),box3),box4),box5),box6);
                return result;
            }
            float mapf(vec3 pos, float iTime) {
                vec3 pos_origin = pos;
                float box_set1 = box_set(pos, iTime);

                return box_set1;
            }
        `,

        fragBody: `
            vec2 p = v_position.xy/v_position.z;
            if(hasUv) p = vUv;
            vec3 ro = vec3(0., -0.2 ,iTime * 4.);
            vec3 ray = normalize(vec3(p, 1.5));
            ray.xy = ray.xy * rot(sin(iTime * .03) * 5.);
            ray.yz = ray.yz * rot(sin(iTime * .05) * .2);
            float t = 0.1;
            vec3 col = vec3(0.);
            float ac = 0.0;
            for (int i = 0; i < 99; i++){
                vec3 pos = ro + ray * t;
                pos = mod(pos-2., 4.) -2.;
                gTime = iTime -float(i) * 0.01;
                
                float d = mapf(pos, iTime);

                d = max(abs(d), 0.01);
                ac += exp(-d*23.);

                t += d* 0.55;
            }
            col = vec3(ac * 0.02);
            col +=vec3(0.,0.2 * abs(sin(iTime)),0.5 + sin(iTime) * 0.2);  
        `,

        pointFragIn: `vec3 effect_color = col;`,

        lightFragEnd: `vec4 diffuseColor = vec4( mix(diffuse, col * mixColor , mixRatio), opacity );`

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '晶片着色' }

}

/* 流光围栏 */
export function getFenceShader(DOM) {

    const uniforms = {

        iResolution: { type: 'vec2', value: new THREE.Vector2(DOM.clientWidth, DOM.clientHeight), unit: 'vec2' },

        iTime: { type: 'number', value: 1.0, unit: 'float' },

        speed: { type: 'number', value: 0.05, unit: 'float' },

        intensity: { type: 'number', unit: 'float', value: 2 },

        density: { type: 'number', unit: 'float', value: 5 },

        mixColor: { type: 'color', unit: 'vec3', value: new THREE.Color(0xffffff) },

        high: { type: 'number', unit: 'float', value: 0.5 },

        medium: { type: 'number', unit: 'float', value: 0.4 }

    }

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value

    const glslProps = {

        vertexHeader: UV_VERTEX_HEAD,

        fragHeader: getFormatFragHeader(uniforms) + 'varying vec2 vUv; \n',

        fragBody: `
            vec4 fragColor = vec4(0.);
            float sin = sin((vUv.y - iTime * speed) * 10. * density);
            if (sin > high) {
              fragColor = vec4( mixColor, (1. - sin) / (1. - high));
            } else if(sin > medium) {
               fragColor = vec4(mixColor, mix(1., 0., 1.-(sin - medium) / (high - medium)));
            } else {
               fragColor = vec4(mixColor, 0.);
            }
            fragColor = mix(fragColor, vec4(mix(mixColor, vec3(0., 0., 0.), vUv.y), 1.), 0.);
        `,

        lightFragEnd: ` vec4 diffuseColor = vec4(fragColor.rgb * vec3(intensity, intensity, intensity), fragColor.a * opacity * (1. - vUv.y));`

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '流光围栏' }

}

/* 雪片着色 */
export function getSnowShader(DOM) {

    const uniforms = getCommonUniforms(DOM)

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value

    const glslProps = {

        vertexHeader: `
            precision lowp float;
            varying vec2 vUv;
            void main() {
                vUv = uv;
        `,

        fragHeader: getFormatFragHeader(uniforms) + ' varying vec2 vUv; \n',

        fragFunc: `
            mat2 rot(float a) {
                float c = cos(a), s = sin(a);
                return mat2(c,s,-s,c);
            }

            const float pi = acos(-1.0);
            const float pi2 = pi*2.0;

            vec2 pmod(vec2 p, float r) {
                float a = atan(p.x, p.y) + pi/r;
                float n = pi2 / r;
                a = floor(a/n)*n;
                return p*rot(-a);
            }

            float box( vec3 p, vec3 b ) {
                vec3 d = abs(p) - b;
                return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
            }

            float ifsBox(vec3 p) {
                for (int i=0; i<5; i++) {
                    p = abs(p) - 1.0;
                    p.xy *= rot(iTime*0.3);
                    p.xz *= rot(iTime*0.1);
                }
                p.xz *= rot(iTime);
                return box(p, vec3(0.4,0.8,0.3));
            }

            float mapSnow(vec3 p, vec3 cPos) {
                vec3 p1 = p;
                p1.x = mod(p1.x-5., 10.) - 5.;
                p1.y = mod(p1.y-5., 10.) - 5.;
                p1.z = mod(p1.z, 16.)-8.;
                p1.xy = pmod(p1.xy, 5.0);
                return ifsBox(p1);
            }  
        `,

        fragBody: `
            vec2 p = (gl_FragCoord.xy * 2.0  - iResolution.xy) / min(iResolution.x, iResolution.y);
            if(hasUv) p = vUv;
            vec3 cPos = vec3(0.0,0.0, -3.0 * iTime);
            vec3 cDir = normalize(vec3(0.0, 0.0, -1.0));
            vec3 cUp  = vec3(sin(iTime), 1.0, 0.0);
            vec3 cSide = cross(cDir, cUp);
            vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir);
            float acc = 0.0;
            float acc2 = 0.0;
            float t = 0.0;
            for (int i = 0; i < 99; i++) {
                vec3 pos = cPos + ray * t;
                float dist = mapSnow(pos, cPos);
                dist = max(abs(dist), 0.02);
                float a = exp(-dist*3.0);
                if (mod(length(pos)+24.0*iTime, 30.0) < 3.0) {
                    a *= 2.0;
                    acc2 += a;
                }
                acc += a;
                t += dist * 0.5;
            }
            vec3 col = vec3(acc * 0.01, acc * 0.011 + acc2*0.002, acc * 0.012+ acc2*0.005);
        `,

        pointFragIn: `vec3 effect_color = col;`,

        lightFragEnd: `vec4 diffuseColor = vec4( mix(diffuse, col * mixColor * vec3(intensity, intensity, intensity) , mixRatio), opacity );`

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '雪片着色' }

}

/* 光线叠加 */
export function getSelfGlowShader(DOM) {

    const uniforms = getCommonUniforms(DOM)

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value;

    const glslProps = {

        vertexHeader: UV_VERTEX_HEAD,

        fragHeader: getFormatFragHeader(uniforms) + ' varying vec2 vUv; \n',

        fragBody: `
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            vec3 wave_color = vec3(0.0);
            float wave_width = 0.0;
            uv  = -3.0 + 2.0 * uv;
            uv.y += 0.0;
            if(hasUv) uv = vUv;
            for(float i = 0.0; i <= 28.0; i++) {
                uv.y += (0.2+(0.9*sin(iTime*0.4) * sin(uv.x + i/3.0 + 3.0 *iTime )));
                uv.x += 1.7* sin(iTime*0.4);
                wave_width = abs(1.0 / (200.0*abs(cos(iTime)) * uv.y));
                wave_color += vec3(wave_width *( 0.4+((i+1.0)/18.0)), wave_width * (i / 9.0), wave_width * ((i+1.0)/ 8.0) * 1.9);
            }
        `,

        pointFragIn: `vec3 effect_color = wave_color;`,

        lightFragEnd: `vec4 diffuseColor = vec4( mix(diffuse, wave_color * mixColor * vec3(intensity, intensity, intensity) , mixRatio), opacity );`

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '光线叠加' }

}

/* 流光围栏2 */
export function getGradientFenceShader(DOM) {

    const uniforms = {

        iResolution: { type: 'vec2', value: new THREE.Vector2(DOM.clientWidth, DOM.clientHeight), unit: 'vec2' },

        iTime: { type: 'number', value: 1.0, unit: 'float' },

        speed: { type: 'number', value: 0.05, unit: 'float' },

        intensity: { type: 'number', unit: 'float', value: 2 },

        density: { type: 'number', unit: 'float', value: 5 },

        mixColor: { type: 'color', unit: 'vec3', value: new THREE.Color(0xffffff) },

        high: { type: 'number', unit: 'float', value: 0.5 },

    }

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value

    const glslProps = {

        vertexHeader: UV_VERTEX_HEAD,

        fragHeader: getFormatFragHeader(uniforms) + 'varying vec2 vUv; \n',

        fragBody: `
            float t = gl_FragCoord.y / iResolution.y;
            vec4 fragColor = vec4(0.);
            float siny = sin((vUv.y - iTime * speed) * 10. * density);
            if (siny > high) {
              fragColor = vec4( mixColor, (siny - high));
            }  else {
               fragColor = vec4(mixColor, 0.);
            }
            fragColor = mix(fragColor, vec4(mix(mixColor, vec3(0., 0., 0.), vUv.y), 1.), 0.);
        `,

        lightFragEnd: ` vec4 diffuseColor = vec4(fragColor.rgb * vec3(intensity, intensity, intensity),  fragColor.a * opacity * (1. - vUv.y));`

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '流光围栏2' }

}

/* 绚烂线条 */
export function getBrilliantLineShader(DOM) {

    const uniforms = getCommonUniforms(DOM)

    const ShaderAnimateRender = () => uniforms.iTime.value += uniforms.speed.value

    const glslProps = {

        vertexHeader: UV_VERTEX_HEAD,

        fragHeader: getFormatFragHeader(uniforms) + 'varying vec2 vUv; \n',

        fragFunc: `
            vec3 hsv2rgb( vec3 c ){
                vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                                        6.0)-3.0)-1.0,
                                0.0,
                                1.0 );
                rgb = rgb*rgb*(3.0-2.0*rgb);
                return c.z * mix(vec3(1.0), rgb, c.y);
            }
            float rands(vec2 v){
                v = fract(v * vec2(70.26593, 1.6682));
                v += dot(v, v+23.45);
                return fract(v.x*v.y);
            }
            vec2 rand_2(vec2 v){
                float n = rands(v);
                return vec2(n, rands(v + n));
            }
            float dist_line(vec2 which, vec2 p1, vec2 p2){
                float r = clamp(dot(which - p1, p2 - p1) / dot(p2 - p1, p2 - p1), .0, 1.);
                return length((which - p1)-(p2 - p1)*r);
            }
            float drawline(vec2 which, vec2 p1, vec2 p2, float w){
                float dis = dist_line(which, p1, p2);
                return smoothstep(.015*w, .005*w, dis)*smoothstep(.8, .0, distance(p1, p2)-.25);
            }
            vec2 Getpos(vec2 v){
                vec2 p = rand_2(v);
                return vec2(.5)+.4*vec2(cos(p.x*(iTime+5.)), sin(p.y*(iTime+5.)));
            }
            vec3 layer(vec2 uv, float w){
                float m=.0;
                vec2 fl_uv = floor(uv);
                vec2 fr_uv = fract(uv);
                vec2 id = Getpos(fl_uv);
                m = smoothstep(.08*w, .01*w, distance(fr_uv, id))*abs(sin((iTime+id.x)*4.));
                vec2 p[9];
                int num = 0;
                for(float i=-1.; i<=1.; i++){
                    for(float j=-1.; j<=1.; j++){
                        p[num++] = vec2(i,j)+Getpos(fl_uv + vec2(i,j));
                    }
                }
                for(int i=0; i<9; i++){
                m += drawline(fr_uv, p[4], p[i], w);
                }
                m += drawline(fr_uv, p[1], p[3], w);
                m += drawline(fr_uv, p[1], p[5], w);
                m += drawline(fr_uv, p[3], p[7], w);
                m += drawline(fr_uv, p[5], p[7], w);
                return vec3(m);
            }
        `,

        fragBody: `
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            if(hasUv) uv *= vUv;
            float yy = uv.y;
            uv -= .5;
            uv.x *= iResolution.x / iResolution.y;
            uv *= .5;
            float t = iTime*.1;
            float rs = sin(2.*t);
            float rc = cos(2.*t);
            uv *= mat2(rc, -rs, rs, rc);
            float m = .0;
            vec3 v3 = vec3(1.);
            vec2 fl_uv = floor(uv);
            vec2 fr_uv = fract(uv);
            
            vec2 id = Getpos(fl_uv);
            vec3 col = vec3(.0);
            
            for(float i=.0; i<1.; i+=1./8.){
                float z = fract(i+t);
                float size = mix(10., .5, z);
                float al = smoothstep(.0, .8, z) * smoothstep(1., .8, z);
                v3 = 0.5 + 0.5*cos(-1.2*z+iTime+uv.xyx+vec3(0,2,4));
            col += layer(uv*size + i*27.385, 1.)*al*v3;
            col += layer(uv*size + i*27.385, .4)*pow(al, 2.);
            }
            //col *= smoothstep(1., .7, yy)*smoothstep(.0, .3, yy);
            v3 = 0.5 + 0.5*cos(iTime-1.2+uv.xyx+vec3(0,2,4));
            col += vec3(.8*yy)*.3*v3;
            col += vec3(.2*(1.-yy))*.3*v3;
        `,

        pointFragIn: `vec3 effect_color = col;`,

        lightFragEnd: `vec4 diffuseColor = vec4( mix(diffuse, col * mixColor * vec3(intensity, intensity, intensity) , mixRatio), opacity );`

    }

    return { uniforms, glslProps, ShaderAnimateRender, shaderProgramsCodeName: '绚烂线条' }

}
