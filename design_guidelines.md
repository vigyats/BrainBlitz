# Design Guidelines: Romantic Note-Taking Web App

## Design Approach
**Reference-Based**: Netflix-inspired aesthetic combined with romantic, intimate design language. Drawing from Netflix's bold minimalism, high contrast, and cinematic feel, adapted for a personal, emotional note-taking experience.

## Core Design Principles
- **Cinematic Romance**: Large, bold typography with soft, smooth transitions
- **Emotional Intimacy**: Spacious layouts that feel personal and warm
- **Effortless Simplicity**: Clear hierarchy with minimal visual clutter
- **Smooth Interactions**: Gentle animations that feel fluid and romantic

## Typography System
**Primary Font**: Playfair Display (romantic serif for headlines)
**Secondary Font**: Inter or Poppins (clean sans-serif for body text)

**Hierarchy**:
- Hero "Heyo": 6xl to 8xl (text-6xl md:text-8xl) - dominant, romantic
- Section headers: 3xl to 4xl
- Note titles: xl to 2xl with medium weight
- Body text: base to lg with comfortable line height (leading-relaxed)
- Button text: lg with medium weight

## Layout System
**Spacing Units**: Primarily use Tailwind units of 4, 6, 8, 12, 16, and 24 for consistency
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-24
- Element gaps: gap-4 to gap-8

**Container Strategy**:
- Max-width containers: max-w-4xl for main content
- Centered layouts: mx-auto with generous padding
- Full-width backgrounds with contained content

## Screen Layouts

### Home/Welcome Screen
- Full viewport height (min-h-screen) with centered content
- Massive "Heyo" greeting (centered, dominant)
- Subtle romantic tagline below (text-lg, opacity-80)
- Two large, prominent action buttons stacked vertically with gap-6
- Minimal distractions - pure focus on the greeting and actions

### Create Note Screen
- Centered form layout (max-w-2xl)
- Large, clear input fields with generous padding (p-4 to p-6)
- Title input: Full-width with larger text (text-xl)
- Note textarea: Minimum height of h-64, auto-expanding
- Smooth focus states with subtle transitions
- Save button: Large, prominent, full-width or nearly full-width
- Back/Cancel action clearly visible but secondary

### Read Notes Screen
- Grid layout for note cards: grid-cols-1 md:grid-cols-2 with gap-6
- Each note card: Elevated appearance with rounded-2xl borders
- Card padding: p-6 to p-8
- Note preview: Title (text-xl font-semibold) + truncated content
- Timestamp display: Small, subtle (text-sm, opacity-70)
- Hover states: Gentle lift effect (transform scale-105)
- Empty state: Centered message with romantic illustration placeholder

### Individual Note View
- Max-width reading layout (max-w-3xl)
- Title: Large and prominent (text-3xl to text-4xl)
- Content: Comfortable reading size (text-lg) with generous line-height
- Metadata: Date, ID displayed subtly at bottom
- Edit/Delete actions: Clear but not distracting

## Component Library

### Buttons
**Primary Action**: 
- Large touch targets (px-8 py-4 minimum)
- Rounded-xl borders
- Medium weight text
- Smooth hover/active transitions

**Secondary Action**:
- Similar sizing but with outline treatment
- Clear visual hierarchy separation from primary

### Form Inputs
- Consistent border-radius (rounded-lg to rounded-xl)
- Generous padding (p-4)
- Clear focus states with smooth transitions
- Placeholder text with appropriate opacity

### Note Cards
- Rounded-2xl with subtle shadows
- Hover elevation effect
- Clear title/content separation
- Timestamp positioned at bottom
- Clickable entire card area

### Navigation
- Simple back/home icons or text links
- Fixed or sticky positioning where appropriate
- Minimal and unobtrusive

## Animations & Transitions
**Use Sparingly and Purposefully**:
- Page transitions: Gentle fade-ins (duration-300)
- Button hovers: Subtle scale (scale-105) and opacity changes
- Card hovers: Gentle lift effect
- Input focus: Smooth border/shadow transitions
- No complex scroll-triggered animations
- All transitions: transition-all duration-300 ease-in-out

## Accessibility
- High contrast ratios throughout
- Large, easily clickable buttons (minimum 44px height)
- Clear focus indicators on all interactive elements
- Semantic HTML structure
- ARIA labels for icon-only actions

## Images
**No hero images required** - This is a utility application focused on text and romance through typography and space, not imagery. The "Heyo" greeting serves as the visual anchor.

## Responsive Behavior
- Mobile-first approach
- Stack elements vertically on mobile
- Note grid: Single column on mobile, 2 columns on tablet+
- Font sizes scale down appropriately (use responsive text utilities)
- Maintain generous spacing even on smaller screens
- Touch-friendly targets throughout