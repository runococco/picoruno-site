/* 全ページ共通のフッター：紙の丘の上の小さな町 */
{
  const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const f=document.getElementById("footWord");
  if(f){
    f.innerHTML=[...f.textContent].map((c,i)=>`<span style="--i:${i};--c:${["#fbf8f2","#f0db93","#e5b4ab","#a9bfcf"][i%4]};--r:${[-3,2,-2,3,-1,2,-3,2,0][i%9]}deg">${c}</span>`).join("");
    if("IntersectionObserver" in window){ const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ f.classList.add("on"); io.disconnect(); } }),{threshold:.4}); io.observe(f); }
  }
  if(document.getElementById("footHills"))
{ /* 紙の丘・うえへ */
  const svg=document.getElementById("footHills");
  const draw=()=>{ const W=svg.clientWidth||1200, H=svg.clientHeight||120, sp=W<640;
    let seed=7; const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
    const layer=(base,amp,n,col)=>{ let d=`M0 ${H} L0 ${base}`; for(let i=1;i<=n;i++){ const x=W*i/n, y=base-amp*(.4+.6*Math.sin(i*1.7+base))+ (rnd()-.5)*6; d+=` Q${(x-W/n/2).toFixed(1)} ${(y-amp*.6).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`; } return `<path d="${d} L${W} ${H}Z" fill="${col}"/>`; };
    const tree=(x,y,s,c1,c2)=>`<polygon points="${x},${y-30*s} ${x+12*s},${y} ${x},${y}" fill="${c2}"/><polygon points="${x},${y-30*s} ${x-12*s},${y} ${x},${y}" fill="${c1}"/>`;
    const house=(x,y,s,wall,roof)=>`<rect x="${x-11*s}" y="${y-16*s}" width="${22*s}" height="${16*s}" fill="${wall}"/><polygon points="${x-14*s},${y-15*s} ${x},${y-28*s} ${x+14*s},${y-15*s}" fill="${roof}"/><rect x="${x-3*s}" y="${y-9*s}" width="${6*s}" height="${9*s}" fill="#cf968c"/>`;
    let h=layer(H*.42,H*.22,sp?4:7,"#c9d3c2")+layer(H*.62,H*.18,sp?5:9,"#adbda6");
    const s=sp?.7:1;
    [[.08,.66],[.2,.6],[.47,.64],[.66,.58],[.93,.62]].forEach(([fx,fy],i)=>{ h+=tree(W*fx,H*fy+8,s*(1-i%2*.25),"#8fa287","#74876d"); });
    h+=house(W*.32,H*.7,s,"#fbf8f2","#e5b4ab")+house(W*.56,H*.74,s*.8,"#f2ebdd","#f0db93");
    h+=layer(H*.86,H*.12,sp?6:11,"#667960");
    svg.setAttribute("viewBox",`0 0 ${W} ${H}`); svg.innerHTML=h; };
  draw(); let fw=0; addEventListener("resize",()=>{ if(svg.clientWidth!==fw){ fw=svg.clientWidth; draw(); } });
  document.getElementById("footChick").addEventListener("click",()=>scrollTo({top:0,behavior:RM?"auto":"smooth"}));
}
}
