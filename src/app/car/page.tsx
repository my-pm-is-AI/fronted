'use client';
import { useEffect, useRef } from 'react';
import type * as THREE from 'three';

export default function CarPage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let frameId: number;
    let cleanupFn: (() => void) | undefined;

    // 动态 import three + 后处理，避免 SSR
    async function init(mount: HTMLDivElement) {
      const THREE = await import('three');
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js');
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js');
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');
      const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js');
      const { Reflector } = await import('three/examples/jsm/objects/Reflector.js');

      // ── Color palette ──────────────────────────────────────
      const CP = {
        black: 0x010101, white: 0xeeeeee,
        c1: 0xf72585, c2: 0xb5179e, c3: 0x7209b7, c4: 0x560bad,
        c5: 0x480ca8, c6: 0x3a0ca3, c7: 0x3f37c9, c8: 0x4361ee,
        c9: 0x4895ef, c10: 0x4cc9f0,
      };
      const GL = {
        black: 'vec4(0.04,0.04,0.04,1.0)', white: 'vec4(0.933,0.933,0.933,1.0)',
        c1: 'vec4(0.969,0.145,0.522,1.0)', c2: 'vec4(0.71,0.09,0.62,1.0)',
        c3: 'vec4(0.447,0.035,0.718,1.0)', c4: 'vec4(0.337,0.043,0.678,1.0)',
        c5: 'vec4(0.282,0.047,0.659,1.0)', c6: 'vec4(0.227,0.047,0.639,1.0)',
        c7: 'vec4(0.247,0.216,0.788,1.0)', c8: 'vec4(0.263,0.38,0.933,1.0)',
        c9: 'vec4(0.282,0.584,0.937,1.0)', c10: 'vec4(0.298,0.788,0.941,1.0)',
      };

      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const SHADOWS = !isMobile, BLOOM = !isMobile, NOISE = !isMobile;

      // ── Helper: patch shader with uTime + vUv ─────────────
      function patchShaderBase(shader: THREE.WebGLProgramParametersWithUniforms) {
        shader.uniforms.uTime = { value: 0 };
        shader.vertexShader = shader.vertexShader
          .replace('#include <uv_pars_vertex>', 'varying vec2 vUv;\nuniform float uTime;')
          .replace('#include <uv_vertex>', 'vUv = uv;');
        shader.fragmentShader = shader.fragmentShader
          .replace('varying vec3 vViewPosition;', 'varying vec3 vViewPosition;\nvarying vec2 vUv;\nuniform float uTime;');
      }

      // ── Custom materials ───────────────────────────────────
      function makeRoadMat() {
        const mat = new THREE.MeshStandardMaterial({ transparent: true });
        mat.onBeforeCompile = (shader) => {
          patchShaderBase(shader);
          shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
            diffuseColor=${GL.black};
            float width=0.06;
            bool isInCenter=abs(0.5-vUv.x)<(0.01+width/2.0);
            bool isInRoad=abs(0.5-vUv.x)<(width/2.0);
            if(isInCenter){diffuseColor=${GL.c9};}
            if(isInRoad){diffuseColor=${GL.black};diffuseColor.a=0.8;
              bool L=(abs(0.5-vUv.x+width/6.0)<0.0003);
              bool D=(abs(0.5-vUv.x-width/6.0)<0.0003)&&(sin(100.0*vUv.y-10.0*uTime)>0.3);
              if(L||D){diffuseColor=${GL.c10};}}
          `);
          mat.userData.shader = shader;
        };
        return mat;
      }

      function makeSunMat() {
        const mat = new THREE.MeshStandardMaterial({ transparent: true });
        mat.onBeforeCompile = (shader) => {
          patchShaderBase(shader);
          shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
            diffuseColor=vec4(0.0);
            bool isInSun=distance(vUv.xy,vec2(0.5,0.5))<0.5;
            if(isInSun){diffuseColor=${GL.c1};float delta=0.2*(1.0-vUv.y);
              diffuseColor+=vec4(delta,delta,0.0,0.0);
              if(sin(100.0*vUv.y)*vUv.y>0.3){diffuseColor=${GL.c3};}}
          `);
          mat.userData.shader = shader;
        };
        return mat;
      }

      function makeBuildingMat(glsl: string) {
        const mat = new THREE.MeshStandardMaterial();
        mat.onBeforeCompile = (shader) => {
          patchShaderBase(shader);
          shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', glsl);
          mat.userData.shader = shader;
        };
        return mat;
      }

      const matBldA = makeBuildingMat(`
        diffuseColor=${GL.black};
        bool w=vUv.y>0.09&&(sin(31.415*(vUv.x-0.05))>0.5)&&(sin(100.0*vUv.y)>0.5);
        if(w){diffuseColor=${GL.c7};if(vUv.x>0.4&&vUv.x<0.6){diffuseColor=${GL.c10};}}`);
      const matBldB = makeBuildingMat(`
        diffuseColor=${GL.black};
        bool w=vUv.y>0.1&&vUv.y<0.5&&(sin(50.0*3.1415*(vUv.x-0.05))>-0.8)&&(sin(50.0*vUv.y)>0.5);
        if(w){diffuseColor=${GL.c1};if(vUv.y<0.3){diffuseColor=${GL.c4};}}`);
      const matBldC = makeBuildingMat(`
        diffuseColor=${GL.black};
        bool w=vUv.y>0.5&&vUv.y<0.8&&(sin(5.0*3.1415*(vUv.x-0.05))>-0.8)&&(sin(50.0*vUv.y)>0.5);
        if(w){diffuseColor=${GL.c9};}`);
      const matBldD = makeBuildingMat(`
        diffuseColor=${GL.black};
        bool w=vUv.y>0.1&&(sin(50.0*vUv.y)>-0.8);
        if(w){diffuseColor=${GL.c5};}`);

      const matCar = new THREE.MeshStandardMaterial({ color: CP.black });
      const matLight = new THREE.MeshStandardMaterial({ color: CP.c1, emissive: new THREE.Color(CP.c1), emissiveIntensity: 1 });
      const matWheel = new THREE.MeshStandardMaterial({ color: CP.black });
      const matMountain = new THREE.MeshBasicMaterial({ color: CP.black });
      const matRoad = makeRoadMat();
      const matSun = makeSunMat();

      // ── Scene ──────────────────────────────────────────────
      const scene = new THREE.Scene();

      // Road
      const roadGrp = new THREE.Group();
      const roadMesh = new THREE.Mesh(new THREE.PlaneGeometry(), matRoad);
      roadMesh.scale.set(200, 200, 1);
      roadMesh.rotation.set(-Math.PI / 2, 0, 0);
      if (SHADOWS) roadMesh.receiveShadow = true;
      roadGrp.add(roadMesh);
      const reflector = new Reflector(new THREE.PlaneGeometry(10, 10), {
        color: new THREE.Color(0x7f7f7f),
        textureWidth: mount.clientWidth * window.devicePixelRatio,
        textureHeight: mount.clientHeight * window.devicePixelRatio,
      });
      reflector.position.set(0, -0.1, 0);
      reflector.scale.set(200, 200, 1);
      reflector.rotation.set(-Math.PI / 2, 0, 0);
      roadGrp.add(reflector);
      roadGrp.position.set(0, 0, 100);
      scene.add(roadGrp);

      // Sun
      const sunGrp = new THREE.Group();
      const sunMesh = new THREE.Mesh(new THREE.PlaneGeometry(), matSun);
      sunMesh.scale.set(50, 50, 1);
      sunGrp.add(sunMesh);
      sunGrp.position.set(0, 10, 200);
      sunGrp.rotation.set(-Math.PI, 0, 0);
      scene.add(sunGrp);

      // Mountain
      const mtGrp = new THREE.Group();
      const mtShape = new THREE.Shape();
      mtShape.moveTo(0,0);mtShape.lineTo(100,0);mtShape.lineTo(100,50);mtShape.lineTo(50,10);
      mtShape.lineTo(20,15);mtShape.lineTo(15,5);mtShape.lineTo(10,10);mtShape.lineTo(0,0);
      mtShape.lineTo(-5,3);mtShape.lineTo(-10,10);mtShape.lineTo(-12,8);mtShape.lineTo(-100,50);
      mtShape.lineTo(-100,0);mtShape.lineTo(0,0);
      mtGrp.add(new THREE.Mesh(new THREE.ExtrudeGeometry(mtShape), matMountain));
      mtGrp.position.set(0, 0, 200);
      scene.add(mtGrp);

      // Car
      const carGrp = new THREE.Group();
      const carShape = new THREE.Shape();
      carShape.moveTo(0,0);carShape.lineTo(4,0);carShape.lineTo(3.8,0.3);
      carShape.lineTo(-0.1,0.7);carShape.lineTo(0,0);
      const carBody = new THREE.Mesh(new THREE.ExtrudeGeometry(carShape,{depth:1.5,bevelThickness:0.2}),matCar);
      carBody.position.set(0,0.3,0); carGrp.add(carBody);
      const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.6,1.2,0.5,4),matCar);
      roof.position.set(1.5,1,0.8); roof.rotation.set(0,Math.PI/4,0); carGrp.add(roof);
      [[0,0],[0,0.3],[0,1.2],[0,1.5]].forEach(([,z]) => {
        const l = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.1,12),matLight);
        l.position.set(-0.2,0.9,z); l.rotation.set(0,0,Math.PI/2); carGrp.add(l);
      });
      [3,0.7].forEach(x => {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,12),matWheel);
        w.scale.set(0.33,2,0.33); w.position.set(x,0.33,0.75); w.rotation.set(Math.PI/2,0,0); carGrp.add(w);
      });
      carGrp.position.set(0.7, 0, 10);
      carGrp.rotation.set(0, -Math.PI / 2, 0);
      scene.add(carGrp);

      // Stars
      const starsGrp = new THREE.Group();
      for (let x=-300;x<300;x+=30) for (let y=0;y<300;y+=30) {
        const s = new THREE.Mesh(new THREE.SphereGeometry(),matLight);
        const r = Math.random();
        s.scale.setScalar(r); s.position.set(x+25*Math.random(),y+25*Math.random(),0); starsGrp.add(s);
      }
      starsGrp.position.set(0,0,250);
      scene.add(starsGrp);

      // Buildings
      const cityGrp = new THREE.Group();
      function randBuilding() {
        const r = Math.random();
        if (r<0.2) {
          const g = new THREE.Group();
          const b = new THREE.Mesh(new THREE.BoxGeometry(),matBldA); b.scale.set(10,15,10); b.position.set(0,-3,0);
          if(SHADOWS)b.castShadow=true; g.add(b);
          const roof2 = new THREE.Mesh(new THREE.ConeGeometry(5,15,7),matBldA); roof2.position.set(0,5,0); g.add(roof2);
          return g;
        }
        if (r<0.3) {
          const g = new THREE.Group();
          const b = new THREE.Mesh(new THREE.CylinderGeometry(),matBldB); b.scale.set(5,15,5); b.position.set(0,-3,0);
          if(SHADOWS)b.castShadow=true; g.add(b);
          const roof2 = new THREE.Mesh(new THREE.SphereGeometry(7),matBldB); roof2.position.set(0,2,0); roof2.rotation.set(0,0.3,0); g.add(roof2);
          return g;
        }
        if (r<0.9) {
          const g = new THREE.Group();
          const b = new THREE.Mesh(new THREE.BoxGeometry(),matBldC); b.scale.set(5,5,5); b.position.set(0,-8,0);
          if(SHADOWS)b.castShadow=true; g.add(b);
          return g;
        }
        const g = new THREE.Group();
        const b = new THREE.Mesh(new THREE.ConeGeometry(1,1,3),matBldD); b.scale.set(5,20,5); b.rotation.set(0,1,0);
        if(SHADOWS)b.castShadow=true; g.add(b);
        return g;
      }
      for (let z=0;z<200;z+=20) {
        for (let x=70;x>=10;x-=20) { const bld=randBuilding(); bld.position.set(x,10,z); cityGrp.add(bld); }
        for (let x=120;x<=180;x+=20) { const bld=randBuilding(); bld.position.set(x,10,z); cityGrp.add(bld); }
      }
      cityGrp.position.set(-100,0,0);
      scene.add(cityGrp);

      // Lights — 大幅提亮以匹配原版效果
      scene.add(new THREE.AmbientLight(CP.c3, 2));           // 紫色环境光
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));      // 补充白色环境
      const point = new THREE.PointLight(CP.c1, 80, 400, 1);
      point.position.set(0, 30, 180);
      if (SHADOWS) point.castShadow = true;
      scene.add(point);
      // 第二盏补光让城市正面亮起来
      const fill = new THREE.PointLight(CP.c9, 30, 300, 1);
      fill.position.set(0, 20, 20);
      scene.add(fill);

      // ── Camera ─────────────────────────────────────────────
      const w = mount.clientWidth, h = mount.clientHeight;
      const camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000);
      camera.position.set(0, 2, 1);
      camera.lookAt(0, 0, 200);
      camera.updateProjectionMatrix();
      const camData = { x: 0, y: 2 };

      // ── Renderer ───────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ alpha: true, logarithmicDepthBuffer: true });
      renderer.setClearColor(CP.black, 1);
      renderer.setPixelRatio(window.devicePixelRatio);
      if (SHADOWS) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
      renderer.setSize(w, h);
      mount.appendChild(renderer.domElement);

      // ── Post-processing ────────────────────────────────────
      const composer = new EffectComposer(renderer);
      composer.setSize(w, h);
      composer.addPass(new RenderPass(scene, camera));
      if (BLOOM) {
        composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.8, 0.5, 0.1));
      }
      if (NOISE) {
        const noisePass = new ShaderPass({
          uniforms: { tDiffuse: { value: null }, uTime: { value: 1 } },
          vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
          fragmentShader: `
            uniform float uTime;uniform sampler2D tDiffuse;varying vec2 vUv;
            float rand(vec2 s){return fract(sin(dot(s,vec2(12.9898,78.233)))*43758.5453123);}
            float noise(vec2 p){vec2 b=floor(p);float tl=rand(b),tr=rand(b+vec2(1,0)),bl=rand(b+vec2(0,1)),br=rand(b+vec2(1,1));
              vec2 c=smoothstep(0.0,1.0,fract(p));return mix(tl,tr,c.x)+(bl-tl)*c.y*(1.0-c.x)+(br-tr)*c.x*c.y;}
            void main(){vec4 col=texture2D(tDiffuse,vUv);float d=0.05*noise(50.0*(100.0*uTime+vec2(vUv.x,20.0*vUv.y)));
              gl_FragColor=vec4(col.rgb-d,1.0);}`,
        });
        noisePass.renderToScreen = true;
        composer.addPass(noisePass);
      }

      // ── Resize + Mouse ────────────────────────────────────
      function onResize() {
        const nw = mount.clientWidth, nh = mount.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
        composer.setSize(nw, nh);
      }
      function onMouse(e: MouseEvent) {
        camData.x = (5 * (window.innerWidth / 2 - e.clientX)) / window.innerWidth;
        camData.y = 2 + (0.5 * (window.innerHeight / 2 - e.clientY)) / window.innerHeight;
      }
      const ro = new ResizeObserver(onResize);
      ro.observe(mount);
      window.addEventListener('mousemove', onMouse);

      // ── Animate ────────────────────────────────────────────
      function tick() {
        frameId = requestAnimationFrame(tick);
        const t = performance.now() / 1000;

        // car bob
        carGrp.position.set(0.7 + 0.2 * Math.sin(t), 0, 10);

        // city scroll
        cityGrp.children.forEach((bld) => {
          let nz = bld.position.z - 0.5;
          if (nz < 0) nz = 200;
          const ny = nz <= 150 ? 10 : 10 + 20 * ((150 - nz) / 50);
          bld.position.set(bld.position.x, ny, nz);
        });

        // uTime uniforms
        scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mat = (child as THREE.Mesh).material as THREE.Material & { userData: { shader?: { uniforms: { uTime: { value: number } } } } };
            if (mat?.userData?.shader) mat.userData.shader.uniforms.uTime.value = t;
          }
        });
        composer.passes.forEach((pass) => {
          if ((pass as any).uniforms?.uTime) {
            (pass as any).uniforms.uTime.value = t % 10;
          }
        });

        // camera sway
        const cx = camData.x + 0.3 * (Math.sin(0.1 * t) + Math.sin(0.05 * t));
        const cy = camData.y + 0.3 * Math.cos(0.3 * t);
        camera.position.set(cx, cy, 1);
        camera.updateProjectionMatrix();

        composer.render();
      }

      // fade in
      mount.style.opacity = '0';
      mount.style.transition = 'opacity 1s ease-out';
      tick();
      requestAnimationFrame(() => { mount.style.opacity = '1'; });

      cleanupFn = () => {
        cancelAnimationFrame(frameId);
        ro.disconnect();
        window.removeEventListener('mousemove', onMouse);
        renderer.dispose();
        if (renderer.domElement.parentElement === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    }

    init(mount).catch(console.error);
    return () => cleanupFn?.();
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: 'calc(100vh - 48px)',
        background: '#010101',
        overflow: 'hidden',
        display: 'block',
      }}
    />
  );
}
