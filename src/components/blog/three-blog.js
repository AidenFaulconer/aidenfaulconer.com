import * as THREE from "three";
import { TextureLoader, WebGLRenderTarget, Object3D } from "three";
import React, { Suspense, useMemo, useState, useCallback, useRef } from "react";
import { Canvas, useFrame, useThree, useLoader } from "react-three-fiber";
import { Physics, usePlane, useSphere, useBox, useCylinder } from "use-cannon";
import { useTheme } from "emotion-theming";
import BackfaceMaterial from "../threejs/materials/backface";
import RefractionMaterial from "../threejs/materials/refraction";
import linesUrl from "../../../static/assets/circles.png";

export const Mouse = () => {
  const { viewport } = useThree();
  const [_, api] = useSphere(index => ({
    // type: "Kinematic",
    mass: 500,
    args: dimensions[0],
    position: [viewport.width / 2 + 3, viewport.height / 2, 10]
  }));
  const dimensions = [2, 32, 32];
  useFrame(state => {
    api.position.set(
      (state.mouse.x * viewport.width) / 2,
      (state.mouse.y * viewport.height) / 2,
      9
    );
  });
  return (
    <instancedMesh castShadow>
      <sphereBufferGeometry attatch="geometry" args={dimensions} />
      <meshStandardMaterial flatShading attatch="material" color="black" />
    </instancedMesh>
  );
};

// A physical plane without visual representation
export const Plane = ({ color, ...props }) => {
  const { viewport } = useThree();
  const [ref] = usePlane(() => ({ ...props }));
  return (
    <mesh receiveShadow ref={ref} {...props}>
      <planeBufferGeometry
        attatch="geometry"
        args={[viewport.width * 2, viewport.width * 2, viewport.height * 2]}
      />
      <meshPhysicalMaterial
        roughness={0}
        attatch="material"
        transparent
        opacity={color != null}
        color={color || color}
      />
    </mesh>
  );
};

// Creates a crate that catches the spheres
export const Borders = ({ theme }) => {
  const { viewport } = useThree();
  return (
    <>
      <Plane
        position={[0, -viewport.height / 2 + 1.6, -150]} // ground
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Plane
        position={[-viewport.width / 2 + 2, 0, 0]} // r
        rotation={[0, Math.PI / 2, 0]}
      />
      <Plane
        position={[viewport.width / 2 - 2, 0, 0]} // l
        rotation={[0, -Math.PI / 2, 0]}
      />
      <Plane position={[0, 0, 9]} rotation={[0, 0, 0]} /** back */ />
      <Plane position={[0, 0, 12]} rotation={[0, -Math.PI, 0]} /** front */ />
    </>
  );
};

export const InstancedBoxs = ({
  dims,
  choice,
  color = "black",
  count = 50
}) => {
  const { size, viewport, gl, scene, camera, clock } = useThree();

  const texture = useLoader(THREE.TextureLoader, linesUrl);
  texture.anisotropy = 15; // high res textures, no matter the distance

  const dimensions = dims;
  const viewportOffset = -16;
  // use react reference to generate the mesh
  const [ref] = useBox(index => {
    return {
      mass: 20,
      material: { friction: 0.09, restitution: 0.09 },
      args: dimensions, // with use sphere there isnt an array passed
      position: [index - Math.random() - viewport.width /2, viewport.height, 0]
      // onCollide: e => play(index, e.contact.impactVelocity),
    };
  });
  // alert(JSON.stringify(texture));
  return (
    <instancedMesh
      castShadows
      receiveShadows
      ref={ref}
      args={[null, null, count]}
    >
      <boxBufferGeometry attatch="geometry" args={dimensions} />
      <meshBasicMaterial
        flatShading
        attatch="material"
        color={color}
        map={texture}
        alphaMap={texture}
        transparent
        opacity={1}
        depthTest
        toneMapped={false}
      />
    </instancedMesh>
  );
};

// https://inspiring-wiles-b4ffe0.netlify.app/2-objects-and-properties
export default () => {
  const ref = useRef();
  const { viewport } = useThree();
  const theme = useTheme();

  return (
    <Canvas
      ref={ref}
      concurrent
      shadowMap
      pixelRatio={window.devicePixelRatio}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 20], fov: 50, near: 17, far: 40 }}
    >
      <ambientLight
        color={
          theme.name === "dark" ? theme.colors.primary : theme.colors.foreground
        }
        intensity={0.5}
      />
      <directionalLight
        position={[50, 150, 400]}
        angle={0.25}
        intensity={theme.name === "dark" ? 1 : 1}
        color={
          theme.name === "dark" ? theme.colors.primary : theme.colors.foreground
        }
        castShadow
        // shadow-bias={0.01}
        shadow-radius={10}
        shadow-mapSize-width={7000} // fidelity of shadow maps (higher is sharper)
        shadow-mapSize-height={7000}
        // move shadows to cameras perspective instead of light
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/**
       */}
      <Suspense fallback={null}>
        <Physics
          gravity={[0, -50, 0]}
          defaultContactMaterial={{ restitution: 0.6 }}
        >
          <group position={[0, 0, -10]}>
            <Mouse />
            <Borders theme={theme} />
            {/** right group */}

            {/** left group */}
            <InstancedBoxs
              color={theme.colors.primary}
              count={4}
              dims={[1.25, 1.25, 1.25]}
              choice="right"
            />
          </group>
        </Physics>
      </Suspense>
    </Canvas>
  );
};
