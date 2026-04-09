'use client';
import { useState, useRef, useEffect } from 'react';

function PixelRobotAvatar({ size = 24, isUser = false }: { size?: number, isUser?: boolean }) {
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
  const COLOR: Record<number, string> = { 1: '#2a1f1a', 2: 'transparent', 3: isUser ? '#22c55e' : '#F05A28', 4: isUser ? '#4ade80' : '#FF7A4A', 5: '#7b2fe8' };
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

interface Message { id: number; role: 'user' | 'agent'; content: string; time: string; isFile?: boolean; }

const MOCK_MESSAGES: Message[] = [];

export default function AgentChat() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 模拟从后端获取 todo list 和 agent 跨 agent 消息
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        // 我们从URL里获取 project_id，这里简化处理写死或者假设在上下文中
        const projectIdStr = window.location.pathname.split('/').pop();
        const projectId = projectIdStr ? parseInt(projectIdStr, 10) : 1;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        
        const initialMsgs: Message[] = [];
        
        // 尝试从后端获取真实的 todo list
        try {
          const res = await fetch(`${apiUrl}/api/v1/project/${projectId}/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const todos = data.data?.todos || [];
            const members = data.data?.members || [];
            
            const isOwner = data.data?.is_owner;
            
            let todoText = '';
            if (todos.length > 0) {
              todoText = todos.map((t: any) => `[${t.status === 'done' ? 'x' : ' '}] ${t.content} (分配给: ${t.role}, 截止: ${t.deadline})`).join('\n');
            } else {
              todoText = '[ ] 暂无任务\n[ ] 等待分配';
            }

            if (isOwner) {
              initialMsgs.push({
                id: Date.now(),
                role: 'agent',
                content: `欢迎回来，项目发起人 ${user?.username || ''}。\n当前项目已完成任务拆解。您的团队正在努力工作中。目前团队的整体任务如下：\n\n${todoText}\n\n您可以在此监督进度、上传参考资料或解答团队成员的问题。`,
                time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
              });
            } else {
              initialMsgs.push({
                id: Date.now(),
                role: 'agent',
                content: `欢迎回来，${user?.username || '用户'}。我已根据当前项目的需求文档为你拆解了以下 Todo List：\n\n${todoText}\n\n请尽快处理，你可以随时向我上传交付物文件。`,
                time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
              });
            }
          }
        } catch {
          // 降级 mock
          initialMsgs.push({
            id: Date.now(),
            role: 'agent',
            content: `欢迎回来，${user?.username || '用户'}。我已根据当前进度为你整理了今日的 Todo List：\n\n[ ] 完成前端登录页切图\n[ ] 对接 /api/v1/auth/login 接口\n\n请尽快处理，你可以随时向我上传交付物文件。`,
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          });
        }
        
        setMessages(initialMsgs);

      } catch (err) {
        console.error(err);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // 监听 3D 场景中点击 Agent 的事件
  useEffect(() => {
    const handleAgentClicked = (e: any) => {
      const agentName = e.detail.agentName;
      if (!agentName) return;

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: 'user',
          content: `你现在的进度怎么样了？遇到什么问题了吗？ (@${agentName})`,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(true);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'agent',
            content: `你好！我是 ${agentName}。我目前的进度一切正常，已经完成了 80% 的任务分配。\n目前暂时没有遇到阻塞问题，正在继续执行...`,
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
      }, 1500);
    };

    window.addEventListener('AGENT_CLICKED', handleAgentClicked);
    return () => window.removeEventListener('AGENT_CLICKED', handleAgentClicked);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: input.trim(), time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    // 调用后端对话接口
    try {
      const token = localStorage.getItem('token') || '';
      const projectIdStr = window.location.pathname.split('/').pop();
      const projectId = projectIdStr ? parseInt(projectIdStr, 10) : 1;
      // 假设 member_id 为 1
      const memberId = 1; 

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/project/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ project_id: projectId, member_id: memberId, message: userMsg.content }),
      });

      if (!res.ok || !res.body) throw new Error('SSE failed');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const id = Date.now() + 1;
      setMessages(prev => [...prev, { id, role: 'agent', content: '', time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }]);
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
            }
          } catch { /* skip */ }
        }
      }
      setIsTyping(false);
    } catch {
      // 降级 mock
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'agent', content: '收到！正在处理你的请求，稍候给出执行方案...', time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }]);
        setIsTyping(false);
      }, 1200);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 显示用户发送了文件
    const userMsg: Message = { 
      id: Date.now(), 
      role: 'user', 
      content: `📎 附件已上传: ${file.name}`, 
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isFile: true
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // 延迟模拟响应
    setTimeout(() => {
      // 假设：简单的判断是否是需求方（这里通过 localStorage mock 判断，或者随机）
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const isOwner = user?.username === 'Fred' || user?.username === 'admin'; // mock 判断

      const replyContent = isOwner 
        ? '已将你的材料发放给协作者。' 
        : '已收到结果，正通知需求方验收。';

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'agent', 
        content: replyContent, 
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) 
      }]);
      setIsTyping(false);
      
      // 清空 input 使得可以重复上传相同文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
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
        <p className='font-mono-brand text-[9px] mb-1.5 px-1 flex justify-between' style={{ color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em' }}>
          <span>&gt; INPUT COMMAND</span>
          {/* 隐藏的文件输入框 */}
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={{ textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            [UPLOAD FILE]
          </button>
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