// components/Avatar.js
import React, { useState, useMemo, useEffect ,useRef } from 'react';
import { useGLTF, useTexture, useFBX, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MeshStandardMaterial, MeshPhysicalMaterial, Vector2, LineBasicMaterial } from 'three';
import { LinearEncoding, sRGBEncoding } from 'three/src/constants';
import * as THREE from 'three';
import axios from 'axios';
import _ from 'lodash';

import createAnimation from '../converter';
import blinkData from '../blendDataBlink.json';

const host = 'http://localhost:5000';

export function makeSpeech(text) {
  return axios.post(host + '/talk', { text });
}

export function Avatar({ avatar_url, speak, setSpeak, text,setText,setAudioSource, playing,animation }) {
  let gltf = useGLTF(avatar_url);
  const group = useRef();
  const { animations: typingAnimation } = useFBX("animations/Typing.fbx");
  const { animations: standingAnimation } = useFBX("animations/Standing Idle.fbx");
  const { animations: fallingAnimation } = useFBX("animations/Falling Idle.fbx");

    // Naming animations for easy access
    typingAnimation[0].name = "Typing";
    standingAnimation[0].name = "Standing";
    fallingAnimation[0].name = "Falling";

    const { actions } = useAnimations(
      [typingAnimation[0], standingAnimation[0], fallingAnimation[0]],
      group
    );

    
  let morphTargetDictionaryBody = null;
  let morphTargetDictionaryLowerTeeth = null;
  let morphTargetDictionaryEyeLeft = null;
  let morphTargetDictionaryEyeRight = null;

  // Load all textures
  const [ 
    bodyTexture, 
    eyesTexture, 
    teethTexture, 
    bodySpecularTexture, 
    bodyRoughnessTexture, 
    bodyNormalTexture,
    teethNormalTexture,
    tshirtDiffuseTexture,
    tshirtNormalTexture,
    tshirtRoughnessTexture,
    // FlannelDiffuseTexture,
    // FlannelNormalTexture,
    // FlannelRoughnessTexture,
    hairTexture,
    hairAlphaTexture,
    hairNormalTexture,
    hairRoughnessTexture,
  ] = useTexture([


    // "/tex2/body.webp",
    // "/tex2/eyes.webp",
    // "/tex2/teeth_diffuse.webp",
    // "/tex2/body_specular.webp",
    // "/tex2/body_roughness.webp",
    // "/tex2/body_normal.webp",
    // "/tex2/teeth_normal.webp",
    // "/tex2/h_color.webp",
    // "/tex2/tshirt_diffuse.webp",
    // "/tex2/tshirt_normal.webp",
    // "/tex2/tshirt_roughness.webp",
     
    "/tex2/body_base color.webp",
    "/tex2/eyes_base color.webp",
    "/images/teeth_diffuse.webp",
    "/tex2/body_specular.webp",
    "/tex2/body_roughness.webp",
    "/tex2/body_normal.webp",
    "/tex2/lower_teeth_normal.webp",
    "/tex2/HG_TSHIRT_Male.002_base color.webp",
    "/tex2/HG_TSHIRT_Male.002_normal.webp",
    "/tex2/HG_TSHIRT_Male.002_roughness.webp",
    // "/tex2/HG_Flannel.002_base color.webp",
    // "/tex2/HG_Flannel.002_normal.webp",
    // "/tex2/HG_Flannel.002_roughness.webp",
    "/images/h_color.webp",
    "/images/h_alpha.webp",
    "/images/h_normal.webp",
    "/images/h_roughness.webp",
  ]);

  // Configure texture encodings
  _.each([
    bodyTexture, 
    eyesTexture, 
    teethTexture, 
    teethNormalTexture, 
    bodySpecularTexture, 
    bodyRoughnessTexture, 
    bodyNormalTexture, 
    tshirtDiffuseTexture, 
    tshirtNormalTexture, 
    tshirtRoughnessTexture,
    // FlannelDiffuseTexture,
    // FlannelNormalTexture,
    // FlannelRoughnessTexture,
    hairTexture,
    hairAlphaTexture,
    hairNormalTexture,
    hairRoughnessTexture
  ], t => {
    t.encoding = sRGBEncoding;
    t.flipY = false;
  });

  // Set specific encodings for normal maps
  bodyNormalTexture.encoding = LinearEncoding;
  tshirtNormalTexture.encoding = LinearEncoding;
  teethNormalTexture.encoding = LinearEncoding;
  hairNormalTexture.encoding = LinearEncoding;

  // Configure materials for each mesh
  gltf.scene.traverse(node => {
    if(node.type === 'Mesh' || node.type === 'LineSegments' || node.type === 'SkinnedMesh') {
      node.castShadow = true;
      node.receiveShadow = true;
      node.frustumCulled = false;

      // Body material
      if (node.name.includes("Wolf3D_Head")) {
        // node.material = new MeshPhysicalMaterial();
        // node.material.map = bodyTexture;
        // node.material.roughness = 1.7;
        // node.material.roughnessMap = bodyRoughnessTexture;
        // node.material.normalMap = bodyNormalTexture;
        // node.material.normalScale = new Vector2(0.6, 0.6);
        morphTargetDictionaryBody = node.morphTargetDictionary;
        node.material.envMapIntensity = 0.8;
      }

      // Eyes material
      if (node.name.includes("Eyes")) {
        node.material = new MeshStandardMaterial();
        node.material.map = eyesTexture;
        node.material.roughness = 0.1;
        node.material.envMapIntensity = 0.5;
      }

      // Eyebrows material
      if (node.name.includes("Brows")) {
        node.material = new LineBasicMaterial({color: 0x000000});
        node.material.linewidth = 1;
        node.material.opacity = 0.5;
        node.material.transparent = true;
        node.visible = false;
      }

      // Teeth material
      if (node.name.includes("Teeth")) {
        node.material = new MeshStandardMaterial();
        node.material.roughness = 0.1;
        node.material.map = teethTexture;
        node.material.normalMap = teethNormalTexture;
        node.material.envMapIntensity = 0.7;
      }

      // Hair material
      if (node.name.includes("Wolf3D_Hair")) {
        node.material = new MeshStandardMaterial();
        // node.material.map = hairTexture;
        // node.material.alphaMap = hairAlphaTexture;
        // node.material.normalMap = hairNormalTexture;
        // node.material.roughnessMap = hairRoughnessTexture;
        node.material.transparent = true;
        node.material.depthWrite = false;
        node.material.side = 2;
        node.material.color.setHex(0x000000);
        node.material.envMapIntensity = 0.3;
      }

      // T-shirt material
      if (node.name.includes("TSHIRT")) {
        node.material = new MeshStandardMaterial();
        node.material.map = tshirtDiffuseTexture;
        node.material.roughnessMap = tshirtRoughnessTexture;
        node.material.normalMap = tshirtNormalTexture;
        node.material.color.setHex(0xffffff);
        node.material.envMapIntensity = 0.5;
      }

    //   if(node.name.includes("Flannel")) {
    //     node.material = new MeshStandardMaterial();
    //     node.material.map = FlannelDiffuseTexture;
    //     node.material.roughnessMap = FlannelRoughnessTexture;
    //     node.material.normalMap = FlannelNormalTexture;
    //     node.material.color.setHex(0xffffff);
    //     node.material.envMapIntensity = 0.5;
    //     }


      if (node.name.includes("Wolf3D_Teeth")) {
        morphTargetDictionaryLowerTeeth = node.morphTargetDictionary;
      }
      if (node.name.includes("EyeLeft")) {
        morphTargetDictionaryEyeLeft = node.morphTargetDictionary;
      }
      if (node.name.includes("EyeRight")) {
        morphTargetDictionaryEyeRight = node.morphTargetDictionary;
      }

    }
  });

  const [clips, setClips] = useState([]);
  const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), []);
  const [talkClips, setTalkClips] = useState(null);

   // Load the talk animation with useFBX
   const { animations: talkAnimation } = useFBX('/idle.fbx');
  
   // Store the loaded talk animation clips
   useEffect(() => {
     if (talkAnimation.length > 0) {
       setTalkClips(talkAnimation);
     }
   }, [talkAnimation]);
 

   // Handle speech animation
  useEffect(() => {
    if (!speak || !talkClips) return;

    // Trigger the talk animation when speech begins
    const talkClipAction = mixer.clipAction(talkClips[0]);
    talkClipAction.setLoop(THREE.LoopOnce).play();

    makeSpeech(text)
      .then(response => {
        let { blendData, filename ,geminiResponse } = response.data;
        setAudioSource(host + filename);
        setText(geminiResponse);

        // Play mouth and head animations based on blendData
        let newClips = [createAnimation(blendData, gltf.scene.getObjectByName('Wolf3D_Head').morphTargetDictionary, 'Wolf3D_Head')]
        ;
        newClips.forEach(clip => {
          let action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopOnce).play();

        });
      })
      .catch(err => {
        console.error(err);
        setSpeak(false);
      });
  }, [speak]);


  
  let idleFbx = useFBX('/animations/Standing Idle.fbx');
  let { clips: idleClips } = useAnimations(idleFbx.animations);

  // let idleFbx = useFBX('/animations/Standing Idle.fbx');
  // let { clips: idleClips } = useAnimations(idleFbx.animations);
  
  
  // // No filtering, track all animations
  // console.log("idleClips", idleClips);
  // console.log("idleClips[0].tracks", idleClips[0].tracks);
  
  idleClips[0].tracks = _.map(idleClips[0].tracks, track => {
    if (track.name.includes("Head")) {
      track.name = "head.quaternion";
    }
    return track;
  });

  useEffect(() => {
    if (mixer && idleClips.length > 0) {
      const idleClipAction = mixer.clipAction(idleClips[0]);
      idleClipAction.setLoop(THREE.LoopRepeat, Infinity);  // Ensure it repeats indefinitely
      idleClipAction.play();
    }
  }, [mixer, idleClips]);
  

  // Initialize idle and blink animations
  useEffect(() => {
    let blinkClip = createAnimation(blinkData, morphTargetDictionaryBody, 'Wolf3D_Head', true);
    let blinkAction = mixer.clipAction(blinkClip);
    blinkAction.play();
  }, []);

  useFrame((state, delta) => {
    mixer.update(delta);
  });
  
  // Handle speech animation playback
  useEffect(() => {
    if (playing === false) return;
    
    _.each(clips, clip => {
      let clipAction = mixer.clipAction(clip);
      clipAction.setLoop(THREE.LoopOnce);
      clipAction.play();
    });
  }, [playing]);

 

  return (
    <group name="avatar">
      <primitive object={gltf.scene}
      position={[0, 0, -1]} 
      dispose={null} />
    </group>
  );
}