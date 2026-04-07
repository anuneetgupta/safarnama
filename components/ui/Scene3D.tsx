'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, MeshDistortMaterial, Sparkles, Trail, Environment } from '@react-three/drei'
import * as THREE from 'three'

// ── AURORA WAVE SHADER ─────────────────────────────────────────
const auroraVert = `
varying vec2 vUv; varying float vElev; uniform float uTime;
void main() {
  vUv = uv; vec3 p = position;
  float w = sin(p.x*2.0+uTime*0.7)*0.35 + sin(p.y*1.5+uTime*0.5)*0.25 + sin((p.x+p.y)*1.8+uTime*0.9)*0.15;
  p.z += w; vElev = w;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
}`
const auroraFrag = `
varying vec2 vUv; varying float vElev; uniform float uTime;
void main() {
  float t = uTime*0.25;
  vec3 c1=vec3(0.52,0.80,0.10); vec3 c2=vec3(0.83,0.66,0.26); vec3 c3=vec3(0.20,0.90,0.50);
  float m1=sin(vUv.x*3.14+t)*0.5+0.5; float m2=sin(vUv.y*6.28+t*1.4)*0.5+0.5;
  vec3 col=mix(mix(c1,c2,m1),c3,m2*0.5);
  float alpha=(vElev+0.5)*0.22*(1.0-vUv.y*0.5);
  gl_FragColor=vec4(col,alpha);
}`

function Aurora() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  useFrame(({ clock }) => { if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime })
  return (
    <mesh position={[0, 4, -10]} rotation={[-0.25, 0, 0]}>
      <planeGeometry args={[35, 14, 100, 50]} />
      <shaderMaterial ref={mat} vertexShader={auroraVert} fragmentShader={auroraFrag}
        uniforms={{ uTime: { value: 0 } }} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ── ANIMATED TERRAIN ───────────────────────────────────────────
const terrVert = `
varying vec2 vUv; varying float vH; uniform float uTime;
void main() {
  vUv=uv; vec3 p=position;
  float h=sin(p.x*1.1+uTime*0.35)*0.7+sin(p.y*0.9+uTime*0.28)*0.5+sin((p.x+p.y)*2.1+uTime*0.6)*0.25;
  p.z+=h; vH=h;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
}`
const terrFrag = `
varying vec2 vUv; varying float vH; uniform float uTime;
void main() {
  vec3 lo=vec3(0.01,0.04,0.01); vec3 mi=vec3(0.05,0.12,0.03); vec3 hi=vec3(0.15,0.30,0.05);
  float t=clamp((vH+0.9)/1.8,0.0,1.0);
  vec3 col=mix(lo,mix(mi,hi,t),t);
  float g=step(0.97,fract(vUv.x*24.0))+step(0.97,fract(vUv.y*24.0));
  col+=g*vec3(0.05,0.18,0.02)*0.35;
  gl_FragColor=vec4(col,0.55);
}`

function Terrain() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  useFrame(({ clock }) => { if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime })
  return (
    <mesh position={[0, -7, -10]} rotation={[-1.15, 0, 0]}>
      <planeGeometry args={[45, 35, 140, 100]} />
      <shaderMaterial ref={mat} vertexShader={terrVert} fragmentShader={terrFrag}
        uniforms={{ uTime: { value: 0 } }} transparent />
    </mesh>
  )
}

// ── MOUSE-REACTIVE PARTICLES ───────────────────────────────────
function ParticleField() {
  const count = 2500
  const ref = useRef<THREE.Points>(null)
  const { mouse } = useThree()
  const [pos, col] = useMemo(() => {
    const p = new Float32Array(count * 3)
    const c = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i*3]=(Math.random()-0.5)*30; p[i*3+1]=(Math.random()-0.5)*22; p[i*3+2]=(Math.random()-0.5)*18
      const r = Math.random()
      if (r<0.45){c[i*3]=0.52;c[i*3+1]=0.80;c[i*3+2]=0.10}
      else if(r<0.75){c[i*3]=0.83;c[i*3+1]=0.66;c[i*3+2]=0.26}
      else{c[i*3]=1;c[i*3+1]=1;c[i*3+2]=1}
    }
    return [p, c]
  }, [])
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.035 + mouse.x * 0.25
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.018) * 0.08 + mouse.y * 0.12
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  )
}

