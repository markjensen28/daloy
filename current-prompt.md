Here is a step-by-step implementation guide you can hand directly to your coding agent. It prioritizes the issues that matter most for the hackathon while preserving the existing visual identity and 3D centerpiece. The order is intentional: fix meaning and scope first, then hierarchy and styling, then polish. The critique’s main problems were Combined-scope ambiguity, Calbayog-specific results appearing in Combined mode, weak visibility of decision metrics, color semantics, small controls/text, and unclear prototype-data provenance. Pasted markdown

## Water Economics UI Improvement Pass

1. **Preserve the existing product identity before editing anything.** Do not redesign the whole application. Keep the floating low-poly dam/reservoir as the central visual, keep `#9a60e0` as the primary UI accent, retain the existing navigation structure, and keep the left simulation controls and right impact panel. Do not convert the application into a conventional card-heavy dashboard. The goal is to make the existing simulation workspace clearer, lighter, and more decision-oriented.

2. **Rename “Combined MVP” to “Provincial Overview.”** Search all user-facing occurrences of `Combined MVP` and replace them with `Provincial Overview`. Internally, variable names do not need to change unless doing so improves code clarity. Under or beside the scope selector, display a subtle persistent explanation: `3 independent LGU water systems · no inter-LGU transfers`. Combined mode must never imply that Catbalogan City, Pinabacdao, and Calbayog physically share one water supply. The critique specifically identified this as the highest-priority ambiguity. Pasted markdown

3. **Make geographic scope explicit on every important result.** Every major calculated result must indicate whether it represents `Catbalogan City`, `Pinabacdao`, `Calbayog`, or `Provincial Overview`. Do not display an unlabeled `Supply gap: 4 ML/day` if the user cannot immediately tell which geography it belongs to. In Provincial Overview, do not silently show a Calbayog-only visualization or interpretation. Either show aggregated values that are explicitly labeled as aggregates, or show separate values for each LGU. If the current 3D scene remains representative rather than aggregated, add plain text such as `Representative visualization: Calbayog` outside the model. The critique identified Calbayog-specific outputs appearing alongside Combined controls as another P1 issue. Pasted markdown

4. **Give the center workspace four permanently visible decision metrics.** Place a compact metric strip directly above the 3D reservoir, not hidden inside expandable controls. Use exactly these primary concepts: `Source supply`, `Water demand`, `Supply gap`, and `Reservoir storage`. For example:

```text
SOURCE SUPPLY       WATER DEMAND       SUPPLY GAP       RESERVOIR STORAGE
76 ML/day           85 ML/day          -9 ML/day        64%
-4% scenario        +6% scenario       10.6% deficit    64 / 100 ML
```

Keep them visually lightweight. Do not wrap each metric in a large independent card. The 3D model should remain the focal point, but the calculations should be understandable without clicking the reservoir. This directly addresses the critique that the model currently attracts more attention than the planning result. Pasted markdown

5. **Separate brand color from semantic data colors.** Keep `#9a60e0` as the main interaction color for active tabs, selected states, buttons, sliders, focus states, and scenario controls. Do not recolor the whole application teal. Instead, create a semantic color system: `purple #9a60e0 = interface/selection`, `cyan/teal = water, reservoir, water flow and water quantity`, `amber/orange = warning or developing stress`, `red = severe shortage/unmet demand`, and `gray = terrain, neutral structures and inactive elements`. Sector colors may remain distinct when necessary for charts. This resolves the color-meaning issue noted in the critique without abandoning your chosen purple identity. Pasted markdown

6. **Lighten and simplify both sidebars.** Do not remove them, but reduce their visual competition with the central simulation. Narrow them slightly, reduce excessive padding, remove unnecessary nested cards and divider lines, and favor plain grouped controls on one surface. Aim approximately for `16% left / 68% center / 16% right` on wide desktop layouts. The sidebars should behave as tools surrounding the simulation rather than becoming equal visual columns. The dam/reservoir should remain noticeably larger than either sidebar.

7. **Clean up the left control hierarchy.** Keep the tabs, but rename them to `Sources`, `Demand & Allocation`, and `Policies`. When a tab is selected, show only controls relevant to that category. Under Sources, group controls by municipality rather than mixing all source records together. Use small headings such as `CATBALOGAN CITY`, `PINABACDAO`, and `CALBAYOG`. Keep rows compact, for example `River intake — 28 ML/day`. Secondary source classifications can appear in subdued helper text rather than adding another full row. This also resolves the critique that the current Demand tab contains allocation functions without communicating that in its label. Pasted markdown

8. **Make the reservoir visualization communicate actual state.** The visible 3D water surface must correspond to reservoir storage. Do not keep the water plane visually static while storage values change. Raise and lower the water mesh according to normalized storage. A simple implementation is:

```ts
const storageRatio = clamp(currentStorage / maxStorage, 0, 1)
const waterY = minWaterY + storageRatio * (maxWaterY - minWaterY)
```

Use a smooth transition when scenarios change. A nearly full reservoir should visibly approach the upper basin level; a low reservoir should expose much more of the basin. Keep the terrain very low-poly and monochrome. Do not add buildings or floating badges to the reservoir view. The dam itself should remain the only major structure.

