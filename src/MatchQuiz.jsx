import { useState, useMemo, useEffect } from "react";
import { ArrowRight, RotateCcw, BrainCircuit, ChevronDown, Zap, Cpu, FlaskConical, Dices, Activity, BookOpen, Star } from "lucide-react";
import { BMETI_QUESTIONS, BMETI_ARCHETYPES, getBMETIArchetype, TAG_CLUSTERS } from "./bmetiConfig";

const IconMap = {
  "zap": Zap, "cpu": Cpu, "flask": FlaskConical, "dice": Dices, 
  "activity": Activity, "book": BookOpen, "star": Star
};

// 聚类模糊匹配函数
function mentorMatchesTag(mentorTags, coreTag) {
  const cluster = TAG_CLUSTERS[coreTag] || [coreTag];
  // 如果导师的任何一个标签，包含了 cluster 中的任何一个关键词，即算命中
  return mentorTags.some(tag => cluster.some(keyword => tag.includes(keyword)));
}

export function MatchQuiz({ supervisors, onOpenMentor }) {
  // 本地缓存状态，支持跨组件切换不丢失
  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem('bmeti_answers');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  
  const [showResult, setShowResult] = useState(() => {
    try {
      if (localStorage.getItem('bmeti_showResult') === 'true') return true;
      // Auto-repair if answers are complete but showResult wasn't saved due to unmount
      const savedAns = localStorage.getItem('bmeti_answers');
      if (savedAns) {
        const parsed = JSON.parse(savedAns);
        if (Object.keys(parsed).length >= BMETI_QUESTIONS.length) return true;
      }
      return false;
    } catch { return false; }
  });
  
  const [expandedId, setExpandedId] = useState(null);

  // 状态变更时自动保存
  useEffect(() => {
    localStorage.setItem('bmeti_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('bmeti_showResult', showResult.toString());
  }, [showResult]);

  const currentQIndex = Object.keys(answers).length;
  const currentQ = BMETI_QUESTIONS[currentQIndex];

  const handleSelect = (optionId) => {
    const newAnswers = { ...answers, [currentQ.id]: optionId };
    setAnswers(newAnswers);
    if (Object.keys(newAnswers).length === BMETI_QUESTIONS.length) {
      setShowResult(true); 
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResult(false);
  };

  const bmetiResult = useMemo(() => {
    if (!showResult) return null;
    
    // 1. Calculate points
    const scores = {
      "人工智能": 0, "生物力学": 0, "医学图像": 0, "医疗器械": 0, 
      "康复工程": 0, "脑科学": 0, "纳米医学": 0, "空天医学": 0
    };
    
    BMETI_QUESTIONS.forEach(q => {
      const selectedId = answers[q.id];
      if (selectedId) {
        const option = q.options.find(o => o.id === selectedId);
        if (option && option.points) {
           Object.keys(option.points).forEach(tag => {
              if (scores[tag] !== undefined) scores[tag] += option.points[tag];
           });
        }
      }
    });

    // 2. Sort and get Top 2 Tags
    const sortedTags = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const top1 = sortedTags[0];
    const top2 = sortedTags[1];

    const profile = getBMETIArchetype(top1, top2);
    const archInfo = BMETI_ARCHETYPES[profile.class] || BMETI_ARCHETYPES["生医工全栈海王"];
    
    // 3. Shuffled Selection Logic with Similarity Clustering
    let t0 = []; let t1 = []; let t2 = []; let t3 = [];
    
    supervisors.forEach(m => {
       const tags = m.topicTags || [];
       const matchTop1 = mentorMatchesTag(tags, top1);
       const matchTop2 = mentorMatchesTag(tags, top2);

       if (matchTop1 && matchTop2) {
         t0.push({ ...m, matchLevel: "T0", badgeColor: "#eab308", badgeText: "SSR 极度契合", score: 100 });
       } else if (matchTop1) {
         t1.push({ ...m, matchLevel: "T1", badgeColor: "#a855f7", badgeText: "SR 核心匹配", score: 85 });
       } else if (matchTop2) {
         t2.push({ ...m, matchLevel: "T2", badgeColor: "#3b82f6", badgeText: "S 次级潜力", score: 70 });
       } else {
         t3.push({ ...m, matchLevel: "T3", badgeColor: "#64748b", badgeText: "A 随机拓展", score: 30 + Math.floor(Math.random()*15) });
       }
    });

    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    shuffle(t0); shuffle(t1); shuffle(t2); shuffle(t3);
    
    let finalMentors = [];
    const seenNames = new Set();
    for (const pool of [t0, t1, t2, t3]) {
       for (const m of pool) {
          if (finalMentors.length < 6 && !seenNames.has(m.name)) {
            finalMentors.push(m);
            seenNames.add(m.name);
          }
       }
    }
    
    return { top1, top2, profile, archInfo, mentors: finalMentors };
  }, [answers, showResult, supervisors]);

  return (
    <section className="content-section">
      <div className="section-title">
        <span className="eyebrow">BMETI Assessment</span>
        <h2>BMETI 生医工科研性格测验</h2>
        <p>纯正的生医工黑话测验，算算你的科研“八字”，算法为你抽出天选导师卡牌。</p>
      </div>
      
      {!showResult && currentQ && (
         <div className="rmti-wizard">
            <div className="rmti-progress">
              <div className="rmti-progress-bar" style={{ width: `${(currentQIndex / BMETI_QUESTIONS.length) * 100}%` }} />
            </div>
            <h3 className="rmti-q-title">
               <span style={{color: "#4f6ef7", marginRight: "8px"}}>Q{currentQIndex + 1}.</span> 
               {currentQ.text}
            </h3>
            <div className="rmti-options">
               {currentQ.options.map(opt => (
                 <button key={opt.id} className="rmti-option-card" onClick={() => handleSelect(opt.id)}>
                    <div className="rmti-opt-letter">{opt.id}</div>
                    <div className="rmti-opt-content">
                      <h4>{opt.text}</h4>
                      <p>{opt.desc}</p>
                    </div>
                 </button>
               ))}
            </div>
         </div>
      )}

      {showResult && bmetiResult && (() => {
        const { top1, top2, profile, archInfo, mentors } = bmetiResult;
        const IconComp = IconMap[archInfo.icon] || BrainCircuit;

        return (
         <div className="rmti-result-view">
           <div className="rmti-profile-card">
              <IconComp size={48} className="rmti-icon" style={{color: archInfo.color}} />
              <div style={{color: archInfo.color, fontWeight: "800", marginBottom: "8px", letterSpacing: "2px", textTransform: "uppercase"}}>
                大类图鉴：{profile.class}
              </div>
              <h2 className="rmti-hero-title">{profile.title}</h2>
              <div style={{display: "flex", gap: "8px", justifyContent: "center", marginBottom: "16px"}}>
                 <span className="chip" style={{background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)"}}>主核心：{top1}</span>
                 <span className="chip" style={{background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)"}}>次核心：{top2}</span>
              </div>
              <p className="rmti-desc">{profile.desc}</p>
              <button className="link-button" onClick={resetQuiz} style={{background: "rgba(255,255,255,0.1)", color: "#fff", borderColor: "rgba(255,255,255,0.2)"}}>
                 <RotateCcw size={16} /> 重新投胎 (重做测试)
              </button>
           </div>
           
           <div className="section-title" style={{marginTop: '40px', marginBottom: '24px'}}>
             <span className="eyebrow">Matched SSR Mentors</span>
             <h2>你的天选导师阵容</h2>
           </div>

           <div className="bmeti-supervisors-grid">
             {mentors.map(m => (
               <div key={m.id} className="bmeti-mentor-card" style={{ '--badge-color': m.badgeColor }}>
                 <div className="bmeti-mentor-header" onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}>
                   <div className="avatar" style={{background: m.badgeColor}}>{m.name[0]}</div>
                   <div className="bmeti-mentor-info">
                     <div className="bmeti-mentor-headline">
                       <h3>{m.name}</h3>
                       <span className="title-tag">{m.title}</span>
                     </div>
                     <div className="bmeti-mentor-tags">
                        {/* Highlights matching tags via cluster */}
                        {(m.topicTags || []).slice(0,3).map(tag => {
                           const isHit = TAG_CLUSTERS[top1]?.some(k => tag.includes(k)) || 
                                         TAG_CLUSTERS[top2]?.some(k => tag.includes(k));
                           return (
                             <span key={tag} className={`chip ${isHit ? 'chip-highlight' : ''}`}>
                               {tag}
                             </span>
                           );
                        })}
                     </div>
                   </div>
                   <div className="bmeti-mentor-badge-container">
                      <div className="bmeti-badge" style={{background: m.badgeColor}}>
                        {m.badgeText}
                      </div>
                      <ChevronDown className={`chevron ${expandedId === m.id ? "chevron--open" : ""}`} size={20} />
                   </div>
                 </div>
                 
                 <div className={`bmeti-mentor-expand ${expandedId === m.id ? "bmeti-mentor-expand--open" : ""}`}>
                   <div className="bmeti-mentor-expand-inner">
                     <div style={{ padding: "8px 20px 20px 80px" }}>
                       <button className="link-button link-button--strong" onClick={() => onOpenMentor(m)}>
                         <ArrowRight size={16} /> 查看完整主页
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
        );
      })()}
    </section>
  )
}
