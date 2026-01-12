## 2024-05-23 - Accessibility of Expanding Search Inputs
**Learning:** This app used a CSS pattern where the search input had `width: 0` until hovered, making it invisible and confusing for keyboard users who tabbed into it. They would focus on an invisible element.
**Action:** When creating expanding search inputs, always pair `:hover` expansion with `:focus` or `:focus-within` expansion so keyboard users can see what they are typing.
