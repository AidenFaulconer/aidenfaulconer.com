import * as THREE from "three";
import {
  TextureLoader,
  WebGLRenderTarget,
  Object3D,
  Vector3,
  Camera,
  DirectionalLight,
  Raycaster,
  ArrowHelper,
} from "three";
import React, {
  useContext,
  Suspense,
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  Canvas,
  useFrame,
  useThree,
  useLoader,
  Renderer,
  extend,
} from "react-three-fiber";
import { Physics, usePlane, useSphere, useBox, useCylinder } from "use-cannon";
import Post from "./three-post-processing.js";
import SimplexNoise from "simplex-noise";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GlobalStore } from "../../layout/layout.js";

export const Mouse = () => {
  const viewportOffset = 2;
  const { viewport } = useThree();
  const position = [-viewport.width, -viewport.height, 8.7];
  const dimensions = [6, 6, 6, 6];
  const [_, api] = useBox((index) => ({
    type: "Kinematic",
    args: dimensions,
    position,
  }));
  useFrame((state) => {
    if (state.mouse.x === 0) return;
    api.position.set(
      (state.mouse.x * viewport.width) / 2,
      (state.mouse.y * viewport.height) / 2,
      8
    );
  });
  return (
    <instancedMesh>
      <sphereBufferGeometry
        attatch="geometry"
        args={dimensions}
        position={position}
      />
      <meshStandardMaterial flatShading attatch="material" color="black" />
    </instancedMesh>
  );
};

// A physical plane without visual representation
export const Plane = ({ color, ...props }) => {
  const { viewport } = useThree();
  const [ref] = usePlane(() => ({ ...props }));
  return (
    <mesh /**receiveShadow*/ ref={ref} {...props}>
      <planeBufferGeometry
        attatch="geometry"
        args={[viewport.width * 2, viewport.width * 2, viewport.height * 2]}
      />
      <meshBasicMaterial attatch="material" opacity={0.25} color="white" />
    </mesh>
  );
};

// Creates a crate that catches the spheres
export const Borders = ({ theme }) => {
  const { viewport } = useThree();
  return (
    <>
      <Plane
        position={[0, -viewport.height / 2 + 3.45, -150]} // ground
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Plane
        position={[-viewport.width / 2, 0, 0]} // left
        rotation={[0, Math.PI / 2, 0]}
      />
      <Plane
        position={[viewport.width / 2, 0, 0]} // right
        rotation={[0, -Math.PI / 2, 0]}
      />
      <Plane position={[0, 0, 7]} rotation={[0, 0, 0]} /** back */ />
      <Plane position={[0, 0, 11.5]} rotation={[0, -Math.PI, 0]} /** front */ />
    </>
  );
};

//https://discourse.threejs.org/t/how-to-change-texture-color-per-object-instance-in-instancedmesh/11271/3

export const deg2rad = (deg) => deg * (Math.PI / 180);

extend({ OrbitControls });

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
    viewport,
  } = useThree();
  const controls = useRef();
  const { isMobile } = useContext(GlobalStore);
  useEffect(() => {
    let orbitControls = controls.current;
    orbitControls.target = new Vector3(0, 0, 0); //set to center of shifting column construct
    isMobile && orbitControls.dispose();
    orbitControls.maxDistance = 25;
    orbitControls.autoRotate = true;
    orbitControls.maxZoom = 3;
    orbitControls.enableZoom = false;
    orbitControls.autoRotateSpeed = 0.5;
    orbitControls.maxPolarAngle = 0;
    orbitControls.enablePan = false;
    orbitControls.touches = THREE.TOUCH.TWO;
  }, []);
  useFrame((state) => {
    let orbitControls = controls.current;
    orbitControls.update();
  });
  return <orbitControls ref={controls} args={[camera, domElement]} />;
};

//configure location of shifting columns and the camera looking at it
export const cubeSize = 1;
export const viewPortOffset = 1.25;
export const columnDepth = 8 / viewPortOffset;
export const scale = columnDepth * cubeSize;
//