// ── FLYING PLANE WITH TRAIL ────────────────────────────────────
function FlyingPlane() {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!g.current) return
    const t = clock.elapsedTime * 0.35
    g.current.position.set(Math.sin(t)*9, Math.cos(t*0.65)*2.5+1.5, Math.cos(t)*5-2)
    g.current.rotation.z = -Math.cos(t)*0.35
    g.current.rotation.y = Math.atan2(Math.cos(t)*9*0.35, -Math.sin(t*0.65)*2.5*0.35)
  })
  return (
    <group ref={g}>
      <Trail width={2} length={10} color="#a3e635" attenuation={t => t * t}>
        <mesh>
          <coneGeometry args={[0.07, 0.45, 6]} />
          <meshStandardMaterial color="#a3e635" emissive="#84cc16" emissiveIntensity={3} />
        </mesh>
      </Trail>
    </group>
  )
}

// ── MORPHING ORBS ──────────────────────────────────────────────
function Orb({ pos, col, speed }: { pos: [number,number,number]; col: string; speed: number }) {
  const m = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (m.current) { m.current.rotation.x = clock.elapsedTime*speed*0.4; m.current.rotation.y = clock.elapsedTime*speed*0.6 }
  })
  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.8}>
      <mesh ref={m} position={pos}>
        <icosahedronGeometry args={[0.75, 2]} />
        <MeshDistortMaterial color={col} distort={0.55} speed={speed*1.5} roughness={0.05} metalness={0.95}
          emissive={col} emissiveIntensity={0.35} transparent opacity={0.8} />
      </mesh>
    </Float>
  )
}

// ── SPINNING RINGS ─────────────────────────────────────────────
function Rings() {
  const r1 = useRef<THREE.Group>(null), r2 = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (r1.current) { r1.current.rotation.x=clock.elapsedTime*0.45; r1.current.rotation.z=clock.elapsedTime*0.22 }
    if (r2.current) { r2.current.rotation.y=clock.elapsedTime*0.38; r2.current.rotation.x=clock.elapsedTime*0.55 }
  })
  return (
    <>
      <group ref={r1} position={[4.5, 1.5, -3]}>
        <mesh><torusGeometry args={[2, 0.022, 16, 120]} /><meshStandardMaterial color="#a3e635" emissive="#84cc16" emissiveIntensity={2} transparent opacity={0.55} /></mesh>
        <mesh rotation={[Math.PI/3,0,0]}><torusGeometry args={[2, 0.014, 16, 120]} /><meshStandardMaterial color="#d4a843" emissive="#d4a843" emissiveIntensity={1.5} transparent opacity={0.4} /></mesh>
      </group>
      <group ref={r2} position={[-4.5, -1, -2]}>
        <mesh><torusGeometry args={[1.4, 0.018, 16, 100]} /><meshStandardMaterial color="#d4a843" emissive="#d4a843" emissiveIntensity={2} transparent opacity={0.5} /></mesh>
      </group>
    </>
  )
}

// ── MOUSE FOLLOW LIGHT ─────────────────────────────────────────
function MouseLight() {
  const l = useRef<THREE.PointLight>(null)
  const { mouse, viewport } = useThree()
  useFrame(() => {
    if (!l.current) return
    l.current.position.x += (mouse.x*viewport.width*0.5 - l.current.position.x)*0.07
    l.current.position.y += (mouse.y*viewport.height*0.5 - l.current.position.y)*0.07
  })
  return <pointLight ref={l} position={[0,0,5]} intensity={4} color="#a3e635" distance={14} />
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position:[0,0,11], fov:62 }}
      style={{ position:'absolute', inset:0, pointerEvents:'none' }}
      gl={{ antialias:true, alpha:true, powerPreference:'high-performance' }} dpr={[1,1.5]}>
      <ambientLight intensity={0.15} />
      <pointLight position={[10,10,5]} intensity={1} color="#a3e635" />
      <pointLight position={[-10,-5,3]} intensity={0.6} color="#d4a843" />
      <MouseLight />
      <Stars radius={120} depth={70} count={5000} factor={4} saturation={0.2} fade speed={0.6} />
      <Sparkles count={100} scale={22} size={2.5} speed={0.5} color="#a3e635" />
      <Aurora />
      <Terrain />
      <ParticleField />
      <FlyingPlane />
      <Orb pos={[-5.5, 2.5, -1]} col="#84cc16" speed={1.2} />
      <Orb pos={[5.5, -1.5, -2]} col="#d4a843" speed={0.9} />
      <Rings />
    </Canvas>
  )
}
