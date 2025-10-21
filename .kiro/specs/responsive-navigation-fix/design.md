# Design Document

## Overview

This design addresses the responsive navigation issues in the YouthGuard application by implementing a proper responsive layout system where desktop users see only the sidebar navigation and mobile users see a custom header with functional hamburger menu toggle. The solution focuses on modifying the existing DashboardLayout, Header, and DashboardSidebar components to work together seamlessly across different screen sizes.

## Architecture

### Component Hierarchy
```
DashboardLayout (Main container)
├── DashboardSidebar (Desktop: always visible, Mobile: toggleable)
├── Header (Desktop: hidden, Mobile: visible)
└── Main Content Area (Responsive margins)
```

### Responsive Breakpoints
- **Mobile**: `< 768px` (below Tailwind's `md` breakpoint)
- **Desktop**: `≥ 768px` (Tailwind's `md` breakpoint and above)

### State Management
The DashboardLayout component will manage the sidebar toggle state using React's `useState` hook, controlling visibility across both desktop and mobile views.

## Components and Interfaces

### DashboardLayout Component

**Current Issues:**
- Shows both Header and DashboardSidebar on desktop
- Header toggle functionality not connected to sidebar state
- No proper responsive behavior

**Design Changes:**
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface DashboardLayoutState {
  isSidebarOpen: boolean; // Controls mobile sidebar visibility
}
```

**Responsive Logic:**
- Desktop (`md:` and above): Show only DashboardSidebar, hide Header
- Mobile (below `md:`): Show Header with toggle, hide DashboardSidebar by default
- Sidebar state managed centrally and passed to both Header and DashboardSidebar

### Header Component

**Current Issues:**
- Has mobile-specific code but not properly integrated
- Toggle function exists but not connected to actual sidebar state
- Shows on desktop when it shouldn't

**Design Changes:**
```typescript
interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean; // For potential future hamburger icon state
}
```

**Responsive Behavior:**
- Hidden on desktop using `hidden md:hidden` classes
- Visible on mobile with `block md:hidden` classes
- Logo positioned left, hamburger menu positioned right
- Hamburger menu calls `toggleSidebar` function from DashboardLayout

### DashboardSidebar Component

**Current Issues:**
- Always visible on desktop (correct)
- Mobile toggle state not properly managed
- Close functionality exists but not connected to parent state

**Design Changes:**
```typescript
interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Responsive Behavior:**
- Desktop: Always visible using `block md:block` classes
- Mobile: Conditionally visible based on `isOpen` prop
- Overlay background on mobile when open
- Close button and overlay click both call `onClose` function

## Data Models

### Sidebar State Model
```typescript
interface SidebarState {
  isOpen: boolean;          // Current visibility state
  isMobile: boolean;        // Screen size detection (optional)
}
```

### Responsive Breakpoint Detection
```typescript
// Using Tailwind CSS classes for responsive behavior
const breakpoints = {
  mobile: '< 768px',      // Below md breakpoint
  desktop: '>= 768px'     // md breakpoint and above
};
```

## Error Handling

### Screen Size Transition Handling
- Ensure sidebar state resets appropriately when transitioning between mobile and desktop
- Prevent layout shifts during responsive transitions
- Handle edge cases where screen size changes rapidly

### State Synchronization
- Ensure Header and DashboardSidebar components stay synchronized with parent state
- Handle cases where toggle functions are called multiple times rapidly
- Prevent memory leaks from event listeners or state updates

### Accessibility Considerations
- Maintain proper ARIA labels for hamburger menu button
- Ensure keyboard navigation works correctly in both mobile and desktop modes
- Provide screen reader announcements for sidebar state changes

## Testing Strategy

### Responsive Testing
1. **Breakpoint Testing**: Verify behavior at exactly 768px breakpoint
2. **Screen Resize Testing**: Test dynamic resizing between mobile and desktop
3. **Device Testing**: Test on actual mobile devices and desktop browsers

### Functional Testing
1. **Sidebar Toggle**: Verify hamburger menu opens/closes sidebar on mobile
2. **Navigation**: Ensure all navigation links work in both mobile and desktop modes
3. **Overlay Interaction**: Test overlay click closes sidebar on mobile
4. **Auto-close**: Verify sidebar closes when navigating on mobile

### Visual Testing
1. **Layout Consistency**: Ensure proper spacing and alignment across screen sizes
2. **Animation Smoothness**: Verify sidebar open/close animations work correctly
3. **Content Positioning**: Check main content area margins adjust properly

### Integration Testing
1. **Component Communication**: Test state passing between DashboardLayout, Header, and DashboardSidebar
2. **Route Navigation**: Ensure navigation works correctly from both header and sidebar
3. **Theme Compatibility**: Verify responsive behavior works with both light and dark themes

## Implementation Approach

### Phase 1: DashboardLayout Modifications
- Add sidebar state management
- Implement responsive visibility logic for Header and DashboardSidebar
- Update main content area margins for proper spacing

### Phase 2: Header Component Updates
- Add responsive visibility classes
- Connect hamburger menu to sidebar toggle function
- Ensure proper mobile layout (logo left, menu right)

### Phase 3: DashboardSidebar Integration
- Update component to accept external state control
- Ensure mobile overlay and close functionality works
- Maintain desktop always-visible behavior

### Phase 4: CSS and Styling Refinements
- Add any necessary responsive utility classes
- Ensure smooth transitions between states
- Verify proper z-index layering for mobile overlay

## Technical Considerations

### Performance
- Use CSS classes for responsive behavior instead of JavaScript media queries where possible
- Minimize re-renders by using proper React state management
- Ensure animations don't impact performance on lower-end devices

### Browser Compatibility
- Ensure responsive behavior works across modern browsers
- Test CSS Grid and Flexbox implementations
- Verify Tailwind CSS responsive classes work as expected

### Maintenance
- Keep responsive logic centralized in DashboardLayout
- Use consistent naming conventions for props and state
- Document any custom responsive utility classes added