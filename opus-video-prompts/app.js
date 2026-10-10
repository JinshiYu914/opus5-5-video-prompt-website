const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const REPO='https://github.com/joeseesun/opus-video-prompts';let D=null;const st={q:'',g:'',sci:false},cs={c:'',sci:false,q:''},C={};
function get(u){if(C[u])return C[u];const c=new AbortController(),t=setTimeout(()=>c.abort(),15000);
 return C[u]=fetch(u,{signal:c.signal}).then(r=>{clearTimeout(t);if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).catch(e=>{delete C[u];throw e})}
function fail(e){$('#app').innerHTML=`<div class="page"><div class="box"><h4>加载失败</h4>网络较慢或连接中断（${esc(e.name=='AbortError'?'超过 15 秒未响应':e.message)}）。<br><button class="btn" onclick="route()">重试</button> <a href="${REPO}" target="_blank">或直接访问源仓库 ↗</a></div></div>`}
const loading=()=>$('#app').innerHTML='<p class="loading">加载中…</p>';
const copy=(t,b)=>{(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(()=>{const a=document.createElement('textarea');a.value=t;document.body.append(a);a.select();document.execCommand('copy');a.remove()}).finally(()=>{b.textContent='已复制 ✓';setTimeout(()=>b.textContent=b.dataset.l,1500)})};
const idx=f=>D?f():(loading(),get('data/index.json').then(d=>{D=d;f()}).catch(fail));
onhashchange=route;route();
function route(){const h=location.hash.slice(2);scrollTo(0,0);
 if(h.startsWith('p/')){loading();return get('data/p/'+h.slice(2)+'.json').then(detail).catch(fail)}
 const pg={tips:'💡 写法经验 · ⚠️ 局限与成本',routes:'🛠 技术路线',intro:'这是什么 · ⚡ 三分钟上手',sources:'📚 资料来源 · 声明'}[h];
 if(pg){loading();return get('data/pages/'+h+'.json').then(html=>page(pg,html,h)).catch(fail)}
 if(h=='cases')return idx(cases);idx(home)}
const ph='<div class="ph">暂无真实预览图</div>';
function home(){const gs=[...new Set(D.prompts.map(p=>p.group))];
 $('#app').innerHTML=`<section class="hero" style="grid-template-columns:1fr"><div><h1>Claude Opus 5.5 “用代码拍视频”</h1><p><b>全网案例与可直接复制的提示词</b> · 18 份完整提示词 · 54 个公开案例 · 9 种技术路线</p>
 <p class="q">Opus 5.5 本身不输出视频文件。它的做法是写代码画出每一帧……所以它擅长动态图形、手绘/线稿/水墨动画、科普讲解、产品发布片、歌词 MV，不擅长写实的真人镜头。<a href="#/intro">（阅读全文）</a></p>
 <p class="note">以上文字摘自源仓库 README。🔬 绿色标记 = 源仓库「案例总览」把对应案例归为「科普讲解」。</p></div></section>
 <div class="bar"><input id="q" placeholder="搜索标题 / 作者 / 分组…" value="${esc(st.q)}"><select id="g"><option value="">全部分组</option>${gs.map(g=>`<option ${st.g==g?'selected':''}>${esc(g)}</option>`).join('')}</select>
 <span class="chip sci ${st.sci?'on':''}" id="sci">🔬 只看科普讲解</span><span class="count" id="cnt"></span></div><div id="list"></div>`;
 $('#q').oninput=e=>{st.q=e.target.value;list()};$('#g').onchange=e=>{st.g=e.target.value;list()};$('#sci').onclick=e=>{st.sci=!st.sci;e.target.classList.toggle('on');list()};list()}
function list(){const q=st.q.toLowerCase(),L=D.prompts.filter(p=>(!st.g||p.group==st.g)&&(!st.sci||p.sci)&&(!q||(p.title+p.author+p.group).toLowerCase().includes(q)));
 $('#cnt').textContent=`${L.length} / ${D.prompts.length} 份`;const g={};L.forEach(p=>(g[p.group]=g[p.group]||[]).push(p));
 $('#list').innerHTML=Object.entries(g).map(([k,a])=>`<section class="group"><h2>${esc(k)}<small>${a.length} 份</small></h2><div class="grid">${a.map(p=>`<a class="card" href="#/p/${p.slug}"><div class="im">${p.img?`<img loading="lazy" src="${p.img}" alt="">`:ph}<span class="num">${p.n}</span><span class="badges">${p.sci?'<span class="b x">🔬 科普讲解</span>':''}</span></div><div class="tx"><h3>${esc(p.title)}</h3><div class="en">${esc(p.author)}</div></div></a>`).join('')}</div></section>`).join('')||'<p class="note">没有匹配。</p>'}
function detail(p){const im=p.img;$('#app').innerHTML=`<div class="detail"><div class="crumb"><a href="#/">18 份提示词</a> / ${esc(p.group)}</div><h1>${p.n}. ${esc(p.title)}</h1>
 <div class="sub">作者：${esc(p.author)}${p.sci?' · 🔬 对应案例在源仓库中归为「科普讲解」':''}</div>
 <div class="dgrid"><div>${im?`<img loading="lazy" src="${im.src}" style="width:100%;border-radius:10px"><p class="note">图片：X 原帖媒体（${im.ref?'作者附的参考图，不是成片画面':'视频缩略图'}），<a href="${im.post}" target="_blank">原帖</a> · <a href="${im.url}" target="_blank">原图</a></p>`:'<div class="ph" style="height:220px">暂无真实预览图（来源未提供可用图片）</div>'}</div>
 <div><div class="box"><h4>来源</h4><a class="btn" href="${esc(p.source)}" target="_blank">原帖 / 来源 ↗</a><a class="btn ghost" href="${p.file}" target="_blank">仓库文件 ↗</a>${p.case?`<p class="note">对应案例：<a href="${esc(p.case_url)}" target="_blank">${esc(p.case)}</a></p>`:''}</div><br>
 ${p.note?`<div class="box"><h4>说明</h4>${esc(p.note)}</div>`:''}</div></div>
 <h3>提示词（${esc(p.label)}）</h3><button class="btn" id="cp" data-l="一键复制提示词">一键复制提示词</button><pre class="prompt">${esc(p.prompt)}</pre>
 <div class="box"><h4>怎么测</h4><pre style="background:none;color:inherit;padding:0">${esc(p.howto.replace(/^## 怎么测\s*/,''))}</pre></div></div>`;$('#cp').onclick=e=>copy(p.prompt,e.target)}
function cases(){const cats=[...new Set(D.cases.map(c=>c.category))];
 $('#app').innerHTML=`<div class="page"><h1>🎬 案例总览（54 条）</h1><p class="note">数据来自源仓库 cases.json；“—”表示原帖没有披露。图片为 X 原帖媒体。</p></div>
 <div class="bar"><input id="q" placeholder="搜索案例 / 作者 / 实现方式…" value="${esc(cs.q)}"><select id="c"><option value="">全部类别</option>${cats.map(c=>`<option ${cs.c==c?'selected':''}>${c}</option>`).join('')}</select><span class="chip sci ${cs.sci?'on':''}" id="sci">🔬 科普讲解</span><span class="count" id="cnt"></span></div><div class="grid" id="g" style="margin-top:16px"></div>`;
 $('#q').oninput=e=>{cs.q=e.target.value;cl()};$('#c').onchange=e=>{cs.c=e.target.value;cl()};$('#sci').onclick=e=>{cs.sci=!cs.sci;e.target.classList.toggle('on');cl()};cl()}
function cl(){const q=cs.q.toLowerCase(),L=D.cases.filter(c=>(!cs.c||c.category==cs.c)&&(!cs.sci||c.sci)&&(!q||(c.title+c.author+c.how).toLowerCase().includes(q)));$('#cnt').textContent=`${L.length} / 54 条`;
 $('#g').innerHTML=L.map(c=>`<a class="card" href="${esc(c.url)}" target="_blank"><div class="im">${c.img?`<img loading="lazy" src="${c.img}" alt="">`:ph}<span class="badges">${c.sci?'<span class="b x">🔬 科普讲解</span>':''}${c.imgref?'<span class="b r">参考图</span>':''}</span></div><div class="tx"><h3>${esc(c.title)}</h3><div class="en">${esc(c.category)} · ${esc(c.author)}</div><div class="ln" style="font-style:normal">${esc(c.how)}</div><span class="tag">耗时成本：${esc(c.cost)}</span></div></a>`).join('')}
function page(t,html,k){$('#app').innerHTML=`<div class="page"><h1>${t}</h1><p class="note">以下为源仓库 README 原文。</p><div class="md" style="border-radius:12px">${html}</div>${k=='sources'?`<div class="box" style="margin-top:16px"><h4>本站说明</h4>源仓库 <a href="${REPO}" target="_blank">${REPO}</a> 没有附 LICENSE 文件；按其「声明」，提示词和视频作品版权归原作者所有。本站只做浏览索引，图片为 X 原帖公开媒体的缩小版，均链接回原帖。</div>`:''}</div>`;
 document.querySelectorAll('.md pre').forEach(p=>{const b=document.createElement('button');b.className='btn ghost';b.textContent=b.dataset.l='复制';b.onclick=()=>copy(p.innerText,b);p.before(b)})}
