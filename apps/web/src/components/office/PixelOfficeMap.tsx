"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import type { Agent } from "../../types/office";
import { findOfficePath, type GridPoint } from "../../lib/office-pathfinding";

const rooms = [
  ["대표실", 2, 3, 22, 25, "#e6b84f"], ["브랜드 인텔리전스", 27, 3, 22, 25, "#8fc7a5"], ["콘텐츠 전략 1", 52, 3, 22, 25, "#d88f68"], ["시장조사", 77, 3, 21, 25, "#9dbb70"],
  ["브랜드 QA", 2, 57, 22, 28, "#e6b84f"], ["콘텐츠 전략 2", 27, 57, 22, 28, "#b6a26f"], ["릴스 제작", 52, 57, 22, 28, "#78b8b0"], ["캐러셀 제작", 77, 57, 21, 28, "#d99a70"],
  ["파트너십", 2, 32, 22, 20, "#79b79d"], ["재무·사업관리", 27, 32, 22, 20, "#91b67e"], ["성과리뷰", 52, 32, 22, 20, "#d69b4c"], ["자동화 운영", 77, 32, 21, 20, "#8db6c0"],
] as const;

function gridPoint(agent: Agent): GridPoint { return { x: Math.round(agent.positionX ?? 5), y: Math.round(agent.positionY ?? 8) }; }
function targetPoint(agent: Agent, index: number): GridPoint { if (agent.status === "IN_MEETING" || agent.roomId === "meeting") return { x: 32 + (index % 5) * 4, y: 36 + Math.floor(index / 5) * 4 }; return gridPoint(agent); }

export function PixelOfficeMap({ agents }: { agents: Agent[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = hostRef.current; if (!host) return;
    let disposed = false; let initialized = false; let animation = 0;
    const app = new PIXI.Application();
    void (async () => {
      await app.init({ resizeTo: host, background: "#e8dfc8", antialias: false, preference: "webgl" });
      initialized = true;
      if (disposed) { app.destroy({ removeView: true }, { children: true }); return; }
      host.appendChild(app.canvas); app.canvas.setAttribute("aria-label", "실시간 AI Office Pixi 맵");
      const world = new PIXI.Container(); app.stage.addChild(world);
      const redraw = () => {
        world.removeChildren().forEach((child) => child.destroy());
        const sx = app.screen.width / 100; const sy = app.screen.height / 100;
        const background = new PIXI.Graphics().rect(0, 0, app.screen.width, app.screen.height).fill("#e8dfc8"); world.addChild(background);
        for (let x = 0; x <= 100; x += 3) { const gridLine = new PIXI.Graphics().moveTo(x * sx, 0).lineTo(x * sx, app.screen.height).stroke({ color: "#fff8e8", alpha: 0.42, width: 1 }); world.addChild(gridLine); }
        for (let y = 0; y <= 100; y += 4) { const gridLine = new PIXI.Graphics().moveTo(0, y * sy).lineTo(app.screen.width, y * sy).stroke({ color: "#fff8e8", alpha: 0.42, width: 1 }); world.addChild(gridLine); }
        for (const [name, x, y, width, height, accent] of rooms) { const room = new PIXI.Graphics().roundRect(x * sx, y * sy, width * sx, height * sy, 3).fill("#fffaf0").stroke({ color: "#66584a", width: 2 }); world.addChild(room); const label = new PIXI.Text(name, { fontFamily: "monospace", fontSize: Math.max(10, Math.min(14, app.screen.width / 90)), fontWeight: "700", fill: "#66584a" }); label.x = (x + 1.5) * sx; label.y = (y + 1.5) * sy; world.addChild(label); const light = new PIXI.Graphics().rect((x + width - 4) * sx, (y + 2) * sy, 6, 6).fill(accent); world.addChild(light); }
        const meeting = new PIXI.Graphics().roundRect(40 * sx, 32 * sy, 18 * sx, 20 * sy, 3).fill("#f8e8c7").stroke({ color: "#bd7a45", width: 2 }); world.addChild(meeting); const meetingLabel = new PIXI.Text({ text: "회의실", style: { fontFamily: "monospace", fontSize: 12, fontWeight: "700", fill: "#8d542f" } }); meetingLabel.x = 42 * sx; meetingLabel.y = 34 * sy; world.addChild(meetingLabel);
        agents.forEach((agent, index) => { const point = gridPoint(agent); const destination = targetPoint(agent, index); const path = findOfficePath(point, destination); const progress = Math.min(path.length - 1, Math.floor(Date.now() / 350) % Math.max(path.length, 1)); const cell = path[progress] ?? point; const x = (cell.x / 64) * 100 * sx; const y = (cell.y / 72) * 100 * sy; const body = new PIXI.Graphics().rect(x - 7, y - 4, 14, 12).fill(agent.color).stroke({ color: "#51463d", width: 2 }); world.addChild(body); const head = new PIXI.Graphics().circle(x, y - 9, 6).fill("#f1c7a4").stroke({ color: "#51463d", width: 2 }); world.addChild(head); const name = new PIXI.Text(agent.name.slice(0, 3), { fontFamily: "monospace", fontSize: 9, fill: "#66584a", fontWeight: "700" }); name.anchor.set(0.5, 0); name.x = x; name.y = y + 10; world.addChild(name); if (agent.status === "WORKING" || agent.status === "IN_MEETING") { const bubble = new PIXI.Text(agent.status === "IN_MEETING" ? "회의 중" : agent.speech ?? "작업 중…", { fontFamily: "sans-serif", fontSize: 9, fill: "#66584a", padding: 4, wordWrap: true, wordWrapWidth: 130 }); bubble.x = x + 10; bubble.y = y - 24; world.addChild(bubble); } });
      };
      const tick = () => { if (disposed) return; redraw(); animation = window.setTimeout(tick, 350); }; tick();
    })();
    return () => { disposed = true; window.clearTimeout(animation); if (initialized) app.destroy({ removeView: true }, { children: true }); };
  }, [agents]);
  return <div ref={hostRef} className="pixi-office-canvas" aria-label="AI 직원 실시간 픽셀 오피스" />;
}
