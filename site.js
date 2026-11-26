/* 下層ページ共通：ヘッダーの色と、スクロールで出てくる動き */
(function(){
  var nav=document.getElementById("gnav"), hero=document.querySelector(".subhero");
  if(nav&&hero&&"IntersectionObserver" in window){
    new IntersectionObserver(function(es){nav.classList.toggle("solid",!es[0].isIntersecting)},{rootMargin:"-64px 0px 0px 0px"}).observe(hero);
  }
  var els=document.querySelectorAll(".rise");
  if(!("IntersectionObserver" in window)){els.forEach(function(e){e.classList.add("in")});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.1});
  els.forEach(function(e){io.observe(e)});
  setTimeout(function(){els.forEach(function(e){if(e.getBoundingClientRect().top<innerHeight)e.classList.add("in")})},1200);
})();
