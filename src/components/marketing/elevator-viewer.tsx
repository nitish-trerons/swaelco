"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Box, Cpu, GaugeCircle, MoonStar, Pause, Play, ShieldAlert, Sparkles, Sun, Wrench } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group, Mesh, PointLight } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FLOOR_COUNT = 4;
const FLOOR_IDS = Array.from({ length: FLOOR_COUNT }, (_, index) => index);
const FLOOR_LABELS = ["G", "F1", "F2", "F3"] as const;
const SHAFT_MIN_Y = -2.25;
const SHAFT_MAX_Y = 2.35;

const MODE_CONFIG = {
  passenger: {
    label: "Passenger Flow",
    description: "Simulates normal daily traffic with predictable floor dispatch.",
    icon: GaugeCircle,
    accent: "text-blue-300",
  },
  emergency: {
    label: "Emergency Recall",
    description: "Returns to safe floor and keeps doors open for evacuation control.",
    icon: ShieldAlert,
    accent: "text-rose-300",
  },
  maintenance: {
    label: "Maintenance",
    description: "Reduced-speed movement for inspection and technician safety checks.",
    icon: Wrench,
    accent: "text-blue-200",
  },
} as const;

type ViewMode = keyof typeof MODE_CONFIG;

type PartKey = "car" | "doors" | "control-panel" | "counterweight" | "machine-room" | "pit";

const PART_INFO: Record<PartKey, string> = {
  car: "Elevator car with low-vibration cabin design for passenger comfort.",
  doors: "Bi-parting doors with obstacle sensing and controlled close timing.",
  "control-panel": "Controller dispatches travel and logs faults for maintenance teams.",
  counterweight: "Counterweight balances load and improves power efficiency during travel.",
  "machine-room": "Drive unit and braking assembly with monitoring instrumentation.",
  pit: "Pit zone includes buffers and bottom-travel safety protection.",
};

function toY(floor: number) {
  if (FLOOR_COUNT <= 1) {
    return SHAFT_MIN_Y;
  }
  return SHAFT_MIN_Y + (floor * (SHAFT_MAX_Y - SHAFT_MIN_Y)) / (FLOOR_COUNT - 1);
}

function floorLabel(floor: number) {
  return FLOOR_LABELS[floor] ?? `F${floor}`;
}

type OrbitControlsWithAuto = OrbitControls & {
  autoRotate: boolean;
  autoRotateSpeed: number;
};

function Controls() {
  const { camera, gl } = useThree();

  const controls = useMemo(() => {
    const orbit = new OrbitControls(camera, gl.domElement) as OrbitControlsWithAuto;
    orbit.enablePan = false;
    orbit.minDistance = 5.2;
    orbit.maxDistance = 14.5;
    orbit.maxPolarAngle = Math.PI / 2.02;
    orbit.target.set(0, 0.2, 0);
    orbit.autoRotate = true;
    orbit.autoRotateSpeed = 0.55;
    return orbit;
  }, [camera, gl.domElement]);

  useFrame(() => controls.update());

  useEffect(() => {
    return () => controls.dispose();
  }, [controls]);

  return null;
}

