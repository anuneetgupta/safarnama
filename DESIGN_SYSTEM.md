# Safarnama Design System - Production Grade

## Overview
This document outlines the complete design system for Safarnama, built to production standards with strict adherence to spacing, typography, and component consistency.

---

## 🎯 Core Principles

1. **8px Grid System** - All spacing uses multiples of 8px
2. **Pixel Perfect** - Strict alignment and consistency
3. **Professional** - Handcrafted, not AI-generated
4. **Accessible** - WCAG compliant contrast and interactions
5. **Performance** - Optimized animations and transitions

---

## 📐 Spacing System

All spacing values follow the 8px grid:

```
--space-xs:   4px
--space-sm:   8px
--space-md:   16px
--space-lg:   24px
--space-xl:   32px
--space-2xl:  48px
--space-3xl:  64px
```

### Usage Rules
- Never use arbitrary spacing values
- Section padding: 64px (top/bottom)
- Grid gaps: 24px (desktop), 20px (tablet), 16px (mobile)
- Component padding: 16px-24px
- Button padding: 12px-16px (horizontal)

---

## 🎨 Color System

### Primary Colors
- **Primary Green**: `#a3e635` (Neon green - brand identity)
- **Primary Dark**: `#84cc16` (Darker green for hover states)
- **Primary Light**: `#bfff00` (Lighter green for accents)

### Secondary Colors
- **Secondary Blue**: `#0ea5e9` (Sky blue - CTAs)
- **Secondary Dark**: `#0284c7` (Darker blue for hover)
- **Secondary Light**: `#38bdf8` (Lighter blue for accents)

### Neutral Colors
- **Background Dark**: `#020817` (Main background)
- **Background Darker**: `#0a0f1a` (Darker sections)
- **Card Background**: `rgba(15, 23, 42, 0.7)` (Glass effect)
- **Text Primary**: `#ffffff` (Main text)
- **Text Secondary**: `rgba(226, 232, 240, 0.7)` (Secondary text)
- **Text Tertiary**: `rgba(148, 163, 184, 0.6)` (Muted text)
- **Border**: `rgba(148, 163, 184, 0.1)` (Subtle borders)

---

## 🔤 Typography

### Font Families
- **Display**: Outfit (headings, titles)
- **Body**: Inter (content, UI text)

### Font Sizes & Weights

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1      | 56px | 800    | 1.2         |
| H2      | 40px | 700    | 1.2         |
| H3      | 28px | 600    | 1.2         |
| Body    | 16px | 400    | 1.5         |
| Small   | 14px | 400    | 1.5         |

### Letter Spacing
- Headings: -0.02em (H1), -0.01em (H2)
- Body: 0 (normal)

---

## 🔘 Components

### Buttons

**Standard Button (48px height)**
```
Height: 48px
Padding: 0 24px
Border Radius: 12px
Font Size: 16px
Font Weight: 600
Gap between icon & text: 8px
```

**Button Variants**
- `.btn-primary` - Gradient green (primary action)
- `.btn-secondary` - Outlined green (secondary action)
- `.btn-ghost` - Transparent with border (tertiary action)

**Button Sizes**
- `.btn-sm` - 40px height (compact)
- `.btn` - 48px height (standard)
- `.btn-lg` - 56px height (prominent)

**Hover States**
- Transform: translateY(-2px)
- Shadow: Increase from md to lg
- Transition: 0.3s ease

### Cards

**Card Structure**
```
Padding: 24px
Border Radius: 16px
Background: rgba(15, 23, 42, 0.7)
Border: 1px solid rgba(148, 163, 184, 0.1)
Backdrop Filter: blur(16px)
```

**Card Hover**
- Transform: translateY(-4px)
- Border Color: rgba(148, 163, 184, 0.2)
- Shadow: 0 8px 24px rgba(0, 0, 0, 0.2)
- Transition: 0.3s ease

### Badges & Pills

**Badge Structure**
```
Padding: 4px 16px
Border Radius: 999px (fully rounded)
Font Size: 14px
Font Weight: 600
Background: rgba(163, 230, 53, 0.1)
Color: #a3e635
Border: 1px solid rgba(163, 230, 53, 0.2)
```

---

## 📦 Container & Layout

### Container
- **Max Width**: 1280px
- **Horizontal Padding**: 24px (desktop), 20px (tablet), 16px (mobile)
- **Alignment**: Center

### Grid System
- **Columns**: 12-column layout
- **Gutter**: 24px (desktop), 20px (tablet), 16px (mobile)

### Responsive Breakpoints
```
Desktop:  1024px+
Tablet:   768px - 1023px
Mobile:   < 768px
```

---

## 🎬 Animations & Transitions

### Transition Speeds
- **Fast**: 0.15s ease (micro-interactions)
- **Base**: 0.3s ease (standard transitions)
- **Slow**: 0.5s ease (entrance animations)

### Common Animations
- **Fade In**: opacity 0 → 1
- **Slide Up**: translateY(24px) → 0
- **Scale**: scale(0.95) → 1
- **Hover**: translateY(-2px) or scale(1.02-1.05)

---

## 📱 Responsive Design

### Mobile-First Approach
1. Design for mobile first
2. Enhance for tablet
3. Optimize for desktop

### Responsive Typography
```
Mobile:   32px (H1), 28px (H2), 20px (H3)
Tablet:   40px (H1), 32px (H2), 24px (H3)
Desktop:  56px (H1), 40px (H2), 28px (H3)
```

### Responsive Spacing
```
Mobile:   16px padding, 12px gaps
Tablet:   20px padding, 20px gaps
Desktop:  24px padding, 24px gaps
```

---

## 🔍 Quality Checklist

Before shipping any component:

- [ ] Spacing follows 8px grid
- [ ] Typography hierarchy is clear
- [ ] Colors match design system
- [ ] Buttons have proper hover states
- [ ] Cards have consistent styling
- [ ] Responsive design tested
- [ ] Animations are smooth (60fps)
- [ ] Accessibility standards met
- [ ] No random padding/margin values
- [ ] Consistent with existing components

---

## 📂 File Structure

```
safarnama/
├── app/
│   ├── design-system.css          # Core design system
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
├── components/
│   ├── ui/
│   │   ├── Navbar-v2.tsx          # Production navbar
│   │   └── ...
│   └── sections/
│       ├── Hero.tsx               # Hero section
│       ├── Stats.tsx              # Stats section
│       ├── Features.tsx           # Features section
│       ├── HowItWorks.tsx         # How it works section
│       ├── Destinations.tsx       # Destinations grid
│       ├── CTA.tsx                # Call-to-action
│       └── Footer.tsx             # Footer
└── DESIGN_SYSTEM.md               # This file
```

---

## 🚀 Implementation Guide

### Using the Design System

1. **Import CSS Variables**
   ```css
   color: var(--color-primary);
   padding: var(--space-lg);
   border-radius: var(--radius-md);
   ```

2. **Use Utility Classes**
   ```html
   <div class="container">
     <h1>Heading</h1>
     <p>Body text</p>
     <button class="btn btn-primary">Action</button>
   </div>
   ```

3. **Component Structure**
   ```tsx
   <div className="card">
     <h3>Title</h3>
     <p>Description</p>
     <button className="btn btn-primary">CTA</button>
   </div>
   ```

---

## 📝 Notes

- All components are production-ready
- Design system is strictly enforced
- No exceptions to spacing rules
- Consistency is paramount
- Quality over speed

---

**Last Updated**: April 2026
**Version**: 1.0.0
**Status**: Production Ready
