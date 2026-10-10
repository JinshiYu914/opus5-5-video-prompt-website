let D,S=[];const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const REPO='https://github.com/lemomo-ai/lemo-opuscar',st={q:'',cat:'',use:'',sci:false,exp:false};
const C={};function get(u){if(C[u])return C[u];const c=new AbortController(),t=setTimeout(()=>c.abort(),15000);
 return C[u]=fetch(u,{signal:c.signal}).then(r=>{clearTimeout(t);if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).catch(e=>{delete C[u];throw e})}
function fail(e){$('#app').innerHTML=`<div class="page"><div class="box"><h4>加载失败</h4>网络较慢或连接中断（${esc(e.name=='AbortError'?'超过 15 秒未响应':e.message)}）。<br><button class="btn" onclick="route()">重试</button> <a href="https://github.com/lemomo-ai/lemo-opuscar" target="_blank">或直接访问源仓库 ↗</a></div></div>`}
const loading=()=>$('#app').innerHTML='<p class="loading">加载中…</p>';
const needIdx=f=>S.length?f():(loading(),get('data/index.json').then(d=>{S=d;f()}).catch(fail));
const page=k=>get('data/pages/'+k+'.json');onhashchange=route;route();
const copy=(t,b)=>{(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(()=>{const a=document.createElement('textarea');a.value=t;document.body.append(a);a.select();document.execCommand('copy');a.remove()}).finally(()=>{b.textContent='已复制 ✓';setTimeout(()=>b.textContent=b.dataset.l,1500)})};
function route(){const h=location.hash.slice(2);scrollTo(0,0);
 if(h.startsWith('style/')){const sl=h.slice(6);loading();return get('data/styles/'+sl+'.json').then(detail).catch(fail)}
 const pg={use:'use',director:'director',technique:'technique',agents:'agents',about:'license'}[h];
 if(pg){loading();return page(pg).then(v=>({use,director:()=>guide('director',v),technique:()=>guide('technique',v),agents:()=>guide('agents',v),about}[h])(v)).catch(fail)}
 needIdx(home)}
function home(){const cats=[...new Set(S.map(s=>s.cat))],uses=[...new Set(S.flatMap(s=>s.uses))].sort();
 $('#app').innerHTML=`<section class="hero"><div><h1>43 种影片风格，<br>每种都配一支完全用代码做出来的短片。</h1>
 <p>选一个风格，带上你自己的故事，让你的编程 agent 来当导演。</p>
 <p class="q">这不是一个 awesome 合集。这里所有的片子都是我自己用 Claude Opus 5.5 做的。风格是按 Opus 5.5 调出来的，换成其他模型不保证能做出同样的效果。<br>每一支片子都是 AI agent 写代码导演、作画、配乐、混音的：Canvas 和 WebGL 页面逐帧渲染，用免费采样库写原创配乐，TTS 配音。不用视频生成，也不用素材库画面。</p>
 <p class="note">以上文字摘自仓库官方中文 README（README.zh-CN.md）。</p>
 <a class="btn" href="#/use">怎么用（Opus 5.5）</a><a class="btn ghost" href="${REPO}" target="_blank">GitHub 仓库 ↗</a><a class="btn ghost" href="https://lemomo-ai.github.io/lemo-opuscar/" target="_blank">官方图鉴 ↗</a></div>
 <img loading="lazy" src="img/cover.jpg" alt="全部风格（docs/cover.jpg）"></section>
 <div class="bar"><input id="q" placeholder="搜索：中文名 / 英文名 / 示范片 / 用途 / STYLE.md 全文…" value="${esc(st.q)}">
 <select id="cat"><option value="">全部分组</option>${cats.map(c=>`<option ${st.cat==c?'selected':''}>${c}</option>`).join('')}</select>
 <select id="use"><option value="">全部用途</option>${uses.map(u=>`<option value="${esc(u)}" ${st.use==u?'selected':''}>${esc(S.find(s=>s.uses.includes(u)).uses_cn[S.find(s=>s.uses.includes(u)).uses.indexOf(u)])} · ${esc(u)}</option>`).join('')}</select>
 <span class="chip sci ${st.sci?'on':''}" id="sci">🔬 科学 / 太空</span><span class="chip ${st.exp?'on':''}" id="exp">📘 讲解 / 教学</span><span class="count" id="cnt"></span></div><div id="list"></div>`;
 $('#q').oninput=e=>{st.q=e.target.value;list()};$('#cat').onchange=e=>{st.cat=e.target.value;list()};$('#use').onchange=e=>{st.use=e.target.value;list()};
 $('#sci').onclick=e=>{st.sci=!st.sci;e.target.classList.toggle('on');list()};$('#exp').onclick=e=>{st.exp=!st.exp;e.target.classList.toggle('on');list()};list()}
let FT=null;function list(){const q=st.q.toLowerCase();if(q.length>=2&&!FT){FT={};get('data/search.json').then(d=>{FT=d;list()}).catch(()=>{})}const L=S.filter(s=>(!st.cat||s.cat==st.cat)&&(!st.use||s.uses.includes(st.use))&&(!st.sci||s.science)&&(!st.exp||s.explainer)&&(!q||[s.cn,s.en,s.slug,s.film,s.line,s.line_cn,...s.uses,...s.uses_cn,FT&&FT[s.slug]||''].join(' ').toLowerCase().includes(q)));
 $('#cnt').textContent=`${L.length} / ${S.length} 种`;const g={};L.forEach(s=>(g[s.cat]=g[s.cat]||[]).push(s));
 $('#list').innerHTML=Object.entries(g).map(([c,a])=>`<section class="group"><h2>${c}<small>${a[0].cat_en} · ${a.length}</small></h2><div class="grid">${a.map(card).join('')}</div></section>`).join('')||'<p class="note">没有匹配的风格。</p>'}
const card=s=>`<a class="card" href="#/style/${s.slug}"><div class="im">${s.thumb?`<img loading="lazy" src="${s.thumb}" alt="">`:''}<span class="num">#${s.num}</span><span class="badges">${s.science?'<span class="b s">科学</span>':''}${s.explainer?'<span class="b e">讲解</span>':''}</span></div>
 <div class="tx"><h3>${esc(s.cn)}</h3><div class="en">${esc(s.en)} · <i>${esc(s.film)}</i></div><div class="ln">${esc(s.line_cn)}</div>${s.uses_cn.map(u=>`<span class="tag">${esc(u)}</span>`).join('')}</div></a>`;
function detail(s){const g=s.gallery,ex=`用「${s.cn}」风格做一支 30 秒的片子，讲……`;
 $('#app').innerHTML=`<div class="detail"><div class="crumb"><a href="#/">风格图鉴</a> / ${s.cat} / #${s.num}</div><h1>${esc(s.cn)} <span style="font-weight:400">${esc(s.en)}</span></h1>
 <div class="sub">示范片《${esc(s.film)}》${s.dur?` · ${Math.round(s.dur)} 秒`:''} · 文件夹 <code>${s.slug}</code></div>
 <div class="dgrid"><div><video controls preload="none" poster="${g[0]?.src||''}"><source src="${s.video}" type="video/mp4"></video>
 <p class="note">示范片视频直接从仓库 GitHub Release（films）加载：<a href="${s.video}" target="_blank">下载 ${s.slug}.mp4</a>。下面是仓库里的画面（${g.length} 张）：</p>
 <div class="thumbs">${g.map((x,i)=>`<img loading="lazy" src="${x.src}" title="${esc(x.cap)}" data-i="${i}" class="${i?'':'on'}">`).join('')}</div><p class="note" id="cap">${esc(g[0]?.cap||'')}</p></div>
 <div><div class="box"><h4>一句话（官方中文）</h4>${esc(s.line_cn)}<br><span class="note">${esc(s.line)}</span></div><br>
 <div class="box"><h4>适合用途（仓库 style.json；中文为本站翻译）</h4>${s.uses.map((u,i)=>`<span class="tag">${esc(s.uses_cn[i])} · ${esc(u)}</span>`).join('')}
 ${s.science?'<p class="note">🔬 用途里写明了科学 / 太空类，适合科普讲解。</p>':s.explainer?'<p class="note">📘 用途里写明了讲解 / 教学类。</p>':''}</div><br>
 <div class="box"><h4>怎么用</h4>按 README 的说法，装好 skill 之后直接对 agent 说，例如：<pre>${esc(ex)}</pre>风格可以用中文名、英文名或文件夹名（<code>${s.slug}</code>）。<br>
 <button class="btn" data-l="复制 STYLE.md 原文" id="cpy">复制 STYLE.md 原文</button><a class="btn ghost" target="_blank" href="${REPO}/tree/main/styles/${s.slug}">仓库目录 ↗</a></div></div></div>
 <div class="tabs"><button class="on" data-t="style">STYLE.md（风格提示词·英文原文）</button>${s.demo_html?'<button data-t="demo">DEMO.md（示范片说明）</button>':''}${s.srt?'<button data-t="srt">示范片字幕 .srt</button>':''}</div><div class="md" id="tab"></div>
 <p class="note">STYLE.md 是写给 agent 的风格设定：只规定外观、色彩、字体、运动、镜头语法、声音、标志性手法和常见坑，故事由你来定（AGENTS.md：“STYLE.md is fixed… Everything else is yours to direct”）。</p></div>`;
 const tab=t=>{$('#tab').innerHTML=t=='style'?s.style_html:t=='demo'?s.demo_html:`<pre>${esc(s.srt)}</pre>`;document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t==t))};
 document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>tab(b.dataset.t));tab('style');$('#cpy').onclick=e=>copy(s.style_md,e.target);
 document.querySelectorAll('.thumbs img').forEach(im=>im.onclick=()=>{const x=g[im.dataset.i];const v=$('video');v.pause();v.setAttribute('poster',x.src);v.load();$('#cap').textContent=x.cap;document.querySelectorAll('.thumbs img').forEach(i=>i.classList.toggle('on',i==im))})}
