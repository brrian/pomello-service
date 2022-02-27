var t,e;t=this,e=function(){const t=({initialState:t,context:e,onStateChange:a})=>{let i={value:t,context:e};return{getState:()=>i,setState:(t,e)=>{i={value:null!=t?t:i.value,context:null!=e?e:i.context},a(i)}}};var e,a,i,n;!function(t){t.initializing="INITIALIZING",t.selectTask="SELECT_TASK",t.task="TASK",t.taskCompletePrompt="TASK_COMPLETE_PROMPT",t.taskVoidPrompt="TASK_VOID_PROMPT",t.taskTimerEndPrompt="TASK_TIMER_END_PROMPT",t.shortBreak="SHORT_BREAK",t.longBreak="LONG_BREAK"}(e||(e={})),function(t){t.idle="IDLE",t.active="ACTIVE"}(a||(a={})),function(t){t.idle="IDLE",t.ready="READY",t.active="ACTIVE",t.paused="PAUSED"}(i||(i={})),function(t){t.task="TASK",t.shortBreak="SHORT_BREAK",t.longBreak="LONG_BREAK"}(n||(n={}));const r=({onStateChange:e,onTimerEnd:a,onTimerTick:n,ticker:r})=>{const{getState:s,setState:o}=t({initialState:i.idle,context:{timer:null},onStateChange:e}),c=()=>{const{timer:t}=s().context;t&&(1===t.time?(o(i.idle,{timer:null}),r.stop(),a(t)):o(null,{timer:Object.assign(Object.assign({},t),{time:t.time-1})}))};return{createTimer:({isInjected:t=!1,time:e,type:a})=>{o(i.ready,{timer:{isInjected:t,time:e,totalTime:e,type:a}})},destroyTimer:()=>{o(i.idle,{timer:null}),r.stop()},pauseTimer:()=>{o(i.paused),r.stop()},startTimer:()=>{o(i.active),r.start((()=>{c(),n()}))},getState:s}};return({createTicker:s,settings:o})=>{const{batchedEmit:c,emit:m,on:l,off:T}=(()=>{const t={},e=new Map,a=(e,a)=>{var i;null===(i=t[e])||void 0===i||i.forEach((t=>t(a)))};return{batchedEmit:(t,i)=>{e.size>0?e.set(t,i):(e.set(t,i),setImmediate((()=>{for(const[t,i]of e)a(t,i);e.clear()})))},emit:a,off:(e,a)=>{const i=t[e];i&&(t[e]=i.filter((t=>t!==a)))},on:(e,a)=>{var i;const n=null!==(i=t[e])&&void 0!==i?i:[];n.push(a),t[e]=n}}})(),u=()=>{c("update",f())},k=(({onStateChange:a})=>{const{getState:i,setState:n}=t({initialState:e.initializing,context:{currentTaskId:null},onStateChange:a});return{completeTask:()=>{n(e.taskCompletePrompt)},getState:i,selectTask:t=>{n(e.task,{currentTaskId:t})},setAppState:t=>{n(t)},switchTask:()=>{n(e.selectTask,{currentTaskId:null})},unsetCurrentTask:()=>{n(null,{currentTaskId:null})},voidTask:()=>{n(e.taskVoidPrompt)}}})({onStateChange:u}),d=r({onStateChange:u,onTimerEnd:t=>{m("timerEnd",g(Object.assign(Object.assign({},t),{time:0}))),t.isInjected||v(),k.getState().value===e.task?k.setAppState(e.taskTimerEndPrompt):h(),p.startOvertimeCountdown({delay:o.overtimeDelay,type:t.type})},onTimerTick:()=>{m("timerTick",g())},ticker:s()}),p=(({onStateChange:e,ticker:i})=>{const{getState:n,setState:r}=t({initialState:a.idle,context:{overtime:null},onStateChange:e});return{startOvertimeCountdown:({delay:t,type:e})=>{i.wait((()=>{r(a.active,{overtime:{time:t,type:e}})}),t)},getState:n}})({onStateChange:u,ticker:s()});let S=0;const g=t=>{const e=t||d.getState().context.timer;return{taskId:k.getState().context.currentTaskId,timer:e?{time:e.time,totalTime:e.totalTime,type:e.type}:null,timestamp:Date.now()}},v=()=>{S+=1,S>=o.set.length&&(S=0)},h=()=>{const t=o.set[S];if("task"===t)return k.getState().context.currentTaskId?(d.getState().context.timer||d.createTimer({time:o.taskTime,type:n.task}),k.setAppState(e.task)):k.setAppState(e.selectTask);if("shortBreak"===t)return d.createTimer({time:o.shortBreakTime,type:n.shortBreak}),k.setAppState(e.shortBreak);if("longBreak"===t)return d.createTimer({time:o.longBreakTime,type:n.longBreak}),k.setAppState(e.longBreak);throw new Error(`Unknown set item: "${t}"`)},f=()=>{const t=k.getState(),e=d.getState(),a=p.getState(),n=e.context.timer?{isActive:e.value===i.active,isInjected:e.context.timer.isInjected,isPaused:e.value===i.paused,time:e.context.timer.time,totalTime:e.context.timer.totalTime,type:e.context.timer.type}:null;return{value:t.value,currentTaskId:t.context.currentTaskId,timer:n,overtime:a.context.overtime}},I=()=>{const t=d.getState().value===i.paused;d.startTimer(),m(t?"timerResume":"timerStart",g())};return{completeTask:()=>{k.completeTask()},continueTask:()=>{h(),I()},getState:f,off:T,on:l,pauseTimer:()=>{d.pauseTimer(),m("timerPause",g())},selectNewTask:()=>{k.unsetCurrentTask(),h(),I()},selectTask:t=>{k.selectTask(t),h(),m("taskSelect",g())},setReady:()=>{h(),m("appInitialize",g())},skipTimer:()=>{m("timerSkip",g()),d.destroyTimer(),v(),h()},startTimer:I,switchTask:()=>{k.switchTask()},taskCompleteHandled:()=>{k.unsetCurrentTask(),h()},voidTask:()=>{m("taskVoid",g()),d.getState().value===i.active&&d.destroyTimer(),k.getState().value===e.taskTimerEndPrompt&&(S-=1,S<0&&(S=o.set.length-1)),k.voidTask()},voidPromptHandled:()=>{k.setAppState(e.shortBreak),d.createTimer({isInjected:!0,time:o.shortBreakTime,type:n.shortBreak}),I()}}}},"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).createPomelloService=e();
