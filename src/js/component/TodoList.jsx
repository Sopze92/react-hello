import React from "react";

import "../../styles/todolist.css";

// ------------------------------------------------------------------------------------ TITLE COMPONENT

const TaskList_Title= ()=> {

  const [aberration, setAberration]= React.useState([1,0, true]);

  React.useEffect(()=>{
    let 
      timeoutID= -1,
      rand= Math.random(),
      abturn= !aberration[3];
    
    if(rand > .6){
      let move= rand > .85;
      rand= ((rand*10 - 6)*1.5) | 0;
      timeoutID= setTimeout(()=>{
        setAberration([rand, Math.max(0, rand-2), move ? -.5 + Math.random() : 0, abturn]);
      }, 50 + ((Math.random()*350) | 0) );
    }
    else timeoutID= setTimeout(()=>{ setAberration( [0, 0, 0, abturn]); }, 66);
    return ()=>{ if(timeoutID != -1) clearTimeout(timeoutID); }
  }, [aberration])
  
  const title= "TODOs";

  return (
    <div className="text-center fw-light tl-title">
      <h1 className="m-0 mb-4 p-0 layer-fg" 
            style={{ 
              "--cv-rx":`${aberration[0]}px`, "--cv-rb":`${aberration[1]}px`,
              "--cv-bx":`${-aberration[0]}px`, "--cv-bb":`${aberration[1]}px`,
              "--cv-mx":`${aberration[2]}rem`
            }}>{title}</h1>
      {
        Array(5).fill(null).map((e,i)=> 
          <h1 key={`title-layer-${i}`} className={`m-0 mb-4 p-0 tl-title layer-bg layer-bg${i}`} >{title}</h1>
        )
      }
      <h4 className="fw-bold tl-subtitle">Now with Fetch!</h4>
    </div>
  )
}

// ------------------------------------------------------------------------------------ TODOLIST COMPONENT

const 
  ITEM_ANIM= { NONE: "", ADDED: "tl-anim-onadd", REMOVE: "tl-anim-onremove", REMOVEALL: "tl-anim-onremoveall" },
  API_URL= "https://playground.4geeks.com/apis/fake/todos/user/sopze92"

