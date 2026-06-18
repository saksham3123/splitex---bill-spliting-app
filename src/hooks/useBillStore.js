import { useReducer, useCallback, useEffect } from 'react';

// ─── Avatar Colors ────────────────────────────────────────
export const AVATAR_COLORS = [
  { bg: 'rgba(99, 102, 241, 0.25)',  border: '#6366f1', text: '#a5b4fc' },
  { bg: 'rgba(236, 72, 153, 0.25)',  border: '#ec4899', text: '#f9a8d4' },
  { bg: 'rgba(52, 211, 153, 0.25)',  border: '#34d399', text: '#6ee7b7' },
  { bg: 'rgba(251, 191, 36, 0.25)',  border: '#fbbf24', text: '#fde68a' },
  { bg: 'rgba(56, 189, 248, 0.25)',  border: '#38bdf8', text: '#7dd3fc' },
  { bg: 'rgba(248, 113, 113, 0.25)', border: '#f87171', text: '#fca5a5' },
  { bg: 'rgba(167, 139, 250, 0.25)', border: '#a78bfa', text: '#c4b5fd' },
  { bg: 'rgba(251, 146, 60, 0.25)',  border: '#fb923c', text: '#fdba74' },
];

const STORAGE_KEY = 'splitex-v1';

// ─── Factory ──────────────────────────────────────────────
function makeGroup(overrides = {}) {
  const now = Date.now();
  return {
    id: now.toString() + Math.random().toString(36).slice(2, 7),
    name:      overrides.name     || 'New Group',
    icon:      overrides.icon     || '💰',
    type:      overrides.type     || 'expense',
    color:     overrides.color    || '#6366f1',
    currency:  overrides.currency || 'USD',
    createdAt: now,
    updatedAt: now,
    people:    [],
    items:     [],
    tip:       18,
    tax:       0,
  };
}

// ─── Initial State ────────────────────────────────────────
const initialState = {
  groups: [],
  activeGroupId: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Always open the dashboard on fresh load
      return { ...parsed, activeGroupId: null };
    }
  } catch { /* ignore */ }
  return initialState;
}

// ─── Group-level reducer (operates on one group) ──────────
function groupReducer(group, action) {
  switch (action.type) {
    case 'ADD_PERSON': {
      const colorIdx = group.people.length % AVATAR_COLORS.length;
      return {
        ...group,
        updatedAt: Date.now(),
        people: [
          ...group.people,
          { id: Date.now().toString(), name: action.payload.trim(), colorIdx },
        ],
      };
    }
    case 'REMOVE_PERSON':
      return {
        ...group,
        updatedAt: Date.now(),
        people: group.people.filter(p => p.id !== action.payload),
        items:  group.items.map(item =>
          item.assignedTo === action.payload ? { ...item, assignedTo: 'all' } : item
        ),
      };
    case 'ADD_ITEM':
      return {
        ...group,
        updatedAt: Date.now(),
        items: [
          ...group.items,
          {
            id:         Date.now().toString(),
            name:       action.payload.name.trim(),
            amount:     parseFloat(action.payload.amount) || 0,
            assignedTo: action.payload.assignedTo || 'all',
          },
        ],
      };
    case 'UPDATE_ITEM':
      return {
        ...group,
        updatedAt: Date.now(),
        items: group.items.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.changes } : item
        ),
      };
    case 'REMOVE_ITEM':
      return {
        ...group,
        updatedAt: Date.now(),
        items: group.items.filter(i => i.id !== action.payload),
      };
    case 'SET_TIP':      return { ...group, updatedAt: Date.now(), tip:      action.payload };
    case 'SET_TAX':      return { ...group, updatedAt: Date.now(), tax:      action.payload };
    case 'SET_CURRENCY': return { ...group, updatedAt: Date.now(), currency: action.payload };
    case 'RESET_GROUP':  return { ...group, updatedAt: Date.now(), people: [], items: [], tip: 18, tax: 0 };
    default: return group;
  }
}

// ─── Actions that operate on the active group ─────────────
const GROUP_SCOPED = new Set([
  'ADD_PERSON', 'REMOVE_PERSON',
  'ADD_ITEM', 'UPDATE_ITEM', 'REMOVE_ITEM',
  'SET_TIP', 'SET_TAX', 'SET_CURRENCY',
  'RESET_GROUP',
]);

// ─── Root reducer ─────────────────────────────────────────
function rootReducer(state, action) {
  // Delegate group-scoped actions to the active group
  if (GROUP_SCOPED.has(action.type)) {
    return {
      ...state,
      groups: state.groups.map(g =>
        g.id === state.activeGroupId ? groupReducer(g, action) : g
      ),
    };
  }

  switch (action.type) {
    case 'CREATE_GROUP': {
      const newGroup = makeGroup(action.payload);
      return {
        ...state,
        groups: [...state.groups, newGroup],
        activeGroupId: newGroup.id,
      };
    }
    case 'DELETE_GROUP':
      return {
        ...state,
        groups: state.groups.filter(g => g.id !== action.payload),
        activeGroupId: state.activeGroupId === action.payload ? null : state.activeGroupId,
      };
    case 'SET_ACTIVE_GROUP':
      return { ...state, activeGroupId: action.payload };
    case 'BACK_TO_DASHBOARD':
      return { ...state, activeGroupId: null };
    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────
export function useBillStore() {
  const [state, dispatch] = useReducer(rootReducer, undefined, loadState);

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* quota exceeded etc. */ }
  }, [state]);

  // ── Group management ─────────────────────────────────────
  const createGroup    = useCallback((data) => dispatch({ type: 'CREATE_GROUP',    payload: data }), []);
  const deleteGroup    = useCallback((id)   => dispatch({ type: 'DELETE_GROUP',    payload: id   }), []);
  const setActiveGroup = useCallback((id)   => dispatch({ type: 'SET_ACTIVE_GROUP', payload: id  }), []);
  const backToDashboard= useCallback(()     => dispatch({ type: 'BACK_TO_DASHBOARD' }),               []);

  // ── Bill actions (active group) ───────────────────────────
  const addPerson  = useCallback((name) => {
    if (!name.trim()) return false;
    dispatch({ type: 'ADD_PERSON', payload: name });
    return true;
  }, []);

  const removePerson = useCallback((id) => dispatch({ type: 'REMOVE_PERSON', payload: id }), []);

  const addItem = useCallback((item) => {
    if (!item.name?.trim() || !item.amount) return false;
    dispatch({ type: 'ADD_ITEM', payload: item });
    return true;
  }, []);

  const updateItem = useCallback((id, changes) => dispatch({ type: 'UPDATE_ITEM', payload: { id, changes } }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', payload: id }), []);
  const setTip     = useCallback((tip)      => dispatch({ type: 'SET_TIP',      payload: tip      }), []);
  const setTax     = useCallback((tax)      => dispatch({ type: 'SET_TAX',      payload: tax      }), []);
  const setCurrency= useCallback((currency) => dispatch({ type: 'SET_CURRENCY', payload: currency }), []);
  const resetGroup = useCallback(()         => dispatch({ type: 'RESET_GROUP' }),                     []);

  return {
    state,
    avatarColors: AVATAR_COLORS,
    actions: {
      // Group management
      createGroup,
      deleteGroup,
      setActiveGroup,
      backToDashboard,
      // Bill (active group)
      addPerson, removePerson,
      addItem, updateItem, removeItem,
      setTip, setTax, setCurrency,
      resetGroup,
      reset: resetGroup, // backward-compat
    },
  };
}
