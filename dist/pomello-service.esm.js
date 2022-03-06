const t=({initialState:t,context:e,onStateChange:a})=>{let i={value:t,context:e};return{getState:()=>i,setState:(t,e)=>{i={value:null!=t?t:i.value,context:null!=e?e:i.context},a(i)}}};var e,a,i,r;!function(t){t.initializing="INITIALIZING",t.selectTask="SELECT_TASK",t.task="TASK",t.taskCompletePrompt="TASK_COMPLETE_PROMPT",t.taskVoidPrompt="TASK_VOID_PROMPT",t.taskTimerEndPrompt="TASK_TIMER_END_PROMPT",t.shortBreak="SHORT_BREAK",t.longBreak="LONG_BREAK"}(e||(e={})),function(t){t.idle="IDLE",t.active="ACTIVE"}(a||(a={})),function(t){t.idle="IDLE",t.ready="READY",t.active="ACTIVE",t.paused="PAUSED"}(i||(i={})),function(t){t.task="TASK",t.shortBreak="SHORT_BREAK",t.longBreak="LONG_BREAK"}(r||(r={}));const n=({onStateChange:e,onTimerEnd:a,onTimerTick:r,ticker:n})=>{const{getState:s,setState:o}=t({initialState:i.idle,context:{timer:null},onStateChange:e}),m=()=>{const{timer:t}=s().context;t&&(1===t.time?(o(i.idle,{timer:null}),n.stop(),a(t)):o(null,{timer:Object.assign(Object.assign({},t),{time:t.time-1})}))};return{createTimer:({isInjected:t=!1,time:e,type:a})=>{o(i.ready,{timer:{isInjected:t,time:e,totalTime:e,type:a}})},destroyTimer:()=>{o(i.idle,{timer:null}),n.stop()},pauseTimer:()=>{o(i.paused),n.stop()},startTimer:()=>{o(i.active),n.start((()=>{m(),r()}))},getState:s}},s=({createTicker:s,settings:o})=>{let m=o;const{batchedEmit:c,emit:l,on:T,off:k}=(()=>{const t={},e=new Map,a=(e,a)=>{var i;null===(i=t[e])||void 0===i||i.forEach((t=>t(a)))};return{batchedEmit:(t,i)=>{e.size>0?e.set(t,i):(e.set(t,i),setTimeout((()=>{for(const[t,i]of e)a(t,i);e.clear()}),0))},emit:a,off:(e,a)=>{const i=t[e];i&&(t[e]=i.filter((t=>t!==a)))},on:(e,a)=>{var i;const r=null!==(i=t[e])&&void 0!==i?i:[];r.push(a),t[e]=r}}})(),u=(()=>{let t=null;const e=()=>{t=null};return{getMarker:a=>{const i=(new Date).getTime(),r=1e3*a;return t&&i-t.timestamp>r&&e(),t},setMarker:e=>{e&&(t={time:e.time,timestamp:(new Date).getTime()})},unsetMarker:e}})(),p=()=>{c("update",I())},d=(({onStateChange:a})=>{const{getState:i,setState:r}=t({initialState:e.initializing,context:{currentTaskId:null},onStateChange:a});return{completeTask:()=>{r(e.taskCompletePrompt)},getState:i,selectTask:t=>{r(e.task,{currentTaskId:t})},setAppState:t=>{r(t)},switchTask:()=>{r(e.selectTask,{currentTaskId:null})},unsetCurrentTask:()=>{r(null,{currentTaskId:null})},voidTask:()=>{r(e.taskVoidPrompt)}}})({onStateChange:p}),S=n({onStateChange:p,onTimerEnd:t=>{const a={time:0,totalTime:t.totalTime,type:t.type};l("timerEnd",h({timer:a})),t.isInjected||E(),d.getState().value===e.task?(u.unsetMarker(),d.setAppState(e.taskTimerEndPrompt),l("taskEnd",h({timer:a}))):d.getState().value!==e.taskCompletePrompt&&y(),g.startOvertimeCountdown({delay:m.overtimeDelay,type:t.type})},onTimerTick:()=>{l("timerTick",h())},ticker:s()}),g=(({onOvertimeStart:e,onOvertimeTick:i,onStateChange:r,ticker:n})=>{const{getState:s,setState:o}=t({initialState:a.idle,context:{overtime:null},onStateChange:r});let m=null;const c=()=>{const{overtime:t}=s().context;t&&(o(null,{overtime:Object.assign(Object.assign({},t),{time:t.time+1})}),i())};return{endOvertime:()=>{s().value===a.active?(o(a.idle,{overtime:null}),n.stop()):m&&(m(),m=null)},startOvertimeCountdown:({delay:t,type:i})=>{m=n.wait((()=>{const r={time:t,type:i};o(a.active,{overtime:r}),n.start(c),e(r)}),t)},getState:s}})({onOvertimeStart:t=>{l("overtimeStart",h({overtime:Object.assign(Object.assign({},t),{time:0}),timestamp:Date.now()-1e3*t.time}))},onOvertimeTick:()=>{l("overtimeTick",h())},onStateChange:p,ticker:s()});let v=0;const h=(t={})=>{const e=S.getState().context.timer;return Object.assign({taskId:d.getState().context.currentTaskId,timer:e?{time:e.time,totalTime:e.totalTime,type:e.type}:null,overtime:g.getState().context.overtime,timestamp:Date.now()},t)},E=()=>{v+=1,v>=m.set.length&&(v=0)},y=()=>{const t=m.set[v];if("task"===t){if(d.getState().context.currentTaskId){if(S.getState().context.timer){const{timer:t}=S.getState().context,e=u.getMarker(m.betweenTasksGracePeriod);let a={};t&&e&&(a={timer:{time:e.time,totalTime:t.totalTime,type:t.type},timestamp:e.timestamp}),l("taskStart",h(a))}else S.createTimer({time:m.taskTime,type:r.task});return d.setAppState(e.task)}return d.setAppState(e.selectTask)}if("shortBreak"===t)return S.createTimer({time:m.shortBreakTime,type:r.shortBreak}),d.setAppState(e.shortBreak);if("longBreak"===t)return S.createTimer({time:m.longBreakTime,type:r.longBreak}),d.setAppState(e.longBreak);throw new Error(`Unknown set item: "${t}"`)},I=()=>{const t=d.getState(),e=S.getState(),a=g.getState(),r=e.context.timer?{isActive:e.value===i.active,isInjected:e.context.timer.isInjected,isPaused:e.value===i.paused,time:e.context.timer.time,totalTime:e.context.timer.totalTime,type:e.context.timer.type}:null;return{value:t.value,currentTaskId:t.context.currentTaskId,timer:r,overtime:a.context.overtime}},x=()=>{var t;g.getState().value===a.active&&l("overtimeEnd",h()),g.endOvertime();const e=S.getState(),n=e.value===i.paused,s=(null===(t=e.context.timer)||void 0===t?void 0:t.type)===r.task;n?l("timerResume",h()):(l("timerStart",h()),s&&l("taskStart",h())),S.startTimer()},O=()=>{l("taskVoid",h()),S.getState().value===i.active&&S.destroyTimer(),d.voidTask()};return{completeTask:()=>{u.setMarker(S.getState().context.timer),d.completeTask()},getState:I,off:k,on:T,pauseTimer:()=>{S.pauseTimer(),l("timerPause",h())},selectTask:t=>{d.selectTask(t),l("taskSelect",h()),y()},setReady:()=>{y(),l("appInitialize",h())},skipTimer:()=>{l("timerSkip",h()),S.destroyTimer(),E(),y()},startTimer:x,switchTask:()=>{l("taskEnd",h()),u.setMarker(S.getState().context.timer),d.switchTask()},taskCompleteHandled:()=>{d.unsetCurrentTask(),y()},taskTimerEndPromptHandled:t=>{if("voidTask"===t)return v-=1,v<0&&(v=m.set.length-1),O();"switchTask"===t&&d.unsetCurrentTask(),y(),x()},updateSettings:t=>{m=t},voidPromptHandled:()=>{d.setAppState(e.shortBreak),S.createTimer({isInjected:!0,time:m.shortBreakTime,type:r.shortBreak}),x()},voidTask:O}};export{s as default};
