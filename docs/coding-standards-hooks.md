# React Hooks Coding Standards

## Preventing Infinite Loops

Infinite loops in React hooks are a common source of bugs. Follow these guidelines to avoid them.

### 1. Never put unstable references in dependency arrays

**BAD** - Functions from hooks create new references each render:
```tsx
const { toast } = useToast();

useEffect(() => {
  // ... do something
  toast({ title: 'Done' });
}, [toast]); // ❌ toast is a new reference every render = infinite loop
```

**GOOD** - Use a ref to store the function:
```tsx
const { toast } = useToast();
const toastRef = useRef(toast);
toastRef.current = toast;

useEffect(() => {
  // ... do something
  toastRef.current({ title: 'Done' });
}, []); // ✅ No dependency on toast
```

### 2. Avoid callbacks in useCallback dependencies

**BAD** - Callback props change every render:
```tsx
function useMyHook(onComplete: () => void) {
  const doWork = useCallback(() => {
    // work...
    onComplete();
  }, [onComplete]); // ❌ onComplete changes every render
}
```

**GOOD** - Store callback in ref:
```tsx
function useMyHook(onComplete: () => void) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  
  const doWork = useCallback(() => {
    // work...
    onCompleteRef.current();
  }, []); // ✅ Stable reference
}
```

### 3. Use loading flags to prevent duplicate fetches

**BAD** - Multiple renders can trigger multiple fetches:
```tsx
useEffect(() => {
  fetchData();
}, [userId]);
```

**GOOD** - Use a ref to track loading state:
```tsx
const isLoadingRef = useRef(false);

useEffect(() => {
  if (isLoadingRef.current) return;
  isLoadingRef.current = true;
  
  fetchData().finally(() => {
    isLoadingRef.current = false;
  });
}, [userId]);
```

### 4. Never call setState that triggers the same effect

**BAD** - Effect updates state that triggers itself:
```tsx
useEffect(() => {
  if (shouldSubmit) {
    submitData();
    fetchData(); // This sets shouldSubmit to true again!
  }
}, [shouldSubmit]);
```

**GOOD** - Use a flag to track if action was already taken:
```tsx
const hasSubmittedRef = useRef(false);

useEffect(() => {
  if (shouldSubmit && !hasSubmittedRef.current) {
    hasSubmittedRef.current = true;
    submitData();
    // Update local state instead of refetching
    setState(prev => ({ ...prev, submitted: true }));
  }
}, [shouldSubmit]);
```

### 5. Be careful with autoRefresh patterns

Window focus/visibility events fire frequently (screenshots, tab switches, etc.).

**BAD** - Refreshing on every focus:
```tsx
useEffect(() => {
  const handleFocus = () => fetchData(); // Fires too often!
  window.addEventListener('focus', handleFocus);
  return () => window.removeEventListener('focus', handleFocus);
}, []);
```

**GOOD** - Debounce or disable by default:
```tsx
// Option 1: Make it opt-in
function useMyHook(options = { autoRefresh: false }) {
  // ...
}

// Option 2: Debounce
const lastFetchRef = useRef(0);
const handleFocus = () => {
  const now = Date.now();
  if (now - lastFetchRef.current > 5000) { // 5 second debounce
    lastFetchRef.current = now;
    fetchData();
  }
};
```

## Checklist Before Committing Hook Code

- [ ] No functions from other hooks in dependency arrays
- [ ] Callback props stored in refs, not dependencies
- [ ] Loading flags prevent duplicate operations
- [ ] State updates don't trigger the same effect
- [ ] Auto-refresh patterns are debounced or opt-in
- [ ] Test by rapidly switching tabs/taking screenshots

## ESLint Rules

Add these to catch common issues:

```json
{
  "rules": {
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error"
  }
}
```

Note: `exhaustive-deps` will warn about missing dependencies. When you intentionally exclude a dependency, add a comment explaining why:

```tsx
useEffect(() => {
  // ... 
}, [userId]); // eslint-disable-line react-hooks/exhaustive-deps -- toast is stored in ref
```
