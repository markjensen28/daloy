# DALOY - Economy Decision Sandbox

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are local government planning, water-management, and related technical staff working on water-resource planning for the Samar pilot areas. They need to understand supply and demand, test policy or development changes, identify shortages and affordability risks, and compare scenarios before making planning decisions.

## Product Purpose

DALOY - Economy Decision Sandbox is an illustrative decision-support and scenario-simulation platform for exploring water and economic impacts in Catbalogan City, Pinabacdao, and Calbayog. Users change assumptions such as supply, demand, drought conditions, policies, and developments, then see the calculated water-balance and related impacts immediately. Success means helping staff understand tradeoffs and compare options before deciding; the application does not make LGU decisions.

## Positioning

The MVP combines transparent, single-day water-balance calculations with interactive scenario controls and views of allocation, affordability, development impacts, and municipal context. Its central mechanism is immediate, traceable exploration of how changed assumptions affect a modeled system. It is a planning aid, not an operational water-management system or a forecasting product.

## Operating Context

The current prototype runs in a web browser. Users can explore a combined or individual pilot LGU, adjust scenario assumptions, review policy and sector impacts, compare saved scenarios or municipalities, edit selected demand and income assumptions, export calculated results as CSV, and add illustrative development assets to a scenario. Saved scenario copies are stored in browser local storage on the current device; there is no account or cross-device synchronization.

## Capabilities and Constraints

- The current simulation is a deterministic, single-day water-balance calculator. Rates are expressed in ML/day and reservoir volumes in ML. Each LGU is calculated independently; municipal water is not implicitly pooled or transferred.
- Calculations currently include only Catbalogan City, Pinabacdao, and Calbayog. Other Samar municipalities may appear as geographic context but are excluded from results.
- Users control allocation assumptions and policy inputs. The system does not automatically recommend allocations or make decisions for an LGU.
- Demonstration and illustrative assumptions are not official statistics, live utility data, or operational advice. There is no connection to live utility, meter, weather, reservoir, or official-statistics feeds.
- Forecasting and prediction are outside the current MVP. They may be considered as later modules.
- Gemma 4 E4B may be used to interpret or explain results already calculated by the simulation. AI must not calculate the water balance, forecast demand, or make allocation decisions. The current DALOY panel is rule-based; no Gemma endpoint is connected in the current application.
- The application has no backend API or database. Scenario copies and appearance preference are held in local browser storage.
- The Samar boundaries in `public/samar.json` are a bundled 2011 low-resolution dataset used for visual context; they are not verified current legal boundaries.
- The current interface supports keyboard focus, semantic form labels, reduced-motion preferences, 44 px touch targets, and numerical alternatives to visualizations; preserve these accessibility behaviors.

## Evidence on Hand

- The current React and TypeScript prototype and its deterministic calculation code are in `src/`, including `src/engine/simulation.ts` and `src/engine/developments.ts`.
- `README.md` and `SYSTEM_OVERVIEW.md` describe the implemented workflows, calculation boundaries, local persistence, and demonstration-data limitations.
- `core-idea[watereconomics].md` and `Features.pdf` contain the product brief and feature context.
- `public/samar.json` and `public/map-LICENSE.txt` provide the bundled geographic context and its attribution.
- No official LGU statistics, live utility feed, verified provider data, or connected Gemma endpoint is present in the current application. Do not present illustrative values as verified facts.

## Product Principles

- Make the effects of changed assumptions understandable through immediate scenario results.
- Keep input assumptions, calculation methods, and outputs distinguishable and inspectable.
- Let planning users control allocation and policy assumptions; keep decisions with the LGU.
- Support comparison of options before planning decisions without presenting the model as a forecast.
- Label illustrative inputs and model limits wherever they inform interpretation.
