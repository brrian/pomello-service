function t({initialState:t,context:e,onStateChange:n}){let i={value:t,context:e};return{getState:function(){return i},setState:function(t,e){i={value:null!=t?t:i.value,context:null!=e?e:i.context},n(i)}}}var e,n,i;!function(t){t.initializing="INITIALIZING",t.selectTask="SELECT_TASK",t.task="TASK",t.taskFinishPrompt="TASK_FINISH_PROMPT",t.taskVoidPrompt="TASK_VOID_PROMPT",t.taskTimerEndPrompt="TASK_TIMER_END_PROMPT",t.shortBreak="SHORT_BREAK",t.longBreak="LONG_BREAK"}(e||(e={})),function(t){t.idle="IDLE",t.ready="READY",t.active="ACTIVE",t.paused="PAUSED"}(n||(n={})),function(t){t.task="TASK",t.shortBreak="SHORT_BREAK",t.longBreak="LONG_BREAK"}(i||(i={}));const a=({onStateChange:e,onTimerEnd:i,onTimerTick:a,ticker:r})=>{const{getState:o,setState:s}=t({initialState:n.idle,context:{timer:null},onStateChange:e});function c(){r.start((()=>{!function(){const{timer:t}=o().context;t&&(1===t.time?(s(n.idle,{timer:null}),r.stop(),i(t)):s(null,{timer:Object.assign(Object.assign({},t),{time:t.time-1})}))}(),a()}))}return{createTimer:function({isInjected:t=!1,time:e,type:i}){s(n.ready,{timer:{isInjected:t,time:e,totalTime:e,type:i}})},destroyTimer:function(){s(n.idle,{timer:null}),r.stop()},pauseTimer:function(){s(n.paused),r.stop()},startTimer:function(){s(n.active),c()},getState:o}};module.exports=({createTicker:r,settings:o})=>{const{batchedEmit:s,emit:c,on:u,off:m}=(()=>{const t={},e=new Map;function n(e,n){var i;null===(i=t[e])||void 0===i||i.forEach((t=>t(n)))}return{batchedEmit:function(t,i){e.size>0?e.set(t,i):(e.set(t,i),setImmediate((function(){for(const[t,i]of e)n(t,i);e.clear()})))},emit:n,off:function(e,n){const i=t[e];i&&(t[e]=i.filter((t=>t!==n)))},on:function(e,n){var i;const a=null!==(i=t[e])&&void 0!==i?i:[];a.push(n),t[e]=a}}})(),l=function({onStateChange:n}){const{getState:i,setState:a}=t({initialState:e.initializing,context:{currentTaskId:null},onStateChange:n});return{completeTask:function(){a(e.taskFinishPrompt)},getState:i,selectTask:function(t){a(e.task,{currentTaskId:t})},setAppState:function(t){a(t)},switchTask:function(){a(e.selectTask,{currentTaskId:null})},unsetCurrentTask:function(){a(null,{currentTaskId:null})},voidTask:function(){a(e.taskVoidPrompt)}}}({onStateChange:f}),T=a({onStateChange:f,onTimerEnd:function(t){t.isInjected||d();l.getState().value===e.task?l.setAppState(e.taskTimerEndPrompt):p();c("timerEnd",S())},onTimerTick:function(){c("timerTick",S())},ticker:r()});let k=0;function f(){s("update",S())}function d(){k+=1,k>=o.set.length&&(k=0)}function p(){const t=o.set[k];if("task"===t)return l.getState().context.currentTaskId?(T.getState().context.timer||T.createTimer({time:o.taskTime,type:i.task}),l.setAppState(e.task)):l.setAppState(e.selectTask);if("shortBreak"===t)return T.createTimer({time:o.shortBreakTime,type:i.shortBreak}),l.setAppState(e.shortBreak);if("longBreak"===t)return T.createTimer({time:o.longBreakTime,type:i.longBreak}),l.setAppState(e.longBreak);throw new Error(`Unknown set item: "${t}"`)}function S(){const t=l.getState(),e=T.getState(),i=e.context.timer?{isActive:e.value===n.active,isInjected:e.context.timer.isInjected,isPaused:e.value===n.paused,time:e.context.timer.time,totalTime:e.context.timer.totalTime,type:e.context.timer.type}:null;return{value:t.value,currentTaskId:t.context.currentTaskId,timer:i}}function g(){const t=T.getState().value===n.paused;T.startTimer(),c(t?"timerResume":"timerStart",S())}return{completeTask:function(){l.completeTask()},continueTask:function(){p(),g()},getState:S,off:m,on:u,pauseTimer:function(){T.pauseTimer(),c("timerPause",S())},selectNewTask:function(){l.unsetCurrentTask(),p(),g()},selectTask:function(t){l.selectTask(t),p(),c("taskSelect",S())},setReady:function(){p(),c("appInitialize",S())},skipTimer:function(){c("timerSkip",S()),T.destroyTimer(),d(),p()},startTimer:g,switchTask:function(){l.switchTask()},taskCompleteHandled:function(){l.unsetCurrentTask(),p()},voidTask:function(){c("taskVoid",S()),T.getState().value===n.active&&T.destroyTimer(),l.getState().value===e.taskTimerEndPrompt&&(k-=1,k<0&&(k=o.set.length-1)),l.voidTask()},voidPromptHandled:function(){l.setAppState(e.shortBreak),T.createTimer({isInjected:!0,time:o.shortBreakTime,type:i.shortBreak}),g()}}};
