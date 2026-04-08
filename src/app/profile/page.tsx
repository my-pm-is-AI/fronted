'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const FaultyTerminalBackground = dynamic(() => import('@/components/FaultyTerminalBackground'), { ssr: false });

// ─── Split Login Screen ───────────────────────────────────
function BootLoginScreen({ loginUsername, setLoginUsername, onLogin, loading }: {
  loginUsername: string;
  setLoginUsername: (v: string) => void;
  onLogin: () => void;
  loading: boolean;
}) {
  // granted 是登录成功后由父级触发的，但这里我们用一个内部 prop 来驱动
  // 实际上父级 handleLogin 成功后才 setIsLoggedIn(true)，我们需要在这里展示过渡动画
  // 所以在 onLogin wrap 一层：点击→显示 ACCESS GRANTED→再切换
  const [granted, setGranted] = useState(false);

  const handleClick = async () => {
    if (!loginUsername.trim() || loading) return;
    setGranted(true);           // 先弹出大字
    await new Promise(r => setTimeout(r, 1400)); // 等动画
    onLogin();                  // 再触发真正登录
  };

  return (
    <div style={{ flex: 1, display: 'flex', background: '#000', overflow: 'hidden' }}>

      {/* ── Left: Login Form ── */}
      <div style={{
        width: '38%', flexShrink: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        background: '#000', position: 'relative', zIndex: 2,
        borderRight: '1px solid rgba(255,100,0,0.45)',
      }}>
        <div style={{ width: '100%', maxWidth: 340, margin: '0 auto', padding: '0 40px' }}>

          {/* Logo区 */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 4, height: 32, background: '#F05A28' }} />
              <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 28, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1 }}>
                AGENT<span style={{ color: '#F05A28' }}>OS</span>
              </span>
            </div>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginLeft: 14 }}>
              KINETIC ENGINE v1.0
            </p>
          </div>

          {/* 表单 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.22em', marginBottom: 8 }}>USERNAME</div>
              <div style={{ display: 'flex', alignItems: 'center', background: '#0d0d0d', border: '2px solid rgba(255,90,40,0.35)', transition: 'border-color 0.2s' }}>
                <span style={{ padding: '13px 14px', fontFamily: 'Space Mono, monospace', fontSize: 14, color: '#F05A28', flexShrink: 0, lineHeight: 1 }}>&gt;</span>
                <input
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleClick()}
                  placeholder="your_username"
                  autoFocus
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    fontFamily: 'Space Mono, monospace', fontSize: 14, color: '#fff',
                    padding: '13px 12px 13px 0', caretColor: '#F05A28',
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleClick}
              disabled={!loginUsername.trim() || loading || granted}
              style={{
                padding: '14px',
                background: loginUsername.trim() && !loading && !granted ? '#F05A28' : '#111',
                border: `2px solid ${loginUsername.trim() && !loading && !granted ? '#F05A28' : 'rgba(255,90,40,0.2)'}`,
                color: loginUsername.trim() && !loading && !granted ? '#000' : 'rgba(255,90,40,0.35)',
                fontFamily: 'Archivo Black, sans-serif', fontSize: 13, letterSpacing: '0.15em',
                cursor: loginUsername.trim() && !loading && !granted ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s', borderRadius: 0,
                boxShadow: loginUsername.trim() && !loading && !granted ? '4px 4px 0 rgba(240,90,40,0.4)' : 'none',
              }}
            >
              {loading ? 'CONNECTING...' : granted ? 'ACCESS GRANTED ✓' : '▶ LOGIN'}
            </button>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.18em' }}>
              AGENTOS · ALL RIGHTS RESERVED
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: WebGL 点阵 + ACCESS GRANTED ── */}
      <div style={{ flex: 1, position: 'relative', background: '#000', overflow: 'hidden' }}>
        {/* 点阵背景 */}
        <FaultyTerminalBackground
          scale={2.5}
          scanlineIntensity={0.8}
          glitchAmount={1.2}
          tint="#FF6600"
          mouseReact={false}
          brightness={0.8}
          style={{ position: 'absolute', inset: 0, opacity: 0.5 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: '#000', zIndex: -1 }} />

        {/* ACCESS GRANTED — 登录成功后弹出 */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 10%', zIndex: 2,
          opacity: granted ? 1 : 0,
          transform: granted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          pointerEvents: 'none',
        }}>
          <div style={{ width: 48, height: 2, background: '#F05A28', marginBottom: 24 }} />
          <div style={{
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: 'clamp(3.5rem, 9vw, 9rem)',
            letterSpacing: '-0.05em', lineHeight: 0.88,
            color: '#F05A28',
            textShadow: '0 0 40px rgba(255,100,0,0.7), 0 0 100px rgba(255,100,0,0.35)',
          }}>ACCESS</div>
          <div style={{
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: 'clamp(3.5rem, 9vw, 9rem)',
            letterSpacing: '-0.05em', lineHeight: 0.88,
            color: '#fff',
          }}>GRANTED</div>
          <div style={{ marginTop: 28, fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#F05A28', letterSpacing: '0.3em' }}>
            WELCOME TO THE AGENT ENVIRONMENT
          </div>
          <div style={{ marginTop: 14, borderLeft: '2px solid #F05A28', paddingLeft: 14 }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em' }}>
              SYSTEM NOMINAL · ALL MODULES ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pixel Robot ─────────────────────────────────────────
function PixelRobot({ size = 64, color = '#F05A28' }: { size?: number; color?: string }) {
  const grid = [
    [0, 1, 1, 1, 1, 0],
    [1, 2, 1, 1, 2, 1],
    [1, 1, 1, 1, 1, 1],
    [0, 1, 3, 3, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1],
  ];
  const colors: Record<number, string> = { 0: 'transparent', 1: color, 2: '#fff', 3: '#7b2fe8' };
  const cellSize = size / 6;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(6, ${cellSize}px)`, gridTemplateRows: `repeat(7, ${cellSize}px)` }}>
      {grid.flat().map((v, i) => (
        <div key={i} style={{ width: cellSize, height: cellSize, background: colors[v] }} />
      ))}
    </div>
  );
}

// ─── OrangeButton ─────────────────────────────────────────
function OrangeButton({ children, onClick, disabled, fullWidth, type = 'button' }: {
  children: React.ReactNode; onClick?: () => void;
  disabled?: boolean; fullWidth?: boolean; type?: 'button' | 'submit';
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        width: fullWidth ? '100%' : undefined,
        padding: '14px 32px',
        background: disabled ? '#333' : '#F05A28',
        color: hovered && !pressed && !disabled ? '#000' : '#fff',
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

// ─── Field Label ──────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', display: 'block', marginBottom: 8 }}>
      {children}
    </label>
  );
}

// ─── Input style ─────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 16px',
  background: '#141414', color: '#fff',
  border: '2px solid rgba(255,255,255,0.12)',
  fontFamily: 'Space Mono, monospace', fontSize: 14,
  outline: 'none', borderRadius: 0, boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

// ─── Main ─────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    full_name: '',
    profession: '',
    introduction: '',
    hourly_rate: '',
    skills: [] as string[],
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');

  const PROFESSIONS = ['前端开发', '后端开发', '全栈开发', '算法/AI', '运维/DevOps', 'UI/UX 设计', '产品经理', '数据分析', '架构师', '测试工程师'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchProfile(token);
    }
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const r = await fetch('http://120.78.126.163/api/v1/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) {
        const data = await r.json();
        setForm({
          username: data.username ?? '',
          full_name: data.full_name ?? '',
          profession: data.profession ?? '',
          introduction: data.introduction ?? '',
          hourly_rate: data.hourly_rate ? String(data.hourly_rate) : '',
          skills: data.skills ?? [],
        });
      }
    } catch { /* ignore */ }
  };

  const handleLogin = async () => {
    if (!loginUsername.trim()) return;
    setLoading(true);
    try {
      const r = await fetch('http://120.78.126.163/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername.trim() }),
      });
      const data = await r.json();
      const token = data.token ?? data.access_token ?? data.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setForm(f => ({ ...f, username: loginUsername.trim() }));
        await fetchProfile(token);
        showToast('✓ 登录成功');
      }
    } catch {
      // mock login
      const mockToken = `mock_${loginUsername.trim()}_${Date.now()}`;
      localStorage.setItem('token', mockToken);
      localStorage.setItem('username', loginUsername.trim());
      setIsLoggedIn(true);
      setForm(f => ({ ...f, username: loginUsername.trim() }));
      showToast('✓ 已登录（离线模式）');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem('token') || '';
    try {
      await fetch('http://120.78.126.163/api/v1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, hourly_rate: Number(form.hourly_rate) || 0 }),
      });
    } catch { /* ignore */ }
    showToast('✓ 信息已更新');
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const addSkill = (val: string) => {
    const s = val.trim();
    if (s && !form.skills.includes(s)) {
      setForm(f => ({ ...f, skills: [...f.skills, s] }));
    }
    setSkillInput('');
  };

  const removeSkill = (s: string) => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }));

  const professionColor: Record<string, string> = {
    '前端开发': '#5189fb', '后端开发': '#5189fb', '全栈开发': '#5189fb', '开发': '#5189fb',
    '算法/AI': '#cc44aa', '数据分析': '#cc44aa',
    '运维/DevOps': '#22c55e', '架构师': '#22c55e', '测试工程师': '#22c55e',
    'UI/UX 设计': '#F05A28',
    '产品经理': '#aaccff',
  };
  const avatarColor = professionColor[form.profession] ?? '#F05A28';

  return (
    <div style={{ minHeight: 'calc(100vh - 48px)', background: '#0A0A0A', color: '#fff', display: 'flex', flexDirection: 'column' }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: 48, left: 0, right: 0, zIndex: 9999,
          background: '#F05A28', color: '#000', padding: '14px 28px',
          fontFamily: 'Archivo Black, sans-serif', fontSize: 14, letterSpacing: '0.1em',
          borderBottom: '2px solid #000', textAlign: 'center',
        }}>
          {toast}
        </div>
      )}

      {!isLoggedIn ? (
        /* ── Boot-style Split Login ── */
        <BootLoginScreen
          loginUsername={loginUsername}
          setLoginUsername={setLoginUsername}
          onLogin={handleLogin}
          loading={loading}
        />
      ) : (
        /* ── Profile Form ── */
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Left: Avatar Panel */}
          <div style={{ width: 280, flexShrink: 0, background: '#F7F6F3', borderRight: '2px solid #000', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', gap: 16 }}>
            {/* Avatar */}
            <div style={{ background: '#000', border: `3px solid ${avatarColor}`, boxShadow: `6px 6px 0 ${avatarColor}`, padding: 16 }}>
              <PixelRobot size={72} color={avatarColor} />
            </div>
            {/* Username */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 20, color: '#111', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {form.full_name || form.username || 'AGENT'}
              </div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#888', letterSpacing: '0.12em', marginTop: 6 }}>
                @{form.username}
              </div>
            </div>
            {/* Profession badge */}
            {form.profession && (
              <div style={{
                padding: '6px 14px', border: `2px solid ${avatarColor}`,
                background: `${avatarColor}18`,
                fontFamily: 'Space Mono, monospace', fontSize: 11, color: avatarColor,
                letterSpacing: '0.06em', borderRadius: 0,
              }}>
                {form.profession}
              </div>
            )}
            {/* Skills */}
            {form.skills.length > 0 && (
              <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {form.skills.map(s => (
                  <div key={s} style={{
                    padding: '3px 10px', background: '#F05A28', color: '#000',
                    fontFamily: 'Space Mono, monospace', fontSize: 10, letterSpacing: '0.06em',
                    border: '1px solid #000',
                  }}>{s}</div>
                ))}
              </div>
            )}
            {/* Hourly rate display */}
            {form.hourly_rate && (
              <div style={{ marginTop: 'auto', textAlign: 'center', borderTop: '2px solid #000', paddingTop: 16, width: '100%' }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#888', letterSpacing: '0.12em' }}>HOURLY RATE</div>
                <div style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 28, color: '#111', letterSpacing: '-0.04em' }}>¥{form.hourly_rate}</div>
              </div>
            )}
            {/* Logout */}
            <button
              onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); setLoginUsername(''); setForm({ username: '', full_name: '', profession: '', introduction: '', hourly_rate: '', skills: [] }); }}
              style={{ marginTop: 'auto', padding: '8px 20px', background: 'transparent', border: '2px solid #000', fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#555', cursor: 'pointer', letterSpacing: '0.1em', borderRadius: 0 }}
            >
              LOGOUT
            </button>
          </div>

          {/* Right: Form */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 28, background: '#0A0A0A' }}>

            {/* Section: Identity */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 3, height: 20, background: '#F05A28' }} />
                <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 16, letterSpacing: '-0.02em' }}>基本信息</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <FieldLabel>USERNAME（只读）</FieldLabel>
                  <input value={form.username} readOnly style={{ ...inputStyle, opacity: 0.45, cursor: 'not-allowed' }} />
                </div>
                <div>
                  <FieldLabel>FULL_NAME</FieldLabel>
                  <input
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    placeholder="你的显示名称"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Section: Profession */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 3, height: 20, background: '#F05A28' }} />
                <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 16, letterSpacing: '-0.02em' }}>职能 & 技能</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Profession selector */}
                <div>
                  <FieldLabel>PROFESSION</FieldLabel>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {PROFESSIONS.map(p => {
                      const pColor = professionColor[p] ?? '#F05A28';
                      const isActive = form.profession === p;
                      return (
                        <button
                          key={p}
                          onClick={() => setForm(f => ({ ...f, profession: p }))}
                          style={{
                            padding: '8px 16px',
                            background: isActive ? `${pColor}20` : 'transparent',
                            border: `2px solid ${isActive ? pColor : 'rgba(255,255,255,0.15)'}`,
                            color: isActive ? pColor : 'rgba(255,255,255,0.5)',
                            fontFamily: 'Space Mono, monospace', fontSize: 11,
                            letterSpacing: '0.06em', cursor: 'pointer', borderRadius: 0,
                            boxShadow: isActive ? `3px 3px 0 ${pColor}55` : 'none',
                            transition: 'all 0.15s',
                          }}
                        >{p}</button>
                      );
                    })}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <FieldLabel>SKILLS（Enter 添加）</FieldLabel>
                  <div style={{ display: 'flex', gap: 0 }}>
                    <input
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), addSkill(skillInput))}
                      placeholder="如：React、Python、Docker..."
                      style={{ ...inputStyle, flex: 1, borderRight: 'none' }}
                    />
                    <button
                      onClick={() => addSkill(skillInput)}
                      style={{
                        padding: '0 20px', background: '#F05A28', color: '#fff',
                        border: '2px solid #000', fontFamily: 'Archivo Black, sans-serif',
                        fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 0,
                        boxShadow: '3px 3px 0 #000',
                      }}
                    >ADD</button>
                  </div>
                  {form.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                      {form.skills.map(s => (
                        <div key={s} style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '5px 12px', background: '#F05A28', color: '#000',
                          border: '2px solid #000', boxShadow: '2px 2px 0 #000',
                          fontFamily: 'Space Mono, monospace', fontSize: 11, letterSpacing: '0.06em',
                        }}>
                          {s}
                          <button
                            onClick={() => removeSkill(s)}
                            style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', padding: 0, fontSize: 12, lineHeight: 1, fontWeight: 700 }}
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Bio */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 3, height: 20, background: '#F05A28' }} />
                <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 16, letterSpacing: '-0.02em' }}>简介 & 费率</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <FieldLabel>INTRODUCTION</FieldLabel>
                  <textarea
                    value={form.introduction}
                    onChange={e => setForm(f => ({ ...f, introduction: e.target.value }))}
                    placeholder="简单介绍一下你自己..."
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.8, fontFamily: 'Space Mono, monospace', fontSize: 13 }}
                  />
                </div>
                <div style={{ maxWidth: 240 }}>
                  <FieldLabel>HOURLY_RATE（¥/hr）</FieldLabel>
                  <input
                    type="number"
                    value={form.hourly_rate}
                    onChange={e => setForm(f => ({ ...f, hourly_rate: e.target.value }))}
                    placeholder="0"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Save */}
            <div style={{ paddingBottom: 32 }}>
              <OrangeButton onClick={handleSave} disabled={loading} fullWidth>
                {loading ? 'SAVING...' : '✦ 保存信息'}
              </OrangeButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}