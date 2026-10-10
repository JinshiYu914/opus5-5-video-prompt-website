const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const REPO='https://github.com/yihui-dev/awesome-opus5-5-videos';
const CAT={motion:['动态图形','Motion graphics'],explainer:['讲解 / 科普','Explainers'],'3d':['3D 场景','3D scenes'],interactive:['游戏与交互','Games & interactive']};
const TAG={canvas:'Canvas',svg:'SVG',threejs:'Three.js',shader:'Shader',gsap:'GSAP',css:'CSS',audio:'音频 Audio',particles:'粒子 Particles',playable:'可玩 Playable',pixel:'像素 Pixel','ai-image':'AI 图像',physics:'物理 Physics',webgl:'WebGL'};
let I=[],FT=null,shown=60;const st={q:'',c:'',t:'',exp:false,full:false,sort:'new'};const C={};
function get(u){if(C[u])return C[u];const c=new AbortController(),t=setTimeout(()=>c.abort(),15000);
 return C[u]=fetch(u,{signal:c.signal}).then(r=>{clearTimeout(t);if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).catch(e=>{delete C[u];throw e})}
function fail(e){$('#app').innerHTML=`<div class="page"><div class="box"><h4>加载失败</h4>网络较慢或连接中断（${esc(e.name=='AbortError'?'超过 15 秒未响应':e.message)}）。<br><button class="btn" onclick="route()">重试</button> <a href="${REPO}" target="_blank">或直接访问源仓库 ↗</a></div></div>`}
const loading=()=>$('#app').innerHTML='<p class="loading">加载中…</p>';
const copy=(t,b)=>{(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(()=>{const a=document.createElement('textarea');a.value=t;document.body.append(a);a.select();document.execCommand('copy');a.remove()}).finally(()=>{b.textContent='已复制 ✓';setTimeout(()=>b.textContent=b.dataset.l,1500)})};
onhashchange=route;route();
function route(){const h=location.hash.slice(2);
 if(h.startsWith('v/')){scrollTo(0,0);loading();return get('data/items/'+h.slice(2)+'.json').then(detail).catch(fail)}
 if(h=='how'){scrollTo(0,0);return how()}if(h=='about'){scrollTo(0,0);loading();return get('data/license.json').then(about).catch(fail)}
 if(I.length)return home();loading();get('data/index.json').then(d=>{I=d;home()}).catch(fail)}
function home(){const n=k=>I.filter(x=>x.c==k).length;
 $('#app').innerHTML=`<section class="hero" style="grid-template-columns:1fr"><div><h1>Opus 5.5 视频提示词：${I.length} 条</h1>
 <p>这些视频都是让 Claude Opus 5.5 把动画写成代码（HTML、Canvas、SVG、Three.js 等）做出来的。每条都附创作者分享的提示词；没有公开提示词的，就附原帖。挑一条，复制提示词，交给你自己的 agent 试试。</p>
 <p class="note">中文说明译自源仓库 README。🔬 绿色标记 = 源仓库分类为 Explainers（讲解类），适合做科普视频的参考。</p></div></section>
 <div class="bar"><input id="q" placeholder="搜索提示词全文 / 作者…" value="${esc(st.q)}">
 <select id="c"><option value="">全部分类</option>${Object.entries(CAT).map(([k,v])=>`<option value="${k}" ${st.c==k?'selected':''}>${v[0]} (${n(k)})</option>`).join('')}</select>
 <select id="t"><option value="">全部技术标签</option>${Object.entries(TAG).map(([k,v])=>`<option value="${k}" ${st.t==k?'selected':''}>${v} (${I.filter(x=>x.t.includes(k)).length})</option>`).join('')}</select>
 <select id="sort"><option value="new">最新加入</option><option value="exp" ${st.sort=='exp'?'selected':''}>讲解类优先</option></select>
 <span class="chip sci ${st.exp?'on':''}" id="exp">🔬 只看讲解 / 科普</span><span class="chip ${st.full?'on':''}" id="full">隐藏不完整提示词</span><span class="count" id="cnt"></span></div><div class="grid" id="g" style="margin-top:16px"></div><div class="more" id="more"></div>`;
 $('#q').oninput=e=>{st.q=e.target.value;shown=60;list()};['c','t','sort'].forEach(k=>$('#'+k).onchange=e=>{st[k]=e.target.value;shown=60;list()});
 $('#exp').onclick=e=>{st.exp=!st.exp;e.target.classList.toggle('on');shown=60;list()};$('#full').onclick=e=>{st.full=!st.full;e.target.classList.toggle('on');shown=60;list()};list()}
function list(){const q=st.q.toLowerCase().trim();if(q.length>=2&&!FT){FT={};get('data/search.json').then(d=>{FT=d;list()}).catch(()=>{})}
 let L=I.filter(x=>(!st.c||x.c==st.c)&&(!st.t||x.t.includes(st.t))&&(!st.exp||x.c=='explainer')&&(!st.full||!x.p)&&(!q||(x.a+' '+x.h).toLowerCase().includes(q)||(FT&&FT[x.s]||'').includes(q)));
 L.sort((a,b)=>(st.sort=='exp'?(b.c=='explainer')-(a.c=='explainer'):0)||b.d.localeCompare(a.d));
 $('#cnt').textContent=`${L.length} / ${I.length} 条${q.length>=2&&FT&&!Object.keys(FT).length?'（全文索引加载中…）':''}`;
 $('#g').innerHTML=L.slice(0,shown).map(x=>`<a class="card" href="#/v/${x.s}"><div class="im">${x.i?`<img loading="lazy" src="img/${x.s}.jpg" alt="">`:'<div class="ph">暂无封面</div>'}<span class="badges">${x.c=='explainer'?'<span class="b x">🔬 讲解</span>':''}${x.p?'<span class="b p">部分提示词</span>':''}</span></div>
 <div class="tx"><h3>@${esc(x.a)}</h3><div class="en">${CAT[x.c]?.[0]||x.c} · ${x.d}</div><div class="ln">${esc(x.h)}</div>${x.t.map(t=>`<span class="tag">${esc(TAG[t]||t)}</span>`).join('')}</div></a>`).join('')||'<p class="note">没有匹配的提示词。</p>';
 $('#more').innerHTML=L.length>shown?`<button class="btn" id="mb">再显示 60 条（还剩 ${L.length-shown}）</button>`:'';if($('#mb'))$('#mb').onclick=()=>{shown+=60;list()}}
function detail(v){$('#app').innerHTML=`<div class="detail"><div class="crumb"><a href="#/">全部提示词</a> / ${CAT[v.category]?.[0]||v.category}</div><h1>Opus 5.5 视频 · @${esc(v.author)}</h1>
 <div class="sub">分类：${CAT[v.category]?.join(' · ')||v.category} · 收录日期 ${v.added}${v.category=='explainer'?' · 🔬 讲解类，适合科普参考':''}</div>
 <div class="dgrid"><div>${v.img?`<img loading="lazy" src="${v.img}" style="width:100%;border-radius:10px">`:'<div class="ph" style="height:240px">暂无封面</div>'}<p class="note">封面图来自源仓库收录的原视频封面（<a href="${esc(v.poster_url)}" target="_blank">原图</a>，本站缩小保存）。</p></div>
 <div><div class="box"><h4>链接</h4><a class="btn" href="${esc(v.post_url)}" target="_blank">X 原帖 ↗</a><a class="btn ghost" href="${esc(v.skillry_url)}" target="_blank">原片与复刻（Skillry）↗</a><a class="btn ghost" href="${esc(v.file)}" target="_blank">仓库条目 ↗</a></div><br>
 <div class="box"><h4>复刻所用技术（Remake built with）</h4>${v.tech_tags.map(t=>`<span class="tag">${esc(TAG[t]||t)}</span>`).join('')||'—'}<p class="note">源仓库的这些标签描述的是 Skillry 复刻版用到的技术，不一定是原作者用的。</p></div></div></div>
 <h3>提示词（原文）</h3>${v.prompt_partial?'<p class="warn">⚠️ 源仓库标注：作者只分享了部分提示词（The author shared only part of the prompt），或只在帖子里描述了效果。</p>':''}
 <button class="btn" id="cp" data-l="一键复制提示词">一键复制提示词</button><pre class="prompt">${esc(v.prompt)}</pre></div>`;$('#cp').onclick=e=>copy(v.prompt,e.target)}
function how(){$('#app').innerHTML=`<div class="page"><h1>怎么用一条提示词</h1><div class="box"><h4>中文（译自源仓库 README）</h4><ol><li>打开一条提示词，复制 <b>Prompt</b> 下面那段。</li><li>粘贴给 Claude Opus 5.5（Claude Code、Claude 应用，或任何用 Opus 5.5 的 agent）。</li><li>让它把结果做成一个单独的 HTML 文件；想要视频的话，把页面录下来。</li></ol>有些创作者只分享了部分提示词，或只在帖子里描述了效果，这些条目会注明。</div><br>
 <div class="box"><h4>英文原文 · How to use a prompt</h4><ol><li>Open a prompt file and copy the block under <b>Prompt</b>.</li><li>Paste it into Claude Opus 5.5 (Claude Code, the Claude app, or any agent running Opus 5.5).</li><li>Ask it to render the result as a single HTML file, then record the page if you want a video.</li></ol>Some creators shared only part of their prompt, or only described the result in their post; those files say so.</div></div>`}
function about(d){$('#app').innerHTML=`<div class="page"><h1>来源与许可</h1><div class="box">数据来自 <a href="${REPO}" target="_blank">${REPO}</a>。源仓库的致谢说明（中文译文）：每个视频和提示词都归创作者所有，每条都链接到创作者；预览是为这个列表托管的短片段；创作者如果希望修改或删除某条，请到源仓库提 issue。<br>完整合集（原片与复刻并排）：<a href="https://skillry.dev/ai-videos/opus-5-5" target="_blank">skillry.dev/ai-videos/opus-5-5</a>。<br>本站是非官方的中文浏览站，中文说明由本站翻译；封面图是从源仓库收录的封面缩小保存的。</div><h3>LICENSE（原文）</h3><pre>${esc(d.license)}</pre></div>`}
