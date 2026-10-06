Yes — exactly. I’d keep the two expanded views deliberately different:

**Map / Demographics expands downward into Water Balance Analysis.**  
**3D Planning View expands downward into the NRW Simulator.**

That gives each primary visualization its own deeper analytical layer instead of making both expansions repeat the same information.

For the 3D planner, NRW is actually a strong fit because the planner can show not only *who receives water*, but also *what happens to water while it is being distributed*.

I’d structure the expanded 3D view like this:

```text
┌─────────────────────────────────────────────────────────────────────┐
│ PINABACDAO                                      3D PLANNING VIEW    │
│ Water Stress HIGH · NRW 30% · Allocable Water 7.2 ML/day           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                        3D MUNICIPALITY                              │
│                                                                     │
│       Houses      School      Hospital      Government              │
│                     │              │                                │
│             distribution network / pipes                            │
│                     │                                               │
│                💧 LEAK POINT                                        │
│                                                                     │
│         Infrastructure reacts to water satisfaction                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

                 NRW SIMULATOR                          Expand ↓
```

Then when expanded downward:

```text
┌─────────────────────────────────────────────────────────────────────┐
│ NON-REVENUE WATER                                        Collapse ↑ │
│ Recover water already being produced                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ BASELINE NRW                         SCENARIO NRW                    │
│      30%                                  20%                       │
│                                                                     │
│  ────────────────●────────────  slider / scenario control           │
│                                                                     │
│ Baseline loss        Scenario loss        Recovered water           │
│ 3.0 ML/day           2.0 ML/day           +1.0 ML/day               │
│                                                                     │
│                              ↓                                      │
│                   MORE ALLOCABLE WATER                              │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  +1.0 ML/day usable       −10 pp NRW       ₱X estimated value       │
│                                                ESTIMATED            │
└─────────────────────────────────────────────────────────────────────┘
```

The important part is that this should **not just be a slider with three numbers**.

The 3D planning model itself should visibly react.

For example, at 30% NRW:

```text
Source
  │
  ├───────────────💧💧💧  large leakage
  │
  └────► sectors
```

Reduce NRW to 20%:

```text
Source
  │
  ├──────────────💧  smaller leakage
  │
  └────────────► more water reaches sectors
```

You don't necessarily need to model a realistic underground pipe network. A simple stylized water-distribution line running through the 2.5D scene is enough.

The leak can be represented by:
- a pipe break marker,
- animated droplets,
- cyan water spilling from a distribution line,
- or a small visible loss stream.

As NRW decreases, the leak physically shrinks. That directly follows the PDF's recommendation that the leak itself communicate the feature visually. :chatgpt-content-reference{index="0"}

And this is where it becomes deeply connected to the rest of your system.

Suppose:

```text
Gross supply        10 ML/day
NRW                  30%
Reserve               5%
```

Then:

```text
NRW loss             3.0
Reserve              0.5
────────────────────────
Allocable water      6.5 ML/day
```

Change NRW:

```text
30% → 20%
```

Now:

```text
NRW loss             2.0
Reserve              0.5
────────────────────────
Allocable water      7.5 ML/day
```

So the recovered:

**+1.0 ML/day**

is not merely displayed in the NRW section.

It gets returned to the shared municipal water pool.

That means all of these can update immediately:

```text
NRW ↓
 │
 ├─► Leak visually shrinks
 │
 ├─► Allocable water ↑
 │
 ├─► Supply gap ↓
 │
 ├─► Unmet demand ↓
 │
 ├─► Sector satisfaction ↑
 │
 ├─► Red buildings may return to default colors
 │
 ├─► Water Balance graphs update
 │
 └─► DALOY receives new state
```

That interaction is much stronger than having NRW exist on its own page.

For example, imagine households were only getting 85% of required water because of losses.

The 3D scene could initially show:

```text
HOUSEHOLDS
████████████░░░
85%

[several household structures = red/orange]
```

Then the user reduces NRW:

```text
30% → 20%
```

Recovered water goes back into allocation:

```text
HOUSEHOLDS
███████████████
100%

[houses transition back to their normal teal]
```

That creates a very visible “I changed policy → the municipality improved” moment.

For the NRW controls, I would keep them simple. You don't need a huge configuration interface.

Something like:

```text
NON-REVENUE WATER

Baseline
30%
HISTORICAL

Scenario
20%
USER INPUT

30% ─────────●──────── 20%

Recovered
+1.0 ML/day

Allocable water
6.5 → 7.5 ML/day
```

And underneath that, only three strong outcomes, exactly like your document recommends:

**+1.0 ML/day usable water**  
**−10 percentage points NRW**  
**₱X estimated water/revenue value**

The peso value should only appear when you actually have a tariff or defensible valuation assumption. Your source explicitly warns against calculating the peso value without one. :chatgpt-content-reference{index="1"}

I would also show the status label beside it:

```text
Estimated economic value
₱18,400/day
SIMULATED
```

rather than presenting it as an unquestionable real-world figure.

The formulas behind it stay simple:

```text
Old NRW Volume
= Supply × Old NRW Rate

New NRW Volume
= Supply × New NRW Rate

Recovered Water
= Old NRW Volume − New NRW Volume
```

That also makes it easy for your judges to understand what the software is doing without requiring AI or forecasting.

So at this point your expanded Explore structure becomes quite clean:

```text
MAP / DEMOGRAPHICS
       │
       └──── expand downward
                 │
                 ▼
         WATER BALANCE ANALYSIS
         • required demand
         • unmet demand
         • supply vs demand
         • reserve
```

while:

```text
3D PLANNING VIEW
       │
       └──── expand downward
                 │
                 ▼
              NRW
         • baseline loss
         • scenario loss
         • recovered water
         • economic value
         • visible leak
```

And both still consume the exact same underlying state.

I would specifically make **“Where is the imbalance?”** useful here too. If NRW is one of the causes, DALOY could respond:

> **The largest system imbalance comes from distribution losses.**  
> Current NRW removes 3.0 ML/day before water reaches users. Reducing NRW from 30% to 20% recovers 1.0 ML/day and closes 63% of the current household deficit.

Then clicking the result could highlight the leak in the 3D planner and the corresponding NRW value below.

That gives the AI a meaningful role without letting it invent the calculations.