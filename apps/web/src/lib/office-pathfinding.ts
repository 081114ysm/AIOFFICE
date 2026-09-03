export type GridPoint = { x: number; y: number };

const directions = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
const keyOf = (point: GridPoint) => `${point.x},${point.y}`;
const distance = (a: GridPoint, b: GridPoint) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export function findOfficePath(start: GridPoint, goal: GridPoint, width = 64, height = 72): GridPoint[] {
  const open = [start]; const cameFrom = new Map<string, GridPoint>(); const gScore = new Map([[keyOf(start), 0]]); const fScore = new Map([[keyOf(start), distance(start, goal)]]);
  while (open.length) {
    open.sort((a, b) => (fScore.get(keyOf(a)) ?? Infinity) - (fScore.get(keyOf(b)) ?? Infinity));
    const current = open.shift()!;
    if (current.x === goal.x && current.y === goal.y) {
      const path = [current]; let cursor = current;
      while (cameFrom.has(keyOf(cursor))) { cursor = cameFrom.get(keyOf(cursor))!; path.unshift(cursor); }
      return path;
    }
    for (const direction of directions) {
      const next = { x: current.x + direction.x, y: current.y + direction.y };
      if (next.x < 0 || next.y < 0 || next.x >= width || next.y >= height) continue;
      const nextKey = keyOf(next); const tentative = (gScore.get(keyOf(current)) ?? Infinity) + 1;
      if (tentative < (gScore.get(nextKey) ?? Infinity)) { cameFrom.set(nextKey, current); gScore.set(nextKey, tentative); fScore.set(nextKey, tentative + distance(next, goal)); if (!open.some((point) => point.x === next.x && point.y === next.y)) open.push(next); }
    }
  }
  return [start];
}
