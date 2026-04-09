'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Phase {
  id: number;
  label: string;
  status: 'done' | 'active' | 'pending';
  detail?: string;
}

interface Commission {
  name: string;
  role: string;
  commission: number;
}

interface SettlementData {
  days_taken: number;
  total_budget: number;
  commissions: Commission[];
}

const STATUS: Record<string, { bar: string; text: string }> = {
  done:    { bar: '#22c55e', text: '#22c55e' },
  active:  { bar: '#F05A28', text: '#F05A28' },
  pending: { bar: 'rgba(255,255,255,0.12)', text: 'rgba(255,255,255,0.25)' },
};

export default function ProjectStatus() {
  const router = useRouter();
  const [phases, setPhases] = useState<Phase[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [projectStatus, setProjectStatus] = useState<string>('active');
  const [projectId, setProjectId] = useState(1);
  const [settlementData, setSettlementData] = useState<SettlementData | null>(null);

  const fetchNodes = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      // Fix: Get project ID accurately since window.location.pathname.split('/').pop() might not always work as expected if there are query params or trailing slashes
      const pathParts = window.location.pathname.split('/');
      const pIdStr = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2]; 
      const pId = pIdStr ? parseInt(pIdStr, 10) : 1;
      setProjectId(pId);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const res = await fetch(`${apiUrl}/api/v1/project/${pId}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIsOwner(data.data?.is_owner || false);
        if (data.data?.project_status) {
          setProjectStatus(data.data.project_status);
        }
        const nodes = data.data?.nodes || [];
        
        if (nodes.length > 0) {
          let foundActive = false;
          const mappedPhases: Phase[] = nodes.map((n: any, idx: number) => {
            let s: 'done' | 'active' | 'pending' = 'pending';
            if (n.status === 'completed' || n.status === 'done') {
              s = 'done';
            } else if (!foundActive) {
              s = 'active';
              foundActive = true;
            }

            return {
              id: n.id,
              label: n.name,
              status: s,
              detail: n.deadline ? `DUE: ${n.deadline}` : 'QUEUED'
            };
          });
          setPhases(mappedPhases);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch project nodes", err);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  const handleCompleteNode = async (nodeId: number) => {
    try {
      const token = localStorage.getItem('token') || '';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const pathParts = window.location.pathname.split('/');
      const pIdStr = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2]; 
      const currentProjectId = pIdStr ? parseInt(pIdStr, 10) : projectId;
      
      const res = await fetch(`${apiUrl}/api/v1/project/${currentProjectId}/nodes/${nodeId}/complete`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchNodes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptProject = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      // Ensure we are using the parsed projectId
      const pathParts = window.location.pathname.split('/');
      const pIdStr = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2]; 
      const currentProjectId = pIdStr ? parseInt(pIdStr, 10) : projectId;
      
      const res = await fetch(`${apiUrl}/api/v1/project/${currentProjectId}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSettlementData(data.data);
      } else {
        console.error("Failed to accept project:", await res.text());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activePhase = phases.find(p => p.status === 'active');
  const allDone = phases.length > 0 && phases.every(p => p.status === 'done');

  return (
    <div style={{ borderTop: '2px solid #000', background: '#F7F6F3', position: 'relative' }}>
      {/* Settlement Modal */}
      {settlementData && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', border: '2px solid #000',
            boxShadow: '8px 8px 0 #F05A28', padding: '32px',
            width: 400, maxWidth: '90%'
          }}>
            <h2 className="font-display text-2xl mb-4 text-black" style={{ letterSpacing: '-0.04em' }}>项目已验收结算</h2>
            <div className="font-mono-brand text-xs space-y-2 mb-6 text-black" style={{ letterSpacing: '0.05em' }}>
              <p>耗时: {settlementData.days_taken} 天</p>
              <p>总预算: ¥{settlementData.total_budget}</p>
              <div style={{ borderTop: '1px dashed #ccc', margin: '12px 0' }} />
              <p className="font-bold text-black">佣金分配:</p>
              <ul className="space-y-1">
                {settlementData.commissions && settlementData.commissions.length > 0 ? (
                  settlementData.commissions.map((c, idx) => (
                    <li key={idx} className="flex justify-between text-black">
                      <span>{c.name} ({c.role})</span>
                      <span style={{ color: '#22c55e', fontWeight: 'bold' }}>¥{c.commission}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">无佣金分配数据</li>
                )}
              </ul>
            </div>
            <button
              onClick={() => router.push('/projects')}
              className="w-full py-3 bg-black text-white font-display text-sm hover:bg-[#F05A28] transition-colors"
              style={{ letterSpacing: '0.05em' }}
            >
              返回历史项目
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className='flex items-center gap-3 px-4 py-2'
        style={{ borderBottom: '2px solid #000' }}
      >
        <div style={{ width: 3, height: 14, background: '#000' }} />
        <p className='font-display text-black' style={{ fontSize: 11, letterSpacing: '-0.02em' }}>
          PROJECT_STATUS
        </p>
      </div>

      {/* Phase list */}
      <div className='px-3 py-2 space-y-1'>
        {phases.map((phase, idx) => {
          const cfg = STATUS[phase.status];
          const isActive = phase.status === 'active';
          const isDone = phase.status === 'done';
          return (
            <div
              key={phase.id}
              className='flex items-center gap-3 px-3 py-2 cursor-default transition-all duration-150 group'
              style={{
                background: isActive ? '#000' : '#fff',
                border: `2px solid ${isActive ? '#000' : '#e5e5e5'}`,
                boxShadow: isActive ? '3px 3px 0 #F05A28' : 'none',
              }}
            >
              {/* Outline number */}
              <span
                className='font-display shrink-0'
                style={{
                  fontSize: 20,
                  lineHeight: 1,
                  color: isActive ? '#fff' : 'transparent',
                  WebkitTextStroke: isActive ? 'none' : `1px ${isDone ? '#22c55e' : 'rgba(0,0,0,0.2)'}`,
                  letterSpacing: '-0.04em',
                  minWidth: 20,
                }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Content */}
              <div className='flex-1 min-w-0'>
                <p
                  className='font-display truncate'
                  style={{
                    fontSize: 11,
                    color: isActive ? '#fff' : phase.status === 'pending' ? 'rgba(0,0,0,0.25)' : '#000',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {phase.label}
                </p>
                <p
                  className='font-mono-brand text-[9px] mt-0.5'
                  style={{ color: isActive ? '#F05A28' : cfg.text, letterSpacing: '0.12em' }}
                >
                  {phase.detail}
                </p>
              </div>

              {/* Right: progress bar */}
              <div className='shrink-0 flex flex-col items-end gap-1'>
                <div style={{ width: 28, height: 2, background: isActive ? 'rgba(255,255,255,0.15)' : '#e5e5e5' }}>
                  <div style={{
                    height: '100%',
                    background: isActive ? '#F05A28' : cfg.bar,
                    width: phase.status === 'done' ? '100%' : phase.status === 'active' ? '60%' : '0%',
                  }} />
                </div>
                {isActive && <span className='pixel-blink' style={{ color: '#F05A28', fontSize: 7 }}>●</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Owner Actions */}
      {isOwner && projectStatus !== 'completed' && (
        <div className="px-3 py-2 flex gap-2">
          {activePhase && (
            <button
              onClick={() => handleCompleteNode(activePhase.id)}
              className="flex-1 py-2 bg-black text-white font-display text-[10px] hover:bg-[#F05A28] transition-colors"
              style={{ letterSpacing: '0.05em' }}
            >
              完成当前节点
            </button>
          )}
          <button
            onClick={handleAcceptProject}
            className="flex-1 py-2 bg-[#22c55e] text-white font-display text-[10px] hover:bg-green-600 transition-colors"
            style={{ letterSpacing: '0.05em' }}
          >
            直接验收项目
          </button>
        </div>
      )}
      {isOwner && projectStatus === 'completed' && (
        <div className="px-3 py-2 flex justify-center border-t border-gray-200">
          <span className="text-[#22c55e] font-display text-xs" style={{ letterSpacing: '0.05em' }}>✓ PROJECT COMPLETED</span>
        </div>
      )}
    </div>
  );
}