function ElevatorModel({
  selectedFloor,
  doorOpen,
  highlightedPart,
  mode,
}: {
  selectedFloor: number;
  doorOpen: number;
  highlightedPart: PartKey;
  mode: ViewMode;
}) {
  const carRef = useRef<Group>(null);
  const counterweightRef = useRef<Group>(null);
  const leftDoorRef = useRef<Mesh>(null);
  const rightDoorRef = useRef<Mesh>(null);
  const cabinLightRef = useRef<PointLight>(null);

  const targetY = toY(selectedFloor);
  const emergency = mode === "emergency";
  const maintenance = mode === "maintenance";

  useFrame((state) => {
    const delta = state.clock.getDelta();

    if (carRef.current) {
      const smoothing = maintenance ? 0.05 : 0.09;
      carRef.current.position.y += (targetY - carRef.current.position.y) * smoothing;
    }

    if (counterweightRef.current && carRef.current) {
      counterweightRef.current.position.y = -carRef.current.position.y * 0.82;
    }

    const doorTravel = 0.24 * doorOpen;
    if (leftDoorRef.current) {
      leftDoorRef.current.position.x += (-doorTravel - leftDoorRef.current.position.x) * 0.16;
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x += (doorTravel - rightDoorRef.current.position.x) * 0.16;
    }

    if (cabinLightRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.3) * 0.12;
      const base = emergency ? 1.25 : maintenance ? 0.85 : 1.05;
      cabinLightRef.current.intensity += (base * pulse - cabinLightRef.current.intensity) * Math.min(1, delta * 8);
      cabinLightRef.current.color.set(emergency ? "#fb7185" : "#60a5fa");
    }
  });

  const partGlow = (part: PartKey) => (highlightedPart === part ? "#3b82f6" : "#334155");

  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.6, 6.5, 1.8]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.23} wireframe />
      </mesh>

      <mesh position={[-0.74, 0.2, -0.56]}>
        <boxGeometry args={[0.08, 6.3, 0.08]} />
        <meshStandardMaterial color="#64748b" metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[0.74, 0.2, -0.56]}>
        <boxGeometry args={[0.08, 6.3, 0.08]} />
        <meshStandardMaterial color="#64748b" metalness={0.45} roughness={0.35} />
      </mesh>

      {FLOOR_IDS.map((floor: number) => {
        const levelY = toY(floor) - 0.32;
        const active = floor === selectedFloor;

        return (
          <group key={floor}>
            <mesh position={[0, levelY, 0]}>
              <boxGeometry args={[2.35, 0.06, 1.45]} />
              <meshStandardMaterial color={active ? "#3b82f6" : "#334155"} emissive={active ? "#1e3a8a" : "#020617"} />
            </mesh>

            <mesh position={[1.1, levelY + 0.22, 0.56]}>
              <boxGeometry args={[0.08, 0.18, 0.04]} />
              <meshStandardMaterial color={active ? "#f8fafc" : "#475569"} emissive={active ? "#2563eb" : "#020617"} />
            </mesh>
          </group>
        );
      })}

      <group ref={counterweightRef} position={[-0.95, 0, -0.25]}>
        <mesh>
          <boxGeometry args={[0.38, 1.25, 0.38]} />
          <meshStandardMaterial color={partGlow("counterweight")} metalness={0.35} roughness={0.4} />
        </mesh>
      </group>

      <group ref={carRef} position={[0, toY(0), 0]}>
        <mesh>
          <boxGeometry args={[1.54, 0.7, 1.15]} />
          <meshStandardMaterial color={partGlow("car")} metalness={0.45} roughness={0.3} />
        </mesh>

        <mesh position={[0, 0.02, -0.58]}>
          <boxGeometry args={[1.12, 0.56, 0.04]} />
          <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.45} />
        </mesh>

        <mesh ref={leftDoorRef} position={[-0.001, 0.02, 0.58]}>
          <boxGeometry args={[0.52, 0.56, 0.04]} />
          <meshStandardMaterial color={partGlow("doors")} metalness={0.35} roughness={0.28} />
        </mesh>
        <mesh ref={rightDoorRef} position={[0.001, 0.02, 0.58]}>
          <boxGeometry args={[0.52, 0.56, 0.04]} />
          <meshStandardMaterial color={partGlow("doors")} metalness={0.35} roughness={0.28} />
        </mesh>

        <mesh position={[0.73, 0.12, 0.32]}>
          <boxGeometry args={[0.07, 0.25, 0.05]} />
          <meshStandardMaterial color={partGlow("control-panel")} emissive="#172554" />
        </mesh>

        <pointLight ref={cabinLightRef} position={[0, 0.18, 0]} color="#60a5fa" intensity={1} distance={2.8} />
      </group>

      <mesh position={[0, 3.44, 0]}>
        <boxGeometry args={[1.92, 0.42, 1.2]} />
        <meshStandardMaterial color={partGlow("machine-room")} metalness={0.35} roughness={0.4} />
      </mesh>

      <mesh position={[0, -3.1, 0]}>
        <boxGeometry args={[1.92, 0.32, 1.2]} />
        <meshStandardMaterial color={partGlow("pit")} metalness={0.25} roughness={0.5} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.25, 0]}>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
    </group>
  );
}

