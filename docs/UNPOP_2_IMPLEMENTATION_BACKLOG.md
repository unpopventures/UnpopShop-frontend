# Unpop 2.0 implementation backlog

## Product decisions
- Markets: India and international, with market-by-market launch controls.
- Fulfilment: hybrid manufacturer-direct and Unpop-managed warehouse.
- Currency: multi-currency, with market-specific price lists and checkout eligibility.
- Customer relationship: Unpop owns order management, payments coordination and customer service.
- Preserve the existing B2B RFQ, buyer, manufacturer and admin workflows.

## Delivery sequence

### Phase 0 — Safety and baseline
- [ ] Preserve current main branch and establish a separate working branch.
- [ ] Run frontend and backend builds; record baseline failures.
- [ ] Audit deployment environments, database, storage, email, payment and shipping integrations without exposing secrets.
- [ ] Confirm staging deployment and database backup/restore process.

### Phase 1 — Frontend foundation
- [x] Establish design tokens and global styling.
- [x] Improve responsive public navigation and accessible mobile menu.
- [ ] Standardize public page shell, footer, spacing and typography.
- [ ] Add reusable storefront buttons, badges, cards, form fields, empty/loading/error states.
- [ ] Add market/currency display component (display only until pricing and checkout APIs exist).
- [ ] Validate existing buyer, manufacturer and admin navigation remains intact.

### Phase 2 — Storefront
- [ ] Rework homepage around consumer discovery and authentic Indian homegrown brands.
- [ ] Add shop landing, category landing and brand discovery.
- [ ] Add search, filters, sorting and pagination.
- [ ] Keep B2B sourcing/wholesale entry points visible without dominating consumer journeys.
- [ ] Remove unverified country-demand claims and correct misleading dashboard metrics.

### Phase 3 — Product catalogue
- [ ] Product detail layout with structured gallery and product information.
- [ ] Variants, pack sizes, SKU and availability.
- [ ] Market-specific retail and wholesale price lists.
- [ ] Product content fields for ingredients/materials, origin, shelf life, storage and compliance where relevant.
- [ ] Product and market publication controls.

### Phase 4 — Shopping and customer identity
- [ ] Consumer account/profile and address book.
- [ ] Persistent cart and multi-manufacturer cart support.
- [ ] Market-aware checkout eligibility, shipping quote and currency selection.
- [ ] Tax, duties, shipping and landed-cost disclosures before payment.

### Phase 5 — Payments and finance
- [ ] Select payment providers based on Unpop entity, geography and eligibility.
- [ ] Payment intents, webhook verification, idempotency and reconciliation.
- [ ] Refunds, cancellations, partial refunds and payment failure recovery.
- [ ] Finance ledger and manufacturer settlement rules.
- [ ] Confirm seller-of-record, GST, e-commerce operator, TCS and cross-border tax treatment with qualified advisers.

### Phase 6 — Orders and customer service
- [ ] Customer order history and order detail.
- [ ] Order status timeline and notifications.
- [ ] Support, cancellation, return and refund workflows.
- [ ] Immutable order-item snapshots for product, SKU, quantity, price, currency and seller/fulfiller.

### Phase 7 — Hybrid fulfilment
- [ ] Fulfilment location and routing rules per SKU/market.
- [ ] Split one customer order into fulfilment tasks by manufacturer or warehouse.
- [ ] Manufacturer acceptance, packing, dispatch and tracking updates.
- [ ] Warehouse receiving, stock, pick/pack and dispatch workflows.
- [ ] Partial shipment, backorder, failed delivery and return handling.

### Phase 8 — B2B continuity and improvements
- [ ] Preserve RFQ, quotation, negotiation and buyer/manufacturer workflows.
- [ ] Clarify shared product catalogue with retail and wholesale visibility controls.
- [ ] Improve manufacturer onboarding and document/compliance records.
- [ ] Market and demand intelligence only from traceable, supportable data.

### Phase 9 — Admin and operations
- [ ] Product, brand, category and market administration.
- [ ] Currency, price-list and exchange-rate policy controls.
- [ ] Order, payment, refund and fulfilment dashboard.
- [ ] Manufacturer settlement and reconciliation views.
- [ ] Role-based permissions and audit trail.

### Phase 10 — Launch readiness
- [ ] Unit, integration and end-to-end tests.
- [ ] Security review: auth, authorization, input validation, rate limits, CORS and webhook verification.
- [ ] Accessibility, responsive and performance checks.
- [ ] Legal, tax, consumer policy, shipping and market readiness review.
- [ ] Staged rollout with monitoring and rollback plan.

## Architecture guardrails
- Keep the current React + TypeScript + Vite and Express + Prisma + PostgreSQL stack unless measured constraints justify a change.
- Extend the existing modular monolith; do not introduce microservices prematurely.
- Preserve B2B RFQ models and routes.
- Keep a single customer-facing order while splitting internal fulfilment tasks.
- Snapshot commercial terms on each order item; never rely on mutable current catalogue prices for historical orders.
- Treat currency conversion as a display/quoting concern until a market-specific payable price and payment provider are configured.
- Never claim a market, certification, delivery promise or export capability is available without operational evidence.
