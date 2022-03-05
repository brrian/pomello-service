var t,e;t=this,e=function(){const t=({initialState:t,context:e,onStateChange:a})=>{let i={value:t,context:e};return{getState:()=>i,setState:(t,e)=>{i={value:null!=t?t:i.value,context:null!=e?e:i.context},a(i)}}};var e,a,i,r;!function(t){t.initializing="INITIALIZING",t.selectTask="SELECT_TASK",t.task="TASK",t.taskCompletePrompt="TASK_COMPLETE_PROMPT",t.taskVoidPrompt="TASK_VOID_PROMPT",t.taskTimerEndPrompt="TASK_TIMER_END_PROMPT",t.shortBreak="SHORT_BREAK",t.longBreak="LONG_BREAK"}(e||(e={})),function(t){t.idle="IDLE",t.active="ACTIVE"}(a||(a={})),function(t){t.idle="IDLE",t.ready="READY",t.active="ACTIVE",t.paused="PAUSED"}(i||(i={})),function(t){t.task="TASK",t.shortBreak="SHORT_BREAK",t.longBreak="LONG_BREAK"}(r||(r={}));const n=({onStateChange:e,onTimerEnd:a,onTimerTick:r,ticker:n})=>{const{getState:s,setState:o}=t({initialState:i.idle,context:{timer:null},onStateChange:e}),m=()=>{const{timer:t}=s().context;t&&(1===t.time?(o(i.idle,{timer:null}),n.stop(),a(t)):o(null,{timer:Object.assign(Object.assign({},t),{time:t.time-1})}))};return{createTimer:({isInjected:t=!1,time:e,type:a})=>{o(i.ready,{timer:{isInjected:t,time:e,totalTime:e,type:a}})},destroyTimer:()=>{o(i.idle,{timer:null}),n.stop()},pauseTimer:()=>{o(i.paused),n.stop()},startTimer:()=>{o(i.active),n.start((()=>{m(),r()}))},getState:s}};return({createTicker:s,settings:o})=>{let m=o;const{batchedEmit:l,emit:c,on:u,off:T}=(()=>{const t={},e=new Map,a=(e,a)=>{var i;null===(i=t[e])||void 0===i||i.forEach((t=>t(a)))};return{batchedEmit:(t,i)=>{e.size>0?e.set(t,i):(e.set(t,i),setTimeout((()=>{for(const[t,i]of e)a(t,i);e.clear()}),0))},emit:a,off:(e,a)=>{const i=t[e];i&&(t[e]=i.filter((t=>t!==a)))},on:(e,a)=>{var i;const r=null!==(i=t[e])&&void 0!==i?i:[];r.push(a),t[e]=r}}})(),k=(()=>{let t=null;const e=()=>{t=null};return{getMarker:a=>{const i=(new Date).getTime(),r=1e3*a;return t&&i-t.timestamp>r&&e(),t},setMarker:e=>{e&&(t={time:e.time,timestamp:(new Date).getTime()})},unsetMarker:e}})(),d=()=>{l("update",E())},p=(({onStateChange:a})=>{const{getState:i,setState:r}=t({initialState:e.initializing,context:{currentTaskId:null},onStateChange:a});return{completeTask:()=>{r(e.taskCompletePrompt)},getState:i,selectTask:t=>{r(e.task,{currentTaskId:t})},setAppState:t=>{r(t)},switchTask:()=>{r(e.selectTask,{currentTaskId:null})},unsetCurrentTask:()=>{r(null,{currentTaskId:null})},voidTask:()=>{r(e.taskVoidPrompt)}}})({onStateChange:d}),S=n({onStateChange:d,onTimerEnd:t=>{const a={time:0,totalTime:t.totalTime,type:t.type};c("timerEnd",h({timer:a})),t.isInjected||f(),p.getState().value===e.task?(k.unsetMarker(),p.setAppState(e.taskTimerEndPrompt),c("taskEnd",h({timer:a}))):p.getState().value!==e.taskCompletePrompt&&y(),v.startOvertimeCountdown({delay:m.overtimeDelay,type:t.type})},onTimerTick:()=>{c("timerTick",h())},ticker:s()}),v=(({onOvertimeStart:e,onOvertimeTick:i,onStateChange:r,ticker:n})=>{const{getState:s,setState:o}=t({initialState:a.idle,context:{overtime:null},onStateChange:r});let m=null;const l=()=>{const{overtime:t}=s().context;t&&(o(null,{overtime:Object.assign(Object.assign({},t),{time:t.time+1})}),i())};return{endOvertime:()=>{s().value===a.active?(o(a.idle,{overtime:null}),n.stop()):m&&(m(),m=null)},startOvertimeCountdown:({delay:t,type:i})=>{m=n.wait((()=>{o(a.active,{overtime:{time:t,type:i}}),n.start(l),e()}),t)},getState:s}})({onOvertimeStart:()=>{c("overtimeStart",h())},onOvertimeTick:()=>{c("overtimeTick",h())},onStateChange:d,ticker:s()});let g=0;const h=(t={})=>{const e=S.getState().context.timer;return Object.assign({taskId:p.getState().context.currentTaskId,timer:e?{time:e.time,totalTime:e.totalTime,type:e.type}:null,overtime:v.getState().context.overtime,timestamp:Date.now()},t)},f=()=>{g+=1,g>=m.set.length&&(g=0)},y=()=>{const t=m.set[g];if("task"===t){if(p.getState().context.currentTaskId){if(S.getState().context.timer){const{timer:t}=S.getState().context,e=k.getMarker(m.betweenTasksGracePeriod);let a={};t&&e&&(a={timer:{time:e.time,totalTime:t.totalTime,type:t.type},timestamp:e.timestamp}),c("taskStart",h(a))}else S.createTimer({time:m.taskTime,type:r.task});return p.setAppState(e.task)}return p.setAppState(e.selectTask)}if("shortBreak"===t)return S.createTimer({time:m.shortBreakTime,type:r.shortBreak}),p.setAppState(e.shortBreak);if("longBreak"===t)return S.createTimer({time:m.longBreakTime,type:r.longBreak}),p.setAppState(e.longBreak);throw new Error(`Unknown set item: "${t}"`)},E=()=>{const t=p.getState(),e=S.getState(),a=v.getState(),r=e.context.timer?{isActive:e.value===i.active,isInjected:e.context.timer.isInjected,isPaused:e.value===i.paused,time:e.context.timer.time,totalTime:e.context.timer.totalTime,type:e.context.timer.type}:null;return{value:t.value,currentTaskId:t.context.currentTaskId,timer:r,overtime:a.context.overtime}},x=()=>{var t;v.getState().value===a.active&&c("overtimeEnd",h()),v.endOvertime();const e=S.getState(),n=e.value===i.paused,s=(null===(t=e.context.timer)||void 0===t?void 0:t.type)===r.task;n?c("timerResume",h()):(c("timerStart",h()),s&&c("taskStart",h())),S.startTimer()},I=()=>{c("taskVoid",h()),S.getState().value===i.active&&S.destroyTimer(),p.voidTask()};return{completeTask:()=>{k.setMarker(S.getState().context.timer),p.completeTask()},getState:E,off:T,on:u,pauseTimer:()=>{S.pauseTimer(),c("timerPause",h())},selectTask:t=>{p.selectTask(t),y(),c("taskSelect",h())},setReady:()=>{y(),c("appInitialize",h())},skipTimer:()=>{c("timerSkip",h()),S.destroyTimer(),f(),y()},startTimer:x,switchTask:()=>{c("taskEnd",h()),k.setMarker(S.getState().context.timer),p.switchTask()},taskCompleteHandled:()=>{p.unsetCurrentTask(),y()},taskTimerEndPromptHandled:t=>{if("voidTask"===t)return g-=1,g<0&&(g=m.set.length-1),I();"switchTask"===t&&p.unsetCurrentTask(),y(),x()},updateSettings:t=>{m=t},voidPromptHandled:()=>{p.setAppState(e.shortBreak),S.createTimer({isInjected:!0,time:m.shortBreakTime,type:r.shortBreak}),x()},voidTask:I}}},"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).createPomelloService=e();
