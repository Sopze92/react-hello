import React from "react";

/**
 *  By some reason I decided to use ghetto's slang on this one
 *  I spent most of the time on the 3D things, not hard but tedious, ended up caming with some reusable components, so no problem xd
 *  also wanted to make some UI with different features just to practice and get used to React, I guess that's the purpose of all this
 * 
 *  could've split this into several .jsx files but I didn't, the component you're looking for starts on line 119
 */

import "../../styles/trafficlight.css";
import "../../styles/shapes.css";

const MESH_FACES= ["msf-zneg", "msf-ypos", "msf-xpos", "msf-yneg", "msf-xneg", "msf-zpos"]
const Mesh_Plane = ({ face= 0, className= "msh-plane", layers=1, children= null, props=null }) => {
  return (
    <div className={`${className} msh-parent`} {...props}>
      {
        layers < 2 ?
          <div className={`${MESH_FACES[face]} msh-face`}></div>
          :
          Array(layers).fill(null).map((e, idx) => 
            <div key={`${className}-${MESH_FACES[face]}-${idx}`} className={`${MESH_FACES[face]} msh-face msh-layer${idx}`}></div>
          )
      }
      {children?? null}
    </div>
  )
}

const Mesh_Box = ({ faces= 0b11111, className= "msh-box", children= null, props= null }) => {
  return (
    <div className={`${className} msh-parent`} {...props}>
      {(faces & 0b100000) ? <div className="msf-zneg msh-face">{faces}</div> : null}
      {(faces & 0b010000) ? <div className="msf-ypos msh-face">{faces}</div> : null}
      {(faces & 0b001000) ? <div className="msf-xpos msh-face">{faces}</div> : null}
      {(faces & 0b000100) ? <div className="msf-yneg msh-face">{faces}</div> : null}
      {(faces & 0b000010) ? <div className="msf-xneg msh-face">{faces}</div> : null}
      {(faces & 0b000001) ? <div className="msf-zpos msh-face">{faces}</div> : null}
      {children?? null}
    </div>
  )
}

const Header = () => {
  return (
    <header className="fs-title">
      <div className="fs-title-wrapper">
        <h2>da mf</h2>
        <h1>TraFFic LighT</h1>
      </div>
      <div className="fs-subtitle-wrapper">
        <h3>watch ur step kiddo, u could die on any corner</h3>
      </div>
    </header>
  )
}

// component for traffic light model (arm part)
const Model_Arm = () => {
  return (
    <>
      <div className={`mdl-arm msh-parent`}>
        <Mesh_Box faces={0b110100} className="mdl-arm-support" />
        <Mesh_Box faces={0b110100} className="mdl-arm-support-base" />
        <Mesh_Box faces={0b101010} className="mdl-arm-head-top" />
        <Mesh_Box faces={0b101010} className="mdl-arm-head" />
      </div>
    </>
  )
}

// component for traffic light model
const Model_Body= ({ lights, inverted, callbackSetActive }) => {

  const renderLights= [];

   // as renderLights wont contain hidden ones, we store original index for the buttons to work
  for(let i=0; i< lights.length; i++){
    if(!lights[i].visible) continue;
    renderLights.push({ index:i, ...lights[i] });
  }

  function getActive(idx){
    let active= renderLights[idx].active;
    return inverted ? !active : active;
  }

  return (
    <>
      <div className={`mdl-body msh-parent`}>
        <Mesh_Box faces={0b101011} className="mdl-body-support" />
        <Mesh_Box faces={0b111010} className="mdl-body-top" />
        {/* ----------------------------------------------------- Light array */}
        {
          renderLights.map((e, idx) => 
              <Mesh_Box key={`mdl-body-mid_${idx}`} faces={0b101011} className="mdl-body-mid"
                props={{ 
                  style:{"--cv-idx":idx, "--cv-col":renderLights[idx].color}
                }}
                children={
                  <>
                    <Mesh_Plane className="mdl-body-mid-rim"/>
                    <Mesh_Plane className={`mdl-body-light ${getActive(idx) ? "light-active" : ""}`} layers={3} 
                      props={{
                        onClick:()=>callbackSetActive(renderLights[idx].index, true, true)}
                    }/>
                  </>
              }/>
            )
        }
        <Mesh_Box faces={0b101110} className="mdl-body-bot" 
          props={{
            style:{"--cv-off":renderLights.length}
        }} />
      </div>
    </>
  )
}

const 
  NAMES_CHAR= "abcdefghijklmnopqrstuvwxyz0123456789_-",
  COLOR_CHAR= "0123456789ABCDEF",
  DEMO_MODES= { CYCLE:0, BOUNCE:1, CRAZY:2 };

