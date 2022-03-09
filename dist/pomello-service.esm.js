const t=({initialState:t,context:e,onStateChange:a})=>{let r={value:t,context:e};return{getState:()=>r,setState:(t,e)=>{r={value:null!=t?t:r.value,context:null!=e?e:r.context},a(r)}}};var e,a,r,i;!function(t){t.initializing="INITIALIZING",t.selectTask="SELECT_TASK",t.task="TASK",t.taskCompletePrompt="TASK_COMPLETE_PROMPT",t.taskVoidPrompt="TASK_VOID_PROMPT",t.taskTimerEndPrompt="TASK_TIMER_END_PROMPT",t.shortBreak="SHORT_BREAK",t.longBreak="LONG_BREAK"}(e||(e={})),function(t){t.idle="IDLE",t.active="ACTIVE"}(a||(a={})),function(t){t.idle="IDLE",t.ready="READY",t.active="ACTIVE",t.paused="PAUSED"}(r||(r={})),function(t){t.task="TASK",t.shortBreak="SHORT_BREAK",t.longBreak="LONG_BREAK"}(i||(i={}));const n=({onStateChange:e,onTimerEnd:a,onTimerTick:i,ticker:n})=>{const{getState:s,setState:o}=t({initialState:r.idle,context:{timer:null},onStateChange:e}),m=new Map,c=()=>{const{timer:t}=s().context;if(t){const e=Object.assign(Object.assign({},t),{time:t.time-1});if(o(null,{timer:e}),0===e.time){n.stop(),a(e);const{timer:t}=s().context;t&&0===t.time&&o(r.idle,{timer:null})}}};return{clearMarkers:()=>{m.clear()},createTimer:({isInjected:t=!1,time:e,type:a})=>{o(r.ready,{timer:{isInjected:t,time:e,totalTime:e,type:a}})},destroyTimer:()=>{o(r.idle,{timer:null}),n.stop()},getMarker:t=>{var e;return null!==(e=m.get(t))&&void 0!==e?e:null},getState:s,pauseTimer:()=>{o(r.paused),n.stop()},setMarker:t=>{const{timer:e}=s().context;e&&m.set(t,{timer:e,timestamp:Date.now()})},startTimer:()=>{o(r.active),n.start((()=>{c(),i()}))}}},s=({createTicker:s,settings:o})=>{let m=o;const{batchedEmit:c,emit:l,on:k,off:T}=(()=>{const t={},e=new Map,a=(e,a)=>{var r;null===(r=t[e])||void 0===r||r.forEach((t=>t(a)))};return{batchedEmit:(t,r)=>{e.size>0?e.set(t,r):(e.set(t,r),setTimeout((()=>{for(const[t,r]of e)a(t,r);e.clear()}),0))},emit:a,off:(e,a)=>{const r=t[e];r&&(t[e]=r.filter((t=>t!==a)))},on:(e,a)=>{var r;const i=null!==(r=t[e])&&void 0!==r?r:[];i.push(a),t[e]=i}}})(),u=()=>{c("update",y())},p=(({onStateChange:a})=>{const{getState:r,setState:i}=t({initialState:e.initializing,context:{currentTaskId:null},onStateChange:a});return{completeTask:()=>{i(e.taskCompletePrompt)},getState:r,selectTask:t=>{i(e.task,{currentTaskId:t})},setAppState:t=>{i(t)},switchTask:()=>{i(e.selectTask,{currentTaskId:null})},unsetCurrentTask:()=>{i(null,{currentTaskId:null})},voidTask:()=>{i(e.taskVoidPrompt)}}})({onStateChange:u}),d=n({onStateChange:u,onTimerEnd:t=>{l("timerEnd",g()),t.isInjected||E(),p.getState().value===e.task?(d.setMarker("taskEnd"),p.setAppState(e.taskTimerEndPrompt),l("taskEnd",g())):p.getState().value!==e.taskCompletePrompt&&h(),S.startOvertimeCountdown({delay:m.overtimeDelay,type:t.type})},onTimerTick:()=>{l("timerTick",g())},ticker:s()}),S=(({onOvertimeStart:e,onOvertimeTick:r,onStateChange:i,ticker:n})=>{const{getState:s,setState:o}=t({initialState:a.idle,context:{overtime:null},onStateChange:i});let m=null;const c=()=>{const{overtime:t}=s().context;t&&(o(null,{overtime:Object.assign(Object.assign({},t),{time:t.time+1})}),r())};return{endOvertime:()=>{s().value===a.active?(o(a.idle,{overtime:null}),n.stop()):m&&(m(),m=null)},startOvertimeCountdown:({delay:t,type:r})=>{m=n.wait((()=>{const i={time:t,type:r};o(a.active,{overtime:i}),n.start(c),e(i)}),t)},getState:s}})({onOvertimeStart:t=>{l("overtimeStart",g({overtime:Object.assign(Object.assign({},t),{time:0}),timestamp:Date.now()-1e3*t.time}))},onOvertimeTick:()=>{l("overtimeTick",g())},onStateChange:u,ticker:s()});let v=0;const g=(t={})=>{const e=d.getState().context.timer;return Object.assign({taskId:p.getState().context.currentTaskId,timer:e?{time:e.time,totalTime:e.totalTime,type:e.type}:null,overtime:S.getState().context.overtime,timestamp:Date.now()},t)},E=()=>{v+=1,v>=m.set.length&&(v=0)},h=()=>{const t=m.set[v];if("task"===t){if(p.getState().context.currentTaskId){const{timer:t}=d.getState().context;if(t&&0!==t.time){let e;const a=d.getMarker("taskStart"),r=Date.now()-1e3*m.betweenTasksGracePeriod;a&&a.timestamp>r?e={timer:{time:a.timer.time,totalTime:t.totalTime,type:t.type},timestamp:a.timestamp}:d.setMarker("taskStart"),l("taskStart",g(e))}else d.createTimer({time:m.taskTime,type:i.task});return p.setAppState(e.task)}return p.setAppState(e.selectTask)}if("shortBreak"===t)return d.createTimer({time:m.shortBreakTime,type:i.shortBreak}),p.setAppState(e.shortBreak);if("longBreak"===t)return d.createTimer({time:m.longBreakTime,type:i.longBreak}),p.setAppState(e.longBreak);throw new Error(`Unknown set item: "${t}"`)},y=()=>{const t=p.getState(),e=d.getState(),a=S.getState(),i=e.context.timer?{isActive:e.value===r.active,isInjected:e.context.timer.isInjected,isPaused:e.value===r.paused,time:e.context.timer.time,totalTime:e.context.timer.totalTime,type:e.context.timer.type}:null;return{value:t.value,currentTaskId:t.context.currentTaskId,timer:i,overtime:a.context.overtime}},I=()=>{var t;S.getState().value===a.active&&l("overtimeEnd",g()),S.endOvertime();const e=d.getState(),n=e.value===r.paused,s=(null===(t=e.context.timer)||void 0===t?void 0:t.type)===i.task;n?l("timerResume",g()):(l("timerStart",g()),s&&l("taskStart",g())),d.startTimer(),d.setMarker("taskStart")},x=()=>{const t={};if(d.getState().value===r.idle){const e=d.getMarker("taskStart"),a=d.getMarker("taskEnd");e&&a&&(t.timer={time:e.timer.time,totalTime:e.timer.totalTime,type:e.timer.type},t.timestamp=a.timestamp)}l("taskVoid",g(t)),d.getState().value===r.active&&d.destroyTimer(),p.voidTask()};return{completeTask:()=>{l("taskEnd",g()),d.setMarker("taskStart"),p.completeTask()},getState:y,off:T,on:k,pauseTimer:()=>{d.pauseTimer(),l("timerPause",g())},selectTask:t=>{p.selectTask(t),l("taskSelect",g()),h()},setReady:()=>{h(),l("appInitialize",g())},skipTimer:()=>{l("timerSkip",g()),d.destroyTimer(),E(),h()},startTimer:I,switchTask:()=>{l("taskEnd",g()),d.setMarker("taskStart"),p.switchTask()},taskCompleteHandled:()=>{p.unsetCurrentTask(),h(),d.getState().value!==r.active&&I()},taskTimerEndPromptHandled:t=>{"voidTask"===t?(v-=1,v<0&&(v=m.set.length-1),x()):("switchTask"===t&&p.unsetCurrentTask(),h(),I()),d.clearMarkers()},updateSettings:t=>{m=t},voidPromptHandled:()=>{p.setAppState(e.shortBreak),d.createTimer({isInjected:!0,time:m.shortBreakTime,type:i.shortBreak}),I()},voidTask:x}};export{s as default};
