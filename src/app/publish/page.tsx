'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────
interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  typing?: boolean;
}

interface PublishStep {
  key: string;
  label: string;
  status: 'pending' | 'loading' | 'done' | 'error';
}

interface MatchedAgent {
  name: string;
  profession: string;
  skills: string[];
}

function PixelRobotAvatar({ size = 24 }: { size?: number }) {
  const px = size / 7;
  const grid = [
    [2, 5, 1, 1, 5, 2],
    [2, 1, 1, 1, 1, 2],
    [1, 1, 3, 3, 1, 1],
    [1, 1, 3, 3, 1, 1],
    [2, 1, 4, 4, 1, 2],
    [2, 1, 1, 1, 1, 2],
    [2, 2, 1, 1, 2, 2],
  ];
  const COLOR: Record<number, string> = { 1: '#2a1f1a', 2: 'transparent', 3: '#F05A28', 4: '#FF7A4A', 5: '#7b2fe8' };
  return (
    <div style={{ width: size, height: size, display: 'grid', gridTemplateColumns: `repeat(6, ${px}px)`, gridTemplateRows: `repeat(7, ${px}px)`, imageRendering: 'pixelated' }}>
      {grid.flat().map((v, i) => <div key={i} style={{ background: COLOR[v], width: px, height: px }} />)}
    </div>
  );
}

