import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts"

/* ── GLOBAL CSS ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#05090F;color:#EEF4FF;font-family:'Plus Jakarta Sans',sans-serif}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:#0A1222}
::-webkit-scrollbar-thumb{background:#1E2F50;border-radius:4px}
.hov{transition:transform .2s,box-shadow .2s}
.hov:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,0,0,.5)!important}
.crow{transition:background .12s;cursor:pointer}
.crow:hover{background:rgba(34,211,238,.05)!important}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .3s ease forwards}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
.blink{animation:blink 2s ease-in-out infinite}
`

/* ── TOKENS ── */
const T = {
  bg:"#05090F", s0:"#08101E", s1:"#0C1626", s2:"#101D32",
  b1:"#162038", b2:"#1E2D4A", b3:"#263860",
  cyan:"#22D3EE", purple:"#8B5CF6", green:"#10B981",
  amber:"#F59E0B", red:"#F43F5E",
  txt:"#EEF4FF", sub:"#7C92B4", muted:"#3B4F6A",
}

/* ── DATA ── */
const CUSTS = [
  {id:1543,name:"Arjun Mehta",plan:"Enterprise",tenure:8,monthly:87.5,seg:"persuadable",churn:.83,sc:{usage:.28,support:.75,sentiment:.22,engagement:.31},cate:{call:.18,upgrade:.12,discount:.09,email:.04,reward:.14},best:"call",lift:.18,roi:9900,cost:100,rev:10000},
  {id:2891,name:"Priya Sharma",plan:"Pro",tenure:24,monthly:62,seg:"persuadable",churn:.76,sc:{usage:.35,support:.62,sentiment:.30,engagement:.38},cate:{call:.08,upgrade:.19,discount:.14,email:.06,reward:.11},best:"upgrade",lift:.19,roi:3504,cost:200,rev:7200},
  {id:3302,name:"Rohan Iyer",plan:"Basic",tenure:3,monthly:29.99,seg:"lost_cause",churn:.91,sc:{usage:.08,support:.88,sentiment:.10,engagement:.12},cate:{call:.01,upgrade:-.01,discount:.02,email:.00,reward:.01},best:null,lift:.02,roi:0,cost:0,rev:0},
  {id:4120,name:"Kavitha Nair",plan:"Pro",tenure:36,monthly:75,seg:"sure_thing",churn:.21,sc:{usage:.78,support:.25,sentiment:.82,engagement:.77},cate:{call:.03,upgrade:.02,discount:.04,email:.05,reward:.04},best:"email",lift:.05,roi:8900,cost:10,rev:900},
  {id:5567,name:"Deepak Rao",plan:"Enterprise",tenure:12,monthly:120,seg:"do_not_disturb",churn:.55,sc:{usage:.65,support:.40,sentiment:.48,engagement:.52},cate:{call:-.12,upgrade:-.06,discount:-.08,email:-.09,reward:-.07},best:null,lift:0,roi:0,cost:0,rev:0},
  {id:6031,name:"Sneha Pillai",plan:"Basic",tenure:6,monthly:45,seg:"persuadable",churn:.68,sc:{usage:.42,support:.58,sentiment:.35,engagement:.44},cate:{call:.15,upgrade:.08,discount:.22,email:.10,reward:.18},best:"discount",lift:.22,roi:1880,cost:500,rev:10900},
  {id:7284,name:"Vikram Singh",plan:"Pro",tenure:18,monthly:95,seg:"persuadable",churn:.72,sc:{usage:.31,support:.69,sentiment:.28,engagement:.33},cate:{call:.21,upgrade:.16,discount:.12,email:.07,reward:.13},best:"call",lift:.21,roi:11900,cost:100,rev:12000},
  {id:8445,name:"Ananya Krishnan",plan:"Enterprise",tenure:48,monthly:150,seg:"sure_thing",churn:.15,sc:{usage:.88,support:.18,sentiment:.91,engagement:.85},cate:{call:.02,upgrade:.05,discount:.03,email:.06,reward:.04},best:"email",lift:.06,roi:26900,cost:10,rev:2700},
  {id:9117,name:"Rahul Banerjee",plan:"Basic",tenure:2,monthly:25,seg:"lost_cause",churn:.88,sc:{usage:.12,support:.82,sentiment:.15,engagement:.10},cate:{call:-.01,upgrade:.00,discount:.01,email:.01,reward:.00},best:null,lift:.01,roi:0,cost:0,rev:0},
  {id:1001,name:"Meera Joshi",plan:"Pro",tenure:15,monthly:68,seg:"persuadable",churn:.79,sc:{usage:.25,support:.71,sentiment:.20,engagement:.27},cate:{call:.16,upgrade:.14,discount:.10,email:.05,reward:.12},best:"call",lift:.16,roi:7904,cost:100,rev:8016},
]

