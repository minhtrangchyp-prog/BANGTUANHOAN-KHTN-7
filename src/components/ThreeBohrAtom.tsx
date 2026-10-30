import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ElementData } from '../types/element';
import { getElementParticleDetails } from '../data/elementsData';
import { Play, Pause, RotateCcw, Orbit, Sparkles, Layers, Info } from 'lucide-react';

interface ThreeBohrAtomProps {
  element: ElementData;
}

// Module-level scratch math vectors to prevent garbage collection inside the 60fps render loop
const _vec3 = new THREE.Vector3();

const SHELL_NAMES = ['K (n=1)', 'L (n=2)', 'M (n=3)', 'N (n=4)', 'O (n=5)', 'P (n=6)', 'Q (n=7)'];

export const ThreeBohrAtom: React.FC<ThreeBohrAtomProps> = ({ element }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [orbitSpeed, setOrbitSpeed] = useState<number>(1);
  const [modelMode, setModelMode] = useState<'3d-spherical' | 'bohr-planar'>('3d-spherical');
  const [activeShellIndex, setActiveShellIndex] = useState<number | null>(null);
  const [showShellDetails, setShowShellDetails] = useState<boolean>(true);

  // References to keep animation loop decoupled from React re-renders
  const stateRef = useRef({
    isPlaying: true,
    speed: 1,
    mode: '3d-spherical' as '3d-spherical' | 'bohr-planar',
  });

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
    stateRef.current.speed = orbitSpeed;
    stateRef.current.mode = modelMode;
  }, [isPlaying, orbitSpeed, modelMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene & Camera setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1120); // Deep slate cosmos

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    
    // Calculate camera distance according to number of shells
    const shellCount = element.electronsPerShell.length;
    const maxRadius = 1.6 + shellCount * 1.35;
    camera.position.set(0, maxRadius * 0.9, maxRadius * 2.1);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Mandatory Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(10, 15, 10);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 1.4);
    fillLight.position.set(-10, -5, -10);
    scene.add(fillLight);

    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.8);
    scene.add(hemiLight);

    // Root Group for the atom
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);

    // ==========================================
    // 1. PROCEDURAL COMPOSITE NUCLEUS (Protons & Neutrons)
    // ==========================================
    const nucleusGroup = new THREE.Group();
    atomGroup.add(nucleusGroup);

    // Number of protons Z, neutrons A - Z (exact integer subatomic particles)
    const particleInfo = getElementParticleDetails(element);
    const numProtons = particleInfo.protons;
    const numNeutrons = particleInfo.neutrons;
    const totalNucleons = numProtons + numNeutrons;
    // Cap visual nucleons rendered to prevent lagging on heavy elements (e.g. U has 238 nucleons)
    const visualNucleonCap = Math.min(totalNucleons, 48);

    const protonMat = new THREE.MeshPhysicalMaterial({
      color: 0xef4444, // Red / Carmine
      emissive: 0x991b1b,
      emissiveIntensity: 0.35,
      metalness: 0.4,
      roughness: 0.25,
      clearcoat: 0.8,
    });

    const neutronMat = new THREE.MeshPhysicalMaterial({
      color: 0x64748b, // Slate gray
      emissive: 0x334155,
      emissiveIntensity: 0.15,
      metalness: 0.2,
      roughness: 0.4,
    });

    const nucleonRadius = 0.26;
    const nucleonGeom = new THREE.SphereGeometry(nucleonRadius, 16, 16);

    // Golden spiral sphere distribution for tightly packed nucleus
    const clusterRadius = Math.max(0.45, Math.pow(visualNucleonCap, 1 / 3) * 0.4);
    for (let i = 0; i < visualNucleonCap; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / visualNucleonCap);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = clusterRadius * Math.pow((i + 1) / visualNucleonCap, 0.7);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      const isProton = (i % 2 === 0 && numProtons > 0) || i < (visualNucleonCap * numProtons) / totalNucleons;
      const mesh = new THREE.Mesh(nucleonGeom, isProton ? protonMat : neutronMat);
      mesh.position.set(x, y, z);
      nucleusGroup.add(mesh);
    }

    // Outer subtle energy aura for nucleus
    const auraGeom = new THREE.SphereGeometry(clusterRadius * 1.35, 24, 24);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    });
    const auraMesh = new THREE.Mesh(auraGeom, auraMat);
    nucleusGroup.add(auraMesh);

    // ==========================================
    // 2. ELECTRON SHELLS & ORBITING ELECTRONS
    // ==========================================
    interface ElectronObject {
      mesh: THREE.Mesh;
      ringRadius: number;
      angle: number;
      speed: number;
      inclinationX: number;
      inclinationZ: number;
      shellIndex: number;
    }

    const electronList: ElectronObject[] = [];
    const shellRingsGroup = new THREE.Group();
    atomGroup.add(shellRingsGroup);

    const electronGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const electronMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8, // Electric cyan
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.15,
      clearcoat: 1.0,
    });

    const ringMeshes: THREE.LineLoop[] = [];

    element.electronsPerShell.forEach((electronCount, shellIdx) => {
      const shellRadius = 1.3 + (shellIdx + 1) * 1.15;

      // Create orbital ring geometry
      const segments = 96;
      const ringGeom = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * shellRadius, 0, Math.sin(theta) * shellRadius));
      }
      ringGeom.setFromPoints(points);

      const ringMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        linewidth: 1,
      });

      const ringMesh = new THREE.LineLoop(ringGeom, ringMat);

      // Inclination for 3D atomic orbital effect
      const tiltAngles = [
        { x: 0.15, z: 0.05 },
        { x: 0.55, z: 0.3 },
        { x: -0.45, z: 0.6 },
        { x: 0.75, z: -0.4 },
        { x: -0.65, z: -0.5 },
        { x: 0.35, z: 0.8 },
        { x: -0.85, z: 0.2 },
      ];
      const tilt = tiltAngles[shellIdx % tiltAngles.length];

      ringMesh.rotation.x = tilt.x;
      ringMesh.rotation.z = tilt.z;
      shellRingsGroup.add(ringMesh);
      ringMeshes.push(ringMesh);

      // Create electrons on this shell according to Bohr rules
      const baseAngularSpeed = (1.5 / Math.sqrt(shellIdx + 1)) * 0.8;

      for (let eIdx = 0; eIdx < electronCount; eIdx++) {
        const initialAngle = (eIdx / electronCount) * Math.PI * 2;
        const eMesh = new THREE.Mesh(electronGeom, electronMat);
        atomGroup.add(eMesh);

        electronList.push({
          mesh: eMesh,
          ringRadius: shellRadius,
          angle: initialAngle,
          speed: baseAngularSpeed,
          inclinationX: tilt.x,
          inclinationZ: tilt.z,
          shellIndex: shellIdx,
        });
      }
    });

    // ==========================================
    // 3. INTERACTIVE ORBIT CONTROLS (Manual Smooth Damping)
    // ==========================================
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.3;
    let targetRotationY = 0.5;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.007;
      targetRotationX += deltaY * 0.007;
      targetRotationX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationX));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domCanvas = renderer.domElement;
    domCanvas.style.cursor = 'grab';
    domCanvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // ==========================================
    // 4. ANIMATION LOOP WITH 60FPS DAMPING
    // ==========================================
    let frameId = 0;
    let clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const animate = () => {
      const dt = clock.getDelta();
      const currentSpeed = stateRef.current.speed;
      const currentlyPlaying = stateRef.current.isPlaying;
      const currentMode = stateRef.current.mode;

      // Exponential damping on atom group rotation
      atomGroup.rotation.y = THREE.MathUtils.damp(atomGroup.rotation.y, targetRotationY, 12, dt);
      atomGroup.rotation.x = THREE.MathUtils.damp(atomGroup.rotation.x, targetRotationX, 12, dt);

      // Nucleus gentle pulse and internal tumble
      nucleusGroup.rotation.y += 0.012;
      nucleusGroup.rotation.x += 0.008;

      // Animate rings according to mode (Planar vs 3D Inclined)
      ringMeshes.forEach((rm, idx) => {
        const tilt = [
          { x: 0.15, z: 0.05 },
          { x: 0.55, z: 0.3 },
          { x: -0.45, z: 0.6 },
          { x: 0.75, z: -0.4 },
          { x: -0.65, z: -0.5 },
          { x: 0.35, z: 0.8 },
          { x: -0.85, z: 0.2 },
        ][idx % 7];

        const targetX = currentMode === 'bohr-planar' ? 0 : tilt.x;
        const targetZ = currentMode === 'bohr-planar' ? 0 : tilt.z;
        rm.rotation.x = THREE.MathUtils.damp(rm.rotation.x, targetX, 8, dt);
        rm.rotation.z = THREE.MathUtils.damp(rm.rotation.z, targetZ, 8, dt);
      });

      // Orbit electrons
      electronList.forEach((eObj) => {
        if (currentlyPlaying) {
          eObj.angle += eObj.speed * currentSpeed * dt * 2.2;
        }

        const effectiveTiltX = currentMode === 'bohr-planar' ? 0 : eObj.inclinationX;
        const effectiveTiltZ = currentMode === 'bohr-planar' ? 0 : eObj.inclinationZ;

        // Position on planar circle
        const px = Math.cos(eObj.angle) * eObj.ringRadius;
        const py = 0;
        const pz = Math.sin(eObj.angle) * eObj.ringRadius;

        _vec3.set(px, py, pz);

        // Apply ring tilt
        const euler = new THREE.Euler(effectiveTiltX, 0, effectiveTiltZ, 'XYZ');
        _vec3.applyEuler(euler);

        eObj.mesh.position.copy(_vec3);
      });

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domCanvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);

      // Clean disposal
      nucleonGeom.dispose();
      protonMat.dispose();
      neutronMat.dispose();
      auraGeom.dispose();
      auraMat.dispose();
      electronGeom.dispose();
      electronMat.dispose();
      ringMeshes.forEach(r => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [element]);

  const resetView = () => {
    setIsPlaying(true);
    setOrbitSpeed(1);
    setModelMode('3d-spherical');
  };

  const particleInfo = getElementParticleDetails(element);

  return (
    <div className="relative w-full flex flex-col bg-slate-950/90 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Integrated Header Status Bar above canvas (no absolute overlap collisions) */}
      <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-200">
            Mô hình nguyên tử {element.vietnameseName} ({element.symbol})
          </span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Hạt nhân: <strong className="text-rose-400">{particleInfo.protons}p⁺</strong> + <strong className="text-slate-300">{particleInfo.neutrons}n⁰</strong> • Vỏ: <strong className="text-cyan-400">{particleInfo.electrons}e⁻</strong>
            {particleInfo.isChlorineSpecial && (
              <span className="ml-1 text-amber-300 font-sans text-[10px] bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">
                (Đồng vị ³⁵Cl: 18n; ³⁷Cl: 20n)
              </span>
            )}
            {particleInfo.isHydrogenZeroNeutron && (
              <span className="ml-1 text-cyan-300 font-sans text-[10px] bg-cyan-500/10 px-1 py-0.5 rounded border border-cyan-500/20">
                (¹H: 0n)
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium shrink-0">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>p⁺</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>n⁰</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>e⁻</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div 
        ref={mountRef} 
        className="w-full h-64 sm:h-72 md:h-80 relative touch-none select-none bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" 
      />

      {/* Electron Shell breakdown strip (Middle Overlay) */}
      {showShellDetails && (
        <div className="px-3.5 py-1.5 bg-slate-900/95 border-t border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px]">Phân bố electron ({element.electronsPerShell.length} lớp):</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {element.electronsPerShell.map((count, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveShellIndex(activeShellIndex === idx ? null : idx)}
                className={`px-2 py-0.5 rounded-md font-mono font-medium text-[11px] transition-all border cursor-pointer ${
                  idx === element.electronsPerShell.length - 1
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-sm'
                    : 'bg-slate-800 text-cyan-300 border-slate-700 hover:border-cyan-500/50'
                }`}
                title={`Lớp ${SHELL_NAMES[idx] || `Lớp ${idx+1}`}: chứa ${count} electron`}
              >
                {SHELL_NAMES[idx]?.split(' ')[0] || `Lớp ${idx+1}`}: <strong className="text-white">{count}e⁻</strong>
                {idx === element.electronsPerShell.length - 1 && (
                  <span className="ml-1 text-[9px] bg-amber-400/30 text-amber-200 px-1 rounded">ngoài cùng</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ergonomic 3D Control Dock */}
      <div className="p-2.5 sm:p-3 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-300 shrink-0">
        {/* Play/Pause and Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow transition active:scale-95 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Tạm dừng' : 'Chuyển động'}</span>
          </button>

          <button
            type="button"
            onClick={resetView}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title="Đặt lại góc nhìn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3D vs 2D Bohr Planar Toggle */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setModelMode('3d-spherical')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
              modelMode === '3d-spherical'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Orbit className="w-3 h-3" />
            <span>Mô hình 3D</span>
          </button>
          <button
            type="button"
            onClick={() => setModelMode('bohr-planar')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
              modelMode === 'bohr-planar'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Bohr Phẳng</span>
          </button>
        </div>

        {/* Orbit Speed Slider */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Tốc độ:</span>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={orbitSpeed}
            onChange={(e) => setOrbitSpeed(parseFloat(e.target.value))}
            className="w-16 sm:w-20 accent-cyan-400 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-cyan-300 w-7">{orbitSpeed}x</span>
        </div>
      </div>
    </div>
  );
};