export default function ElevatorViewer() {
  const [selectedFloor, setSelectedFloor] = useState(Math.floor(FLOOR_COUNT / 2));
  const [selectedPart, setSelectedPart] = useState<PartKey>("car");
  const [mode, setMode] = useState<ViewMode>("passenger");
  const [autoDemo, setAutoDemo] = useState(true);
  const [doorOpen, setDoorOpen] = useState(0);
  const [lowPerfMode, setLowPerfMode] = useState(false);
  const [lowPerfRecommended, setLowPerfRecommended] = useState(false);
  const [lightView, setLightView] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowCpu = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
    const shouldUsePerf = reducedMotion || (!!deviceMemory && deviceMemory <= 4) || lowCpu;
    setLowPerfRecommended(shouldUsePerf);
    setLowPerfMode(shouldUsePerf);
    if (shouldUsePerf) {
      setAutoDemo(false);
    }
  }, []);

  useEffect(() => {
    setDoorOpen(0);
    const timeout = setTimeout(() => {
      setDoorOpen(mode === "emergency" ? 1 : 0.78);
    }, 520);

    return () => clearTimeout(timeout);
  }, [selectedFloor, mode]);

  useEffect(() => {
    if (!autoDemo || mode !== "passenger") {
      return;
    }

    const interval = setInterval(() => {
      setSelectedFloor((current: number) => (current + 1) % FLOOR_COUNT);
    }, 2500);

    return () => clearInterval(interval);
  }, [autoDemo, mode]);

  useEffect(() => {
    if (mode === "emergency") {
      setAutoDemo(false);
      setSelectedFloor(0);
      setDoorOpen(1);
    }

    if (mode === "maintenance") {
      setAutoDemo(false);
    }
  }, [mode]);

  const activeMode = MODE_CONFIG[mode];
  const activePartLabel = selectedPart.replace("-", " ");

  return (
    <Card className="overflow-hidden border-blue-300/20 bg-slate-900/85">
      <CardContent className="space-y-4 p-4 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Interactive System Explorer</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-100">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-blue-300/40 bg-blue-500/10">
                <Box className="h-3.5 w-3.5 text-blue-300" />
              </span>
              3D Elevator Digital Walkthrough
            </p>
          </div>
          <div className="relative z-20 grid w-full grid-cols-3 gap-2 sm:w-auto">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-full border-slate-700 bg-transparent text-slate-100 active:scale-[0.98] sm:w-10"
              onClick={() => setAutoDemo((current: boolean) => !current)}
              disabled={mode !== "passenger"}
              aria-label={autoDemo ? "Pause auto demo" : "Start auto demo"}
              title={autoDemo ? "Pause auto demo" : "Start auto demo"}
            >
              {autoDemo ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-full border-slate-700 bg-transparent text-slate-100 active:scale-[0.98] sm:w-10"
              onClick={() =>
                setLowPerfMode((prev: boolean) => {
                  const next = !prev;
                  if (!next && mode === "passenger") {
                    setAutoDemo(true);
                  }
                  return next;
                })
              }
              aria-label={lowPerfMode ? "Switch to full 3D mode" : "Switch to performance mode"}
              title={lowPerfMode ? "Switch to full 3D mode" : "Switch to performance mode"}
            >
              {lowPerfMode ? <Cpu className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-full border-slate-700 bg-transparent text-slate-100 active:scale-[0.98] sm:w-10"
              onClick={() => setLightView((prev: boolean) => !prev)}
              aria-label={lightView ? "Switch to dark view" : "Switch to light view"}
              title={lightView ? "Switch to dark view" : "Switch to light view"}
            >
              {lightView ? <MoonStar className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {lowPerfRecommended && lowPerfMode ? (
          <p className="text-xs text-slate-400">Perf mode is auto-enabled based on your device settings.</p>
        ) : null}

        <div className="flex flex-col gap-4 lg:flex-row">
          <div
            className={cn(
              "relative h-[300px] w-full overflow-hidden rounded-lg border sm:h-[360px] md:h-[420px] lg:w-[76%]",
              lightView ? "border-blue-300 bg-blue-50" : "border-slate-700 bg-slate-950",
            )}
          >
            <Canvas
              dpr={lowPerfMode ? [1, 1] : [1, 2]}
              gl={{ antialias: !lowPerfMode, powerPreference: lowPerfMode ? "low-power" : "high-performance" }}
              camera={{ position: [7.6, 3.4, 7.6], fov: 36 }}
            >
              <color attach="background" args={[lightView ? "#dff3ff" : "#020617"]} />
              {!lowPerfMode ? (
                <fog
                  attach="fog"
                  args={[lightView ? "#f0f9ff" : "#020617", lightView ? 10 : 6, lightView ? 20 : 16]}
                />
              ) : null}
              <ambientLight intensity={lightView ? (lowPerfMode ? 0.8 : 0.92) : lowPerfMode ? 0.48 : 0.55} />
              {!lowPerfMode ? (
                <spotLight
                  position={[4, 6, 4]}
                  angle={0.45}
                  intensity={lightView ? 0.95 : 1.1}
                  penumbra={0.4}
                  color={lightView ? "#fecaca" : "#ffffff"}
                />
              ) : null}
              <pointLight
                position={[-4, 1, -1]}
                intensity={lightView ? (lowPerfMode ? 0.62 : 0.78) : lowPerfMode ? 0.42 : 0.55}
                color={lightView ? "#38bdf8" : "#60a5fa"}
              />
              <ElevatorModel
                selectedFloor={selectedFloor}
                doorOpen={doorOpen}
                highlightedPart={selectedPart}
                mode={mode}
              />
              <Controls />
            </Canvas>

            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-2 sm:p-3">
              <div
                className={cn(
                  "pointer-events-auto rounded-full border px-2 py-1 text-[10px] sm:px-3 sm:text-xs",
                  lightView
                    ? "border-blue-300 bg-white/90 text-slate-700"
                    : "border-slate-600 bg-slate-900/85 text-slate-200",
                )}
              >
                Floor {floorLabel(selectedFloor)}
              </div>
              <div
                className={cn(
                  "pointer-events-auto rounded-full border px-2 py-1 text-[10px] sm:px-3 sm:text-xs",
                  lightView
                    ? "border-blue-300 bg-white/90 text-slate-700"
                    : "border-slate-600 bg-slate-900/85 text-slate-200",
                )}
              >
                Doors {doorOpen > 0.7 ? "Open" : "Moving"}
              </div>
            </div>

            <div className="pointer-events-none absolute left-3 top-12 hidden gap-2 sm:grid">
              {(["car", "doors", "control-panel", "counterweight", "machine-room", "pit"] as PartKey[]).map(
                (part: PartKey) => (
                  <button
                    key={part}
                    type="button"
                    className={cn(
                      "pointer-events-auto rounded-full border px-2 py-1 text-xs capitalize",
                      selectedPart === part
                        ? lightView
                          ? "border-blue-400 bg-blue-100 text-blue-900"
                          : "border-blue-300 bg-blue-500/20 text-blue-100"
                        : lightView
                          ? "border-slate-300 bg-white/90 text-slate-700"
                          : "border-slate-600 bg-slate-900/80 text-slate-300",
                    )}
                    onMouseEnter={() => setSelectedPart(part)}
                    onFocus={() => setSelectedPart(part)}
                  >
                    {part.replace("-", " ")}
                  </button>
                ),
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-2 sm:hidden">
              <div
                className={cn(
                  "flex gap-1.5 overflow-x-auto rounded-md border p-1.5",
                  lightView ? "border-slate-300/80 bg-white/90" : "border-slate-700/80 bg-slate-900/80",
                )}
              >
                {(["car", "doors", "control-panel", "counterweight", "machine-room", "pit"] as PartKey[]).map(
                  (part: PartKey) => (
                    <button
                      key={part}
                      type="button"
                      className={cn(
                        "shrink-0 rounded-full border px-2 py-1 text-[10px] capitalize",
                        selectedPart === part
                          ? lightView
                            ? "border-blue-400 bg-blue-100 text-blue-900"
                            : "border-blue-300 bg-blue-500/20 text-blue-100"
                          : lightView
                            ? "border-slate-300 bg-white/90 text-slate-700"
                            : "border-slate-600 bg-slate-900/80 text-slate-300",
                      )}
                      onClick={() => setSelectedPart(part)}
                    >
                      {part.replace("-", " ")}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="w-full space-y-3 rounded-lg border border-slate-700 bg-slate-950/75 p-3 lg:min-w-[250px] lg:w-[24%]">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Mode</p>
              <div className="mt-2 grid grid-cols-1 gap-1.5">
                {(Object.entries(MODE_CONFIG) as Array<[ViewMode, (typeof MODE_CONFIG)[ViewMode]]>).map(
                  ([modeKey, config]) => (
                    <button
                      key={modeKey}
                      type="button"
                      className={cn(
                        "rounded-md border px-2.5 py-1.5 text-left text-xs",
                        mode === modeKey
                          ? "border-blue-300 bg-blue-500/15 text-blue-100"
                          : "border-slate-700 text-slate-300",
                      )}
                      onClick={() => setMode(modeKey)}
                    >
                      <span className={cn("flex items-center gap-2 font-semibold", config.accent)}>
                        <config.icon className="h-4 w-4" /> {config.label}
                      </span>
                    </button>
                  ),
                )}
              </div>
              <p className="mt-2 text-[11px] text-slate-300">
                <span className={cn("font-semibold", activeMode.accent)}>{activeMode.label}:</span>{" "}
                {activeMode.description}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Target Floor</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[...FLOOR_IDS].reverse().map((floor: number) => (
                  <button
                    key={floor}
                    type="button"
                    className={cn(
                      "h-10 rounded-md border px-2 text-sm font-medium",
                      selectedFloor === floor
                        ? "border-red-300 bg-red-500/20 text-red-100"
                        : "border-slate-700 text-slate-300",
                    )}
                    onClick={() => setSelectedFloor(floor)}
                    aria-label={`Set floor ${floorLabel(floor)}`}
                    aria-pressed={selectedFloor === floor}
                  >
                    {floorLabel(floor)}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-300">
              <span className="font-semibold capitalize text-slate-200">{activePartLabel}:</span>{" "}
              {PART_INFO[selectedPart]}
            </p>

          </div>
        </div>
      </CardContent>
    </Card>
  );
}