9. **Improve the right “Allocation & Impact” panel so shortages are obvious.** Each sector row should show three things: sector name, allocated versus required demand, and percentage supplied. When everything is supplied, keep the row visually quiet. When shortages occur, make the deficit the dominant information. For example:

```text
Agriculture
19 / 24 ML/day
79% supplied · 5 ML/day unmet
```

Do not use purple for every progress bar. Normal water allocation can use muted cyan/teal; warning conditions use amber; critical shortage uses red. Protected sectors can still be identified through icons/text without adding badges.

10. **Strengthen “People behind the numbers.”** Replace tiny low-priority rows with two or three clearer impact indicators. Prioritize values such as `Households with unmet needs`, `Water affordability burden`, and `Estimated economic exposure`. If economic exposure is not yet calculated reliably, omit it instead of inventing a number. These should be more noticeable than tertiary technical information because the project is about Water Economics, not only hydraulic balance.

11. **Rename ambiguous “live” and AI-looking language.** Replace `Live scenario reading` with `Current scenario summary` or `Scenario interpretation`. Do not use sparkle icons or wording that suggests AI if the current result is rule-based. Once Gemma 4 E4B is actually connected, expose a separate action such as `Interpret scenario`. Gemma should receive calculated outputs and explain them; it should never generate the actual supply, demand, allocation, affordability, or forecast numbers. The critique specifically noted that the existing language could imply AI or live data where neither was actually present. Pasted markdown

12. **Add one persistent data-scope disclaimer to the working view.** Do not force users to open Methodology to learn the MVP limitations. Add a subdued line near the bottom of the workspace:

```text
Illustrative demonstration data · Single-day water balance · No live utility connection
```

If needed, make `Methodology` clickable beside it. Do not call these numbers official, live, real-time, or forecast values. The critique explicitly recommended keeping these limits visible in the main workspace. Pasted markdown

13. **Increase text and interactive-control sizes where they are currently too small.** Avoid 7–10 px labels. For desktop, use approximately `13–14px` for normal UI text, `11–12px minimum` for secondary text, `15–17px` for panel headings, and `22–30px` for major metric values. Main buttons and selectors should generally be around `36–42px` high on desktop. Collapse buttons and important interactive elements should no longer look like tiny icon targets. The critique specifically flagged undersized labels and controls. Pasted markdown

14. **Simplify the bottom actions.** Keep `Compare`, `Reset`, and `Save scenario`, but remove an oversized floating container if one currently surrounds them. Place them in a small toolbar aligned underneath the visualization or integrate them into the scenario toolbar above it. `Save scenario` remains the primary filled-purple action. `Compare` and `Reset` remain secondary.

15. **Improve Reset safety without building a full undo system.** Do not spend hackathon time implementing complete history/undo. Instead, if Reset destroys meaningful scenario edits, add a lightweight confirmation such as `Reset current scenario to baseline?`. Do not interrupt users when nothing has changed. Full undo, keyboard shortcuts, autosave recovery, and draft history are lower-priority post-MVP enhancements even though the critique identified their absence. Pasted markdown

16. **Keep the 3D scene free of UI clutter.** No badges, speech bubbles, sector labels, floating metric cards, or decorative text should be positioned over the dam. The surrounding interface explains the model. The reservoir itself only needs to communicate water level, storage state, inflow/outflow where appropriate, and the physical dam. Preserve the floating-island presentation and low-poly monochrome geometry.

17. **Prepare the center area for the future Development Planner without implementing it in this UI pass.** Keep the visualization mode control extensible so it can eventually become:

```text
Reservoir | Water Flows | Development Planner
```

Do not yet combine the dam and establishment-placement terrain into the same 3D scene. Reservoir mode is for storage/supply. Development Planner will later use a separate low-poly municipality terrain where users can drag malls, hospitals, schools, subdivisions, hotels, factories, public markets, poultry farms, government facilities and other establishments.

18. **Perform a final scope-consistency audit before considering the pass complete.** Test all four scopes: `Provincial Overview`, `Catbalogan City`, `Pinabacdao`, and `Calbayog`. For each one, change a source value and verify that only the intended system changes. Change demand and verify the visible metrics, reservoir state, allocation panel and scenario summary update consistently. Verify that Provincial Overview never implies water transfer between LGUs. Verify that no Calbayog-specific number appears as though it represents all three systems. Verify that the disclaimer stays visible and that no UI text says the data are live or official.

The agent should consider the pass complete only when the interface communicates this hierarchy at a glance:

```text
WHERE?
Provincial Overview / specific LGU

WHAT IS HAPPENING?
Supply · Demand · Gap · Storage

WHY?
Sources / Demand & Allocation / Policies

WHO IS AFFECTED?
Sector allocation + households/economic impact

WHAT DOES THE 3D MODEL SHOW?
The physical consequence of the current water scenario
```

Do **not** spend this pass on new charts, forecasting, Development Planner drag-and-drop, additional AI functionality, keyboard shortcuts, complex undo history, or major architectural rewrites. The objective of this pass is to make the existing Water Economics simulation **unambiguous, readable, and presentation-ready** before adding more features.