'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: number;
  name: string;
  role: string;
  status: string; // 'active', 'invitation', 'completed', etc.
  budget: number;
  created_at: string;
}

interface MemberDetail {
  id: number;
  role: string;
  name: string;
  is_agent: boolean;
}

interface ProjectDetail {
  project_name: string;
  requirement_prd: string;
  budget: number;
  members: MemberDetail[];
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Iteration Modal State
  const [showIterateModal, setShowIterateModal] = useState(false);
  const [iteratingProjectId, setIteratingProjectId] = useState<number | null>(null);
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null);
  const [newPrd, setNewPrd] = useState('');
  const [keepMemberIds, setKeepMemberIds] = useState<number[]>([]);
  const [iterating, setIterating] = useState(false);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setProjects(data.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAccept = (id: number) => {
    // In a real app, call API to accept invitation
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'active' } : p));
    router.push(`/workspace/${id}`);
  };

  const handleEnter = (id: number) => {
    router.push(`/workspace/${id}`);
  };

  const handleOpenIterate = async (id: number) => {
    setIteratingProjectId(id);
    setShowIterateModal(true);
    setProjectDetail(null);
    setNewPrd('');
    setKeepMemberIds([]);

    try {
      const token = localStorage.getItem('token') || '';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/project/${id}/detail`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjectDetail(data.data);
        setNewPrd(data.data.requirement_prd);
        // default keep all
        setKeepMemberIds(data.data.members.map((m: any) => m.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleKeepMember = (memberId: number) => {
    if (keepMemberIds.includes(memberId)) {
      setKeepMemberIds(keepMemberIds.filter(id => id !== memberId));
    } else {
      setKeepMemberIds([...keepMemberIds, memberId]);
    }
  };

  const handleIterateSubmit = async () => {
    if (!iteratingProjectId) return;
    setIterating(true);
    try {
      const token = localStorage.getItem('token') || '';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/project/${iteratingProjectId}/iterate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          new_prd: newPrd,
          keep_member_ids: keepMemberIds
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        const newProjectId = data.data.project_id;
        setShowIterateModal(false);
        router.push(`/workspace/${newProjectId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIterating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono-brand flex flex-col relative">
      {/* Navbar */}
      <nav className="h-16 border-b-2 border-gray-800 flex items-center justify-between px-8 shrink-0 bg-[#0a0812]">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/home')}>
          <div className="w-8 h-8 bg-[#F05A28] border-2 border-white flex items-center justify-center shadow-[2px_2px_0_#fff]">
            <span className="font-display font-bold text-black">A</span>
          </div>
          <span className="font-display text-xl tracking-widest">MY_PROJECTS</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-8 flex flex-col gap-8">
        <h1 className="font-display text-4xl text-[#F05A28] glitch-text" data-text="WORK_HISTORY">WORK_HISTORY</h1>
        
        {loading ? (
          <div className="text-gray-500 animate-pulse">LOADING PROJECTS...</div>
        ) : (
          <div className="flex flex-col gap-6">
            {projects.map(p => (
              <div 
                key={p.id} 
                className={`p-6 border-2 transition-all ${
                  p.status === 'invitation' 
                    ? 'bg-[#1a1500] border-[#eab308] shadow-[4px_4px_0_#eab308]' 
                    : p.status === 'completed'
                    ? 'bg-[#0f172a] border-[#3b82f6] shadow-[4px_4px_0_#3b82f6]'
                    : 'bg-[#111] border-gray-800 hover:border-gray-500 shadow-[4px_4px_0_#333]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    {p.status === 'invitation' && (
                      <div className="text-[#eab308] text-xs font-bold mb-2 flex items-center gap-2 animate-pulse">
                        <span>⚠️ 新的项目邀约</span>
                      </div>
                    )}
                    {p.status === 'completed' && (
                      <div className="text-[#3b82f6] text-xs font-bold mb-2 flex items-center gap-2">
                        <span>✅ 已完成</span>
                      </div>
                    )}
                    <h3 className="font-display text-2xl mb-2">{p.name}</h3>
                    <div className="text-xs text-gray-400 flex gap-4">
                      <span>ID: #{p.id}</span>
                      <span>ROLE: {p.role}</span>
                      <span>DATE: {p.created_at || 'UNKNOWN'}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {p.status === 'invitation' ? (
                      <button 
                        onClick={() => handleAccept(p.id)}
                        className="px-6 py-3 bg-[#eab308] text-black font-display font-bold text-sm hover:bg-yellow-400 transition-colors shadow-[2px_2px_0_#fff] active:translate-y-1 active:translate-x-1 active:shadow-none"
                      >
                        ACCEPT & ENTER
                      </button>
                    ) : p.status === 'completed' ? (
                      <>
                        <button 
                          onClick={() => handleEnter(p.id)}
                          className="px-6 py-3 bg-white text-black font-display font-bold text-sm hover:bg-gray-200 transition-colors shadow-[2px_2px_0_#3b82f6] active:translate-y-1 active:translate-x-1 active:shadow-none"
                        >
                          VIEW WORKSPACE
                        </button>
                        {p.role === 'OWNER' && (
                          <button 
                            onClick={() => handleOpenIterate(p.id)}
                            className="px-6 py-3 bg-[#3b82f6] text-white font-display font-bold text-sm hover:bg-blue-400 transition-colors shadow-[2px_2px_0_#fff] active:translate-y-1 active:translate-x-1 active:shadow-none"
                          >
                            二次迭代
                          </button>
                        )}
                      </>
                    ) : (
                      <button 
                        onClick={() => handleEnter(p.id)}
                        className="px-6 py-3 bg-white text-black font-display font-bold text-sm hover:bg-gray-200 transition-colors shadow-[2px_2px_0_#F05A28] active:translate-y-1 active:translate-x-1 active:shadow-none"
                      >
                        ENTER WORKSPACE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {projects.length === 0 && (
              <div className="p-12 text-center border border-dashed border-gray-800 text-gray-500">
                <p>NO PROJECTS FOUND</p>
                <button 
                  onClick={() => router.push('/publish')}
                  className="mt-4 px-4 py-2 border border-gray-600 hover:text-white hover:border-white transition-colors"
                >
                  START A NEW PROJECT
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Iteration Modal */}
      {showIterateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="bg-[#111] border-2 border-white shadow-[8px_8px_0_#F05A28] w-full max-w-5xl h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b-2 border-white flex justify-between items-center shrink-0">
              <h2 className="font-display text-2xl text-white tracking-wider">PROJECT ITERATION</h2>
              <button 
                onClick={() => setShowIterateModal(false)}
                className="text-white hover:text-[#F05A28] font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            {projectDetail ? (
              <div className="flex-1 flex min-h-0">
                {/* Left: PRD */}
                <div className="flex-1 p-6 border-r-2 border-white flex flex-col gap-4">
                  <h3 className="font-display text-[#F05A28]">UPDATE REQUIREMENT DOC</h3>
                  <textarea
                    className="flex-1 bg-black border border-gray-700 p-4 text-sm font-mono-brand text-gray-300 focus:border-[#F05A28] focus:outline-none resize-none"
                    value={newPrd}
                    onChange={e => setNewPrd(e.target.value)}
                    placeholder="Describe the new features and changes for this iteration..."
                  />
                </div>

                {/* Right: Members */}
                <div className="w-1/3 p-6 flex flex-col gap-4 overflow-y-auto">
                  <h3 className="font-display text-[#F05A28]">TEAM CONFIGURATION</h3>
                  <p className="text-xs text-gray-400">Select the members you want to KEEP. Unselected members will be REPLACED with new agents based on the new PRD.</p>
                  
                  <div className="flex flex-col gap-3">
                    {projectDetail.members.map(m => (
                      <label 
                        key={m.id} 
                        className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                          keepMemberIds.includes(m.id) 
                            ? 'border-white bg-[#1a1a1a]' 
                            : 'border-gray-700 opacity-50 hover:opacity-80'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={keepMemberIds.includes(m.id)}
                          onChange={() => handleToggleKeepMember(m.id)}
                          className="w-4 h-4 accent-[#F05A28]"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{m.role}</span>
                          <span className="text-xs text-gray-400">{m.name} {m.is_agent ? '(AI Agent)' : '(Human)'}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                LOADING PROJECT DETAILS...
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-6 border-t-2 border-white flex justify-end shrink-0 bg-[#0a0812]">
              <button
                onClick={handleIterateSubmit}
                disabled={iterating || !projectDetail}
                className="px-8 py-3 bg-[#F05A28] text-white font-display tracking-widest text-lg hover:bg-[#e04818] transition-colors disabled:opacity-50"
              >
                {iterating ? 'STARTING...' : 'LAUNCH ITERATION'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
