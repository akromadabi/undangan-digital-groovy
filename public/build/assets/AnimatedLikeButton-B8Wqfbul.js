import{r as t,j as e}from"./app-DIMguZl3.js";import{H as d}from"./heart-DL6q-phC.js";function h({count:a=0,liked:s=!1,onClick:i}){const[n,c]=t.useState(!1),[p,y]=t.useState(a),[m,f]=t.useState(null),l=t.useRef(a),u=t.useRef(null);t.useEffect(()=>{a!==l.current&&(f(a>l.current?"up":"down"),clearTimeout(u.current),u.current=setTimeout(()=>{y(a),f(null)},20)),l.current=a},[a]);const x=async r=>{r.preventDefault(),r.stopPropagation(),s||(c(!0),setTimeout(()=>c(!1),650)),i&&await i(r)};return e.jsxs("button",{onClick:x,className:`
                relative flex items-center gap-1.5 text-[11px] font-semibold 
                transition-all duration-300 select-none group/like
                ${s?"text-rose-500":"text-gray-400 hover:text-rose-400"}
            `,style:{fontVariantNumeric:"tabular-nums"},children:[e.jsxs("span",{className:"relative flex items-center justify-center w-6 h-6",children:[n&&e.jsx("span",{className:"absolute inset-0 rounded-full bg-rose-400 opacity-0",style:{animation:"like-burst 0.6s ease-out forwards"}}),n&&e.jsx(e.Fragment,{children:[...Array(6)].map((r,o)=>e.jsx("span",{className:"absolute w-1 h-1 rounded-full bg-rose-400",style:{animation:`like-particle-${o} 0.55s ease-out forwards`,"--deg":`${o*60}deg`}},o))}),e.jsx(d,{fill:s?"currentColor":"none",className:`
                        w-3.5 h-3.5 relative z-10
                        transition-all duration-300
                        ${s?"text-rose-500 scale-110":"text-gray-400 group-hover/like:text-rose-400"}
                        ${n?"animate-like-pop":""}
                    `})]}),e.jsx("span",{className:"relative overflow-hidden",style:{height:"1.1em",display:"inline-flex",alignItems:"center"},children:e.jsx("span",{className:"inline-block",style:{animation:m==="up"?"count-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards":m==="down"?"count-down 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards":"none"},children:p.toLocaleString("id-ID")},p)}),e.jsx("style",{children:`
                @keyframes like-burst {
                    0% { transform: scale(0); opacity: 0.6; }
                    70% { transform: scale(2.5); opacity: 0.15; }
                    100% { transform: scale(3); opacity: 0; }
                }

                @keyframes animate-like-pop {
                    0%   { transform: scale(1); }
                    40%  { transform: scale(1.5); }
                    70%  { transform: scale(0.85); }
                    100% { transform: scale(1.1); }
                }

                @keyframes count-up {
                    0%   { opacity: 0; transform: translateY(60%); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                @keyframes count-down {
                    0%   { opacity: 0; transform: translateY(-60%); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                /* Particle animations */
                @keyframes like-particle-0 { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(0,-14px) scale(0);opacity:0} }
                @keyframes like-particle-1 { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(12px,-8px) scale(0);opacity:0} }
                @keyframes like-particle-2 { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(12px,8px) scale(0);opacity:0} }
                @keyframes like-particle-3 { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(0,14px) scale(0);opacity:0} }
                @keyframes like-particle-4 { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(-12px,8px) scale(0);opacity:0} }
                @keyframes like-particle-5 { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(-12px,-8px) scale(0);opacity:0} }
            `})]})}export{h as A};