const GUIDE={director:{t:'导演指南 DIRECTOR.md',i:'本库每一支片子背后的导演方法。配合一份 <code>styles/&lt;slug&gt;/STYLE.md</code>（风格）和 TECHNIQUE.md（怎么做）使用。你是导演，不是在做技术演示。一部片子按这个顺序评判：<b>声音、节奏、镜头、导演</b>（表演、调度、情感弧线）。好看的画面只是起点。',
 toc:['1. 接下需求 Take the brief','2. 先找一个标杆 Find a benchmark first','3. 塑造故事 Shape the story','4. 写处理方案 Write the treatment','5. 证明画面成立 Prove the look（故事板仅在用户要求时做）','6. 声音是电影的一半 Sound is half the film','7. 节奏：音乐网格先行 Rhythm: the music grid comes first','8. 镜头：每个镜头都要有理由 Camera: every shot needs a reason','9. 表演 Performance','10. 我们最常见的失败 The failures we saw most','11. 交付之前 Before you deliver','12. 版权红线 Copyright red lines']},
 technique:{t:'技术指南 TECHNIQUE.md',i:'这里每一支片子都由代码做成：不用视频生成，不用素材库画面。本页讲解制作管线，可以用仓库 <code>core/</code> 里的工具复现，也可以用你自己的技术栈。配合 DIRECTOR.md 和一份 <code>styles/&lt;slug&gt;/STYLE.md</code> 使用。所有命令和参数见 <code>core/README.md</code>。',
 toc:['1. 环境要求与安装 Requirements and install','2. 画面是时间的函数 The picture is a function of time','3. 一条时间线驱动一切 One timeline drives everything','4. 配音 Voice','5. 配乐 Music','6. 音效与混音 Sound effects and mix','7. 字幕 Subtitles','8. 审片循环 Review loop','9. 3D 注意事项 3D notes','10. 用代码画角色 Characters drawn in code','11. 素材、署名与字体 Assets, credits and fonts','12. 在示范片里去哪找 Where to look in our demos']},
 agents:{t:'给 Agent 的说明 AGENTS.md',i:'这个仓库是一个影片风格库。每种风格有一份 <code>styles/&lt;slug&gt;/STYLE.md</code>（这个风格是什么）和一支完全用代码做出来的示范片（DEMO.md 和 demo/）。用户选一个风格，请 agent 拍一支关于他们<b>自己</b>主题的片子；agent 的工作是导演并制作这支片子。要点：STYLE.md 是固定的，必须全部遵守；故事、结构、角色、场景、镜头、时间点等都由 agent 根据用户主题来导；先写自己的 TREATMENT.md（三个候选结构并选定一个），之后才看 DEMO.md 或示范代码，而且只学技术，不抄它的故事、镜头和时间线；不要在 <code>styles/</code> 里面直接做片。',toc:[]}};
