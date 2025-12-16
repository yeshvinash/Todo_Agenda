# Todo Table App

A React (TypeScript) Todo application providing a modern UI, efficient state management, and interactive table features.

---

## Features

- **Add, Edit, Delete Todos**: Full CRUD operations for managing your todo items.
- **Completion Tracking**: Mark todos as complete/incomplete with checkbox or button.
- **Bulk Actions**: Delete all todos or all completed todos with confirmation alerts.
- **Search & Sort**: Real-time search with debounce, several sort options (by text, by status).
- **Pagination**: Paginated table view with configurable items per page.
- **Sleek Table UI**: Responsive, accessible table built with TailwindCSS and custom React components.
- **Live Counter**: Shows active, completed, and total todos at a glance.

---

## How Pagination Works

- **Visible Pages**: Up to 5 page numbers visible at once for a clean UI.
- **Ellipsis Display**: Ellipsis (`...`) automatically display for long page numbers, following the first and last page (when applicable).
- **Controlled Navigation**: Clickable previous/next, and page number buttons. Current page highlighted.

Pagination logic is managed in [`src/pages/TodoTable/TodoTable.tsx`](src/pages/TodoTable/TodoTable.tsx):

- `getPageNumbers()` calculates which page numbers or ellipsis should appear based on the current page and total pages.
- Handlers use React state and scroll up to the top of the list on change.

---

## File Structure (Partial)

```
src/
  context/
    TodoContext.tsx      # State logic for todos
  pages/
    TodoTable/
      TodoTable.tsx      # Main UI & logic for table
  components/
    Checkbox/
    CustomInput/
    CustomDropDown/
    Pagination/
      Pagination.tsx     # Pagination controls
    Data/
      Consts.ts          # Sort options etc.
  lib/
    utils.ts             # Utility functions
```

---

## Development

1. **Install dependencies**  
   `npm install`
2. **Run the app**  
   `npm run dev`  
   or  
   `yarn dev`
3. **Open** http://localhost:5173 or similar (check your terminal)

---

## Customization Tips

- Adjust `ITEMS_PER_PAGE` in `TodoTable.tsx` for more/less rows per page.
- Update style and component props for different look-and-feel.

---

## Credits

Built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [TailwindCSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/).

---
