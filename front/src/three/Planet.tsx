import { useEffect, useRef } from 'react';
import {
  AmbientLight, Color, DirectionalLight, IcosahedronGeometry, Mesh, MeshStandardMaterial,
  PerspectiveCamera, PointLight, Scene, WebGLRenderer,
} from 'three';

// --- процедурный шум (value noise + fbm), без внешних ассетов ---
const hash = (x: number, y: number, z: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
};
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function vnoise(x: number, y: number, z: number): number {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = smooth(x - ix), fy = smooth(y - iy), fz = smooth(z - iz);
  const c = (dx: number, dy: number, dz: number) => hash(ix + dx, iy + dy, iz + dz);
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), fx), lerp(c(0, 1, 0), c(1, 1, 0), fx), fy),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), fx), lerp(c(0, 1, 1), c(1, 1, 1), fx), fy),
    fz,
  );
}
const fbm = (x: number, y: number, z: number) =>
  vnoise(x, y, z) * 0.6 + vnoise(x * 2.1, y * 2.1, z * 2.1) * 0.28 + vnoise(x * 4.3, y * 4.3, z * 4.3) * 0.12;

function buildGeometry(): IcosahedronGeometry {
  const geo = new IcosahedronGeometry(1, 18);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const len = Math.hypot(x, y, z) || 1;
    const r = 0.82 + fbm(x * 1.6 + 5, y * 1.6 + 5, z * 1.6 + 5) * 0.55; // «смятая» сфера
    pos.setXYZ(i, (x / len) * r, (y / len) * r, (z / len) * r);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

export default function Planet({ onFail }: { onFail: () => void }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      onFail();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.z = 3.8;

    const geo = buildGeometry();
    const mat = new MeshStandardMaterial({ color: new Color('#6f84a3'), roughness: 0.75, metalness: 0.15, flatShading: true });
    const mesh = new Mesh(geo, mat);
    scene.add(mesh);

    scene.add(new AmbientLight('#8fa3c4', 0.55));
    const key = new DirectionalLight('#dbe7ff', 2.2);
    key.position.set(3, 2, 4);
    scene.add(key);
    const rim = new PointLight('#9CCC34', 12, 12); // слабая акцентная подсветка с края
    rim.position.set(-3, -1.5, -1.5);
    scene.add(rim);

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0;
    let spin = 0;
    const tick = () => {
      spin += 0.0018;
      mesh.rotation.y = spin + target.x * 0.5;
      mesh.rotation.x += (target.y * 0.4 - mesh.rotation.x) * 0.05;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onFail]);

  return <div ref={host} className="planet" aria-hidden="true" />;
}
