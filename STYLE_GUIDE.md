# Ear Trainer Style Guide

A minimalist piano-inspired aesthetic for AI agents and developers.

## Typography

**Font Family:** Work Sans
- Weights: 300 (Light), 400 (Regular), 500 (Medium)
- Import: `@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500&display=swap');`

**Line Heights:**
- Body text: 1.8
- Headings: 1.2

**Letter Spacing:**
- Headings: -0.02em (negative for tighter feel)
- Small caps / labels: 0.08em (wider for readability)

**Font Weights:**
- Body text: 300 (Light)
- Labels / emphasis: 400 (Regular)
- Headings: 500 (Medium)

## Color Palette

### Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| `--page-bg` | `#E5E4E2` | Page background (warm gray) |
| `--card-bg` | `#FAF9F7` | Card / container backgrounds (warm off-white) |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `--heading` | `#000000` | Headings (pure black) |
| `--body` | `#444444` | Body text |
| `--secondary` | `#888888` | Secondary / muted text |

### Interactive
| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#B8956D` | Primary buttons, interactive accents (golden taupe) |
| `--primary-hover` | `#A6845E` | Primary button hover state |

### Feedback States
| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | `#4A9D68` | Success text/borders (clear green) |
| `--success-bg` | `rgba(74, 157, 104, 0.15)` | Success background tint |
| `--error` | `#CC5A5A` | Error text/borders (clear coral red) |
| `--error-bg` | `rgba(204, 90, 90, 0.15)` | Error background tint |

### Utility
| Token | Hex | Usage |
|-------|-----|-------|
| `--border` | `#E0E0E0` | Subtle borders |
| `--highlight` | `#D4B896` | Walk/playing highlight (lighter golden) |

## Shadows

Use subtle shadows instead of heavy borders:

```css
/* Standard card/element shadow */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

/* Hover elevation */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
```

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--card-padding` | 36px | Internal card padding |
| `--element-gap` | 24px | Gap between elements |
| `--section-gap` | 48px | Gap between major sections |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small elements, inputs |
| `--radius` | 8px | Standard elements, buttons |
| `--radius-lg` | 12px | Cards, modals |

## Component Patterns

### Cards
```css
.card {
  background: var(--card-bg);
  padding: 36px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}
```

### Buttons

**Primary Button:**
```css
.btn-primary {
  background: var(--primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.btn-primary:hover {
  background: var(--primary-hover);
}
```

**Secondary/Ghost Button:**
```css
.btn-ghost {
  background: transparent;
  color: var(--secondary);
  border: none;
}

.btn-ghost:hover {
  color: var(--body);
  background: rgba(0, 0, 0, 0.04);
}
```

### Feedback Messages

Feedback should use colored left borders (3px) to reinforce state:

```css
.feedback-success {
  background: rgba(74, 157, 104, 0.15);
  border-left: 3px solid #4A9D68;
  color: #4A9D68;
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
}

.feedback-error {
  background: rgba(204, 90, 90, 0.15);
  border-left: 3px solid #CC5A5A;
  color: #CC5A5A;
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
}
```

### Interactive Elements (Solfege Buttons)

```css
.solfege-btn {
  background: var(--card-bg);
  border: 1px solid var(--border);
  color: var(--body);
  padding: 20px;
  border-radius: 8px;
  font-weight: 400;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.solfege-btn:hover {
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.solfege-btn.correct {
  background: rgba(74, 157, 104, 0.15);
  border-color: #4A9D68;
  color: #4A9D68;
  border-left: 3px solid #4A9D68;
}

.solfege-btn.wrong {
  background: rgba(204, 90, 90, 0.15);
  border-color: #CC5A5A;
  color: #CC5A5A;
  border-left: 3px solid #CC5A5A;
}
```

## Headings

```css
h1 {
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--heading);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

h2 {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--heading);
  letter-spacing: -0.02em;
  line-height: 1.2;
}
```

## Labels & Small Text

```css
.label {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--secondary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

## Design Principles

1. **Light and Airy** - Use generous whitespace and light font weights
2. **Subtle Depth** - Prefer soft shadows over hard borders
3. **Muted Feedback** - Success/error states use tinted backgrounds, not solid fills
4. **Piano-Inspired** - Clean blacks and whites with warm golden accent
5. **Minimalist** - Remove unnecessary visual noise

## CSS Variables Reference

```css
:root {
  /* Backgrounds */
  --page-bg: #E5E4E2;
  --card-bg: #FAF9F7;

  /* Text */
  --heading: #000000;
  --body: #444444;
  --secondary: #888888;

  /* Interactive */
  --primary: #B8956D;
  --primary-hover: #A6845E;

  /* Feedback */
  --success: #4A9D68;
  --success-bg: rgba(74, 157, 104, 0.15);
  --error: #CC5A5A;
  --error-bg: rgba(204, 90, 90, 0.15);

  /* Utility */
  --border: #E0E0E0;
  --highlight: #D4B896;

  /* Spacing */
  --card-padding: 36px;
  --element-gap: 24px;

  /* Shadows */
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 2px 8px rgba(0, 0, 0, 0.12);

  /* Border Radius */
  --radius-sm: 4px;
  --radius: 8px;
  --radius-lg: 12px;
}
```
