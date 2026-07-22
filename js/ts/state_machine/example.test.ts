import { StateMachine } from "./StateMachine"

type S = 'idle' | 'loading' | 'done'
type E = 'fetch' | 'success' | 'reset'

const sm = new StateMachine<S, E>({
  initial: 'idle',
  transitions: [
    { from: 'idle',    event: 'fetch',   to: 'loading' },
    { from: 'loading', event: 'success', to: 'done'    },
    { from: 'done',    event: 'reset',   to: 'idle'    },
  ],
  hooks: {
    onEnter: (s, from, ev) => console.log(`[enter] ${s} (from=${from}, by=${ev})`),
    onExit:  (s, to, ev)   => console.log(`[exit ] ${s} -> ${to} (by=${ev})`),
    onEvent: (ev, cur, nx) => console.log(`[event] ${ev}: ${cur} -> ${nx ?? '(no-op)'}`),
  },
})

console.log(sm.currentState()) // 'idle'
sm.sendEvent('fetch')          // idle -> loading
sm.sendEvent('success')        // loading -> done
sm.reset()                     // done -> idle