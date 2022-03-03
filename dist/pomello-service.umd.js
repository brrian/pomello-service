var t,e;t=this,e=function(){const t=({initialState:t,context:e,onStateChange:a})=>{let i={value:t,context:e};return{getState:()=>i,setState:(t,e)=>{i={value:null!=t?t:i.value,context:null!=e?e:i.context},a(i)}}};var e,a,i,n;!function(t){t.initializing="INITIALIZING",t.selectTask="SELECT_TASK",t.task="TASK",t.taskCompletePrompt="TASK_COMPLETE_PROMPT",t.taskVoidPrompt="TASK_VOID_PROMPT",t.taskTimerEndPrompt="TASK_TIMER_END_PROMPT",t.shortBreak="SHORT_BREAK",t.longBreak="LONG_BREAK"}(e||(e={})),function(t){t.idle="IDLE",t.active="ACTIVE"}(a||(a={})),function(t){t.idle="IDLE",t.ready="READY",t.active="ACTIVE",t.paused="PAUSED"}(i||(i={})),function(t){t.task="TASK",t.shortBreak="SHORT_BREAK",t.longBreak="LONG_BREAK"}(n||(n={}));const r=({onStateChange:e,onTimerEnd:a,onTimerTick:n,ticker:r})=>{const{getState:s,setState:o}=t({initialState:i.idle,context:{timer:null},onStateChange:e}),m=()=>{const{timer:t}=s().context;t&&(1===t.time?(o(i.idle,{timer:null}),r.stop(),a(t)):o(null,{timer:Object.assign(Object.assign({},t),{time:t.time-1})}))};return{createTimer:({isInjected:t=!1,time:e,type:a})=>{o(i.ready,{timer:{isInjected:t,time:e,totalTime:e,type:a}})},destroyTimer:()=>{o(i.idle,{timer:null}),r.stop()},pauseTimer:()=>{o(i.paused),r.stop()},startTimer:()=>{o(i.active),r.start((()=>{m(),n()}))},getState:s}};return({createTicker:s,settings:o})=>{let m=o;const{batchedEmit:c,emit:l,on:T,off:u}=(()=>{const t={},e=new Map,a=(e,a)=>{var i;null===(i=t[e])||void 0===i||i.forEach((t=>t(a)))};return{batchedEmit:(t,i)=>{e.size>0?e.set(t,i):(e.set(t,i),setImmediate((()=>{for(const[t,i]of e)a(t,i);e.clear()})))},emit:a,off:(e,a)=>{const i=t[e];i&&(t[e]=i.filter((t=>t!==a)))},on:(e,a)=>{var i;const n=null!==(i=t[e])&&void 0!==i?i:[];n.push(a),t[e]=n}}})(),d=()=>{c("update",E())},k=(({onStateChange:a})=>{const{getState:i,setState:n}=t({initialState:e.initializing,context:{currentTaskId:null},onStateChange:a});return{completeTask:()=>{n(e.taskCompletePrompt)},getState:i,selectTask:t=>{n(e.task,{currentTaskId:t})},setAppState:t=>{n(t)},switchTask:()=>{n(e.selectTask,{currentTaskId:null})},unsetCurrentTask:()=>{n(null,{currentTaskId:null})},voidTask:()=>{n(e.taskVoidPrompt)}}})({onStateChange:d}),p=r({onStateChange:d,onTimerEnd:t=>{const a=Object.assign(Object.assign({},t),{time:0});l("timerEnd",g(a)),t.isInjected||h(),k.getState().value===e.task?(k.setAppState(e.taskTimerEndPrompt),l("taskEnd",g(a))):f(),S.startOvertimeCountdown({delay:m.overtimeDelay,type:t.type})},onTimerTick:()=>{l("timerTick",g())},ticker:s()}),S=(({onOvertimeStart:e,onOvertimeTick:i,onStateChange:n,ticker:r})=>{const{getState:s,setState:o}=t({initialState:a.idle,context:{overtime:null},onStateChange:n});let m=null;const c=()=>{const{overtime:t}=s().context;t&&(o(null,{overtime:Object.assign(Object.assign({},t),{time:t.time+1})}),i())};return{endOvertime:()=>{s().value===a.active?(o(a.idle,{overtime:null}),r.stop()):m&&(m(),m=null)},startOvertimeCountdown:({delay:t,type:i})=>{m=r.wait((()=>{o(a.active,{overtime:{time:t,type:i}}),r.start(c),e()}),t)},getState:s}})({onOvertimeStart:()=>{l("overtimeStart",g())},onOvertimeTick:()=>{l("overtimeTick",g())},onStateChange:d,ticker:s()});let v=0;const g=t=>{const e=t||p.getState().context.timer;return{taskId:k.getState().context.currentTaskId,timer:e?{time:e.time,totalTime:e.totalTime,type:e.type}:null,overtime:S.getState().context.overtime,timestamp:Date.now()}},h=()=>{v+=1,v>=m.set.length&&(v=0)},f=()=>{const t=m.set[v];if("task"===t)return k.getState().context.currentTaskId?(p.getState().context.timer?l("taskStart",g()):p.createTimer({time:m.taskTime,type:n.task}),k.setAppState(e.task)):k.setAppState(e.selectTask);if("shortBreak"===t)return p.createTimer({time:m.shortBreakTime,type:n.shortBreak}),k.setAppState(e.shortBreak);if("longBreak"===t)return p.createTimer({time:m.longBreakTime,type:n.longBreak}),k.setAppState(e.longBreak);throw new Error(`Unknown set item: "${t}"`)},E=()=>{const t=k.getState(),e=p.getState(),a=S.getState(),n=e.context.timer?{isActive:e.value===i.active,isInjected:e.context.timer.isInjected,isPaused:e.value===i.paused,time:e.context.timer.time,totalTime:e.context.timer.totalTime,type:e.context.timer.type}:null;return{value:t.value,currentTaskId:t.context.currentTaskId,timer:n,overtime:a.context.overtime}},y=()=>{var t;S.getState().value===a.active&&l("overtimeEnd",g()),S.endOvertime();const e=p.getState(),r=e.value===i.paused,s=(null===(t=e.context.timer)||void 0===t?void 0:t.type)===n.task;r?l("timerResume",g()):(l("timerStart",g()),s&&l("taskStart",g())),p.startTimer()},I=()=>{l("taskVoid",g()),p.getState().value===i.active&&p.destroyTimer(),k.voidTask()};return{completeTask:()=>{k.completeTask()},getState:E,off:u,on:T,pauseTimer:()=>{p.pauseTimer(),l("timerPause",g())},selectTask:t=>{k.selectTask(t),f(),l("taskSelect",g())},setReady:()=>{f(),l("appInitialize",g())},skipTimer:()=>{l("timerSkip",g()),p.destroyTimer(),h(),f()},startTimer:y,switchTask:()=>{l("taskEnd",g()),k.switchTask()},taskCompleteHandled:()=>{k.unsetCurrentTask(),f()},taskTimerEndPromptHandled:t=>{if("voidTask"===t)return v-=1,v<0&&(v=m.set.length-1),I();"switchTask"===t&&k.unsetCurrentTask(),f(),y()},updateSettings:t=>{m=t},voidPromptHandled:()=>{k.setAppState(e.shortBreak),p.createTimer({isInjected:!0,time:m.shortBreakTime,type:n.shortBreak}),y()},voidTask:I}}},"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).createPomelloService=e();
