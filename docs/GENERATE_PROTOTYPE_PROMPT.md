## HTML Generation Instruction (IMPORTANT)

Generate HTML based on this FSD and provided images.

### 🎯 Primary Goal
- Focus on **layout structure and element positioning**
- NOT visual styling accuracy

---

### 🧱 Layout Rules (STRICT)

- Follow image structure as closely as possible:
  - Section order must match
  - Element grouping must match
  - Alignment must reflect image

- Must clearly separate:
  - Header
  - Toolbar
  - Form section
  - Tabs (if any)
  - Table
  - Footer

- Use proper layout techniques:
  - CSS Grid (for form layout, especially multi-column)
  - Flexbox (for alignment and spacing)

---

### 📐 Positioning Requirements

- Respect:
  - Horizontal alignment (left/right grouping)
  - Vertical flow (top → bottom order)
  - Relative spacing between sections

- Do NOT:
  - Stack everything vertically without structure
  - Ignore multi-column layout (e.g. 4-column form must be grid)

---

### ⚙️ Behavior Scope

Use simple vanilla JavaScript only:

- openModal()
- closeModal()
- addRow()
- deleteRow()

---

### 🎨 Styling Rules (RELAXED)

- Do NOT try to match exact colors, font, or design system
- Use simple neutral styling:
  - Basic borders
  - Light background
  - Minimal spacing

- Styling is secondary — structure is primary

---

### 🧩 Component Mindset

- Structure HTML as if it will be replaced by:
  - Global components
  - Design system components

- Avoid over-styling or hardcoded visual decisions

---

### 📦 Output Format

- Single HTML file
- Inline CSS
- Inline JavaScript
- Ready to open in browser

---

### 🚫 What to Avoid

- Over-engineered styling
- Complex JS logic
- Guessing missing structure
- Ignoring layout hints from FSD