const TodoList= ()=> {

  const 
    [inputField, setInputField]= React.useState(""),
    [taskList, setTaskList]= React.useState(null);

  const 
    bAnyTask= taskList && taskList.length > 0,
    bAnyInput= inputField && inputField.length > 0;
  
  // --------------------------------- FETCH ADDITIONS ---------------------------------
  // ok, so i made the app ignore the first element of the list in both ways so we can easily "clear" the list, as the API says you cannot update the 
  //  list with 0 elements and deleting/creating the user just for clearing the list is weird as it always initializes users with an "example task"

  React.useEffect(()=>{
    if(!taskList){

      // get list from server at startup
      fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        if(res.ok) return res.json();
        else if(res.status===404){
          // if user 404'd then try creating it
          fetch(API_URL, {
            method: "POST",
            body: JSON.stringify([]),
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(res => {
            if(res.ok) setTaskList([]);
          })
          //.catch(err => { console.log("err creating the user: "); console.warn(err); })
        }
      })
      .then(data => {
        // filters out the first element, lists of 1 element count as empty
        if(data && data.length > 1) setTaskList( data.filter((e,i)=> i!=0).map(e=> {return { text:e.label, anim:ITEM_ANIM.ADDED }}));
      })
      //.catch(err => { console.log("err getting the tasklist: "); console.warn(err); })
    }
    else {
      // upload list to server
      // adds an extra first element, you cannot send an empty array, so for this project, 1 is the new 0
      fetch(API_URL, {
        method: "PUT",
        body: JSON.stringify( [{ label:"ZERO", done:false }].concat(taskList.map(e=> {return { label:e.text, done:false }})) ),
        headers: { "Content-Type": "application/json" }
      })
      .catch(err => { console.log("err updating list: "); console.warn(err); })
    }
  }, [taskList]) 

  
  // --------------------------------- END OF FETCH ADDITIONS ---------------------------------

  // handlers

  function handleInputChange(target) {
    setInputField(target.value);
  }

  function handleKey(e) {
    if( e.ctrlKey || e.altKey || e.shiftKey || e.metaKey ) return;
    if(e.key==="Enter") submitInput();
    else if(e.key==="Escape") setInputField("");
  }

  function handleItemAnimationEnd(idx){
    if(taskList[idx].anim== ITEM_ANIM.REMOVE) removeItem(idx);
    else if(taskList[idx].anim== ITEM_ANIM.REMOVEALL) setTaskList([]);
    else setItemAnimation(idx, ITEM_ANIM.NONE);
  }

  function handleRemoveItemButton(idx){
    if(taskList[idx]!= ITEM_ANIM.REMOVE) setItemAnimation(idx, ITEM_ANIM.REMOVE);
  }

  // other

  function addItem(text, clearInput=false){
    const newTaskList= [
      ...(taskList?? []), 
      { text: text, anim: ITEM_ANIM.ADDED }
    ];
    if(clearInput) setInputField("");
    setTaskList(newTaskList);
  }

  function removeItem(idx, clearInput=false){
    const newTaskList= taskList.filter((e,i)=> i!= idx);
    if(clearInput) setInputField("");
    setTaskList(newTaskList);
  }

  function clearList(){
    const newTaskList= structuredClone(taskList);
    newTaskList.forEach(e => e.anim= ITEM_ANIM.REMOVEALL);
    setTaskList(newTaskList);
  }

  function setItemAnimation(idx, anim){
    if(taskList[idx].anim != anim) {
      const newTaskList= structuredClone(taskList);
      newTaskList[idx].anim= anim
      setTaskList(newTaskList);
    }
  }

  function submitInput(){
    if(bAnyInput) addItem(inputField, true);
  }

  // jsx

  return (
    <div className="d-flex flex-column justify-content-center tl-container m-4">
      <TaskList_Title />
      <ul className="list-group rounded-1 m-0 tl-tasklist">
        <li className="list-group-item m-0 p-0 tl-taskinput">
          <div className="d-flex justify-content-between align-middle px-4 py-2">
            <input className="w-100 h-100 align-middle tl-input" type="text" value={inputField} placeholder="Type a new task..." onChange={(e)=>{handleInputChange(e.target)}} onKeyDown={(e)=>{handleKey(e)}} />
            {
              bAnyInput && <button className="tl-button" onClick={()=>submitInput()}><i className="tl-icon icon-enter" /></button>
            }
          </div>
        </li>
        {
          bAnyTask && taskList.map((e,i)=> 
            <li key={`task-${i}`} className={`list-group-item p-0 tl-taskitem ${e.anim}`} onAnimationEnd={()=>handleItemAnimationEnd(i)}>
              <div className="d-flex justify-content-between align-middle m-0 ps-4 pe-2 py-2">
                {e.text}
                <button className="tl-button" onClick={()=>handleRemoveItemButton(i)}><i className="tl-icon icon-remove" /></button>
              </div>
            </li>
          )
        }
        {
          ( !bAnyTask && <li className="list-group-item fw-light p-1 ps-2 text-secondary tl-footnote">No tasks here...</li> )
          || 
          <li className="list-group-item fw-light p-1 ps-2 text-secondary tl-footnote d-flex justify-content-between">
            <p className="m-0 p-0">{taskList.length} {taskList.length > 1 ? "Tasks" : "Task"} left</p>
            <p className="m-0 p-0 tl-button-clear" onClick={()=>clearList()}>clear list</p>
          </li>
        }
      </ul>
        {
          bAnyTask && taskList.length > 1 && 
            <ul className="list-group rounded-0 m-0 tl-tasklist tl-tasklist-multi">
              <li className="list-group-item rounded-bottom-1 tl-tasklist-behind tl-tasklist-behind-0"></li>
              <li className="list-group-item rounded-bottom-1 tl-tasklist-behind tl-tasklist-behind-1"></li>
            </ul>
        }
    </div>
  )
}

export default TodoList;