import{r as x,j as e,R as j}from"./app-94tLnR1q.js";function u({durationHours:n=19,resellerRef:i="default"}){const[t,r]=x.useState(0);x.useEffect(()=>{const a=`promo_countdown_target_${i}`,w=(()=>{const c=localStorage.getItem(a),l=Date.now();if(c){const g=parseInt(c,10);if(g>l)return g}const m=l+n*60*60*1e3;return localStorage.setItem(a,m.toString()),m})(),f=()=>{const c=Date.now(),l=w-c;if(l<=0){const m=c+n*60*60*1e3;localStorage.setItem(a,m.toString()),r(n*60*60*1e3);return}r(l)};f();const h=setInterval(f,1e3);return()=>clearInterval(h)},[n,i]);const d=Math.floor(t/(1e3*60*60)),p=Math.floor(t%(1e3*60*60)/(1e3*60)),s=Math.floor(t%(1e3*60)/1e3),o=a=>String(a).padStart(2,"0");return e.jsxs("span",{className:"rl-countdown-timer",children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
                .rl-countdown-timer {
                    display: inline-flex;
                    align-items: center;
                    gap: 3px;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                    font-size: 0.75rem;
                    font-weight: 700;
                    vertical-align: middle;
                    margin-left: 6px;
                }
                .rl-countdown-icon {
                    margin-right: 2px;
                    font-size: 0.8rem;
                }
                .rl-countdown-box {
                    background: rgba(0, 0, 0, 0.25);
                    color: #ffffff;
                    padding: 2px 5px;
                    border-radius: 4px;
                    font-weight: bold;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    min-width: 20px;
                    text-align: center;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .rl-countdown-label {
                    font-size: 0.7rem;
                    opacity: 0.9;
                    font-weight: bold;
                    margin-right: 2px;
                }
            `}}),e.jsx("span",{className:"rl-countdown-icon",children:"⏱️"}),e.jsx("span",{className:"rl-countdown-box",children:o(d)}),e.jsx("span",{className:"rl-countdown-label",children:"j"}),e.jsx("span",{className:"rl-countdown-box",children:o(p)}),e.jsx("span",{className:"rl-countdown-label",children:"m"}),e.jsx("span",{className:"rl-countdown-box",children:o(s)}),e.jsx("span",{className:"rl-countdown-label",children:"d"})]})}function T({text:n="",showCountdown:i=!0,durationHours:t=19,resellerRef:r="default"}){if(!i){const s=n.replace(/{countdown}/g,"").trim();return e.jsx("span",{children:s})}const d="{countdown}";if(!n.includes(d))return e.jsxs("span",{className:"inline-flex items-center flex-wrap justify-center gap-1",children:[e.jsx("span",{children:n}),e.jsx(u,{durationHours:t,resellerRef:r})]});const p=n.split(d);return e.jsx("span",{className:"inline-flex items-center flex-wrap justify-center gap-1",children:p.map((s,o)=>e.jsxs(j.Fragment,{children:[s,o<p.length-1&&e.jsx(u,{durationHours:t,resellerRef:r})]},o))})}export{T as P};
