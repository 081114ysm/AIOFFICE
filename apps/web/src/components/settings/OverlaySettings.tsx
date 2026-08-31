export function OverlaySettings({ enabled, onChange }: { enabled: boolean; onChange: (enabled: boolean) => void }) { return <div className="overlay-setting"><div><strong>데스크톱 오버레이</strong><p>Agent를 화면 위에 띄우고 현재 작업을 말풍선으로 표시합니다.</p></div><button className={`switch ${enabled ? "on" : ""}`} aria-pressed={enabled} onClick={() => onChange(!enabled)}><span /></button></div>; }

