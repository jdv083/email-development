# Transactional Email System (MJML)

A production-ready transactional email system built with MJML, focused on cross-client compatibility, Outlook reliability, dark mode awareness, and ESP-safe deployment.

This project demonstrates real-world email development practices used in enterprise and marketing automation environments.

---

## Overview

This system includes multiple transactional email templates built from a shared architectural base.  
Each template is modular, QA-tested, and designed for long-term maintainability.

### Included Templates
- Order Confirmation
- Shipping Confirmation
- Password Reset

---

## Key Features

- Modular MJML architecture
- Shared base layout (`base.mjml`)
- Outlook-safe VML buttons
- Dark mode–aware styling
- ESP-friendly HTML output (padding-only layouts)
- Reusable shared components
- QA checklist for production readiness

---

## Project Structure

transactional-email-system/
├─ mjml/
│  ├─ base.mjml
│  ├─ order-confirmation.mjml
│  ├─ shipping-confirmation.mjml
│  └─ password-reset.mjml
│
├─ components/
│  ├─ shared/
│  │  ├─ head.mjml
│  │  ├─ footer.mjml
│  │  └─ button-primary.mjml
│  │
│  ├─ order-confirmation/
│  │  ├─ hero.mjml
│  │  └─ body.mjml
│  │
│  ├─ shipping-confirmation/
│  │  ├─ hero.mjml
│  │  └─ body.mjml
│  │
│  └─ password-reset/
│     ├─ hero.mjml
│     └─ body.mjml
│
├─ compiled-html/
│  └─ eloqua/
│     ├─ order-confirmation.html
│     ├─ shipping-confirmation.html
│     └─ password-reset.html
│
└─ README.md


---

## Architecture Decisions

### Base Template

`base.mjml` defines the global layout contract:
- Email background
- Wrapper behavior
- Shared `<mj-head>` styles

It intentionally contains no content, allowing each transactional email to remain flexible and purpose-driven.

---

### Component Strategy

- Shared components are limited to stable, brand-level elements
- Per-email components live in their own folders to avoid bloated logic
- Duplication is intentional when it improves clarity and maintainability

---

### MJML vs ESP Variables

MJML performs strict compile-time validation and does not support dynamic variables in layout attributes.

This project follows a clear separation:
- MJML → structure and layout
- ESP variables → content and URLs

This ensures compatibility with enterprise ESP workflows.

---

## Outlook & VML Support

Outlook (Windows) uses the Microsoft Word rendering engine and does not support modern CSS.

To ensure consistent rendering:
- VML (`<v:roundrect>`) is used for bulletproof buttons
- Conditional comments isolate Outlook-specific code
- Buttons render consistently across major clients

---

## Dark Mode Strategy

- Light mode is the default
- Dark mode is treated as an enhancement
- No reliance on transparency
- High-contrast colors for accessibility
- Graceful degradation in unsupported clients

---

## Compilation

MJML is compiled using `npx` to avoid version conflicts.

### Compile a template

```bash
npx mjml mjml/order-confirmation.mjml --output compiled-html/eloqua/order-confirmation.html
```
Repeat for each template as needed.

Purpose of This Project
This repository is designed to reflect real-world transactional email workflows, 

emphasizing:
- Stability over cleverness
- Maintainability over abstraction
- Production-ready output over demos


## Author

John Villa
Email Developer

- Portfolio: https://jdv083.github.io/johnvilla.github.io
- GitHub:https://github.com/jdv083