function MovingColumns({ theme, isMobile }) {
  const { clock, camera, viewport, scene } = useThree();
  const instancedColumns = useRef();
  const noiseSpeed = 7;

  //create position data and instance of noise
  //no dependencies, so only one instance is ever made (thanks useMemo)
  const noise = useMemo(() => new SimplexNoise(Math.random()), []); //only instance once, hence use of usememo
  const dummyObj = useMemo(() => new Object3D(), []); //used to generate a matrix we can use based on the ref'ed blueprint of the object
  const raycast = useMemo(() => new Raycaster(), []); //used to generate a matrix we can use based on the ref'ed blueprint of the object
  const generatedGrid = useMemo(() => {
    let result = []; //vec3 array
    for (let x = 0; x < scale; x += cubeSize)
      for (let z = 0; z < scale; z += cubeSize)
        result.push({ position: [x, z, z] });
    return result;
  }, []);

  useFrame((state) => {
    //generate grid and position them according to noise
    const meshRef = instancedColumns.current;

    generatedGrid.forEach((data, i) => {
      const t = clock.elapsedTime / noiseSpeed;
      const { position } = data; //get prefitted positions on the grid
      dummyObj.position.set(
        position[0],
        noise.noise2D(position[1] + t, position[0] + t) * 0.5,
        position[2]
      );
      dummyObj.updateMatrix();
      //place created objects in instancedMesh for the class to manage them
      meshRef.setColorAt(i, new THREE.Color().setHex("0xffffff"));
      meshRef.setMatrixAt(i, dummyObj.matrix);
    });

    meshRef.instanceMatrix.needsUpdate = true; //force update of matrix
    meshRef.instanceColor.needsUpdate = true;

    // if (state.mouse.x === 0) return;
    // let coords = {
    //   x: (state.mouse.x * viewport.width) / 5,
    //   y: (state.mouse.y * viewport.height) / 2
    // };
    // castRay(coords);
  }, 1 /**number 1 render priority */);

  const castRay = (mouse) => {
    //remove old ray, add new one
    // scene.remove(debugRay);
    raycast.setFromCamera(mouse, camera);
    // scene.add(new ArrowHelper([0,0,0],))

    let targetMesh = instancedColumns.current;
    let intersection = raycast.intersectObject(targetMesh);
    if (intersection.length === 0) return;
    //return the instancedObjectId we are intersecting
    let hitId = intersection[0].instanceId;
    targetMesh.setColorAt(
      hitId,
      new THREE.Color().setHex(theme.colors.primary)
    );
    targetMesh.instanceColor.needsUpdate = true;
  };

  return (
    <group position={[-scale / 2, 7.5, -scale / 2]}>
      <instancedMesh
        ref={instancedColumns}
        castShadow
        receiveShadow
        matrixAutoUpdate={false} /**matrix is manually updated in frame loop */
        args={[null, null, generatedGrid.length]}
      >
        <boxBufferGeometry
          /**we are consistently mapping position data, dont dispose objects
           * once a frame finishes*/
          dispose={false} //do not dispose of geometry, saves a massive amount of memory allocation and garbage collection each frame
          args={[cubeSize, cubeSize * 1.5, cubeSize, 1]}
          attatch="geometry"
        />
        <meshBasicMaterial
          color={theme.colors.foreground}
          transparent={false}
          opacity="1"
          toneMapped={false}
          attatch="material"
        />
      </instancedMesh>
    </group>
  );
}

function Box({ position, color }) {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.01));

  return (
    <mesh position={position} ref={ref}>
      <boxBufferGeometry args={[1, 1, 1]} attach="geometry" />
      <meshPhongMaterial color={color} attach="material" />
    </mesh>
  );
}

export default ({ theme, isMobile }) => {
  const { viewport } = useThree();
  return (
    <Canvas
      resize={{ scroll: false }} //dont update canvas on user scroll
      concurrent
      shadowMap
      pixelRatio={typeof window !== "undefined" && window.devicePixelRatioo}
      gl={{ alpha: true, antialias: true }}
      camera={{
        fov: 50,
        near: 1,
        far: 20,
      }}
    >
      <color attach="background" color={theme.colors.foreground} />
      <CameraControls />
      <directionalLight
        castShadow //post will create shadows (ambient occulision)
        position={[0, 10, 0]}
        scale={[1, 1, 1]}
        color={theme.colors.textSecondary}
        intensity={20}
      />
      <Suspense fallback={null}>
        <group position={[0, -6, 0]}>
          <MovingColumns isMobile={isMobile} theme={theme} />
          <instancedMesh>
            <planeBufferGeometry
              position={[16, 0, 16]}
              attatch="geometry"
              args={[16, 16, 16]}
            />
            <meshBasicMaterial
              attatch="material"
              toneMapped={false}
              transparent={false}
              color={theme.colors.foreground}
            />
          </instancedMesh>
        </group>
        <Post theme={theme} />
      </Suspense>
    </Canvas>
  );
};
