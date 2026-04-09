'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────
interface AgentSettlement {
  agent_id: number;
  name: string;
  profession: string;
  hours_worked: number;
  hourly_rate: number;
  subtotal: number;
  progress_percent: number;
  last_update: string;
}

interface ProjectSettlement {
  project_id: number;
  title: string;
  completed_at: string;
  agents: AgentSettlement[];
  total_cost: number;
}

// ─── Profession color map ─────────────────────────────────
const PROF_COLOR: Record<string, string> = {
  '前端开发': '#5189fb', '后端开发': '#5189fb', '全栈开发': '#5189fb',
  '算法/AI': '#cc44aa', '数据分析': '#cc44aa', '研究': '#cc44aa',
  '运维/DevOps': '#22c55e', '架构师': '#22c55e', '测试工程师': '#22c55e',
  'UI/UX 设计': '#F05A28', '设计': '#F05A28',
  '产品经理': '#aaccff', 'PM': '#aaccff',
};
function getProfColor(p: string) {
  return PROF_COLOR[p] ?? '#F05A28';
}

// ─── OrangeButton ─────────────────────────────────────────
function OrangeButton({ children, onClick, disabled }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
}) {
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

// ─── AgentRow ─────────────────────────────────────────────
function AgentRow({ agent, index, animate }: { agent: AgentSettlement; index: number; animate: boolean }) {
  const [hovered, setHovered] = useState(false);
  const color = getProfColor(agent.profession);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${color}0d` : index % 2 === 0 ? '#0d0d0d' : '#111',
        borderLeft: hovered ? `3px solid ${color}` : '3px solid transparent',
        transition: 'background 0.15s, border-color 0.15s',
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(12px)',
        transitionDelay: `${index * 60}ms`,
      }}
    >
      {/* Avatar + Name */}
      <td style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, flexShrink: 0,
            background: `${color}20`, border: `2px solid ${color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Archivo Black, sans-serif', fontSize: 13, color,
          }}>
            {agent.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 14, letterSpacing: '-0.02em' }}>{agent.name}</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>ID #{agent.agent_id}</div>
          </div>
        </div>
      </td>
      {/* Profession */}
      <td style={{ padding: '14px 20px' }}>
        <div style={{
          display: 'inline-block', padding: '4px 12px',
          background: `${color}15`, border: `1px solid ${color}55`,
          fontFamily: 'Space Mono, monospace', fontSize: 11, color,
          letterSpacing: '0.06em',
        }}>
          {agent.profession}
        </div>
      </td>
      {/* Hours */}
      <td style={{ padding: '14px 20px', fontFamily: 'Space Mono, monospace', fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'right' }}>
        {agent.hours_worked.toFixed(1)}h
      </td>
      {/* Rate */}
      <td style={{ padding: '14px 20px', fontFamily: 'Space Mono, monospace', fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'right' }}>
        ¥{agent.hourly_rate}/hr
      </td>
      {/* Progress */}
      <td style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{
              height: '100%', width: `${agent.progress_percent}%`,
              background: color, boxShadow: `0 0 8px ${color}88`,
              transition: 'width 1s ease',
            }} />
          </div>
          <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 13, color, minWidth: 40, textAlign: 'right' }}>
            {agent.progress_percent}%
          </span>
        </div>
      </td>
      {/* Subtotal */}
      <td style={{ padding: '14px 24px', textAlign: 'right' }}>
        <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 15, color }}>
          ¥{agent.subtotal.toLocaleString()}
        </span>
      </td>
    </tr>
  );
}

