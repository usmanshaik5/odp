'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, RoundedBox, Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function SceneContent() {
  const ring = useRef<THREE.Mesh>(null)
  const orbit = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.18
    if (orbit.current) orbit.current.rotation.y += delta * 0.12
    state.camera.lookAt(0, 0.45, 0)
  })

  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[4, 7, 5]} intensity={3} color="#ffffff" />
      <directionalLight position={[-4, 2, -3]} intensity={1.4} color="#8ecbff" />
      <Sparkles count={32} scale={[6, 3.5, 3]} size={2.2} speed={0.25} color="#0874d1" opacity={0.45} />
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.28}>
        <group position={[0, 0.15, 0]}>
          <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5.5, 3.4]} />
            <meshStandardMaterial color="#dceeff" roughness={0.82} />
          </mesh>
          <RoundedBox args={[2.9, 1.75, 1.8]} radius={0.12} smoothness={5} position={[0, 0, 0]} castShadow>
            <meshStandardMaterial color="#f8fbff" roughness={0.3} metalness={0.05} />
          </RoundedBox>
          <mesh position={[0, 1.05, 0]} rotation={[0, 0, Math.PI / 4]} scale={[1.1, 1.1, 1.1]}>
            <coneGeometry args={[1.85, 1.35, 4]} />
            <meshStandardMaterial color="#0874d1" roughness={0.32} metalness={0.1} />
          </mesh>
          <RoundedBox args={[0.8, 1.12, 0.12]} radius={0.04} smoothness={4} position={[0, -0.3, 0.94]}>
            <meshStandardMaterial color="#123957" roughness={0.22} metalness={0.08} />
          </RoundedBox>
          <RoundedBox args={[0.68, 0.58, 0.1]} radius={0.03} smoothness={4} position={[-0.92, 0.32, 0.94]}>
            <meshStandardMaterial color="#8fd4ff" roughness={0.12} metalness={0.15} />
          </RoundedBox>
          <RoundedBox args={[0.68, 0.58, 0.1]} radius={0.03} smoothness={4} position={[0.92, 0.32, 0.94]}>
            <meshStandardMaterial color="#8fd4ff" roughness={0.12} metalness={0.15} />
          </RoundedBox>
          <mesh position={[0, -0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.3, 0.82]} />
            <meshStandardMaterial color="#59b878" roughness={0.9} />
          </mesh>
          <group ref={orbit}>
            <mesh ref={ring} rotation={[Math.PI / 2.4, 0.3, 0]} position={[0, 0.15, 0]}>
              <torusGeometry args={[2.15, 0.018, 10, 100]} />
              <meshBasicMaterial color="#0874d1" transparent opacity={0.42} />
            </mesh>
            <mesh position={[1.5, 0.65, 0.35]}>
              <sphereGeometry args={[0.12, 20, 20]} />
              <meshStandardMaterial color="#f5c62d" emissive="#f5c62d" emissiveIntensity={0.25} />
            </mesh>
          </group>
        </group>
      </Float>
    </>
  )
}

export function HeroScene() {
  return (
    <div className="hero-3d" aria-hidden="true">
      <Canvas camera={{ position: [0, 1.1, 6.8], fov: 35 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
        <SceneContent />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2.5} />
      </Canvas>
    </div>
  )
}

export default HeroScene
