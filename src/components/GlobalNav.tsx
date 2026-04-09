'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/publish',    label: '发布',    icon: '✦' },
  { href: '/workspace',  label: '工作台',  icon: '⬡' },
  { href: '/profile',    label: '个人中心',    icon: '◈' },
];

const PAGE_META: Record<string, { label: string; sub: string }> = {
  '/publish':    { label: '发布',    sub: '新建项目' },
  '/workspace':  { label: '工作台',  sub: 'AGENT 平台' },
  '/profile':    { label: '个人中心',    sub: '用户设置' },
  '/settlement': { label: '结算',    sub: '项目报告' },
};

function NavItem({ href, label, icon, isActive }: {
  href: string; label: string; icon: string; isActive: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const bg = isActive
    ? '#F05A28'
    : hovered && !pressed
    ? '#fff'
    : 'transparent';
  const color = isActive
    ? '#000'
    : hovered && !pressed
    ? '#000'
    : 'rgba(255,255,255,0.55)';
  const borderColor = isActive
    ? '#F05A28'
    : hovered
    ? 'rgba(255,255,255,0.5)'
    : 'rgba(255,255,255,0.12)';
  const shadow = pressed
    ? 'none'
    : hovered && !isActive
    ? '4px 4px 0 rgba(255,255,255,0.2)'
    : isActive
    ? '3px 3px 0 rgba(240,90,40,0.4)'
    : 'none';
  const transform = pressed
    ? 'translate(2px,2px)'
    : hovered
    ? 'translate(-2px,-2px)'
    : 'none';

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 14px',
          border: `1px solid ${borderColor}`,
          background: bg,
          color,
          cursor: 'pointer',
          boxShadow: shadow,
          transform,
          transition: 'transform 0.12s ease, box-shadow 0.12s ease, background 0.12s, color 0.12s, border-color 0.12s',
          borderRadius: 0,
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: 10, opacity: 0.7 }}>{icon}</span>
        <span style={{
          fontFamily: 'Archivo Black, sans-serif',
          fontSize: 11,
          letterSpacing: '0.08em',
        }}>
          {label}
        </span>
        {/* 激活态左侧橙色竖条 */}
        {isActive && (
          <span style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: 3, background: '#000',
          }} />
        )}
      </div>
    </Link>
  );
}

export default function GlobalNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarHovered, setAvatarHovered] = useState(false);

  // workspace 页面有自己的 TopNav，GlobalNav 只做顶部细条
  const isWorkspace = pathname?.startsWith('/workspace');

  return (
    <>
      {/* ── Global Nav Bar ── */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.92)',
          borderBottom: `1px solid ${isWorkspace ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center',
          height: 48, padding: '0 20px',
          gap: 12,
        }}
      >
        {/* ── Logo ── */}
        <Link href='/' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
          <div style={{ width: 3, height: 22, background: '#F05A28', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: 14, letterSpacing: '-0.04em',
            color: '#fff', lineHeight: 1,
          }}>
            别问我<span style={{ color: '#F05A28' }}>问Agent</span>
          </span>
        </Link>

        {/* ── 分隔 ── */}
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.12)' }} />

        {/* ── Nav Links（桌面端） ── */}
        <div className='hidden-mobile' style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map(link => (
            <NavItem
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              isActive={
                link.href === '/workspace'
                  ? pathname?.startsWith('/workspace') ?? false
                  : pathname === link.href
              }
            />
          ))}
        </div>

        {/* ── 页面标题（当前路由名） ── */}
        {(() => {
          const base = pathname?.split('/').slice(0, 2).join('/') ?? '';
          const meta = PAGE_META[base] ?? (pathname?.startsWith('/settlement') ? PAGE_META['/settlement'] : null);
          if (!meta) return null;
          return (
            <>
              <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.08)', marginLeft: 4 }} />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1 }}>
                <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 16, letterSpacing: '-0.04em', color: '#fff' }}>{meta.label}</span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginTop: 2 }}>{meta.sub}</span>
              </div>
            </>
          );
        })()}

        {/* ── Right Side ── */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* 系统状态 */}
          <div style={{
            fontFamily: 'Space Mono, monospace', fontSize: 9,
            color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span className='pixel-blink' style={{ color: '#22c55e', fontSize: 8 }}>█</span>
            <span>系统在线</span>
          </div>

          {/* 分隔 */}
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

          {/* 用户头像 */}
          <div
            onMouseEnter={() => setAvatarHovered(true)}
            onMouseLeave={() => setAvatarHovered(false)}
            style={{
              width: 30, height: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: avatarHovered ? '#F05A28' : 'transparent',
              border: `1px solid ${avatarHovered ? '#F05A28' : 'rgba(255,255,255,0.2)'}`,
              color: avatarHovered ? '#000' : 'rgba(255,255,255,0.7)',
              fontFamily: 'Archivo Black, sans-serif', fontSize: 10,
              cursor: 'pointer',
              transition: 'all 0.12s ease',
              flexShrink: 0,
            }}
          >
            ME
          </div>

          {/* 移动端汉堡 */}
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              display: 'none', // 移动端再显示，暂时隐藏
              width: 30, height: 30, flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 5,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer', padding: 0,
            }}
          >
            <span style={{ width: 14, height: 1.5, background: '#fff', display: 'block' }} />
            <span style={{ width: 14, height: 1.5, background: '#fff', display: 'block' }} />
          </button>
        </div>
      </nav>

      {/* ── 全屏移动端菜单 ── */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: '#000',
          display: 'flex', flexDirection: 'column',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 14, color: '#fff', letterSpacing: '-0.04em' }}>
            别问我<span style={{ color: '#F05A28' }}>问Agent</span>
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              width: 32, height: 32, background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', cursor: 'pointer', fontSize: 14,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 32px', gap: 4 }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'Archivo Black, sans-serif',
                fontSize: 40, letterSpacing: '-0.04em',
                color: pathname?.startsWith(link.href) ? '#F05A28' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none', lineHeight: 1.2,
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
