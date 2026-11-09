# Unpop 2.0 — B2B-first implementation backlog

## Business priorities (authoritative)
1. Build a high-quality, searchable database of Indian manufacturers and their products.
2. Build a dashboard for domestic and international bulk buyers to discover suppliers and manage sourcing.
3. Enable bulk orders first, then progressively enable international order execution.

Consumer B2C commerce is a later expansion channel. It must not displace or delay these three priorities.

## Confirmed operating decisions
- Geography: India and international markets.
- Fulfilment: hybrid — manufacturer-direct and Unpop-managed warehouse, selected per product/order.
- Currency: multi-currency, with market-specific price lists and payment/settlement eligibility.
- Unpop coordinates the buyer relationship, enquiries/orders and customer support.
- Preserve existing B2B RFQ, quotation, manufacturer, buyer and admin capabilities.

## Delivery sequence

### Phase 0 — Safety and baseline
- [ ] Keep production `main` untouched; work on feature branches and use staging.
- [ ] Run frontend and backend builds; record baseline failures.
- [ ] Audit deployment, database, storage, email, payment and shipping integrations without exposing secrets.
- [ ] Confirm staging and database backup/restore process.

### Phase 1 — Frontend foundation (current)
- [x] Establish global design tokens and styling.
- [x] Improve responsive public navigation and accessible mobile menu.
- [ ] Standardize shared public page shell, footer, typography and responsive spacing.
- [ ] Add reusable forms, cards, tables, badges, status indicators, loading, empty and error states.
- [ ] Define distinct navigation paths for manufacturers, bulk buyers and Unpop administrators.
- [ ] Validate existing buyer, manufacturer and admin routes remain accessible.
- [ ] Do not build a B2C-first homepage at this stage.

### Phase 2 — Manufacturer acquisition and database (priority 1)
- [ ] Manufacturer onboarding landing page and clear value proposition.
- [ ] Guided manufacturer registration and profile completion.
- [ ] Structured company profile: legal/trading name, location, contacts, factory/production capability and business type.
- [ ] Structured product catalogue: categories, descriptions, specifications, pack sizes, MOQ, capacity, lead time and indicative wholesale pricing.
- [ ] Manufacturer document collection and verification workflow; distinguish submitted, reviewed, verified, expired and rejected.
- [ ] Product evidence: images, certifications, test reports, licences and market-specific compliance documents where applicable.
- [ ] Admin review queue, duplicate detection, approval/rejection reasons and audit trail.
- [ ] Searchable supply directory with filters for category, geography, MOQ, capacity, certifications and export experience.
- [ ] Manufacturer consent, privacy notice, data access and profile visibility controls.
- [ ] Data-quality dashboard: profiles started/completed, products published, verification status and missing critical fields.

### Phase 3 — Bulk buyer dashboard (priority 2)
- [ ] Buyer onboarding: buyer type, company, country, intended markets and sourcing interests.
- [ ] Buyer dashboard with saved searches, shortlisted manufacturers, products and active RFQs.
- [ ] Search and compare manufacturer/product profiles with clear evidence and verification status.
- [ ] RFQ creation with product/specification, quantity, target price, destination, packaging and delivery requirements.
- [ ] RFQ status, clarification messages, quotation comparison and negotiation history.
- [ ] Buyer document and communication centre.
- [ ] Admin/Unpop workspace to qualify buyer requests and manage matching.

### Phase 4 — Bulk order enablement (priority 3A)
- [ ] Convert accepted quotations into purchase orders with commercial terms snapshot.
- [ ] Order confirmation, pro forma invoice and payment milestones.
- [ ] Manufacturer acceptance, production readiness and dispatch milestones.
- [ ] Split orders by manufacturer while retaining one buyer-facing sourcing/order record.
- [ ] Hybrid fulfilment routing: manufacturer-direct or Unpop warehouse.
- [ ] Shipment documents, tracking, delivery confirmation, discrepancy and claims workflow.
- [ ] Returns/cancellations and refund/credit workflows as contractually applicable.
- [ ] Admin order operations dashboard and full audit trail.

### Phase 5 — International trade enablement (priority 3B)
- [ ] Destination-market readiness matrix by product/category.
- [ ] Capture HS code, country of origin, ingredients/materials, shelf life, packaging and required compliance evidence where relevant.
- [ ] Incoterms, shipment mode, port/airport, freight quote and insurance fields.
- [ ] Export documentation checklist and document versioning.
- [ ] Multi-currency quote and price-list support; store currency and FX basis with each quotation/order.
- [ ] International payment provider and compliant settlement design based on Unpop entity and provider eligibility.
- [ ] Duties, taxes, customs, shipping and landed-cost disclosure.
- [ ] Market activation controls; do not accept orders to a destination until operational, legal and compliance checks pass.

### Phase 6 — Consumer B2C expansion (later)
- [ ] Consumer storefront, retail product pages, cart and checkout.
- [ ] Consumer payments, customer orders, delivery tracking and support.
- [ ] Reuse the same approved catalogue and inventory foundation with retail visibility/pricing controls.
- [ ] Keep B2C rollout independent of core B2B delivery milestones.

### Phase 7 — Admin, analytics and scale
- [ ] Admin control centre for manufacturers, buyers, catalogue, verification, RFQs, orders and fulfilment.
- [ ] KPIs: manufacturer acquisition funnel, verified supply, catalogue completeness, buyer activation, RFQ conversion, quote turnaround, order conversion and repeat buyers.
- [ ] Market/currency configuration and role-based access.
- [ ] Security, performance, accessibility, monitoring and staged rollout.

## Core data model direction
Retain and extend existing User, ManufacturerProfile, BuyerProfile, Category, Brand, Product, RFQ and quotation entities. Add or formalize manufacturer documents/verification events, product specifications and evidence, buyer sourcing preferences, shortlist/saved search, RFQ messages, purchase orders, order line snapshots, payment records, shipment records and fulfilment tasks.

A purchase order must preserve the agreed product/specification, quantity, unit price, currency, Incoterm, delivery terms, manufacturer and document references as they existed at confirmation. Never reconstruct historic commercial terms from the current editable catalogue.

## Architecture and governance guardrails
- Keep React + TypeScript + Vite and Express + Prisma + PostgreSQL unless measured constraints justify a change.
- Extend the current modular monolith; do not introduce microservices prematurely.
- Preserve existing B2B RFQ and quotation flows.
- Treat manufacturer verification as a workflow with evidence and timestamps, not a marketing badge alone.
- Do not describe manufacturers as verified, certified or export-ready without documented evidence and review.
- Multi-currency quoting is not equivalent to enabled international payment acceptance.
- Confirm seller-of-record, GST, e-commerce operator/TCS, export, customs and cross-border tax treatment with qualified advisers before enabling transactions.
- Do not expose manufacturer-sensitive documents or buyer commercial information to unauthorized users.
