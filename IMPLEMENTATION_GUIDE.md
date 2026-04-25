# Safarnama Design System - Implementation Guide

## 🚀 Quick Start

### 1. Import Design System
All CSS variables and utilities are automatically available through `design-system.css` which is imported in `globals.css`.

### 2. Use CSS Variables
```css
/* Spacing */
padding: var(--space-lg);        /* 24px */
margin-bottom: var(--space-xl);  /* 32px */
gap: var(--grid-gutter);         /* 24px */

/* Colors */
color: var(--color-primary);     /* #a3e635 */
background: var(--color-bg-card); /* rgba(15, 23, 42, 0.7) */

/* Typography */
font-family: var(--font-family-display); /* Outfit */
font-size: var(--text-h2);       /* 40px */

/* Borders & Shadows */
border-radius: var(--radius-lg); /* 16px */
box-shadow: var(--shadow-lg);    /* 0 8px 24px rgba(0,0,0,0.2) */

/* Transitions */
transition: all var(--transition-base); /* 0.3s ease */
```

---

## 🎨 Component Examples

### Button Component
```tsx
// Primary Button
<button className="btn btn-primary">
  <svg className="w-5 h-5">...</svg>
  Action
</button>

// Secondary Button
<button className="btn btn-secondary">
  Secondary Action
</button>

// Small Button
<button className="btn btn-sm btn-ghost">
  Small Action
</button>

// Large Button
<button className="btn btn-lg btn-primary">
  Large Action
</button>
```

### Card Component
```tsx
<div className="card">
  <img src="image.jpg" alt="Card" className="card-image" />
  <h3>Card Title</h3>
  <p>Card description goes here.</p>
  <button className="btn btn-primary">Learn More</button>
</div>
```

### Badge Component
```tsx
// Primary Badge
<div className="badge">
  <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
  Badge Text
</div>

// Secondary Badge
<div className="badge badge-secondary">
  <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
  Secondary Badge
</div>
```

### Grid Layout
```tsx
// 2-Column Grid
<div className="grid grid-2">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

// 3-Column Grid
<div className="grid grid-3">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

// 4-Column Grid
<div className="grid grid-4">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
  <div>Column 4</div>
</div>
```

### Container & Section
```tsx
<section className="section bg-[#020817]">
  <div className="container">
    <div className="section-inner">
      <h2>Section Title</h2>
      <p>Section content</p>
    </div>
  </div>
</section>
```

### Form Elements
```tsx
<div className="form-group">
  <label className="form-label">Email Address</label>
  <input type="email" className="form-input" placeholder="you@example.com" />
</div>

<div className="form-group">
  <label className="form-label">Message</label>
  <textarea className="form-textarea" rows={4} placeholder="Your message..."></textarea>
</div>
```

---

## 📐 Spacing Guidelines

### Section Spacing
```tsx
// Top & Bottom padding for sections
<section className="section">
  {/* Automatically gets 64px padding top/bottom */}
</section>
```

### Component Spacing
```tsx
// Margin bottom for spacing between elements
<h2 className="mb-lg">Heading</h2>  {/* 24px */}
<p className="mb-xl">Paragraph</p>  {/* 32px */}

// Gap for flex/grid containers
<div className="flex gap-md">
  {/* 16px gap between items */}
</div>
```

### Padding Values
```
--space-xs:   4px    (minimal spacing)
--space-sm:   8px    (small spacing)
--space-md:   16px   (medium spacing)
--space-lg:   24px   (large spacing)
--space-xl:   32px   (extra large spacing)
--space-2xl:  48px   (2x large spacing)
--space-3xl:  64px   (3x large spacing - sections)
```

---

## 🎯 Common Patterns

