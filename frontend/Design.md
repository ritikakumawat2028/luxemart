# LuxeMart E-Commerce Platform - Design Document

## Overview
- **Motion Style**: Cinematic scroll-driven choreography with 3D depth layers and liquid transitions
- **Animation Intensity**: Ultra-Dynamic
- **Technology Stack**: GSAP ScrollTrigger, CSS 3D Transforms, WebGL Shaders (hero only), Intersection Observer

## Brand Foundation

### Colors
- Primary: #1a1a1a (Dark charcoal)
- Secondary: #ffffff (White)
- Accent: #c9a96e (Gold/Champagne)
- Background: #f8f8f8 (Light gray)
- Text: #333333 (Dark gray)
- Text Light: #666666 (Medium gray)
- Border: #e0e0e0 (Light border)
- Success: #4caf50 (Green)
- Error: #f44336 (Red)
- Overlay: rgba(0, 0, 0, 0.5) (Black overlay)

### Typography

**Font Families:**
- Display/Headings: "Playfair Display", serif
- Body: "Inter", sans-serif

**Font URLs:**
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

**Font Sizes:**
- H1: 48px / 3rem (Mobile: 32px)
- H2: 36px / 2.25rem (Mobile: 28px)
- H3: 24px / 1.5rem (Mobile: 20px)
- H4: 18px / 1.125rem
- Body: 16px / 1rem
- Small: 14px / 0.875rem
- XSmall: 12px / 0.75rem

**Font Weights:**
- Playfair Display: 400, 500, 600, 700
- Inter: 300, 400, 500, 600

**Line Heights:**
- Headings: 1.2
- Body: 1.6

### Core Message
Premium lifestyle essentials curated for the discerning individual. Quality meets elegance.

---

## Global Motion System

### Animation Timing Library

**Custom Easing Functions:**
```css
--ease-dramatic: cubic-bezier(0.87, 0, 0.13, 1);
--ease-expo-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-expo-in: cubic-bezier(0.7, 0, 0.84, 0);
--ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
--ease-liquid: cubic-bezier(0.23, 1, 0.32, 1);
```

**Duration Scale:**
- Micro: 150ms (hover states, micro-interactions)
- Fast: 300ms (button transitions, small reveals)
- Standard: 500ms (section entrances)
- Dramatic: 800ms (hero animations, major transitions)
- Cinematic: 1200ms (scroll-driven sequences)
- Ambient: 8000-20000ms (continuous floating, rotations)

**Stagger Patterns:**
- Cascade: 80ms between elements (top-to-bottom reveals)
- Ripple: 100ms from center outward
- Wave: 120ms with sine-wave offset
- Dramatic: 150ms for impact moments

### Continuous Ambient Effects

**Floating Motion System:**
- Decorative elements use sine-wave Y translation
- Range: -15px to +15px
- Duration: 6s (infinite loop)
- Easing: ease-in-out

**Living Gradients:**
- Accent elements pulse subtly
- Opacity oscillation: 0.8 → 1.0 → 0.8
- Duration: 4s (infinite)

### Scroll Engine Configuration

**Parallax Depth Layers:**
```
Layer -3: 0.3x speed (deep background)
Layer -2: 0.5x speed (mid background)
Layer -1: 0.7x speed (near background)
Layer 0: 1.0x speed (content baseline)
Layer +1: 1.2x speed (foreground accents)
Layer +2: 1.5x speed (floating elements)
```

**Pin Points:**
- Hero section: Pinned for 50vh additional scroll
- Features section: Pinned for 30vh with staggered reveals

**Progress-Driven Animations:**
- All major sections use scroll progress (0-1) for animation control
- Intersection Observer triggers at 15% visibility threshold

---

## Section 1: Navigation Bar

### Layout
**Floating Glass Morphism Navigation**
- Position: Fixed, transforms from transparent to glass on scroll
- Structure: Flexbox with magnetic hover zones
- Glass effect: backdrop-filter: blur(20px) saturate(180%)

#### Spatial Composition
- Container: Full-width with 4% horizontal padding
- Height: 80px (shrinks to 64px on scroll)
- Z-index: 1000
- Grid: `1fr auto 1fr` (logo | nav | actions)

