export function useMetrika() {
  function trackGoal(goal: string): void {
    if (process.client && (window as any).ym) {
      ;(window as any).ym(109760856, 'reachGoal', goal)
    }
  }
  return { trackGoal }
}