// main component
const TrafficLight = () => {

  const defaultLights= [
    { name: "red light", active: false, visible: true, color: "#f01" },
    { name: "orange light", active: false, visible: true, color: "#f90" },
    { name: "green light", active: false, visible: true, color: "#4f0" },
    { name: "purple light", active: false, visible: false, color: "#60f" },
  ];

  // states
  const 
    [lights, setLights]= React.useState(defaultLights),
    [inverted, setInverted]= React.useState(false),
    [demoMode, setDemoMode]= React.useState(null),
    [demoIndex, setDemoIndex]= React.useState(-1);

  const 
    visibleLightCount= lights.filter(e => e.visible).length,
    activeLightIndex= lights.findIndex(e => e.active),
    disabledRemove= lights.length == 0 ? {disabled:true} : null,
    disabledAdd= lights.length > 15 ? {disabled:true} : null,
    disabledActive= activeLightIndex < 0 ? {disabled:true} : null;

  // sets the active light (the one lit)
  function setLightActive(idx, toggle, demo){
    let newLights= structuredClone(lights);
    newLights.forEach((e, i) => e.active= (!toggle || !e.active) && i==idx);
    setLights(newLights);
    if(demo) setDemoIndex(idx);
  }

  function genRandomLight() {
    const 
      _color= "#" + Array(6).fill(null).map(e => COLOR_CHAR[(Math.random()*16) | 0]).join(''),
      _name= Array(8+(Math.random()*8) | 0).fill(null).map(e => NAMES_CHAR[(Math.random()*NAMES_CHAR.length) | 0]).join('');

    return {
      name: _name,
      active: false,
      visible: true,
      color: _color
    };
  }

  // adds a light
  function addLight(light) {
    const newLights= structuredClone(lights);
    newLights.push(light);
    setLights(newLights);
  }

  // moves a light up or down, doesn't check under/overflow, that's handled by disabling buttons beforehand
  function moveLight(idx, up){
    const newLights= structuredClone(lights);
    const other= up ? idx-1 : idx+1;
    newLights[idx]= structuredClone(lights[other]);
    newLights[other]= structuredClone(lights[idx]);
    setLights(newLights);
  }

  // toggles a light visibility
  function toggleLight(idx) {
    const newLights= structuredClone(lights);
    newLights[idx].visible= !newLights[idx].visible;
    setLights(newLights);
  }

  // removes a light from the list
  function removeLight(idx) {
    const newLights= lights.filter((e, i) => i!=idx);
    setLights(newLights);
  }

  // duplicate active light
  function duplicateActive(){
    if(activeLightIndex < 0 || activeLightIndex >= lights.length) return;
    const newLights= structuredClone(lights);
    const newLight= lights[activeLightIndex];
    newLight.active= false;
    newLights.push(newLight);
    setLights(newLights);
  }

  // shuffle the lights list
  function shuffle(){
    const newLights= [];
    const oldLights= structuredClone(lights);
    let j;
    for(let i=0; i< lights.length; i++){
        j= (Math.random()*oldLights.length) | 0;
        newLights.push(oldLights[j]);
        oldLights.splice(j,1);
    }
    setLights(newLights);
  }

  // toggles a demonstration mode routine
  function toggleDemoMode(mode){
    if(demoMode != mode) {
      setDemoIndex(0);
      setDemoMode(mode);
    }
    else exitDemoMode(-1);
  }

  // exits the demonstration mode
  function exitDemoMode() {
    setLightActive(-1, false, true);
    setDemoMode(null);
  }

  // demonstration mode routines
  React.useEffect(()=>{
    let timeoutId;
    if(demoMode==DEMO_MODES.CYCLE){
      setLightActive(demoIndex, false, false);
      timeoutId= setTimeout(()=>{ setDemoIndex((demoIndex+1)%lights.length); }, 125);
    }
    else if(demoMode==DEMO_MODES.BOUNCE){
      let bForward= ((demoIndex/lights.length ) | 0) % 2 == 0;
      setLightActive(bForward ? demoIndex : (lights.length - (demoIndex-lights.length) - 1), false, false);
      timeoutId= setTimeout(()=>{ setDemoIndex((demoIndex + ((demoIndex%lights.length == lights.length-1) ? 2 : 1) )%(lights.length*2)); 
      }, 250);
    }
    else if(demoMode==DEMO_MODES.CRAZY){
      setLightActive(((Math.random()*lights.length) | 0));
      if(Math.random() > .5) setInverted(!inverted);
      timeoutId= setTimeout(()=>{ setDemoIndex((demoIndex+1)%2);
      }, ((Math.random()*100) | 0)+25);
    }
    return ()=>clearTimeout(timeoutId);
  },[demoMode, demoIndex]);

  return (
    <div className="traffic-light">
      <Header />
      <section className="d-flex justify-content-center m-0 p-0">
        <div className="col-4 px-5 py-2 d-flex justify-content-center">
          <div className="tl-control-panel w-100">
            {/* ----------------------------------------------------------------------------------- FUN THINGS */}
            <p className="text-center fw-semibold">Weird random shit</p>
            <div className="d-flex flex-wrap p-2 gap-2 justify-content-evenly">
              <button className="btn-action" onClick={()=>toggleDemoMode(DEMO_MODES.CYCLE)}>Cycle</button>
              <button className="btn-action" onClick={()=>toggleDemoMode(DEMO_MODES.BOUNCE)}>Bounce</button>
              <button className="btn-action" onClick={()=>toggleDemoMode(DEMO_MODES.CRAZY)}>Crazy</button>
            </div>
            <div className="d-flex flex-wrap p-2 gap-2 justify-content-evenly">
              <button className="btn-action" onClick={()=>shuffle()}>Shuffle Order</button>
              <button className="btn-action" onClick={()=>setInverted(!inverted)}>Invert Active</button>
              <button className="btn-action" onClick={()=>addLight(genRandomLight())} {...disabledAdd}>Add Random</button>
              <button className="btn-action" onClick={()=>removeLight( ((Math.random()*lights.length) | 0 ) )} {...disabledRemove}>Remove Random</button>
            </div>
            <hr/>
            {/* ----------------------------------------------------------------------------------- LIGHT LIST */}
            <p className="text-center fw-semibold">Light List</p>
            <div className="d-flex flex-wrap p-2 gap-2 justify-content-evenly">
              <button className="btn-action" onClick={()=>setLights([])} {...disabledRemove}>Remove All</button>
              <button className="btn-action" onClick={()=>setLights(defaultLights)}>Restore</button>
              <button className="btn-action" onClick={()=>duplicateActive()} {...disabledAdd} {...disabledActive}>Duplicate Active</button>
              <button className="btn-action" onClick={()=>setLightActive(-1)} {...disabledActive}>Clear</button>
{/*               <button className="btn-action" onClick={()=>showCreateModal(true)} {...disabledAdd}>Create Light</button> */}
            </div>
            <ul className="list-group gap-1">
            {/* ----------------------------------------------------------------------------------- LIGHT LIST ELEMENTS */}
              {
                lights.map((e, idx) => 
                  <li key={`lightlist-${idx}`} className={`light-list-item ${e.active ? "active" : ""} d-flex justify-content-between gap-3 m-0 p-0`} >
                    <div className="d-flex m-0 p-2 w-100" onClick={()=>setLightActive(idx, false, false)}>
                      <p className="ms-3 my-auto fw-bold">{e.name}</p>
                    </div>
                    <div className="d-flex justify-content m-0 p-0">
                      <button className="btn-icon" onClick={()=>moveLight(idx, true)} {...(idx==0 ? {disabled:true}:null) }><i className="icon icon-moveup"/></button>
                      <button className="btn-icon" onClick={()=>moveLight(idx, false)} {...(idx==lights.length-1 ? {disabled:true}:null) }><i className="icon icon-movedown"/></button>
                      <button className="btn-icon" onClick={()=>toggleLight(idx)}><i className={`icon icon-${e.visible ? "shown" : "hidden"}`}/></button>
{/*                       <button className="btn-icon" onClick={()=>showEditModal(idx, true)}><i className="icon icon-edit"/></button> */}
                      <button className="btn-icon" onClick={()=>removeLight(idx)}><i className="icon icon-trashcan"/></button>
                    </div>  
                  </li>
                )
              }
            </ul>
{/*             <input type="color" name="light-color-selector" defaultValue="#aa44ff" />
            <label for="light-color-selector">Body</label>
            {Array(lights.length).fill(null).map((e, idx)=>
                <button onClick={()=>toggleLight(idx)}>{`${(lights[idx].hidden ? "show" : "hide")} light ${idx}`}</button>
            )} */}
          </div>
        </div>
            {/* ----------------------------------------------------------------------------------- 3D MODEL */}
        <div className="col-4 tl-model-frame">
          <div className="tl-model-container overflow-hidden position-relative" style={{"--cv-count":visibleLightCount}}>
            <div className="mdl-origin msh-parent">
              <div className="mdl-pivot msh-parent"><Model_Body lights={lights} inverted={inverted} callbackSetActive={setLightActive}/></div>
              <Model_Arm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TrafficLight;