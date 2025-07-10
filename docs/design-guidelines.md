# LinkPilot Design Guidelines

## 1. Language & Framework
- **Use JavaScript only** (no TypeScript) for all files and components.
- All React components should use `.jsx` extension.

## 2. Styling
- **Tailwind CSS** is the only styling solution. Do not use CSS modules or styled-components.
- Use utility classes for all layout, spacing, color, and typography.
- Avoid custom CSS unless absolutely necessary.

## 3. Theme & Colors
- **Primary color:** LinkedIn Blue (`#0A66C2`)
- **Background:** Use `bg-white` or `bg-gray-50` for main backgrounds.
- **Text:** Use `text-gray-900` for main text, `text-gray-500` for secondary.
- **Accent:** Use LinkedIn blue for buttons, links, and highlights.
- **Example:**
  - Header: `bg-[#0A66C2] text-white`
  - Footer: `bg-white border-t border-gray-200 text-gray-500`

## 4. Component Naming
- Use **PascalCase** for all component files and exports (e.g., `AddContactForm.jsx`, `ContactCard.jsx`).
- Name components clearly by function and UI role.
- Place shared UI components in `/components`.

## 5. Button Styles
- Use a unified button style for all primary actions:
  ```jsx
  <button className="bg-[#0A66C2] text-white px-4 py-2 rounded hover:bg-[#004182] font-medium transition">
    Button Text
  </button>
  ```
- For secondary/outline buttons:
  ```jsx
  <button className="border border-[#0A66C2] text-[#0A66C2] px-4 py-2 rounded hover:bg-blue-50 font-medium transition">
    Button Text
  </button>
  ```
- Avoid inline styles and custom CSS for buttons.

## 6. Layout Consistency
- Use `max-w-5xl mx-auto` for main containers.
- Use `px-6 py-4` for consistent padding in headers, footers, and cards.
- Center main content with `flex flex-col items-center justify-center` where appropriate.
- Use `shadow-md` for cards and headers for subtle elevation.

## 7. Responsive Design
- Use Tailwind's responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) to ensure layouts work on all devices.
- Avoid fixed widths; use `max-w-*` and `w-full` for flexibility.

## 8. Accessibility
- All interactive elements (buttons, links) must be keyboard accessible.
- Use semantic HTML tags (`<button>`, `<nav>`, `<main>`, etc.).
- Add `aria-*` attributes where needed for clarity.

---

**Summary:**
- JavaScript only, no TypeScript
- Tailwind CSS for all styles
- LinkedIn blue/white modern theme
- PascalCase for components
- Unified button and layout styles
- Responsive and accessible by default 