function guide(k,html){const g=GUIDE[k];$('#app').innerHTML=`<div class="page"><h1>${g.t}</h1><div class="box"><h4>中文导读（本站翻译）</h4>${g.i}${g.toc.length?`<ol class="toc" style="list-style:none">${g.toc.map(x=>`<li>${x}</li>`).join('')}</ol>`:''}</div>
 <p class="note">以下为仓库英文原文，未改动。<button class="btn ghost" id="cp" data-l="复制全文">复制全文</button> <a href="${REPO}/blob/main/${k.toUpperCase()}.md" target="_blank">在 GitHub 查看 ↗</a></p><div class="md" style="border-radius:12px">${html}</div></div>`;
 $('#cp').onclick=e=>copy($('.md').innerText,e.target)}
function use(html){$('#app').innerHTML=`<div class="page"><h1>怎么用（配合 Claude Opus 5.5）</h1><p class="note">以下内容是仓库官方中文 README（README.zh-CN.md）里「怎么用」一节的原文。</p><div class="md" style="border-radius:12px">${html}</div></div>`;
 document.querySelectorAll('.md pre').forEach(p=>{const b=document.createElement('button');b.className='btn ghost';b.textContent=b.dataset.l='复制';b.onclick=()=>copy(p.innerText,b);p.before(b)})}
function about(lic){$('#app').innerHTML=`<div class="page"><h1>来源与许可</h1><div class="box">本站所有风格、图片、指南文字都来自 <a href="${REPO}" target="_blank">${REPO}</a>（作者 Lemomo / LemoLab，<a href="https://x.com/lemomo_ai" target="_blank">@lemomo_ai</a>）。示范片视频从该仓库的 GitHub Release 加载。本站是非官方的中文导览：中文导读、用途标签的中文翻译由本站添加，其余为原文。图片都是从仓库原图缩小的。</div><h3>LICENSE（原文）</h3><pre>${esc(lic)}</pre></div>`}
