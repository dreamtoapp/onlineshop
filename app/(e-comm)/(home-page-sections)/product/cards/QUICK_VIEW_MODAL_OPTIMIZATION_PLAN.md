# QuickView Modal Optimization Plan

## Goal
Render the QuickView modal (Dialog and its content) **only when the user clicks the QuickView button** for a product card. This ensures best performance and avoids unnecessary renders.

---

## Steps

### 1. Remove Always-Rendered QuickViewButton
- In `ProductCardMedia.tsx`, **remove** the line:
  ```tsx
  <QuickViewButton product={product} />
  ```

### 2. Move Modal State Up
- In `ProductCardMedia.tsx`, add a local state:
  ```tsx
  const [open, setOpen] = useState(false);
  ```

### 3. Render QuickView Button Inline
- Add a button (with an Eye icon) that sets `open` to `true` on click:
  ```tsx
  <Button
    variant="ghost"
    size="icon"
    aria-label={`معاينة سريعة لـ ${product.name}`}
    onClick={e => {
      e.stopPropagation();
      setOpen(true);
    }}
  >
    <Eye className="w-4 h-4" />
  </Button>
  ```

### 4. Render Modal Only When Open
- Conditionally render the Dialog/modal **only when `open` is true**:
  ```tsx
  {open && (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        {/* Modal content here (images, details, etc.) */}
      </DialogContent>
    </Dialog>
  )}
  ```

### 5. (Optional) Dynamic Import for Heavy Content
- If modal content is very heavy, use `next/dynamic` to lazy-load it:
  ```tsx
  import dynamic from 'next/dynamic';
  const QuickViewModalContent = dynamic(() => import('./QuickViewModalContent'), { ssr: false });
  // ...
  {open && (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <QuickViewModalContent product={product} />
      </DialogContent>
    </Dialog>
  )}
  ```

---

## References
- [React: Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [shadcn/ui Dialog Example](https://ui.shadcn.com/docs/components/dialog)
- [Next.js: Dynamic Imports](https://nextjs.org/docs/pages/building-your-application/optimizing/dynamic-imports)

---

**Result:**
- Only the clicked product's modal is rendered.
- No extra renders or memory usage for hidden modals.
- Follows official React/Next.js best practices for performance and maintainability. 