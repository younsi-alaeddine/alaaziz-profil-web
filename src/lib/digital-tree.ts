import type { DigitalRequest } from "@/lib/types";

export function buildDigitalRequestTree(flat: DigitalRequest[]): DigitalRequest[] {
  const map = new Map<string, DigitalRequest>();
  const roots: DigitalRequest[] = [];

  for (const item of flat) {
    map.set(item.id, { ...item, children: [] });
  }

  for (const item of map.values()) {
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children!.push(item);
    } else {
      roots.push(item);
    }
  }

  return roots;
}
