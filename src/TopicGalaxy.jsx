import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import "./TopicGalaxy.css";

function getVogelSpiral(index, total, maxRadius) {
  const goldenAngle = 137.508 * (Math.PI / 180);
  const angle = index * goldenAngle;
  const r = Math.sqrt(index / total) * maxRadius;
  const x = Math.cos(angle) * r;
  const y = Math.sin(angle) * r;
  return { x, y };
}

function getMentorColor(mentor) {
  if (mentor.title.includes("教授")) return "#38bdf8"; 
  if (mentor.title.includes("副教授")) return "#34d399"; 
  return "#fbbf24"; 
}

function SpaceBackground() {
  const stars = useMemo(() => Array.from({ length: 250 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 0.5,
    opacity: 0.1 + Math.random() * 0.9,
    delay: `${Math.random() * 5}s`,
    duration: `${2 + Math.random() * 4}s`
  })), []);
  return (
    <div className="space-bg">
      {stars.map((s, i) => (
        <div key={i} className="star-dust" style={{
          top: s.top, left: s.left, 
          width: s.size, height: s.size, 
          opacity: s.opacity, 
          animationDelay: s.delay,
          animationDuration: s.duration
        }} />
      ))}
    </div>
  )
}

export function TopicGalaxy({ supervisors, onOpenMentor }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const topicStats = useMemo(() => {
    const map = new Map();
    supervisors.forEach(item => {
      (item.topicTags || []).forEach(topic => {
        const current = map.get(topic) || { topic, mentors: [] };
        current.mentors.push(item);
        map.set(topic, current);
      });
    });
    return Array.from(map.values())
      .filter(t => t.mentors.length > 1) 
      .sort((a, b) => b.mentors.length - a.mentors.length);
  }, [supervisors]);

  const handleSelectTopic = (stat) => {
    setActiveTopic(stat);
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedTopic(stat);
      setIsTransitioning(false);
    }, 800); 
  };

  const handleReturn = () => {
    setIsReturning(true);
    setTimeout(() => {
      setSelectedTopic(null);
      setActiveTopic(null);
      setIsReturning(false);
    }, 600);
  };

  return (
    <section className="content-section galaxy-wrapper">
      <SpaceBackground />
      
      <div className="section-title" style={{position: "relative", zIndex: 10, padding: "0 20px", pointerEvents: "none"}}>
         <div>
           <span className="eyebrow">Macro to Micro Universe</span>
           <h2>3D 星云图谱 <span style={{fontSize:"16px", color:"#94a3b8", fontWeight:"normal"}}>（内测版）</span></h2>
         </div>
         <p>点击发光的星域，进行曲率跃迁，进入 3D 恒星系探索导师星球。</p>
      </div>

      <div className="galaxy-viewport">
        
        {/* MICRO STAR SYSTEM HUD (Flattened out of 3D) */}
        <div className={`star-hud ${selectedTopic || activeTopic ? 'star-hud--visible' : ''}`}>
           <button className="link-button return-btn-hud" onClick={handleReturn} style={{ pointerEvents: (selectedTopic && !isReturning) ? 'auto' : 'none' }}>
              <ArrowLeft size={18} /> 跃迁返回银河
           </button>
           <div className="star-hud-info">
             <div className="star-sun-flat" />
             <div className="star-hud-text">
               <h2>{activeTopic?.topic || "Unknown"}</h2>
               <p>{activeTopic?.mentors.length || 0} 位导师正在此星域</p>
             </div>
           </div>
        </div>

        {/* MICRO STAR SYSTEM (3D Orbits) - Always mounted, visibility toggled via style */}
        <div 
          className={`star-system-container ${isTransitioning ? 'star-fade-in' : ''} ${isReturning ? 'star-fade-out' : ''}`}
          style={{
             opacity: (selectedTopic || activeTopic) ? 1 : 0,
             pointerEvents: (selectedTopic && !isReturning) ? 'auto' : 'none',
             visibility: (selectedTopic || activeTopic) ? 'visible' : 'hidden'
          }}
        >
            {/* The Sun is now an immense glowing core without text */}
            <div className="star-sun-core" />
            
            <div className="star-system__orbits">
              {activeTopic?.mentors.map((m, i) => {
                 const total = activeTopic.mentors.length;
                 const angle = i * (360 / total);
                 // Increased radius to space out planets and avoid core collision
                 const radius = 280 + (i * 8) + (Math.random() * 40); 
                 const color = getMentorColor(m);

                 return (
                   <div key={m.id} className="orbit-wrapper" style={{ transform: `rotateZ(${angle}deg) translateX(${radius}px) rotateZ(-${angle}deg)` }}>
                     <div className="undo-system">
                       <button 
                         className="mentor-planet" 
                         style={{ '--planet-color': color }}
                         onClick={() => onOpenMentor(m)}
                       >
                         <span className="mentor-planet__name">
                           {m.name.length > 3 ? m.name.slice(0,3) : m.name}
                         </span>
                       </button>
                     </div>
                   </div>
                 )
              })}
            </div>
        </div>

        {/* MACRO GALAXY - Always mounted, visibility toggled via style */}
        <div 
          className={`galaxy-container ${isTransitioning ? 'galaxy-dive' : ''} ${isReturning ? 'galaxy-return' : ''}`}
          style={{
             opacity: (!selectedTopic || isReturning) ? 1 : 0,
             pointerEvents: (!selectedTopic && !isTransitioning) ? 'auto' : 'none',
             visibility: (!selectedTopic || isReturning) ? 'visible' : 'hidden'
          }}
        >
            <div className="galaxy-system">
              {topicStats.map((stat, i) => {
                const { x, y } = getVogelSpiral(i, topicStats.length, 360);
                const z = (Math.random() - 0.5) * 60; 
                const bubbleSize = Math.min(90 + stat.mentors.length * 8, 180);
                
                return (
                  <div 
                    key={stat.topic} 
                    className="galaxy-bubble-wrapper"
                    style={{ transform: `translate3d(${x}px, ${y}px, ${z}px)` }}
                  >
                    <div className="galaxy-bubble-counter">
                      <button 
                        className="galaxy-bubble" 
                        style={{ width: bubbleSize, height: bubbleSize }}
                        onClick={() => handleSelectTopic(stat)}
                      >
                        <span className="galaxy-bubble__name">{stat.topic}</span>
                        {/* Tiny Planets inside */}
                        <div className="tiny-planets-orbit">
                           {stat.mentors.slice(0, 20).map((m) => {
                             const px = (Math.random() - 0.5) * (bubbleSize * 0.7);
                             const py = (Math.random() - 0.5) * (bubbleSize * 0.7);
                             const size = 3 + Math.random() * 4;
                             return (
                               <div 
                                 key={m.id} 
                                 className="tiny-planet" 
                                 style={{ 
                                   width: size, height: size, 
                                   left: `calc(50% + ${px}px)`,
                                   top: `calc(50% + ${py}px)`,
                                   backgroundColor: getMentorColor(m),
                                   animationDelay: `${Math.random() * 2}s`
                                 }} 
                               />
                             );
                           })}
                        </div>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
        </div>

      </div>
    </section>
  )
}