const SEG = {
  persuadable:{lbl:"Persuadable",clr:"#10B981",bg:"rgba(16,185,129,.12)"},
  sure_thing:{lbl:"Sure thing",clr:"#22D3EE",bg:"rgba(34,211,238,.12)"},
  lost_cause:{lbl:"Lost cause",clr:"#F43F5E",bg:"rgba(244,63,94,.12)"},
  do_not_disturb:{lbl:"Do not disturb",clr:"#F59E0B",bg:"rgba(245,158,11,.12)"},
}
const ACT = {
  call:{lbl:"Success call",clr:"#22D3EE",emoji:"📞"},
  upgrade:{lbl:"Premium upgrade",clr:"#8B5CF6",emoji:"⬆️"},
  discount:{lbl:"Discount",clr:"#10B981",emoji:"🏷"},
  email:{lbl:"Email campaign",clr:"#94A3B8",emoji:"✉️"},
  reward:{lbl:"Loyalty reward",clr:"#F59E0B",emoji:"🏆"},
}

const REV_DATA = [
  {m:"Jun",risk:380,saved:142},{m:"Jul",risk:410,saved:168},{m:"Aug",risk:395,saved:182},
  {m:"Sep",risk:435,saved:198},{m:"Oct",risk:460,saved:215},{m:"Nov",risk:448,saved:228},
  {m:"Dec",risk:475,saved:251},{m:"Jan",risk:490,saved:267},{m:"Feb",risk:468,saved:278},
  {m:"Mar",risk:512,saved:294},{m:"Apr",risk:498,saved:312},{m:"May",risk:524,saved:331},
]
const SEG_PIE = [
  {name:"Persuadable",value:1847,color:"#10B981"},
  {name:"Sure thing",value:2103,color:"#22D3EE"},
  {name:"Lost cause",value:1542,color:"#F43F5E"},
  {name:"Do not disturb",value:1551,color:"#F59E0B"},
]
const QINI = Array.from({length:21},(_,i)=>({pct:i*5,model:Math.min(i<10?i*9.8:49+i*2.6,98),random:i*5}))
const CATE_AVG = [
  {name:"Call",avg:16.8,color:"#22D3EE"},{name:"Upgrade",avg:14.2,color:"#8B5CF6"},
  {name:"Discount",avg:11.8,color:"#10B981"},{name:"Reward",avg:10.9,color:"#F59E0B"},
  {name:"Email",avg:5.4,color:"#94A3B8"},
]
const SHAP = [
  {f:"NPS Score",v:.248,pos:false},{f:"Support tickets",v:.181,pos:false},
  {f:"Login frequency",v:.152,pos:false},{f:"Tenure",v:.134,pos:true},
  {f:"Sentiment score",v:.121,pos:true},{f:"Monthly charges",v:.108,pos:false},
  {f:"Feature adoption",v:.093,pos:true},{f:"Escalation rate",v:.087,pos:false},
]

/* ── MINI COMPONENTS ── */
const card = (extra={}) => ({
  background:T.s1, border:`1px solid ${T.b2}`, borderRadius:12,
  padding:18, ...extra
})

function SegBadge({type}) {
  const s = SEG[type] || {lbl:type,clr:"#94A3B8",bg:"rgba(148,163,184,.12)"}
  return (
    <span style={{background:s.bg,color:s.clr,border:`1px solid ${s.clr}33`,
      borderRadius:100,fontSize:11,fontWeight:700,padding:"2px 10px",
      whiteSpace:"nowrap",letterSpacing:".02em"}}>
      {s.lbl}
    </span>
  )
}

function ActBadge({action}) {
  if (!action) return <span style={{color:T.muted,fontSize:12}}>—</span>
  const a = ACT[action]
  return (
    <span style={{background:`${a.clr}18`,color:a.clr,border:`1px solid ${a.clr}33`,
      borderRadius:100,fontSize:11,fontWeight:700,padding:"2px 10px"}}>
      {a.emoji} {a.lbl}
    </span>
  )
}

function Gauge({value}) {
  const pct = Math.round(value*100)
  const clr = value>.7 ? T.red : value>.4 ? T.amber : T.green
  const r=40,cx=55,cy=65
  const circ=2*Math.PI*r, arc=circ*.75
  return (
    <div style={{position:"relative",width:110,height:85}}>
      <svg width="110" height="85">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.b2} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={`${arc} ${circ}`}
          transform={`rotate(135,${cx},${cy})`}/>
        {value>0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke={clr} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={`${arc*value} ${circ}`}
          transform={`rotate(135,${cx},${cy})`}
          style={{filter:`drop-shadow(0 0 6px ${clr}80)`}}/>}
      </svg>
      <div style={{position:"absolute",top:14,left:0,right:0,textAlign:"center"}}>
        <div style={{fontSize:24,fontWeight:800,color:clr,fontFamily:"Syne,sans-serif",lineHeight:1}}>{pct}%</div>
        <div style={{fontSize:9,color:T.sub,letterSpacing:".06em",textTransform:"uppercase",marginTop:2}}>Churn Risk</div>
      </div>
    </div>
  )
}