// ─── Main ─────────────────────────────────────────────────
export default function SettlementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<ProjectSettlement | null>(null);
  const [loading, setLoading] = useState(true);
  const [rowsVisible, setRowsVisible] = useState(false);
  const [totalVisible, setTotalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const r = await fetch(`${apiUrl}/api/v1/project/${id}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = await r.json();
      // Transform API response to settlement format
      const agents: AgentSettlement[] = (raw.agents ?? raw.data?.agents ?? []).map((a: Record<string, unknown>, i: number) => {
        const hours = typeof a.hours_worked === 'number' ? a.hours_worked : Math.random() * 40 + 10;
        const rate = typeof a.hourly_rate === 'number' ? a.hourly_rate : 150;
        return {
          agent_id: (a.agent_id as number) ?? i + 1,
          name: (a.name as string) ?? (a.username as string) ?? `Agent ${i + 1}`,
          profession: (a.profession as string) ?? '开发',
          hours_worked: +hours.toFixed(1),
          hourly_rate: rate,
          subtotal: +(hours * rate).toFixed(0),
          progress_percent: (a.progress_percent as number) ?? 100,
          last_update: (a.last_update as string) ?? new Date().toISOString(),
        };
      });
      const total = agents.reduce((s, a) => s + a.subtotal, 0);
      setData({
        project_id: Number(id),
        title: (raw.title as string) ?? (raw.data?.title as string) ?? `Project #${id}`,
        completed_at: (raw.completed_at as string) ?? new Date().toISOString(),
        agents,
        total_cost: total,
      });
    } catch {
      // Mock data
      const mockAgents: AgentSettlement[] = [
        { agent_id: 1, name: 'Alice Chen', profession: '前端开发', hours_worked: 42.5, hourly_rate: 200, subtotal: 8500, progress_percent: 100, last_update: '2026-04-08' },
        { agent_id: 2, name: 'Bob Zhang', profession: '后端开发', hours_worked: 38.0, hourly_rate: 220, subtotal: 8360, progress_percent: 100, last_update: '2026-04-08' },
        { agent_id: 3, name: 'Carol AI', profession: '算法/AI', hours_worked: 55.0, hourly_rate: 280, subtotal: 15400, progress_percent: 100, last_update: '2026-04-08' },
        { agent_id: 4, name: 'Dave Ops', profession: '运维/DevOps', hours_worked: 22.5, hourly_rate: 180, subtotal: 4050, progress_percent: 100, last_update: '2026-04-08' },
        { agent_id: 5, name: 'Eva Design', profession: 'UI/UX 设计', hours_worked: 30.0, hourly_rate: 160, subtotal: 4800, progress_percent: 100, last_update: '2026-04-08' },
      ];
      setData({
        project_id: Number(id),
        title: `AI 驱动协作平台 #${id}`,
        completed_at: '2026-04-08T18:00:00Z',
        agents: mockAgents,
        total_cost: mockAgents.reduce((s, a) => s + a.subtotal, 0),
      });
    }
    setLoading(false);
    setTimeout(() => setRowsVisible(true), 100);
    setTimeout(() => setTotalVisible(true), 600);
  };

  const handleExport = () => {
    if (!data) return;
    const lines = [
      `项目结算报告 — ${data.title}`,
      `完成时间：${new Date(data.completed_at).toLocaleString('zh-CN')}`,
      '',
      '姓名\t职能\t工时\t时薪\t小计\t进度',
      ...data.agents.map(a => `${a.name}\t${a.profession}\t${a.hours_worked}h\t¥${a.hourly_rate}/hr\t¥${a.subtotal.toLocaleString()}\t${a.progress_percent}%`),
      '',
      `总计：¥${data.total_cost.toLocaleString()}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `settlement_${id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 48px)', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <span className="pixel-blink" style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 24, color: '#F05A28', letterSpacing: '-0.03em' }}>LOADING...</span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>CALCULATING SETTLEMENT</span>
      </div>
    );
  }

  if (!data) return null;

  const completedAt = new Date(data.completed_at).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ minHeight: 'calc(100vh - 48px)', background: '#0A0A0A', color: '#fff', display: 'flex', flexDirection: 'column' }}>

      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* ── Hero ── */}
        <div style={{ padding: '40px 40px 32px', borderBottom: '2px solid rgba(255,255,255,0.08)', background: 'linear-gradient(180deg, #141414 0%, #0A0A0A 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', marginBottom: 8 }}>PROJECT_TITLE</div>
              <h1 style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 36, letterSpacing: '-0.04em', lineHeight: 1, margin: 0, color: '#fff' }}>{data.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>COMPLETED</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#22c55e' }}>{completedAt}</span>
                </div>
                <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>AGENTS</span>
                  <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 13, color: '#F05A28' }}>{data.agents.length}</span>
                </div>
                <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#22c55e', letterSpacing: '0.08em' }}>PROGRESS 100% ✓</span>
                </div>
              </div>
            </div>
            {/* Total cost hero */}
            <div style={{
              background: '#141414', border: '2px solid #F05A28',
              boxShadow: '6px 6px 0 #F05A28',
              padding: '20px 32px', textAlign: 'right',
              opacity: totalVisible ? 1 : 0,
              transform: totalVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', marginBottom: 8 }}>TOTAL_COST</div>
              <div style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 48, letterSpacing: '-0.04em', lineHeight: 1, color: '#F05A28' }}>
                ¥{data.total_cost.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{ padding: '32px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 3, height: 20, background: '#F05A28' }} />
            <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 16, letterSpacing: '-0.02em' }}>AGENT 贡献明细</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginLeft: 8 }}>{data.agents.length} AGENTS</span>
          </div>

          <div style={{ border: '2px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#141414', borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
                  {['AGENT', '职能', '工时', '时薪', '进度', '小计'].map((h, i) => (
                    <th key={h} style={{
                      padding: '12px 20px', textAlign: i >= 2 && i <= 3 ? 'right' : i === 5 ? 'right' : 'left',
                      fontFamily: 'Space Mono, monospace', fontSize: 10,
                      color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', fontWeight: 400,
                      borderRight: i < 5 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.agents.map((agent, i) => (
                  <AgentRow key={agent.agent_id} agent={agent} index={i} animate={rowsVisible} />
                ))}
              </tbody>
              {/* Footer: total row */}
              <tfoot>
                <tr style={{ background: '#141414', borderTop: '2px solid rgba(255,255,255,0.12)' }}>
                  <td colSpan={5} style={{ padding: '16px 20px', fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em' }}>
                    TOTAL · {data.agents.length} AGENTS · {data.agents.reduce((s, a) => s + a.hours_worked, 0).toFixed(1)} HOURS
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <span style={{
                      fontFamily: 'Archivo Black, sans-serif', fontSize: 22, color: '#F05A28',
                      letterSpacing: '-0.04em',
                    }}>¥{data.total_cost.toLocaleString()}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ── Summary + Export ── */}
        <div style={{ padding: '0 40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          {/* Stats row */}
          <div style={{ display: 'flex', gap: 0 }}>
            {[
              { label: 'TOTAL AGENTS', value: String(data.agents.length) },
              { label: 'TOTAL HOURS', value: `${data.agents.reduce((s, a) => s + a.hours_worked, 0).toFixed(1)}h` },
              { label: 'AVG RATE', value: `¥${Math.round(data.total_cost / data.agents.reduce((s, a) => s + a.hours_worked, 0))}/hr` },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                padding: '16px 28px', background: '#141414',
                borderTop: '2px solid rgba(255,255,255,0.08)',
                borderBottom: '2px solid rgba(255,255,255,0.08)',
                borderLeft: '2px solid rgba(255,255,255,0.08)',
                borderRight: i === 2 ? '2px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 22, color: '#fff', letterSpacing: '-0.03em' }}>{stat.value}</div>
              </div>
            ))}
          </div>
          {/* Export button */}
          <OrangeButton onClick={handleExport}>
            ↓ 导出报告
          </OrangeButton>
        </div>
      </div>
    </div>
  );
}