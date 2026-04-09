'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';

type Vec2 = [number, number];
export interface FaultyTerminalBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  scale?: number; gridMul?: Vec2; digitSize?: number; timeScale?: number; pause?: boolean;
  scanlineIntensity?: number; glitchAmount?: number; flickerAmount?: number; noiseAmp?: number;
  chromaticAberration?: number; dither?: number | boolean; curvature?: number; tint?: string;
  mouseReact?: boolean; mouseStrength?: number; dpr?: number; pageLoadAnimation?: boolean; brightness?: number;
}

const vert = `attribute vec2 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0.0,1.0);}`;

const frag = `precision mediump float;
varying vec2 vUv;
uniform float iTime;uniform vec3 iResolution;uniform float uScale;uniform vec2 uGridMul;
uniform float uDigitSize;uniform float uScanlineIntensity;uniform float uGlitchAmount;
uniform float uFlickerAmount;uniform float uNoiseAmp;uniform float uChromaticAberration;
uniform float uDither;uniform float uCurvature;uniform vec3 uTint;uniform vec2 uMouse;
uniform float uMouseStrength;uniform float uUseMouse;uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;uniform float uBrightness;
float time;
float hash21(vec2 p){p=fract(p*234.56);p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){return sin(p.x*10.0)*sin(p.y*(3.0+sin(time*0.090909)))+0.2;}
mat2 rotate(float a){float c=cos(a);float s=sin(a);return mat2(c,-s,s,c);}
float fbm(vec2 p){p*=1.1;float f=0.0;float amp=0.5*uNoiseAmp;
  mat2 m0=rotate(time*0.02);f+=amp*noise(p);p=m0*p*2.0;amp*=0.454545;
  mat2 m1=rotate(time*0.02);f+=amp*noise(p);p=m1*p*2.0;amp*=0.454545;
  mat2 m2=rotate(time*0.08);f+=amp*noise(p);return f;}
float pattern(vec2 p,out vec2 q,out vec2 r){
  mat2 r01=rotate(0.1*time);mat2 r1=rotate(0.1);
  q=vec2(fbm(p+vec2(1.0)),fbm(r01*p+vec2(1.0)));
  r=vec2(fbm(r1*q+vec2(0.0)),fbm(q+vec2(0.0)));return fbm(p+r);}
float digit(vec2 p){
  vec2 grid=uGridMul*15.0;vec2 s=floor(p*grid)/grid;p=p*grid;
  vec2 q;vec2 r;float intensity=pattern(s*0.1,q,r)*1.3-0.03;
  if(uUseMouse>0.5){vec2 mw=uMouse*uScale;float d=distance(s,mw);
    float mi=exp(-d*8.0)*uMouseStrength*10.0;intensity+=mi;
    intensity+=sin(d*20.0-iTime*5.0)*0.1*mi;}
  if(uUsePageLoadAnimation>0.5){float cr=fract(sin(dot(s,vec2(12.9898,78.233)))*43758.5453);
    float cd=cr*0.8;float cp=clamp((uPageLoadProgress-cd)/0.2,0.0,1.0);
    intensity*=smoothstep(0.0,1.0,cp);}
  p=fract(p);p*=uDigitSize;
  float px5=p.x*5.0;float py5=(1.0-p.y)*5.0;float x=fract(px5);float y=fract(py5);
  float i=floor(py5)-2.0;float j=floor(px5)-2.0;float n=i*i+j*j;float f=n*0.0625;
  float isOn=step(0.1,intensity-f);float db=isOn*(0.2+y*0.8)*(0.75+x*0.25);
  return step(0.0,p.x)*step(p.x,1.0)*step(0.0,p.y)*step(p.y,1.0)*db;}
float onOff(float a,float b,float c){return step(c,sin(iTime+a*cos(iTime*b)))*uFlickerAmount;}
float displace(vec2 look){float y=look.y-mod(iTime*0.25,1.0);float w=1.0/(1.0+50.0*y*y);
  return sin(look.y*20.0+iTime)*0.0125*onOff(4.0,2.0,0.8)*(1.0+cos(iTime*60.0))*w;}
vec3 getColor(vec2 p){float bar=step(mod(p.y+time*20.0,1.0),0.2)*0.4+1.0;bar*=uScanlineIntensity;
  float d=displace(p);p.x+=d;if(uGlitchAmount!=1.0){p.x+=d*(uGlitchAmount-1.0);}
  float middle=digit(p);const float off=0.002;
  float sum=digit(p+vec2(-off,-off))+digit(p+vec2(0.0,-off))+digit(p+vec2(off,-off))+
    digit(p+vec2(-off,0.0))+digit(p+vec2(0.0,0.0))+digit(p+vec2(off,0.0))+
    digit(p+vec2(-off,off))+digit(p+vec2(0.0,off))+digit(p+vec2(off,off));
  return vec3(0.9)*middle+sum*0.1*vec3(1.0)*bar;}
vec2 barrel(vec2 uv){vec2 c=uv*2.0-1.0;float r2=dot(c,c);c=(1.0+uCurvature*r2)*c;return c*0.5+0.5;}
void main(){time=iTime*0.333333;vec2 uv=vUv;
  if(uCurvature!=0.0){uv=barrel(uv);}
  vec2 p=uv*uScale;vec3 col=getColor(p);
  if(uChromaticAberration!=0.0){vec2 ca=vec2(uChromaticAberration)/iResolution.xy;
    col.r=getColor(p+ca).r;col.b=getColor(p-ca).b;}
  col*=uTint;col*=uBrightness;
  if(uDither>0.0){col+=(hash21(gl_FragCoord.xy)-0.5)*(uDither*0.003922);}
  gl_FragColor=vec4(col,1.0);}`;