function TT({active,payload,label,fmt}) {
  if (!active || !payload?.length) return null
  return (
    <div style={{background:T.s2,border:`1px solid ${T.b3}`,borderRadius:8,
      padding:"10px 14px",fontSize:12,minWidth:120}}>
      <div style={{color:T.sub,marginBottom:6,fontSize:11}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color||T.txt,fontWeight:600,marginBottom:2}}>
          {p.name}: {fmt ? fmt(p.value) : p.value}
        </div>
      ))}
    </div>
  )
}

/* ── PAGE 1: EXECUTIVE ── */
function ExecutivePage() {
  const topROI = useMemo(()=>
    CUSTS.filter(c=>c.best).sort((a,b)=>b.roi-a.roi).slice(0,5),[])

  return (
    <div className="fu" style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {lbl:"Revenue at risk",val:"₹5.24L",sub:"↑ 5.2% vs last month",clr:T.red},
          {lbl:"Revenue saved",val:"₹3.31L",sub:"↑ 12.4% YTD",clr:T.green},
          {lbl:"Persuadable",val:"1,847",sub:"Act now — highest ROI",clr:T.cyan},
          {lbl:"Best ROI achieved",val:"9,900%",sub:"#1543 · Success call",clr:T.purple},
        ].map((k,i)=>(
          <div key={i} className="hov" style={{...card({padding:16})}}>
            <div style={{fontSize:11,color:T.sub,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>{k.lbl}</div>
            <div style={{fontSize:26,fontWeight:800,color:k.clr,fontFamily:"Syne,sans-serif",lineHeight:1}}>{k.val}</div>
            <div style={{fontSize:11,color:k.clr,marginTop:5,opacity:.85}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        {/* Segment donut */}
        <div className="hov" style={{...card({width:230,flexShrink:0})}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:14,fontFamily:"Syne,sans-serif"}}>Customer segments</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <defs>
                {SEG_PIE.map((s,i)=>(
                  <filter key={i} id={`glow${i}`}>
                    <feDropShadow stdDeviation="3" floodColor={s.color} floodOpacity=".5"/>
                  </filter>
                ))}
              </defs>
              <Pie data={SEG_PIE} cx="50%" cy="50%" innerRadius={42} outerRadius={62}
                dataKey="value" paddingAngle={3}>
                {SEG_PIE.map((s,i)=><Cell key={i} fill={s.color}/>)}
              </Pie>
              <Tooltip content={<TT fmt={v=>`${v.toLocaleString()} (${Math.round(v/7043*100)}%)`}/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:6}}>
            {SEG_PIE.map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:8,height:8,borderRadius:2,background:s.color}}/>
                  <span style={{color:T.sub}}>{s.name}</span>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <span style={{fontWeight:700,color:T.txt}}>{s.value.toLocaleString()}</span>
                  <span style={{color:T.muted}}>{Math.round(s.value/7043*100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue area chart */}
        <div className="hov" style={{...card({flex:1,minWidth:260})}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:14,fontFamily:"Syne,sans-serif"}}>
            Revenue trend <span style={{fontSize:11,color:T.sub,fontWeight:400}}>(₹ thousands)</span>
          </div>
          <ResponsiveContainer width="100%" height={195}>
            <AreaChart data={REV_DATA} margin={{top:4,right:8,left:-10,bottom:0}}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.red} stopOpacity={.25}/>
                  <stop offset="100%" stopColor={T.red} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.green} stopOpacity={.25}/>
                  <stop offset="100%" stopColor={T.green} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke={T.b1} strokeDasharray="3 3"/>
              <XAxis dataKey="m" tick={{fill:T.sub,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.sub,fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip content={<TT fmt={v=>`₹${v}K`}/>}/>
              <Area type="monotone" dataKey="risk" name="At risk" stroke={T.red} fill="url(#rg)" strokeWidth={2}/>
              <Area type="monotone" dataKey="saved" name="Saved" stroke={T.green} fill="url(#gg)" strokeWidth={2}/>
              <Legend wrapperStyle={{fontSize:11,paddingTop:8}} iconType="square" iconSize={8}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top ROI table */}
      <div className="hov" style={card()}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:14,fontFamily:"Syne,sans-serif"}}>
          🎯 Top priority — highest ROI interventions
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${T.b2}`}}>
                {["Customer","Segment","Churn risk","Action","Lift","ROI","Revenue saved"].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"6px 10px",color:T.sub,fontWeight:600,letterSpacing:".03em",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topROI.map((c,i)=>(
                <tr key={c.id} className="crow" style={{borderBottom:`1px solid ${T.b1}`}}>
                  <td style={{padding:"10px 10px",fontWeight:600}}>{c.name}<span style={{color:T.muted,fontSize:10,marginLeft:5}}>#{c.id}</span></td>
                  <td style={{padding:"10px 10px"}}><SegBadge type={c.seg}/></td>
                  <td style={{padding:"10px 10px",fontWeight:700,color:c.churn>.7?T.red:c.churn>.4?T.amber:T.green}}>{Math.round(c.churn*100)}%</td>
                  <td style={{padding:"10px 10px"}}><ActBadge action={c.best}/></td>
                  <td style={{padding:"10px 10px",fontWeight:700,color:T.amber}}>+{Math.round(c.lift*100)}%</td>
                  <td style={{padding:"10px 10px",fontWeight:800,color:T.green,fontFamily:"Syne,sans-serif"}}>{c.roi.toLocaleString()}%</td>
                  <td style={{padding:"10px 10px",fontWeight:600,color:T.cyan}}>₹{c.rev.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ── PAGE 2: EXPLORER ── */
function ExplorerPage() {
  const [search, setSearch] = useState("")
  const [segFilter, setSegFilter] = useState("all")
  const [selected, setSelected] = useState(CUSTS[0])

  const filtered = useMemo(()=>CUSTS.filter(c=>{
    const q = search.toLowerCase()
    return (c.name.toLowerCase().includes(q)||String(c.id).includes(q)) &&
      (segFilter==="all"||c.seg===segFilter)
  }),[search,segFilter])

  const radarData = useMemo(()=>[
    {axis:"Usage",value:Math.round((selected?.sc.usage||0)*100)},
    {axis:"Support",value:Math.round((selected?.sc.support||0)*100)},
    {axis:"Sentiment",value:Math.round((selected?.sc.sentiment||0)*100)},
    {axis:"Engagement",value:Math.round((selected?.sc.engagement||0)*100)},
  ],[selected])

  const cateData = useMemo(()=>selected?Object.entries(selected.cate).map(([k,v])=>({
    name:ACT[k]?.lbl||k, value:+(v*100).toFixed(1),
    color:v>0?(ACT[k]?.clr||T.cyan):T.red
  })):[],[selected])

  return (
    <div className="fu" style={{display:"flex",gap:14,minHeight:580}}>
      {/* List panel */}
      <div style={{...card({width:260,flexShrink:0,padding:0,display:"flex",flexDirection:"column",overflow:"hidden"})}}>
        <div style={{padding:12,borderBottom:`1px solid ${T.b1}`}}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search customers…"
            style={{width:"100%",background:T.bg,border:`1px solid ${T.b2}`,
              borderRadius:8,padding:"7px 12px",color:T.txt,fontSize:12,
              outline:"none",fontFamily:"Plus Jakarta Sans,sans-serif"}}/>
          <div style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}>
            {["all","persuadable","sure_thing","lost_cause","do_not_disturb"].map(s=>(
              <button key={s} onClick={()=>setSegFilter(s)}
                style={{background:segFilter===s?(SEG[s]?.clr||T.cyan):T.b1,
                  color:segFilter===s?T.bg:T.sub,
                  border:"none",borderRadius:100,fontSize:10,
                  padding:"3px 9px",cursor:"pointer",
                  fontFamily:"Plus Jakarta Sans,sans-serif",fontWeight:600,
                  transition:"all .15s",whiteSpace:"nowrap"}}>
                {s==="all"?"All":(SEG[s]?.lbl||s)}
              </button>
            ))}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {filtered.map(c=>{
            const s=SEG[c.seg]||{}
            const cc=c.churn>.7?T.red:c.churn>.4?T.amber:T.green
            return (
              <div key={c.id} className="crow"
                onClick={()=>setSelected(c)}
                style={{padding:"10px 14px",borderBottom:`1px solid ${T.b1}`,
                  background:selected?.id===c.id?`rgba(34,211,238,.06)`:undefined}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,color:selected?.id===c.id?T.cyan:T.txt}}>{c.name}</div>
                    <div style={{fontSize:11,color:T.sub,marginTop:2}}>#{c.id} · {c.plan} · {c.tenure}mo</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:14,fontWeight:800,color:cc,fontFamily:"Syne,sans-serif"}}>{Math.round(c.churn*100)}%</div>
                    <SegBadge type={c.seg}/>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:12,overflowY:"auto"}}>
          {/* Header */}
          <div style={card()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontSize:11,color:T.sub,marginBottom:4,letterSpacing:".06em"}}>CUSTOMER #{selected.id}</div>
                <div style={{fontSize:20,fontWeight:800,fontFamily:"Syne,sans-serif"}}>{selected.name}</div>
                <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
                  <SegBadge type={selected.seg}/>
                  <span style={{color:T.sub,fontSize:12}}>{selected.plan} · {selected.tenure} months · ₹{selected.monthly}/mo</span>
                </div>
              </div>
              <Gauge value={selected.churn}/>
            </div>
          </div>

          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {/* Radar */}
            <div style={{...card({width:220,flexShrink:0})}}>
              <div style={{fontSize:12,fontWeight:700,marginBottom:10,fontFamily:"Syne,sans-serif"}}>Behavioral profile</div>
              <ResponsiveContainer width="100%" height={140}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={T.b2}/>
                  <PolarAngleAxis dataKey="axis" tick={{fill:T.sub,fontSize:10}}/>
                  <PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false}/>
                  <Radar dataKey="value" stroke={T.cyan} fill={T.cyan} fillOpacity={.15} strokeWidth={2}/>
                </RadarChart>
              </ResponsiveContainer>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:4}}>
                {Object.entries(selected.sc).map(([k,v])=>{
                  const bc=v<.3?T.red:v<.6?T.amber:T.green
                  return (
                    <div key={k}>
                      <div style={{fontSize:10,color:T.sub,textTransform:"capitalize"}}>{k}</div>
                      <div style={{height:3,background:T.b1,borderRadius:2,margin:"3px 0"}}>
                        <div style={{width:`${v*100}%`,height:3,background:bc,borderRadius:2}}/>
                      </div>
                      <div style={{fontSize:11,fontWeight:700,color:bc}}>{Math.round(v*100)}%</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recommendation */}
            {selected.best ? (
              <div style={{...card({flex:1,minWidth:180,background:`linear-gradient(135deg, ${ACT[selected.best]?.clr}12, ${T.s1})`})}}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:10,fontFamily:"Syne,sans-serif"}}>Recommended action</div>
                <div style={{fontSize:28,marginBottom:8}}>{ACT[selected.best]?.emoji}</div>
                <ActBadge action={selected.best}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:14}}>
                  <div><div style={{fontSize:10,color:T.sub}}>Lift</div><div style={{fontSize:22,fontWeight:800,color:T.amber,fontFamily:"Syne,sans-serif"}}>+{Math.round(selected.lift*100)}%</div></div>
                  <div><div style={{fontSize:10,color:T.sub}}>ROI</div><div style={{fontSize:22,fontWeight:800,color:T.green,fontFamily:"Syne,sans-serif"}}>{selected.roi.toLocaleString()}%</div></div>
                  <div><div style={{fontSize:10,color:T.sub}}>Cost</div><div style={{fontSize:22,fontWeight:800,fontFamily:"Syne,sans-serif"}}>₹{selected.cost}</div></div>
                  <div><div style={{fontSize:10,color:T.sub}}>Saved</div><div style={{fontSize:22,fontWeight:800,color:T.cyan,fontFamily:"Syne,sans-serif"}}>₹{selected.rev.toLocaleString()}</div></div>
                </div>
              </div>
            ) : (
              <div style={{...card({flex:1,minWidth:180,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,textAlign:"center"})}}>
                <div style={{fontSize:32}}>🚫</div>
                <div style={{color:T.amber,fontWeight:700,fontSize:14}}>No action recommended</div>
                <div style={{color:T.sub,fontSize:12}}>
                  {selected.seg==="do_not_disturb"?"Intervention worsens outcome":"Customer unlikely to respond to treatment"}
                </div>
              </div>
            )}
          </div>

          {/* CATE bars */}
          <div style={card()}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:12,fontFamily:"Syne,sans-serif"}}>
              CATE per intervention <span style={{fontWeight:400,color:T.sub}}>(Conditional Average Treatment Effect)</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={cateData} layout="vertical" margin={{left:5,right:30,top:0,bottom:0}}>
                <CartesianGrid stroke={T.b1} strokeDasharray="3 3" horizontal={false}/>
                <XAxis type="number" tick={{fill:T.sub,fontSize:10}} axisLine={false} tickLine={false}
                  tickFormatter={v=>`${v}%`}/>
                <YAxis type="category" dataKey="name" tick={{fill:T.sub,fontSize:10}} width={110} axisLine={false} tickLine={false}/>
                <Tooltip content={<TT fmt={v=>`${v}%`}/>}/>
                <Bar dataKey="value" radius={4} name="CATE %">
                  {cateData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── PAGE 3: UPLIFT ── */
function UpliftPage() {
  return (
    <div className="fu" style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        {/* Qini curve */}
        <div className="hov" style={{...card({flex:1,minWidth:260})}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:4,fontFamily:"Syne,sans-serif"}}>Qini curve</div>
          <div style={{fontSize:11,color:T.sub,marginBottom:12}}>Cumulative uplift vs. random targeting baseline</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={QINI} margin={{top:4,right:8,left:-18,bottom:0}}>
              <CartesianGrid stroke={T.b1} strokeDasharray="3 3"/>
              <XAxis dataKey="pct" tick={{fill:T.sub,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <YAxis tick={{fill:T.sub,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<TT fmt={v=>`${v}%`}/>}/>
              <Line type="monotone" dataKey="model" name="X-Learner" stroke={T.cyan} strokeWidth={2.5} dot={false}
                style={{filter:`drop-shadow(0 0 4px ${T.cyan}80)`}}/>
              <Line type="monotone" dataKey="random" name="Random" stroke={T.muted} strokeWidth={1.5}
                strokeDasharray="5 5" dot={false}/>
              <Legend wrapperStyle={{fontSize:11,paddingTop:8}} iconType="square" iconSize={8}/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{marginTop:12,padding:10,background:T.s0,borderRadius:8,
            border:`1px solid ${T.b1}`,display:"flex",gap:20,flexWrap:"wrap"}}>
            <div><div style={{fontSize:10,color:T.sub}}>Qini Coefficient</div><div style={{fontSize:18,fontWeight:800,color:T.cyan,fontFamily:"Syne,sans-serif"}}>0.44</div></div>
            <div><div style={{fontSize:10,color:T.sub}}>vs. T-Learner</div><div style={{fontSize:18,fontWeight:800,color:T.green,fontFamily:"Syne,sans-serif"}}>+42%</div></div>
            <div><div style={{fontSize:10,color:T.sub}}>Targeting efficiency</div><div style={{fontSize:18,fontWeight:800,color:T.amber,fontFamily:"Syne,sans-serif"}}>3–5×</div></div>
          </div>
        </div>

        {/* CATE avg chart */}
        <div className="hov" style={{...card({width:260,flexShrink:0})}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:4,fontFamily:"Syne,sans-serif"}}>Avg. CATE by action</div>
          <div style={{fontSize:11,color:T.sub,marginBottom:12}}>Mean treatment effect</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CATE_AVG} margin={{top:4,right:8,left:-18,bottom:0}}>
              <CartesianGrid stroke={T.b1} strokeDasharray="3 3"/>
              <XAxis dataKey="name" tick={{fill:T.sub,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.sub,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<TT fmt={v=>`${v}%`}/>}/>
              <Bar dataKey="avg" name="Avg CATE" radius={[6,6,0,0]}>
                {CATE_AVG.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segment cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {seg:"persuadable",icon:"🎯",action:"Contact immediately.",stat:"1,847"},
          {seg:"sure_thing",icon:"✅",action:"Low-touch only.",stat:"2,103"},
          {seg:"lost_cause",icon:"❌",action:"Do not invest budget.",stat:"1,542"},
          {seg:"do_not_disturb",icon:"⛔",action:"Never contact.",stat:"1,551"},
        ].map((s,i)=>{
          const cfg=SEG[s.seg]
          return (
            <div key={i} className="hov" style={{...card({borderLeft:`3px solid ${cfg.clr}`,padding:14})}}>
              <div style={{fontSize:22,marginBottom:8}}>{s.icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:cfg.clr,marginBottom:4}}>{cfg.lbl}</div>
              <div style={{fontSize:24,fontWeight:800,fontFamily:"Syne,sans-serif",marginBottom:4}}>{s.stat}</div>
              <div style={{fontSize:11,color:T.sub,marginBottom:4}}>{SEG[s.seg].lbl === "Persuadable" ? "Will stay only if contacted." : SEG[s.seg].lbl === "Sure thing" ? "Stays regardless of action." : SEG[s.seg].lbl === "Lost cause" ? "Won't respond to any treatment." : "Intervention triggers churn."}</div>
              <div style={{fontSize:11,fontWeight:600,color:T.txt}}>{s.action}</div>
            </div>
          )
        })}
      </div>

      {/* Learner comparison */}
      <div className="hov" style={card()}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:14,fontFamily:"Syne,sans-serif"}}>Uplift learner comparison</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {[
            {name:"T-Learner",qini:"0.31",clr:T.sub,desc:"Two separate outcome models (treated vs. control). Difference = CATE. Simple but unstable when treatment groups are imbalanced.",best:false},
            {name:"X-Learner",qini:"0.44",clr:T.cyan,desc:"Cross-residual estimation. More accurate for imbalanced treatment groups (10–20% treated). Selected model.",best:true},
            {name:"DR-Learner",qini:"0.41",clr:T.purple,desc:"Doubly Robust. Combines propensity score + outcome model. Robust to misspecification in either component.",best:false},
          ].map((l,i)=>(
            <div key={i} style={{flex:"1 1 180px",background:T.s0,borderRadius:10,padding:14,
              border:`1px solid ${l.best?`${l.clr}44`:T.b1}`,
              boxShadow:l.best?`0 0 20px ${l.clr}15`:"none"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontWeight:800,fontSize:14,color:l.clr,fontFamily:"Syne,sans-serif"}}>{l.name}</span>
                {l.best&&<span style={{background:`${l.clr}20`,color:l.clr,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:100}}>BEST</span>}
              </div>
              <div style={{fontSize:22,fontWeight:800,color:T.txt,fontFamily:"Syne,sans-serif",marginBottom:8}}>
                Qini: <span style={{color:l.clr}}>{l.qini}</span>
              </div>
              <div style={{fontSize:11,color:T.sub,lineHeight:1.6}}>{l.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── PAGE 4: EXPLAINABILITY ── */
function ExplainPage() {
  const [selCust, setSelCust] = useState(CUSTS[0])
  const [simAction, setSimAction] = useState("call")
  const [showJSON, setShowJSON] = useState(false)

  const baseRet = 1 - selCust.churn
  const simRet = Math.min(baseRet + (selCust.cate[simAction]||0), .99)
  const simLift = selCust.cate[simAction] || 0

  const apiResp = {
    customer_id: selCust.id,
    churn_probability: selCust.churn,
    segment: selCust.seg,
    best_action: selCust.best || null,
    lift: selCust.lift,
    cost: selCust.cost,
    revenue_saved: selCust.rev,
    roi: selCust.roi,
    explanation: {
      top_factor_1: "Low NPS Score (+24.8%)",
      top_factor_2: "High Ticket Count (+18.1%)",
      top_factor_3: "Low Login Activity (+15.2%)"
    }
  }

  return (
    <div className="fu" style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Customer selector */}
      <div style={{...card({padding:"12px 16px"})}}>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{fontSize:12,color:T.sub,fontWeight:600}}>Analyzing:</div>
          {CUSTS.slice(0,5).map(c=>(
            <button key={c.id} onClick={()=>setSelCust(c)}
              style={{background:selCust.id===c.id?T.cyan:T.b1,
                color:selCust.id===c.id?T.bg:T.sub,
                border:`1px solid ${selCust.id===c.id?T.cyan:T.b2}`,
                borderRadius:100,fontSize:11,padding:"4px 12px",cursor:"pointer",
                fontFamily:"Plus Jakarta Sans,sans-serif",fontWeight:600,transition:"all .15s"}}>
              #{c.id} {c.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        {/* SHAP chart */}
        <div className="hov" style={{...card({flex:1,minWidth:260})}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:4,fontFamily:"Syne,sans-serif"}}>SHAP feature attribution</div>
          <div style={{fontSize:11,color:T.sub,marginBottom:12}}>Why is {selCust.name} predicted to churn?</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SHAP} layout="vertical" margin={{left:5,right:30,top:0,bottom:0}}>
              <CartesianGrid stroke={T.b1} strokeDasharray="3 3" horizontal={false}/>
              <XAxis type="number" tick={{fill:T.sub,fontSize:10}} axisLine={false} tickLine={false}
                tickFormatter={v=>`${(v*100).toFixed(0)}%`}/>
              <YAxis type="category" dataKey="f" tick={{fill:T.sub,fontSize:10}} width={120} axisLine={false} tickLine={false}/>
              <Tooltip content={<TT fmt={v=>`${(v*100).toFixed(1)}%`}/>}/>
              <Bar dataKey="v" name="SHAP impact" radius={4}>
                {SHAP.map((s,i)=><Cell key={i} fill={s.pos?T.green:T.red}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:16,marginTop:8,fontSize:11}}>
            <div style={{display:"flex",gap:6,alignItems:"center"}}><div style={{width:10,height:10,background:T.red,borderRadius:2}}/><span style={{color:T.sub}}>Increases churn risk</span></div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}><div style={{width:10,height:10,background:T.green,borderRadius:2}}/><span style={{color:T.sub}}>Decreases churn risk</span></div>
          </div>
        </div>

        {/* Counterfactual simulator */}
        <div className="hov" style={{...card({width:280,flexShrink:0})}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:4,fontFamily:"Syne,sans-serif"}}>Counterfactual simulator</div>
          <div style={{fontSize:11,color:T.sub,marginBottom:14}}>Customer #{selCust.id} — what if we tried…</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {Object.entries(ACT).map(([key,act])=>{
              const v=selCust.cate[key]||0
              const vc=v>0?T.green:T.red
              return (
                <div key={key} onClick={()=>setSimAction(key)}
                  style={{padding:"10px 14px",borderRadius:8,cursor:"pointer",
                    background:simAction===key?`${act.clr}15`:T.s0,
                    border:`1px solid ${simAction===key?act.clr:T.b1}`,
                    display:"flex",justifyContent:"space-between",alignItems:"center",
                    transition:"all .15s"}}>
                  <span style={{color:simAction===key?act.clr:T.sub,fontSize:12,fontWeight:600}}>
                    {act.emoji} {act.lbl}
                  </span>
                  <span style={{fontSize:12,fontWeight:700,color:vc}}>
                    {v>0?"+":""}{(v*100).toFixed(1)}%
                  </span>
                </div>
              )
            })}
          </div>
          <div style={{marginTop:14,padding:14,background:T.s0,borderRadius:10,border:`1px solid ${T.b2}`}}>
            <div style={{fontSize:11,color:T.sub,marginBottom:10}}>Simulation result</div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div><div style={{fontSize:10,color:T.muted}}>Current retention</div>
                <div style={{fontSize:22,fontWeight:800,fontFamily:"Syne,sans-serif"}}>{(baseRet*100).toFixed(0)}%</div></div>
              <div style={{alignSelf:"center",color:T.sub,fontSize:18}}>→</div>
              <div style={{textAlign:"right"}}><div style={{fontSize:10,color:T.muted}}>Post-intervention</div>
                <div style={{fontSize:22,fontWeight:800,color:simLift>0?T.green:T.red,fontFamily:"Syne,sans-serif"}}>{(simRet*100).toFixed(0)}%</div></div>
            </div>
            <div style={{textAlign:"center",fontSize:12,fontWeight:700,
              color:simLift>0?T.green:T.red}}>
              {simLift>0?`↑ +${(simLift*100).toFixed(1)}% retention lift`:`↓ ${(simLift*100).toFixed(1)}% — avoid this action`}
            </div>
          </div>
        </div>
      </div>

      {/* API layer */}
      <div className="hov" style={card()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700,fontFamily:"Syne,sans-serif"}}>FastAPI REST layer <span style={{color:T.sub,fontWeight:400,fontSize:11}}>— 4 production endpoints</span></div>
          <button onClick={()=>setShowJSON(!showJSON)}
            style={{background:T.b1,color:T.sub,border:`1px solid ${T.b2}`,
              borderRadius:6,fontSize:11,padding:"4px 12px",cursor:"pointer",
              fontFamily:"Plus Jakarta Sans,sans-serif",fontWeight:600}}>
            {showJSON?"Hide JSON":"Show JSON"}
          </button>
        </div>
        {showJSON && (
          <pre style={{background:T.bg,border:`1px solid ${T.b1}`,borderRadius:8,
            padding:16,fontSize:11,color:T.cyan,fontFamily:"JetBrains Mono,monospace",
            overflowX:"auto",lineHeight:1.7,marginBottom:14}}>
            {JSON.stringify(apiResp,null,2)}
          </pre>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
          {[
            {ep:"/predict",m:"POST",desc:"Returns churn_probability (0–1) for any customer feature set"},
            {ep:"/recommend",m:"POST",desc:"Returns best_action, lift, roi, and segment for a customer_id"},
            {ep:"/explain",m:"POST",desc:"Returns SHAP values and top 5 churn drivers per customer"},
            {ep:"/roi",m:"POST",desc:"Returns cost, revenue_saved, roi_percent for a specific action"},
          ].map((ep,i)=>(
            <div key={i} style={{background:T.s0,border:`1px solid ${T.b1}`,borderRadius:8,padding:12}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                <span style={{background:`${T.cyan}20`,color:T.cyan,fontSize:9,fontWeight:800,
                  padding:"2px 8px",borderRadius:4,fontFamily:"JetBrains Mono,monospace"}}>{ep.m}</span>
                <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:12,color:T.purple,fontWeight:600}}>{ep.ep}</span>
              </div>
              <div style={{fontSize:11,color:T.sub,lineHeight:1.5}}>{ep.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── MAIN DASHBOARD ── */
const PAGES = [
  {id:"exec",label:"Executive",emoji:"📊"},
  {id:"explorer",label:"Customer Explorer",emoji:"🔍"},
  {id:"uplift",label:"Uplift Analytics",emoji:"📈"},
  {id:"explain",label:"Explainability",emoji:"🔬"},
]

export default function CausalChurn() {
  const [page, setPage] = useState("exec")

  return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column"}}>
        {/* Header */}
        <div style={{background:T.s0,borderBottom:`1px solid ${T.b2}`,
          padding:"0 22px",position:"sticky",top:0,zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",height:56,gap:20}}>
            {/* Brand */}
            <div style={{display:"flex",alignItems:"center",gap:10,paddingRight:20,
              borderRight:`1px solid ${T.b1}`,flexShrink:0}}>
              <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${T.cyan},${T.purple})`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>⚡</div>
              <div>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:15,
                  background:`linear-gradient(90deg,${T.cyan},${T.purple})`,
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  CausalChurn
                </div>
                <div style={{fontSize:9,color:T.muted,letterSpacing:".07em",textTransform:"uppercase",marginTop:-1}}>Prescriptive Intelligence</div>
              </div>
            </div>

            {/* Tabs */}
            <nav style={{display:"flex",gap:0,flex:1,overflowX:"auto"}}>
              {PAGES.map(p=>(
                <button key={p.id} onClick={()=>setPage(p.id)}
                  style={{background:"none",border:"none",cursor:"pointer",
                    padding:"0 14px",height:56,fontSize:12,fontWeight:600,
                    color:page===p.id?T.cyan:T.sub,
                    borderBottom:`2px solid ${page===p.id?T.cyan:"transparent"}`,
                    fontFamily:"Plus Jakarta Sans,sans-serif",transition:"all .2s",
                    flexShrink:0,whiteSpace:"nowrap"}}>
                  {p.emoji} {p.label}
                </button>
              ))}
            </nav>

            {/* Status */}
            <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
              <div className="blink" style={{width:7,height:7,borderRadius:"50%",background:T.green}}/>
              <span style={{fontSize:11,color:T.sub}}>7,043 customers</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <main style={{flex:1,padding:"18px 22px",maxWidth:1300,width:"100%",margin:"0 auto",alignSelf:"center"}}>
          <div key={page} className="fu">
            {page==="exec"    && <ExecutivePage/>}
            {page==="explorer"&& <ExplorerPage/>}
            {page==="uplift"  && <UpliftPage/>}
            {page==="explain" && <ExplainPage/>}
          </div>
        </main>

        {/* Footer */}
        <div style={{borderTop:`1px solid ${T.b1}`,padding:"8px 22px",
          display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
          <span style={{fontSize:10,color:T.muted}}>LightGBM · XGBoost · CausalML (Uber) · DoWhy (Microsoft) · SHAP · FastAPI · Docker · PostgreSQL</span>
          <div style={{display:"flex",gap:12,fontSize:10,color:T.muted}}>
            <span>AUC-ROC 0.89</span>
            <span>·</span>
            <span>Qini 0.44</span>
            <span>·</span>
            <span>12 modules</span>
          </div>
        </div>
      </div>
    </>
  )
}