// ─── Pixel Robot Avatar ──────────────────────────────────
function PixelRobot({ size = 32 }: { size?: number }) {
  const grid = [
    [0,1,1,1,1,0],
    [1,2,1,1,2,1],
    [1,1,1,1,1,1],
    [0,1,3,3,1,0],
    [0,1,1,1,1,0],
    [1,0,1,1,0,1],
    [1,0,0,0,0,1],
  ];
  const colors: Record<number, string> = { 0: 'transparent', 1: '#F05A28', 2: '#fff', 3: '#7b2fe8' };
  const cellSize = size / 6;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(6, ${cellSize}px)`, gridTemplateRows: `repeat(7, ${cellSize}px)`, flexShrink: 0 }}>
      {grid.flat().map((v, i) => (
        <div key={i} style={{ width: cellSize, height: cellSize, background: colors[v] }} />
      ))}
    </div>
  );
}

// ─── Shared OrangeButton ─────────────────────────────────
function OrangeButton({ children, onClick, disabled, fullWidth }: {
  children: React.ReactNode; onClick?: () => void;
  disabled?: boolean; fullWidth?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        width: fullWidth ? '100%' : undefined,
        padding: '14px 28px',
        background: disabled ? '#333' : '#F05A28',
        color: (hovered && !pressed && !disabled) ? '#000' : '#fff',
        border: `2px solid ${disabled ? '#444' : '#000'}`,
        fontFamily: 'Archivo Black, sans-serif',
        fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: pressed || disabled ? 'none' : hovered ? '6px 6px 0 #000' : '3px 3px 0 #000',
        transform: pressed ? 'translate(3px,3px)' : hovered && !disabled ? 'translate(-3px,-3px)' : 'none',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease, color 0.12s',
        borderRadius: 0,
      }}
    >
      <span aria-hidden style={{
        position: 'absolute', inset: 0, background: '#fff',
        transform: hovered && !pressed && !disabled ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left center',
        transition: 'transform 0.25s ease-out', zIndex: 0,
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function PublishPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0, role: 'ai',
      content: '你好！我是你的 AI 需求助理。请描述你的项目需求，我会帮你整理成 PRD 文档。\n\n比如：「我想做一个 AI 驱动的代码审查工具」',
    },
  ]);
  const [input, setInput] = useState('');
  const [draft, setDraft] = useState({ title: '', prd: '', budget: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const [convId] = useState(() => `conv_${Date.now()}`);
  const [publishing, setPublishing] = useState(false);
  const [steps, setSteps] = useState<PublishStep[]>([]);
  const [matchedAgents, setMatchedAgents] = useState<MatchedAgent[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(1);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 打字机效果
  const typeMessage = (text: string) => {
    const id = msgIdRef.current++;
    setMessages(prev => [...prev, { id, role: 'ai', content: '', typing: true }]);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setMessages(prev => prev.map(m => m.id === id ? { ...m, content: text.slice(0, i) } : m));
      if (i >= text.length) {
        clearInterval(interval);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, typing: false } : m));
        setIsTyping(false);
      }
    }, 25);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput('');
    
    // Create new messages array including the user's new message
    const newMessages = [...messages, { id: msgIdRef.current++, role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    // Filter out typing messages and format history for backend
    const history = newMessages
      .filter(m => !m.typing)
      .map(m => ({ role: m.role === 'ai' ? 'assistant' : m.role, content: m.content }));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/requirement/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        body: JSON.stringify({ 
          message: userMsg, 
          conversation_id: convId ? Number(convId.split('_')[1]) : undefined,
          history: history 
        }),
      });

      if (!res.ok || !res.body) throw new Error('SSE failed');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const id = msgIdRef.current++;
      setMessages(prev => [...prev, { id, role: 'ai', content: '', typing: true }]);
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.trim().startsWith('data:'));
        for (const line of lines) {
          try {
            const dataStr = line.replace(/^data:\s*/, '').trim();
            if (dataStr === '[DONE]') continue;
            
            const data = JSON.parse(dataStr);
            const token = data.content ?? data.text ?? data.delta ?? '';
            if (token) {
              full += token;
              setMessages(prev => prev.map(m => m.id === id ? { ...m, content: full } : m));
              if (full.includes('标题') || full.includes('需求') || full.includes('预算')) {
                const titleMatch = full.match(/(?:项目名称|标题)[：:]\s*([^\n]+)/);
                if (titleMatch) setDraft(d => ({ ...d, title: titleMatch[1].trim() }));
                
                const budgetMatch = full.match(/(?:预算)[：:]\s*(\d+)/);
                if (budgetMatch) setDraft(d => ({ ...d, budget: parseInt(budgetMatch[1], 10) }));
                
                setDraft(d => ({ ...d, prd: full }));
              }
            }
          } catch { /* skip */ }
        }
      }
      setMessages(prev => prev.map(m => m.id === id ? { ...m, typing: false } : m));
      setIsTyping(false);
    } catch {
      const mockReplies = [
        `明白了！你的需求是：${userMsg}\n\n我来帮你整理一下 PRD：\n\n**项目标题**：${userMsg.slice(0, 20)}\n\n**核心功能**：\n- 功能模块 A\n- 功能模块 B\n- 功能模块 C\n\n你觉得这个方向对吗？还有什么需要补充的？`,
        '好的，我已经更新了 PRD。还有什么要调整的地方吗？',
        '完美！PRD 已经整理好了。你可以在右侧预览并编辑，满意后点击「发布项目」。',
      ];
      const reply = mockReplies[Math.min(messages.filter(m => m.role === 'user').length, mockReplies.length - 1)];
      setDraft({ title: userMsg.slice(0, 30), prd: `# ${userMsg.slice(0, 30)}\n\n## 项目概述\n${userMsg}\n\n## 核心功能\n- 功能 A\n- 功能 B\n- 功能 C\n\n## 技术要求\n- 前端：React + TypeScript\n- 后端：Python FastAPI\n- 数据库：PostgreSQL`, budget: 0 });
      typeMessage(reply);
    }
  };

  const handlePublish = async () => {
    if (!draft.title || !draft.prd) return;
    setPublishing(true);
    setMatchedAgents([]);
    setCurrentStepIndex(0);

    const initSteps: PublishStep[] = [
      { key: 'create', label: '1. 创建项目记录与PRD解析', status: 'loading' },
      { key: 'match',  label: '2. 从全球网络搜索匹配协作者', status: 'pending' },
      { key: 'assign', label: '3. 协作者在线会议分配任务', status: 'pending' },
    ];
    setSteps(initSteps);

    const token = localStorage.getItem('token') || '';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    let projectId = 1;

    try {
      const r = await fetch(`${apiUrl}/api/v1/requirement/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: draft.title, prd: draft.prd, budget: draft.budget }),
      });
      if (!r.ok) {
        throw new Error('Create failed');
      }
      const data = await r.json();
      projectId = data.project_id ?? data.data?.project_id ?? projectId;
      setSteps(s => s.map(x => x.key === 'create' ? { ...x, status: 'done' } : x.key === 'match' ? { ...x, status: 'loading' } : x));
      setCurrentStepIndex(1);
    } catch {
      setSteps(s => s.map(x => x.key === 'create' ? { ...x, status: 'error' } : x));
      return;
    }

    await new Promise(r => setTimeout(r, 800));

    try {
      const matchRes = await fetch(`${apiUrl}/api/v1/project/match-agents`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ project_id: projectId }),
      });
      if (!matchRes.ok) {
        throw new Error('Match failed');
      }
      const matchData = await matchRes.json();
      const agents = matchData.data?.matched_agents || [];
      
      // 模拟一个一个搜寻到的过程
      for (let i = 0; i < agents.length; i++) {
        await new Promise(r => setTimeout(r, 600 + Math.random() * 800)); // 模拟不同速度出现
        setMatchedAgents(prev => [...prev, agents[i]]);
      }
      
      await new Promise(r => setTimeout(r, 1000));
      setSteps(s => s.map(x => x.key === 'match' ? { ...x, status: 'done' } : x.key === 'assign' ? { ...x, status: 'loading' } : x));
      setCurrentStepIndex(2);
    } catch {
      setSteps(s => s.map(x => x.key === 'match' ? { ...x, status: 'error' } : x));
      return;
    }

    await new Promise(r => setTimeout(r, 500));

    try {
      const assignRes = await fetch(`${apiUrl}/api/v1/project/assign-tasks`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ project_id: projectId }),
      });
      if (!assignRes.ok) {
        throw new Error('Assign failed');
      }
      // 模拟会议开了一会
      await new Promise(r => setTimeout(r, 1500));
      setSteps(s => s.map(x => x.key === 'assign' ? { ...x, status: 'done' } : x));
      setCurrentStepIndex(3);
    } catch {
      setSteps(s => s.map(x => x.key === 'assign' ? { ...x, status: 'error' } : x));
      return;
    }

    await new Promise(r => setTimeout(r, 1000));
    router.push(`/workspace/${projectId}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)', background: '#0A0A0A', color: '#fff' }}>

      {/* ── Main ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left: Chat ── */}
        <div style={{ width: '55%', display: 'flex', flexDirection: 'column', background: '#F7F6F3', borderRight: '2px solid #000' }}>
          {/* Chat header */}
          <div style={{ padding: '12px 20px', borderBottom: '2px solid #000', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, background: '#fff' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} className='pixel-blink' />
            <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 14, color: '#111', letterSpacing: '0.05em' }}>AI REQUIREMENT ASSISTANT</span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-start' }}>
                {msg.role === 'ai' && (
                  <div style={{ flexShrink: 0, background: '#000', border: '2px solid #000', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PixelRobot size={36} />
                  </div>
                )}
                <div style={{
                  maxWidth: '78%', padding: '14px 18px',
                  background: msg.role === 'user' ? '#111' : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#111',
                  border: '2px solid #000',
                  boxShadow: msg.role === 'user' ? '4px 4px 0 #F05A28' : '4px 4px 0 #000',
                  fontFamily: 'Space Mono, monospace', fontSize: 13, lineHeight: 1.8,
                  whiteSpace: 'pre-wrap', borderRadius: 0,
                }}>
                  {msg.content}
                  {msg.typing && <span className='pixel-blink' style={{ color: '#F05A28' }}>▋</span>}
                </div>
                {msg.role === 'user' && (
                  <div style={{ flexShrink: 0, width: 36, height: 36, background: '#F05A28', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 13, color: '#000' }}>ME</span>
                  </div>
                )}
              </div>
            ))}
            {isTyping && messages[messages.length - 1]?.role !== 'ai' && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, background: '#000', border: '2px solid #000', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PixelRobot size={36} />
                </div>
                <div style={{ padding: '14px 18px', background: '#fff', border: '2px solid #000', boxShadow: '4px 4px 0 #000', fontFamily: 'Space Mono, monospace', fontSize: 13 }}>
                  <span className='pixel-blink' style={{ color: '#F05A28' }}>PROCESSING...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '14px 16px', borderTop: '2px solid #000', flexShrink: 0, background: '#F7F6F3', display: 'flex', gap: 0 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '2px solid #000', borderRight: 'none', background: '#f5f5f5', padding: '0 14px', minHeight: 52 }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 14, color: '#999', marginRight: 8 }}>&gt;</span>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder='描述你的项目需求...'
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Space Mono, monospace', fontSize: 14, color: '#111', height: '100%' }}
              />
            </div>
            <SendBtn onClick={handleSend} disabled={!input.trim() || isTyping} />
          </div>
        </div>

        {/* ── Right: PRD Preview ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0A0A0A', overflow: 'hidden' }}>
          {/* PRD header */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>PRD_PREVIEW</span>
            {draft.title && <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 13, color: '#F05A28', letterSpacing: '0.05em' }}> · {draft.title}</span>}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Title input */}
            <div>
              <label style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', display: 'block', marginBottom: 8 }}>PROJECT_TITLE</label>
              <input
                value={draft.title}
                onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                placeholder='项目标题'
                style={{
                  width: '100%', padding: '13px 16px',
                  background: '#141414', color: '#fff',
                  border: '2px solid rgba(255,255,255,0.15)',
                  fontFamily: 'Archivo Black, sans-serif', fontSize: 18,
                  outline: 'none', borderRadius: 0, boxSizing: 'border-box',
                }}
              />
            </div>

            {/* PRD textarea */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', display: 'block', marginBottom: 8 }}>PRD_CONTENT</label>
              <textarea
                value={draft.prd}
                onChange={e => setDraft(d => ({ ...d, prd: e.target.value }))}
                placeholder={'在左侧与 AI 对话，PRD 将自动生成在这里...\n\n你也可以直接在这里编辑内容。'}
                style={{
                  flex: 1, minHeight: 300, padding: '16px',
                  background: '#0d0d0d', color: 'rgba(255,255,255,0.82)',
                  border: '2px solid rgba(255,255,255,0.1)',
                  fontFamily: 'Space Mono, monospace', fontSize: 13, lineHeight: 2,
                  outline: 'none', resize: 'none', borderRadius: 0, boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Publish / Steps */}
            <OrangeButton onClick={handlePublish} disabled={!draft.title || !draft.prd} fullWidth>
              ✦ 发布项目
            </OrangeButton>
          </div>
        </div>
      </div>

      {publishing && (
        <div className='fixed inset-0 z-50 flex items-center justify-center' style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)' }}>
          <div className='w-full max-w-4xl p-8 flex flex-col md:flex-row gap-12'>
            {/* Left: Status Steps */}
            <div className='w-full md:w-1/3 flex flex-col gap-6'>
              <h2 className='font-display text-2xl mb-4' style={{ color: '#F05A28' }}>SYSTEM_BOOT</h2>
              {steps.map(step => (
                <div key={step.key} className='flex items-start gap-4'>
                  <div className='mt-1 shrink-0'>
                    {step.status === 'done' ? (
                      <span style={{ color: '#22c55e' }}>[✓]</span>
                    ) : step.status === 'loading' ? (
                      <span className='pixel-blink' style={{ color: '#F05A28' }}>[▌]</span>
                    ) : step.status === 'error' ? (
                      <span style={{ color: '#ef4444' }}>[✗]</span>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>[ ]</span>
                    )}
                  </div>
                  <div>
                    <p className='font-display text-sm' style={{ color: step.status === 'pending' ? 'rgba(255,255,255,0.3)' : '#fff' }}>
                      {step.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Agents & Meeting View */}
            <div className='w-full md:w-2/3 flex flex-col gap-4' style={{ minHeight: '300px' }}>
              {currentStepIndex >= 1 && (
                <div className='flex-1 border-2 border-gray-800 p-6 bg-black relative overflow-hidden'>
                  {/* Grid background */}
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px', zIndex: 0 }} />
                  
                  <div className='relative z-10 flex flex-col h-full'>
                    <h3 className='font-mono-brand text-xs mb-6' style={{ color: '#F05A28', letterSpacing: '0.1em' }}>
                      &gt; {currentStepIndex === 1 ? 'SEARCHING_GLOBAL_NETWORK...' : 'INITIALIZING_KICKOFF_MEETING...'}
                    </h3>
                    
                    <div className='flex flex-wrap gap-4 items-center justify-center flex-1'>
                      {matchedAgents.map((agent, i) => (
                        <div 
                          key={i} 
                          className='flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-500'
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          <div className='w-16 h-16 border-2 border-[#F05A28] bg-[#111] flex items-center justify-center shadow-[4px_4px_0_#F05A28]'>
                            <PixelRobotAvatar size={40} />
                          </div>
                          <div className='text-center'>
                            <p className='font-display text-sm' style={{ color: '#fff' }}>{agent.name}</p>
                            <p className='font-mono-brand text-[9px]' style={{ color: '#F05A28' }}>{agent.profession}</p>
                          </div>
                        </div>
                      ))}
                      
                      {currentStepIndex === 1 && matchedAgents.length < 4 && (
                        <div className='w-16 h-16 border-2 border-dashed border-gray-600 rounded-full animate-spin-slow opacity-50 flex items-center justify-center' />
                      )}
                    </div>
                    
                    {currentStepIndex >= 2 && (
                      <div className='mt-8 p-4 border border-gray-800 bg-[#111] text-xs font-mono-brand' style={{ color: '#4ade80' }}>
                        <p className='pixel-blink mb-2'>&gt; CONNECTION ESTABLISHED</p>
                        <p>&gt; SYNCING PRD CONTEXT...</p>
                        <p>&gt; DECONSTRUCTING TASKS...</p>
                        <p>&gt; ASSIGNING TO DO LISTS...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SendBtn({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        padding: '0 24px', height: '100%', minHeight: 52,
        background: disabled ? '#555' : '#F05A28',
        color: (hovered && !pressed && !disabled) ? '#000' : '#fff',
        border: `2px solid ${disabled ? '#666' : '#000'}`,
        fontFamily: 'Archivo Black, sans-serif', fontSize: 13, letterSpacing: '0.12em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: pressed || disabled ? 'none' : hovered ? '4px 4px 0 #000' : '3px 3px 0 #000',
        transform: pressed ? 'translate(2px,2px)' : hovered && !disabled ? 'translate(-2px,-2px)' : 'none',
        transition: 'transform 0.1s, box-shadow 0.1s, color 0.1s',
        borderRadius: 0,
      }}
    >
      <span aria-hidden style={{ position: 'absolute', inset: 0, background: '#fff', transform: hovered && !pressed && !disabled ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left center', transition: 'transform 0.2s ease-out', zIndex: 0 }} />
      <span style={{ position: 'relative', zIndex: 1 }}>SEND</span>
    </button>
  );
}