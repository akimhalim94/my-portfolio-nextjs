"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import {
  useScroll,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import * as THREE from "three";

const smooth = (a: number, b: number, t: number) =>
  a + (b - a) * t * t * (3 - 2 * t);

function applyCamera(
  cam: THREE.PerspectiveCamera,
  px: number,
  py: number,
  reduced: boolean
) {
  cam.position.x = reduced ? 0 : px * 0.25;
  cam.position.y = 0.35 + (reduced ? 0 : py * -0.15);
  cam.position.z = 8;
  cam.fov = 55;
  cam.updateProjectionMatrix();
  cam.lookAt(0, 0, 0);
}

function Scene({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const rig = useRef<THREE.Group>(null);
  const canopy = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);
  const pointer = useRef({ x: 0, y: 0 });

  const shroudLines = useMemo(() => {
    const count = 8;
    const rimRadius = 1.05;
    const harness = new THREE.Vector3(0, -1.5, 0);
    const up = new THREE.Vector3(0, 1, 0);
    const q = new THREE.Quaternion();
    const arr: {
      mid: THREE.Vector3;
      quat: THREE.Quaternion;
      len: number;
    }[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const rim = new THREE.Vector3(
        Math.cos(a) * rimRadius,
        -0.05,
        Math.sin(a) * rimRadius
      );
      const dir = harness.clone().sub(rim);
      const len = dir.length();
      const mid = rim.clone().add(dir.clone().multiplyScalar(0.5));
      q.setFromUnitVectors(up, dir.normalize());
      arr.push({ mid, quat: q.clone(), len });
    }
    return arr;
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    if (document.hidden) return;
    const t = reduced ? 0 : progress.get();
    const time = state.clock.elapsedTime;

    applyCamera(
      camera as THREE.PerspectiveCamera,
      pointer.current.x,
      pointer.current.y,
      reduced
    );

    if (rig.current) {
      // Scroll lowers the parachute from top to bottom of the page
      rig.current.position.y =
        smooth(4.6, -5.4, t) + (reduced ? 0 : Math.sin(time * 0.9) * 0.08);
      rig.current.position.x =
        smooth(-6.5, -5, t) + (reduced ? 0 : Math.sin(time * 0.5) * 0.12);
      rig.current.rotation.z = (reduced ? 0 : Math.sin(time * 1.2)) * 0.06;
    }

    if (canopy.current) {
      const sway = reduced ? 0 : Math.sin(time * 1.1);
      canopy.current.rotation.z = sway * 0.07;
      canopy.current.rotation.x = 0.12 + (reduced ? 0 : Math.sin(time * 0.8) * 0.04);
    }

    if (body.current) {
      // Body counter-sways against the canopy
      body.current.rotation.z =
        -(reduced ? 0 : Math.sin(time * 1.1) * 0.07) * 0.6;
      body.current.rotation.x = 0.08;
    }

    const dangle = reduced ? 0.18 : 0.18 + Math.sin(time * 1.6) * 0.14;
    if (leftLeg.current) leftLeg.current.rotation.x = dangle;
    if (rightLeg.current) rightLeg.current.rotation.x = -dangle * 0.9;
  });

  return (
    <group ref={rig} scale={0.8}>
      {/* Canopy group (dome + rim + shrouds) */}
      <group ref={canopy}>
        {/* Dome */}
        <mesh>
          <sphereGeometry args={[1.1, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0ea5e9"
            emissiveIntensity={0.35}
            metalness={0.3}
            roughness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Rim ring */}
        <mesh position={[0, -0.05, 0]} rotation-x={-Math.PI / 2}>
          <torusGeometry args={[1.05, 0.035, 12, 64]} />
          <meshBasicMaterial
            color="#7dd3fc"
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>

        {/* Shroud lines */}
        {shroudLines.map((line, i) => (
          <mesh
            key={i}
            position={line.mid}
            quaternion={line.quat}
          >
            <cylinderGeometry args={[0.012, 0.012, line.len, 6]} />
            <meshBasicMaterial
              color="#93c5fd"
              transparent
              opacity={0.75}
              depthWrite={false}
            />
          </mesh>
        ))}

        {/* Person hanging from the harness */}
        <group ref={body} position={[0, -1.5, 0]}>
          {/* Arms reaching up toward the shroud lines */}
          <group position={[-0.2, -0.32, 0]} rotation-z={-0.55}>
            <mesh position={[0, -0.16, 0]}>
              <capsuleGeometry args={[0.05, 0.28, 8, 16]} />
              <meshStandardMaterial color="#2563eb" metalness={0.5} roughness={0.3} />
            </mesh>
          </group>
          <group position={[0.2, -0.32, 0]} rotation-z={0.55}>
            <mesh position={[0, -0.16, 0]}>
              <capsuleGeometry args={[0.05, 0.28, 8, 16]} />
              <meshStandardMaterial color="#2563eb" metalness={0.5} roughness={0.3} />
            </mesh>
          </group>

          {/* Torso */}
          <mesh position={[0, -0.42, 0]}>
            <capsuleGeometry args={[0.15, 0.3, 8, 16]} />
            <meshStandardMaterial color="#1e3a8a" metalness={0.5} roughness={0.3} />
          </mesh>

          {/* Head */}
          <mesh position={[0, -0.68, 0]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial
              color="#60a5fa"
              emissive="#1d4ed8"
              emissiveIntensity={0.25}
              metalness={0.4}
              roughness={0.25}
            />
          </mesh>

          {/* Dangling legs */}
          <group ref={leftLeg} position={[-0.08, -0.62, 0]}>
            <mesh position={[0, -0.16, 0]}>
              <capsuleGeometry args={[0.055, 0.26, 8, 16]} />
              <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.3} />
            </mesh>
          </group>
          <group ref={rightLeg} position={[0.08, -0.62, 0]}>
            <mesh position={[0, -0.16, 0]}>
              <capsuleGeometry args={[0.055, 0.26, 8, 16]} />
              <meshStandardMaterial color="#1d4ed8" metalness={0.5} roughness={0.3} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 8]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-5, 2, 2]} intensity={14} color="#8b5cf6" />
      <pointLight position={[5, -1, 4]} intensity={14} color="#22d3ee" />

      {/* Ambience dust */}
      <Sparkles
        count={40}
        scale={[14, 6, 6]}
        size={1}
        speed={0.25}
        opacity={0.25}
        color="#60a5fa"
      />
    </group>
  );
}

export default function Scroll3DBackground() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    mass: 0.6,
  });

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black"
      >
        {/* Legibility gradients over the scene */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>
      <div
        aria-hidden
        className="fixed inset-0 z-10 pointer-events-none overflow-hidden opacity-50"
      >
        <Canvas
          className="pointer-events-none"
          camera={{ position: [0, 0.35, 8], fov: 55 }}
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent", pointerEvents: "none" }}
        >
          <Scene progress={progress} reduced={!!reduced} />
        </Canvas>
      </div>
    </>
  );
}
