'use client';
import { useState, useRef, useEffect } from 'react';

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

function SendButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  // blogNow 风格硬偏移阴影
  const shadow = pressed ? 'none' : hovered ? '6px 6px 0 #000' : '3px 3px 0 #000';
  const transform = pressed ? 'translate(3px,3px)' : hovered ? 'translate(-3px,-3px)' : 'none';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#F05A28',
        color: hovered && !pressed ? '#000' : '#fff',
        fontSize: 11,
        borderRadius: 0,
        border: '2px solid #000',
        letterSpacing: '0.1em',
        padding: '0 18px',
        boxShadow: shadow,
        transform,
        transition: 'transform 0.12s ease, box-shadow 0.12s ease, color 0.12s',
        cursor: 'pointer',
        fontFamily: 'Archivo Black, sans-serif',
        textTransform: 'uppercase',
        userSelect: 'none',
      }}
    >
      {/* blogNow 风格：白色从左往右填入 */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: '#fff',
          transform: hovered && !pressed ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left center',
          transition: 'transform 0.25s ease-out',
          zIndex: 0,
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>SEND</span>
    </button>
  );
}

interface Message { id: number; role: 'user' | 'agent'; content: string; time: string; }

const MOCK_MESSAGES: Message[] = [
  { id: 1, role: 'agent', content: '你好！我是你的 AI Agent，已准备就绪。请告诉我你的 Hackathon 项目需求。', time: '13:20' },
  { id: 2, role: 'user', content: '我需要构建一个 AI 驱动的多人协作 Workspace，展示每个人的 Agent 进度。', time: '13:21' },
  { id: 3, role: 'agent', content: '明白！这是一个很有趣的项目。建议分以下几个阶段推进：\n\n1. 搭建基础布局框架\n2. 集成 3D 霓虹建筑展示\n3. 实现 Agent 对话功能\n4. 添加团队进度面板', time: '13:21' },
  { id: 4, role: 'user', content: '3D 展示用的是 myself2 的代码，设计风格需要对齐 DESIGN_STYLE.md', time: '13:22' },
  { id: 5, role: 'agent', content: '已分析 myself2 代码结构和设计风格文档。将采用：\n\n• 深炭黑底色 #0A0A0A\n• 橙色强调 #F05A28\n• 霓虹蓝紫 3D 建筑继承 myself2\n• Glitch 标题动效\n\n正在执行 Phase 1...', time: '13:22' },
];

export default function AgentChat() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: input.trim(), time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'agent', content: '收到！正在处理你的请求，稍候给出执行方案...', time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className='flex flex-col h-full' style={{ background: '#F7F6F3' }}>

      {/* ── Terminal Header ── */}
      <div
        className='px-4 py-2.5 flex items-center justify-between shrink-0'
        style={{ borderBottom: '2px solid #000', background: '#F7F6F3' }}
      >
        <div className='flex items-center gap-3'>
          <div style={{ width: 3, height: 28, background: '#F05A28' }} />
          <div
            className='w-7 h-7 flex items-center justify-center'
            style={{ background: '#fff', border: '2px solid #000' }}
          >
            <PixelRobotAvatar size={20} />
          </div>
          <div>
            <p className='font-display text-black' style={{ fontSize: 13, letterSpacing: '-0.04em' }}>
              AGENT_001
            </p>
            <p className='font-mono-brand text-[9px] flex items-center gap-1' style={{ color: '#22c55e', letterSpacing: '0.2em' }}>
              <span className='pixel-blink'>█</span> ONLINE · READY
            </p>
          </div>
        </div>
        <div className='font-mono-brand text-[9px] text-right' style={{ color: 'rgba(0,0,0,0.3)', letterSpacing: '0.15em' }}>
          <p>MEM: 4096K</p>
          <p>PROC: 98%</p>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className='flex-1 overflow-y-auto py-3 px-3 space-y-3 min-h-0' style={{ background: '#F7F6F3' }}>
        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'agent' && (
              <div className='shrink-0 mt-1 flex items-center justify-center' style={{ width: 20, height: 20, border: '2px solid #000', background: '#fff' }}>
                <PixelRobotAvatar size={16} />
              </div>
            )}
            <div className='max-w-[82%]'>
              {msg.role === 'agent' && (
                <p className='font-mono-brand text-[9px] mb-0.5 ml-1' style={{ color: 'rgba(0,0,0,0.4)', letterSpacing: '0.15em' }}>
                  [{String(idx * 127 + 1024).padStart(4, '0')}] AGENT OUTPUT
                </p>
              )}
              <div
                className='text-xs px-3 py-2.5 whitespace-pre-wrap leading-relaxed'
                style={{
                  background: msg.role === 'user' ? '#111' : '#ffffff',
                  border: '2px solid #000',
                  boxShadow: msg.role === 'user' ? '4px 4px 0 #F05A28' : '4px 4px 0 #000',
                  color: msg.role === 'user' ? '#fff' : '#111',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 11,
                  lineHeight: 1.65,
                }}
              >
                {msg.content}
              </div>
              <p className='font-mono-brand text-[9px] mt-1 px-1' style={{ color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em' }}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className='flex gap-2 items-start'>
            <div className='shrink-0 flex items-center justify-center mt-1' style={{ width: 20, height: 20, border: '2px solid #000', background: '#fff' }}>
              <PixelRobotAvatar size={16} />
            </div>
            <div className='text-xs px-3 py-2' style={{ background: '#fff', border: '2px solid #000', boxShadow: '4px 4px 0 #000', fontFamily: 'Space Mono, monospace', color: 'rgba(0,0,0,0.45)', fontSize: 11 }}>
              <span className='pixel-blink' style={{ color: '#F05A28' }}>▌</span>{' '}PROCESSING...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div
        className='px-3 py-3 shrink-0'
        style={{ borderTop: '2px solid #000', background: '#fff' }}
      >
        <p className='font-mono-brand text-[9px] mb-1.5 px-1' style={{ color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em' }}>
          &gt; INPUT COMMAND
        </p>
        <div className='flex gap-0'>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder='TYPE COMMAND...'
            className='flex-1 text-xs px-3 py-2.5 outline-none'
            style={{
              background: '#f5f5f5',
              border: '2px solid #000',
              borderRight: 'none',
              color: '#000',
              fontFamily: 'Space Mono, monospace',
              fontSize: 11,
              letterSpacing: '0.05em',
              borderRadius: 0,
            }}
          />
          <SendButton onClick={handleSend} />
        </div>
      </div>
    </div>
  );
}