function hexToRgb(hex: string): [number, number, number] {
  let v = hex.replace('#', '').trim();
  if (v.length === 3) v = v.split('').map(c => c + c).join('');
  if (!/^[0-9A-Fa-f]{6}$/.test(v)) return [1, 1, 1];
  const n = parseInt(v, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export default function FaultyTerminalBackground({
  scale = 1, gridMul = [2, 1], digitSize = 1.5, timeScale = 0.3, pause = false,
  scanlineIntensity = 0.3, glitchAmount = 1, flickerAmount = 1, noiseAmp = 1,
  chromaticAberration = 0, dither = 0, curvature = 0.2, tint = '#ffffff',
  mouseReact = true, mouseStrength = 0.2, dpr, pageLoadAnimation = true, brightness = 1,
  className, style, ...rest
}: FaultyTerminalBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const frozenTimeRef = useRef(0);
  const loadAnimStartRef = useRef(0);
  const [timeOffset] = useState(() => Math.random() * 100);
  const timeOffsetRef = useRef(timeOffset);

  const resolvedDpr = useMemo(() => {
    const d = typeof window === 'undefined' ? 1 : window.devicePixelRatio;
    return Math.max(1, Math.min(dpr ?? d, 2));
  }, [dpr]);

  const ditherValue = useMemo(() => (typeof dither === 'boolean' ? (dither ? 1 : 0) : dither), [dither]);
  const tintRgb = useMemo(() => hexToRgb(tint), [tint]);
  const [gx, gy] = gridMul;

  const onMove = useCallback((e: MouseEvent) => {
    const c = containerRef.current; if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
  }, []);
  const onLeave = useCallback(() => { mouseRef.current = { x: 0.5, y: 0.5 }; }, []);

  useEffect(() => {
    const c = containerRef.current; if (!c) return;
    const renderer = new Renderer({ dpr: resolvedDpr, alpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vert, fragment: frag,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([gl.canvas.width, gl.canvas.height, gl.canvas.width / Math.max(gl.canvas.height, 1)]) },
        uScale: { value: scale }, uGridMul: { value: new Float32Array([gx, gy]) }, uDigitSize: { value: digitSize },
        uScanlineIntensity: { value: scanlineIntensity }, uGlitchAmount: { value: glitchAmount },
        uFlickerAmount: { value: flickerAmount }, uNoiseAmp: { value: noiseAmp },
        uChromaticAberration: { value: chromaticAberration }, uDither: { value: ditherValue },
        uCurvature: { value: curvature }, uTint: { value: new Color(tintRgb[0], tintRgb[1], tintRgb[2]) },
        uMouse: { value: new Float32Array([0.5, 0.5]) }, uMouseStrength: { value: mouseStrength },
        uUseMouse: { value: mouseReact ? 1 : 0 }, uPageLoadProgress: { value: pageLoadAnimation ? 0 : 1 },
        uUsePageLoadAnimation: { value: pageLoadAnimation ? 1 : 0 }, uBrightness: { value: brightness },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    const resize = () => {
      renderer.setSize(Math.max(c.clientWidth, 1), Math.max(c.clientHeight, 1));
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.canvas.width; res[1] = gl.canvas.height; res[2] = gl.canvas.width / Math.max(gl.canvas.height, 1);
    };
    const ro = new ResizeObserver(resize); ro.observe(c); resize();
    gl.canvas.style.cssText = 'width:100%;height:100%;display:block;';
    c.appendChild(gl.canvas);
    const tick = (t: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (pageLoadAnimation && loadAnimStartRef.current === 0) loadAnimStartRef.current = t;
      if (pause) { program.uniforms.iTime.value = frozenTimeRef.current; }
      else { const e = (t * 0.001 + timeOffsetRef.current) * timeScale; program.uniforms.iTime.value = e; frozenTimeRef.current = e; }
      if (pageLoadAnimation && loadAnimStartRef.current > 0) program.uniforms.uPageLoadProgress.value = Math.min((t - loadAnimStartRef.current) / 2000, 1);
      if (mouseReact) {
        const m = mouseRef.current; const s = smoothMouseRef.current;
        s.x += (m.x - s.x) * 0.08; s.y += (m.y - s.y) * 0.08;
        const u = program.uniforms.uMouse.value as Float32Array; u[0] = s.x; u[1] = s.y;
      }
      renderer.render({ scene: mesh });
    };
    rafRef.current = requestAnimationFrame(tick);
    if (mouseReact) { c.addEventListener('mousemove', onMove); c.addEventListener('mouseleave', onLeave); }
    return () => {
      cancelAnimationFrame(rafRef.current); ro.disconnect();
      if (mouseReact) { c.removeEventListener('mousemove', onMove); c.removeEventListener('mouseleave', onLeave); }
      if (gl.canvas.parentElement === c) c.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      loadAnimStartRef.current = 0;
    };
  }, [resolvedDpr, pause, timeScale, scale, gx, gy, digitSize, scanlineIntensity, glitchAmount, flickerAmount, noiseAmp, chromaticAberration, ditherValue, curvature, tintRgb, mouseReact, mouseStrength, pageLoadAnimation, brightness, onMove, onLeave]);

  return <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className ?? ''}`} style={style} {...rest} />;
}