### Content
- Logo: "LuxeMart" (text-based, Playfair Display)
- Navigation Links: Home, Shop, Categories, About, Contact
- Actions: Search, Cart (with count), User

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Logo | Fade + Slide Down | opacity: 0→1, y: -20→0 | 600ms | 0ms | expo-out |
| Nav Links | Stagger Fade Down | opacity: 0→1, y: -15→0 | 400ms | 100ms each | expo-out |
| Action Icons | Scale Pop | opacity: 0→1, scale: 0.5→1 | 500ms | 400ms | spring |

#### Scroll Effects
| Trigger | Element | Effect | Start | End | Values |
|---------|---------|--------|-------|-----|--------|
| scroll > 50px | Navbar | Glass Morphism | 0px | 100px | background: transparent → rgba(255,255,255,0.9) |
| scroll > 50px | Navbar | Height Shrink | 0px | 100px | height: 80px → 64px |
| scroll > 50px | Logo | Scale Down | 0px | 100px | scale: 1 → 0.9 |

#### Interaction Effects
**Magnetic Nav Links (CSS :hover only):**
- On hover: translateY(-2px), color transition to accent
- Underline grows from center: scaleX(0) → scaleX(1)
- Duration: 250ms

**Cart Icon Pulse:**
- On item add: scale pulse 1 → 1.2 → 1
- Badge count: flip animation on change

---

## Section 2: Hero

### Layout
**Cinematic Split-Screen with 3D Depth**
- Structure: Asymmetric grid with overlapping zones
- Left content area: 55% width, diagonal clip-path edge
- Right image area: 50% width, extends beyond container
- Overlap zone: 5% where content and image intersect

#### Spatial Composition
```
┌─────────────────────────────────────────────────┐
│  ┌─────────────────┐                            │
│  │                 │     ┌──────────────────┐   │
│  │    CONTENT      │╲    │                  │   │
│  │    (55%)        │ ╲   │     HERO IMAGE   │   │
│  │                 │  ╲  │     (50%)        │   │
│  │  [Shop Now]     │   ╲ │                  │   │
│  │                 │    ╲│                  │   │
│  └─────────────────┘     └──────────────────┘   │
│         ▲                      ▲                │
│    diagonal edge          parallax layer        │
└─────────────────────────────────────────────────┘
```

- Content positioned with 3D translateZ for depth
- Image has subtle continuous zoom (scale 1 → 1.05 over 20s)
- Diagonal divider: clip-path polygon creates dynamic edge

### Content
- Eyebrow: "NEW COLLECTION 2024"
- Headline: "Elevate Your Style"
- Subheadline: "Discover premium eyewear, fragrances, and accessories curated for the modern connoisseur"
- CTA: "Shop Now" (primary) + "Explore Collections" (secondary)
- Trust Badge: "Free Shipping on Orders Over $100"