### Hero Section
```tsx
<section className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden">
  <div className="container relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-64px items-center">
      <div>
        <div className="badge mb-24px">Badge</div>
        <h1 className="mb-24px">Heading</h1>
        <p className="mb-32px">Description</p>
        <div className="flex gap-16px">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Feature Cards Grid
```tsx
<section className="section bg-[#020817]">
  <div className="container">
    <div className="text-center mb-64px">
      <h2 className="mb-16px">Features</h2>
      <p>Description</p>
    </div>
    <div className="grid grid-3">
      {features.map((feature) => (
        <div key={feature.title} className="card">
          <div className="text-40px mb-16px">{feature.icon}</div>
          <h3 className="mb-12px">{feature.title}</h3>
          <p className="text-14px">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### Stats Section
```tsx
<section className="py-48px" style={{ background: 'rgba(10, 15, 26, 0.9)' }}>
  <div className="container">
    <div className="grid grid-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-40px mb-12px">{stat.icon}</div>
          <div className="text-40px font-800 text-[#a3e635] mb-8px">{stat.value}</div>
          <p className="text-14px text-[rgba(226,232,240,0.6)]">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## 🎬 Animation Patterns

### Fade In Animation
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Slide Up Animation
```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Scroll Reveal Animation
```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Hover Animation
```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -4 }}
  transition={{ duration: 0.3 }}
>
  Hoverable Content
</motion.div>
```

---

## 📱 Responsive Design

### Responsive Grid
```tsx
// Automatically responsive
<div className="grid grid-4">
  {/* 4 cols on desktop, 2 on tablet, 1 on mobile */}
</div>
```

### Responsive Typography
```tsx
// Automatically scales based on breakpoint
<h1>Heading</h1>  {/* 56px desktop, 40px mobile */}
<h2>Heading</h2>  {/* 40px desktop, 32px mobile */}
```

### Responsive Spacing
```tsx
// Automatically adjusts based on breakpoint
<div className="container">
  {/* 24px padding desktop, 16px mobile */}
</div>
```

### Conditional Display
```tsx
// Hide on mobile, show on desktop
<div className="hidden lg:block">
  Desktop only content
</div>

// Show on mobile, hide on desktop
<div className="lg:hidden">
  Mobile only content
</div>
```

---

## 🔍 Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Primary green (#a3e635) on dark background: 7.2:1 ratio
- Secondary blue (#0ea5e9) on dark background: 6.8:1 ratio

### Focus States
```tsx
// All interactive elements have focus states
.btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Semantic HTML
```tsx
// Use semantic elements
<header>Navigation</header>
<main>Main content</main>
<section>Section</section>
<article>Article</article>
<footer>Footer</footer>
```

### ARIA Labels
```tsx
// Add ARIA labels for screen readers
<button aria-label="Close menu">×</button>
<nav aria-label="Main navigation">...</nav>
```

---

## 🚫 What NOT to Do

### ❌ Don't Use Random Spacing
```tsx
// WRONG
<div style={{ padding: '17px', marginBottom: '23px' }}>
  Content
</div>

// RIGHT
<div className="p-lg mb-xl">
  Content
</div>
```

### ❌ Don't Mix Color Systems
```tsx
// WRONG
<div style={{ color: '#ff5733', background: '#123456' }}>
  Content
</div>

// RIGHT
<div style={{ color: 'var(--color-primary)', background: 'var(--color-bg-card)' }}>
  Content
</div>
```

### ❌ Don't Create New Button Styles
```tsx
// WRONG
<button style={{ padding: '10px 20px', background: '#random' }}>
  Button
</button>

// RIGHT
<button className="btn btn-primary">
  Button
</button>
```

### ❌ Don't Use Arbitrary Border Radius
```tsx
// WRONG
<div style={{ borderRadius: '7px' }}>
  Content
</div>

// RIGHT
<div style={{ borderRadius: 'var(--radius-md)' }}>
  Content
</div>
```

---

## ✅ Best Practices

### 1. Always Use CSS Variables
```tsx
// Use variables for consistency
color: var(--color-primary);
padding: var(--space-lg);
```

### 2. Follow 8px Grid
```tsx
// All spacing must be multiples of 8px
margin: 8px, 16px, 24px, 32px, 48px, 64px
```

### 3. Maintain Hierarchy
```tsx
// Clear visual hierarchy
<h1>Main heading</h1>
<h2>Sub heading</h2>
<h3>Tertiary heading</h3>
<p>Body text</p>
```

### 4. Use Utility Classes
```tsx
// Leverage utility classes
<div className="flex gap-md items-center">
  <span>Icon</span>
  <span>Text</span>
</div>
```

### 5. Test Responsiveness
```tsx
// Always test on multiple breakpoints
// Mobile: < 768px
// Tablet: 768px - 1023px
// Desktop: 1024px+
```

---

## 📚 Resources

- `design-system.css` - Core design system
- `DESIGN_SYSTEM.md` - Design system documentation
- `UI_IMPROVEMENTS.md` - Improvement details
- Component files in `components/sections/`

---

## 🎓 Learning Path

1. **Start Here**: Read `DESIGN_SYSTEM.md`
2. **Understand**: Review `design-system.css`
3. **Practice**: Build components using examples
4. **Reference**: Check existing components in `components/sections/`
5. **Master**: Apply to new features

---

## 💡 Tips & Tricks

### Tip 1: Use Tailwind with Design System
```tsx
// Combine Tailwind with design system
<div className="flex gap-md items-center p-lg rounded-lg" style={{ background: 'var(--color-bg-card)' }}>
  Content
</div>
```

### Tip 2: Create Reusable Components
```tsx
// Extract common patterns into components
const FeatureCard = ({ icon, title, description }) => (
  <div className="card">
    <div className="text-40px mb-16px">{icon}</div>
    <h3 className="mb-12px">{title}</h3>
    <p className="text-14px">{description}</p>
  </div>
)
```

### Tip 3: Use Motion for Entrance
```tsx
// Always animate entrance for polish
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  Content
</motion.div>
```

---

## 🆘 Troubleshooting

### Issue: Spacing looks off
**Solution**: Check if using 8px grid multiples. Use `var(--space-*)` variables.

### Issue: Colors don't match
**Solution**: Use CSS variables from design system. Check `design-system.css`.

### Issue: Typography hierarchy unclear
**Solution**: Use proper heading levels (h1, h2, h3). Check font sizes.

### Issue: Component looks different on mobile
**Solution**: Test responsive breakpoints. Check grid-2, grid-3, grid-4 classes.

---

## 📞 Support

For questions or issues:
1. Check `DESIGN_SYSTEM.md`
2. Review component examples
3. Check existing implementations
4. Refer to CSS variables

---

**Version**: 1.0.0
**Last Updated**: April 2026
**Status**: Production Ready

*Follow this guide for consistent, professional design implementation.*