### Images
**Hero Background Image**
- Resolution: 1920x1080 pixels
- Aspect Ratio: 16:9
- Transparent Background: No
- Visual Style: High-end product photography, lifestyle
- Subject: Elegant arrangement of sunglasses, perfume bottles, and luxury accessories on marble surface
- Composition: Diagonal arrangement with depth of field blur
- Lighting: Soft diffused natural light from left, subtle shadows
- Color Palette: Gold (#c9a96e), Black (#1a1a1a), White (#ffffff), Marble grays
- Mood: Luxurious, sophisticated, aspirational
- Generation Prompt: "Luxury lifestyle product photography, elegant arrangement of designer sunglasses and perfume bottles on white marble surface, soft natural lighting from left, shallow depth of field, gold and black color accents, sophisticated composition, high-end editorial style, 16:9 aspect ratio"

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Hero Image | Ken Burns Zoom | scale: 1.1→1, opacity: 0→1 | 1200ms | 0ms | expo-out |
| Diagonal Mask | Wipe Reveal | clip-path expands | 1000ms | 200ms | dramatic |
| Eyebrow | Letter Stagger | opacity: 0→1, y: 20→0 per char | 600ms | 400ms | expo-out |
| Headline | Word Split Rise | opacity: 0→1, y: 40→0 per word | 800ms | 600ms | expo-out |
| Subheadline | Fade Slide | opacity: 0→1, y: 30→0 | 600ms | 900ms | expo-out |
| CTA Primary | Scale Pop | opacity: 0→1, scale: 0.8→1 | 500ms | 1100ms | spring |
| CTA Secondary | Fade Slide | opacity: 0→1, x: -20→0 | 500ms | 1200ms | expo-out |
| Trust Badge | Fade Up | opacity: 0→1, y: 15→0 | 400ms | 1300ms | smooth |

#### Scroll Effects
| Trigger | Element | Effect | Start | End | Values |
|---------|---------|--------|-------|-----|--------|
| 0-50vh | Hero Image | Parallax + Zoom | 0% | 100% | translateY: 0→-100px, scale: 1→1.1 |
| 0-50vh | Content | Fade Out + Rise | 0% | 100% | opacity: 1→0, translateY: 0→-50px |
| 0-50vh | Diagonal Edge | Angle Shift | 0% | 100% | clip-path angle: 15deg→25deg |

#### Continuous Animations
- Hero image: Subtle zoom pulse (scale 1 ↔ 1.03, 15s infinite)
- Accent elements: Gentle float (translateY ±10px, 6s infinite)

#### Interaction Effects
**CTA Button Hover (CSS-only):**
- Background: fill from left with accent color
- Scale: 1 → 1.02
- Shadow: 0 4px 20px rgba(201, 169, 110, 0.4)
- Duration: 300ms

### Advanced Effects

#### 3D Elements
- Content container: perspective(1000px), translateZ(50px)
- Creates subtle depth separation from background
- On scroll: translateZ reduces to 0 (flattens)

---

## Section 3: Features

### Layout
**Staggered Diamond Grid with Hover Expansion**
- Structure: 4 cards in offset diamond pattern
- Cards arranged with alternating vertical offsets (0, 30px, 0, 30px)
- On hover: hovered card expands, others compress slightly

#### Spatial Composition
```
    ┌─────┐         ┌─────┐
    │  1  │         │  3  │
    └─────┘         └─────┘
         ┌─────┐         ┌─────┐
         │  2  │         │  4  │
         └─────┘         └─────┘
    
    Offset pattern creates visual rhythm
```

- Gap: 24px
- Card aspect ratio: 4:5
- Hover expansion: scale 1.05, z-index boost

### Content
**Feature 1: Premium Quality**
- Icon: Award/Ribbon
- Title: "Premium Quality"
- Description: "Every product is carefully selected and tested to meet our high standards of excellence."

**Feature 2: Free Shipping**
- Icon: Truck
- Title: "Free Shipping"
- Description: "Enjoy complimentary shipping on all orders over $100. Fast, reliable delivery worldwide."

**Feature 3: Secure Payment**
- Icon: Shield
- Title: "Secure Payment"
- Description: "Shop with confidence using our encrypted, secure payment processing systems."

**Feature 4: 24/7 Support**
- Icon: Headphones
- Title: "24/7 Support"
- Description: "Our dedicated customer service team is always here to help you with any questions."

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Card 1 | 3D Flip In | rotateY: -90→0, opacity: 0→1 | 700ms | 0ms | expo-out |
| Card 2 | 3D Flip In | rotateY: -90→0, opacity: 0→1 | 700ms | 150ms | expo-out |
| Card 3 | 3D Flip In | rotateY: -90→0, opacity: 0→1 | 700ms | 300ms | expo-out |
| Card 4 | 3D Flip In | rotateY: -90→0, opacity: 0→1 | 700ms | 450ms | expo-out |
| Icons | Bounce In | scale: 0→1.2→1 | 500ms | +200ms each | spring |

#### Scroll Effects
| Trigger | Element | Effect | Start | End | Values |
|---------|---------|--------|-------|-----|--------|
| section enter | Cards | Stagger Reveal | 0% | 60% | Sequential flip animation |
| 0-100% | Cards | Parallax Offset | 0% | 100% | Odd cards: 0→-20px, Even: 0→-40px |

#### Interaction Effects
**Card Hover (CSS :hover):**
- Card: translateY(-10px), scale(1.03)
- Shadow: 0 20px 40px rgba(0,0,0,0.1)
- Icon: rotate(10deg), scale(1.1)
- Border: accent color glow
- Duration: 300ms

**Icon Animation:**
- Continuous subtle pulse on idle (scale 1 ↔ 1.05, 3s infinite)
- On hover: rotate and scale burst

---

## Section 4: Featured Products

### Layout
**Horizontal Scroll Carousel with 3D Perspective**
- Structure: Horizontal scrolling container with snap points
- Cards have 3D rotation based on position from center
- Center card: flat, side cards: rotateY(±15deg)

#### Spatial Composition
```
    ┌─────────────────────────────────────────────────────────┐
    │                                                         │
│  ┌─────┐   ┌─────┐   ┌─────────────┐   ┌─────┐   ┌─────┐  │
│  │     │   │     │   │             │   │     │   │     │  │
│  │ -2  │   │ -1  │   │   CENTER    │   │ +1  │   │ +2  │  │
│  │15deg│   │15deg│   │   0deg      │   │-15dg│   │-15dg│  │
│  │     │   │     │   │             │   │     │   │     │  │
│  └─────┘   └─────┘   └─────────────┘   └─────┘   └─────┘  │
│    ▲         ▲            ▲               ▲         ▲     │
│   far       near       FOCUSED           near      far    │
└─────────────────────────────────────────────────────────┘
```

- Container: overflow-x: auto, scroll-snap-type: x mandatory
- Card width: 300px (400px for center)
- Perspective: 1000px on container

### Content
- Section Title: "Featured Products"
- Subtitle: "Handpicked favorites from our collection"
- CTA: "View All Products"

**Products:**
1. "Aviator Classic" - Goggles - $149.00
2. "Midnight Essence" - Perfume - $89.00
3. "Urban Frame" - Specs - $199.00
4. "Golden Aura" - Perfume - $120.00
5. "Sport Pro" - Goggles - $179.00

### Images
**Product Images**
- Resolution: 600x800 pixels
- Aspect Ratio: 3:4
- Transparent Background: No (white/light gray background)
- Visual Style: Clean product photography, minimal
- Subject: Individual products centered in frame
- Lighting: Even, soft studio lighting
- Color Palette: Product colors on neutral background
- Mood: Clean, professional, commercial
- Generation Prompt: "Professional product photography, [product name] centered on pure white background, soft even studio lighting, sharp focus, minimal shadows, clean commercial style, 3:4 aspect ratio"

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Section Title | Split Text | chars from random positions | 800ms | 0ms | expo-out |
| Subtitle | Fade Up | opacity: 0→1, y: 20→0 | 500ms | 300ms | expo-out |
| Product Cards | Cascade Slide | opacity: 0→1, x: 100→0 | 600ms | 100ms each | expo-out |
| CTA Button | Scale Pop | opacity: 0→1, scale: 0.8→1 | 400ms | 800ms | spring |

#### Scroll Effects
| Trigger | Element | Effect | Start | End | Values |
|---------|---------|--------|-------|-----|--------|
| section scroll | Cards | Horizontal Scroll | 0% | 100% | translateX based on scroll progress |
| card position | Side Cards | 3D Rotation | - | - | rotateY based on distance from center |

#### Interaction Effects
**Product Card Hover (CSS :hover):**
- Image: scale(1.08), filter brightness(1.05)
- Card: translateY(-8px)
- Shadow: 0 25px 50px rgba(0,0,0,0.15)
- Quick Add button: slide up from bottom
- Duration: 350ms

**Quick Add Button:**
- Hidden at bottom of card (translateY: 100%)
- On hover: translateY: 0
- Background: accent color with shimmer effect

---

## Section 5: Categories

### Layout
**Masonry Mosaic with Hover Zoom**
- Structure: Pinterest-style masonry with varied card sizes
- Large featured category + 4 smaller categories
- Cards overlap slightly for dynamic composition

#### Spatial Composition
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌──────────────────┐  ┌─────────────┐  │
│  │                  │  │             │  │
│  │    LARGE         │  │   SMALL 1   │  │
│  │    (Goggles)     │  │             │  │
│  │                  │  ├─────────────┤  │
│  │                  │  │             │  │
│  │                  │  │   SMALL 2   │  │
│  └──────────────────┘  │             │  │
│  ┌─────────────┐       └─────────────┘  │
│  │             │  ┌──────────────────┐  │
│  │   SMALL 3   │  │                  │  │
│  │             │  │    MEDIUM        │  │
│  ├─────────────┤  │    (Perfumes)    │  │
│  │             │  │                  │  │
│  │   SMALL 4   │  │                  │  │
│  │             │  │                  │  │
│  └─────────────┘  └──────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

- Gap: 20px
- Large card: spans 2 rows
- Medium card: spans 2 columns

### Content
**Categories:**
1. **Sunglasses** (Large) - "Protect your eyes in style"
2. **Eyeglasses** (Medium) - "Clear vision, clear style"
3. **Perfumes** (Medium) - "Scents that define you"
4. **Accessories** (Small) - "Complete your look"
5. **Gift Sets** (Small) - "Perfect presents"

### Images
**Category Images**
- Resolution: 800x1000 pixels (large), 600x600 pixels (small)
- Aspect Ratio: 4:5 (large), 1:1 (small)
- Transparent Background: No
- Visual Style: Lifestyle photography with products in context
- Subject: Products styled in relevant settings
- Lighting: Natural or soft studio lighting
- Color Palette: Category-appropriate colors
- Mood: Aspirational, lifestyle-focused
- Generation Prompt: "Lifestyle product photography, [category] collection styled elegantly, soft natural lighting, aspirational setting, high-end editorial style, [aspect ratio]"

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Large Card | Scale Reveal | scale: 0.8→1, opacity: 0→1 | 800ms | 0ms | expo-out |
| Small Cards | Stagger Pop | scale: 0.5→1, opacity: 0→1 | 500ms | 100ms each | spring |
| Category Labels | Slide Up | opacity: 0→1, y: 30→0 | 400ms | +300ms each | expo-out |

#### Scroll Effects
| Trigger | Element | Effect | Start | End | Values |
|---------|---------|--------|-------|-----|--------|
| section scroll | All Cards | Parallax | 0% | 100% | Different speeds per card size |
| section scroll | Images | Zoom | 0% | 100% | scale: 1→1.1 within cards |

#### Interaction Effects
**Category Card Hover (CSS :hover):**
- Image: scale(1.15) within container (overflow: hidden)
- Overlay: gradient opacity increases
- Label: translateY(-10px)
- Arrow icon: appears with slide from left
- Duration: 400ms

**Overlay Animation:**
- Default: gradient from bottom (opacity 0.6)
- Hover: full overlay darken + accent border glow

---

## Section 6: Testimonials

### Layout
**Orbital Carousel with Center Focus**
- Structure: Circular arrangement around center point
- Active testimonial at center, others orbit at edges
- Navigation creates rotation effect

#### Spatial Composition
```
              ┌─────────┐
              │   ★★★   │
              │ Quote 1 │
              │ - Name  │
              └────┬────┘
                   │
    ┌─────────┐    │    ┌─────────┐
    │ Quote 2 │◄───┴───►│ Quote 3 │
    │ (prev)  │         │ (next)  │
    └─────────┘         └─────────┘
    
    Side testimonials at 30% opacity, 70% scale
    Center at 100% opacity, 100% scale
```

- Container: 600px max-width for center testimonial
- Side testimonials: positioned absolutely, partially visible
- Navigation: dot indicators + arrow buttons

### Content
- Section Title: "What Our Customers Say"
- Subtitle: "Real experiences from real people"

**Testimonials:**
1. "The quality of these sunglasses is unmatched. I've never received so many compliments!" - Sarah M.
2. "Fast shipping and beautiful packaging. The perfume smells absolutely divine." - James K.
3. "Best customer service experience. They helped me find the perfect frames." - Emily R.

### Images
**Customer Avatars**
- Resolution: 200x200 pixels
- Aspect Ratio: 1:1
- Transparent Background: No
- Visual Style: Professional headshot or lifestyle portrait
- Subject: Diverse customers, friendly expressions
- Lighting: Soft, flattering lighting
- Color Palette: Natural skin tones, neutral backgrounds
- Mood: Approachable, trustworthy, genuine
- Generation Prompt: "Professional portrait photo, friendly [gender] customer smiling, soft natural lighting, neutral background, approachable expression, headshot style, 1:1 aspect ratio"

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Section Title | Fade Slide | opacity: 0→1, y: 30→0 | 600ms | 0ms | expo-out |
| Center Quote | Scale In | scale: 0.9→1, opacity: 0→1 | 700ms | 200ms | expo-out |
| Stars | Pop Stagger | scale: 0→1.2→1 | 300ms | 50ms each | spring |
| Avatar | Circle Reveal | clip-path: circle(0%)→circle(50%) | 600ms | 400ms | expo-out |
| Side Quotes | Fade In | opacity: 0→0.3 | 500ms | 600ms | smooth |

#### Interaction Effects
**Navigation (CSS transitions):**
- Arrow hover: scale(1.1), background accent
- Dot active: scale(1.3), filled vs outline
- Transition between quotes: crossfade + slide

**Quote Transition:**
- Exit: opacity 1→0, translateX 0→-50px
- Enter: opacity 0→1, translateX 50px→0
- Duration: 400ms

---

## Section 7: Newsletter

### Layout
**Split Diagonal with Floating Elements**
- Structure: Two-column with diagonal divider
- Left: Content and form
- Right: Decorative image/pattern
- Diagonal SVG separator between

#### Spatial Composition
```
┌─────────────────────────────────────────────────┐
│  ╲                                              │
│   ╲    ┌─────────────┐                          │
│    ╲   │  STAY       │      ┌──────────────┐   │
│     ╲  │  UPDATED    │      │              │   │
│      ╲ │             │      │   DECORATIVE │   │
│       ╲│  [email  ]  │      │   IMAGE      │   │
│        │  [Subscribe]│      │   OR PATTERN │   │
│        │             │      │              │   │
│        └─────────────┘      └──────────────┘   │
│                                               │
└─────────────────────────────────────────────────┘
```

- Left: 55% width
- Right: 45% width
- Diagonal angle: 12 degrees

### Content
- Headline: "Stay in the Loop"
- Subheadline: "Subscribe to receive exclusive offers, early access to new collections, and style tips."
- Input Placeholder: "Enter your email"
- Button: "Subscribe"
- Privacy Note: "We respect your privacy. Unsubscribe anytime."

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Diagonal Line | SVG Draw | stroke-dashoffset: 100%→0 | 800ms | 0ms | expo-out |
| Headline | Word Slide | opacity: 0→1, y: 40→0 per word | 700ms | 200ms | expo-out |
| Subheadline | Fade Up | opacity: 0→1, y: 20→0 | 500ms | 500ms | expo-out |
| Form | Slide In | opacity: 0→1, x: -30→0 | 600ms | 700ms | expo-out |
| Right Image | Parallax Reveal | opacity: 0→1, y: 50→0 | 800ms | 300ms | expo-out |

#### Interaction Effects
**Input Focus:**
- Border: color transition to accent
- Shadow: 0 0 0 3px rgba(201, 169, 110, 0.2)
- Label: float up animation (if using floating labels)

**Subscribe Button:**
- Hover: background darken, scale(1.02)
- Click: ripple effect from click point
- Success: morphs to checkmark icon

---

## Section 8: Footer

### Layout
**Layered Reveal with Staggered Columns**
- Structure: Multi-column grid with animated reveals
- Background: Dark with subtle gradient animation
- Columns stagger in from bottom

#### Spatial Composition
- Background: #1a1a1a with gradient overlay
- Grid: 4 columns (Brand | Quick Links | Categories | Contact)
- Bottom bar: Full-width with copyright + social

### Content
**Brand Column:**
- Logo: "LuxeMart"
- Tagline: "Premium lifestyle essentials for the modern connoisseur."

**Quick Links:**
- Home, Shop, About Us, Contact, FAQ

**Categories:**
- Sunglasses, Eyeglasses, Perfumes, Accessories

**Contact:**
- Email: support@luxemart.com
- Phone: +1 (555) 123-4567
- Address: 123 Luxury Lane, Style City

**Bottom Bar:**
- Copyright: "© 2024 LuxeMart. All rights reserved."
- Social: Instagram, Facebook, Twitter, Pinterest

### Motion Choreography

#### Entrance Sequence
| Element | Animation | Values | Duration | Delay | Easing |
|---------|-----------|--------|----------|-------|--------|
| Background | Fade In | opacity: 0→1 | 600ms | 0ms | smooth |
| Column 1 | Slide Up | opacity: 0→1, y: 40→0 | 500ms | 100ms | expo-out |
| Column 2 | Slide Up | opacity: 0→1, y: 40→0 | 500ms | 200ms | expo-out |
| Column 3 | Slide Up | opacity: 0→1, y: 40→0 | 500ms | 300ms | expo-out |
| Column 4 | Slide Up | opacity: 0→1, y: 40→0 | 500ms | 400ms | expo-out |
| Social Icons | Pop Stagger | scale: 0→1 | 400ms | 80ms each | spring |
| Bottom Bar | Fade In | opacity: 0→1 | 400ms | 600ms | smooth |

#### Interaction Effects
**Link Hover:**
- Color: white → accent
- translateX: 0 → 5px
- Underline: scaleX(0) → scaleX(1) from left

**Social Icon Hover:**
- Background: transparent → accent
- Scale: 1 → 1.1
- Rotation: 0 → 10deg

---

## Technical Implementation Notes

### Required Libraries
```javascript
// Core Animation
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Intersection Observer for triggering (native API)
// CSS Animations for simple effects
// CSS Custom Properties for dynamic values
```

### Performance Optimizations

**GPU Acceleration:**
```css
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

**Scroll Performance:**
```css
html {
  scroll-behavior: smooth;
}

/* Use passive listeners */
element.addEventListener('scroll', handler, { passive: true });
```

**Reduced Motion Support:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Critical Performance Rules

**NEVER Use:**
- ❌ setState in mousemove events
- ❌ requestAnimationFrame + setState loops
- ❌ Dynamic blur calculations on scroll
- ❌ Layout property animations (width, height, top, left)

**ALWAYS Use:**
- ✅ transform and opacity for animations
- ✅ CSS :hover for mouse effects
- ✅ CSS custom properties for dynamic values
- ✅ Intersection Observer for visibility triggers
- ✅ will-change before animation, remove after

### Browser Support
- Modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- Progressive enhancement for older browsers
- Feature detection with CSS.supports()

---

## Responsive Design

### Breakpoints
- Desktop: > 1024px (full effects)
- Tablet: 768px - 1024px (reduced 3D, simplified parallax)
- Mobile: < 768px (essential animations only)

### Mobile Optimizations
- Disable 3D transforms (use 2D equivalents)
- Reduce parallax layers to 2
- Simplify entrance animations
- Remove continuous ambient animations
- Increase touch targets

### Animation Scaling
```css
/* Desktop: Full effects */
@media (min-width: 1025px) {
  --parallax-depth: 3;
  --3d-enabled: 1;
}

/* Tablet: Reduced effects */
@media (min-width: 768px) and (max-width: 1024px) {
  --parallax-depth: 2;
  --3d-enabled: 0;
}

/* Mobile: Essential only */
@media (max-width: 767px) {
  --parallax-depth: 1;
  --3d-enabled: 0;
}
```

---

## Animation Value Reference

### Movement Magnitudes
| Effect Type | Range | Use Case |
|-------------|-------|----------|
| Micro | 2-5px | Subtle hover shifts |
| Small | 10-20px | Entrance slides |
| Medium | 30-50px | Parallax layers |
| Large | 80-150px | Hero scroll effects |
| Dramatic | 200px+ | Special moments |

### Rotation Values
| Type | Range | Use Case |
|------|-------|----------|
| Subtle | 2-5deg | Hover tilts |
| Moderate | 10-15deg | Card flips |
| Dramatic | 45-90deg | 3D reveals |

### Scale Values
| Type | Range | Use Case |
|------|-------|----------|
| Subtle | 1.02-1.05 | Hover emphasis |
| Moderate | 1.08-1.15 | Image zooms |
| Dramatic | 0.5-1.2 | Entrance pops |

### Timing Reference
| Type | Duration | Use Case |
|------|----------|----------|
| Instant | 100ms | Micro-feedback |
| Fast | 200-300ms | Hovers, toggles |
| Standard | 400-600ms | Entrances |
| Dramatic | 800-1200ms | Hero reveals |
| Ambient | 6-20s | Continuous loops |
