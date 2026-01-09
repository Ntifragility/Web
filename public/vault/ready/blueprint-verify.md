---
title: Plotting Blueprint Verification
subtitle: Testing automated engineering plots
image: https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=2070
date: 2026-01-09
category: Tests
---

# Physics & Engineering Blueprint Verification

This page verifies that the `blueprint:plot` system correctly handles math, physics, and automated UI rendering.

## 1. Transient Current Response (Complex Math + Vars)

This plot uses the `vars` section to calculate impedance and phase before evaluating the final equation.

```blueprint:plot
title: Transient Current Response
equation: i_peak_calc * exp(-x / tau_g)
steps: 120
color: rgb(255, 149, 0)
params:
  i0: { label: "Initial Current i(0)", value: 10, min: -20, max: 50, step: 0.5 }
  u_hat: { label: "Voltage Amplitude û", value: 100, min: 10, max: 300, step: 5 }
  R: { label: "Resistance R", value: 10, min: 1, max: 50, step: 0.5 }
  X: { label: "Reactance X", value: 15, min: 1, max: 50, step: 0.5 }
  psi: { label: "Phase ψ", value: 30, min: 0, max: 360, step: 5 }
  phi_k: { label: "Imp. Phase φk", value: 45, min: 0, max: 90, step: 5 }
  tau_g: { label: "Time Const τg", value: 0.05, min: 0.01, max: 0.2, step: 0.005 }
vars:
  Z: sqrt(R**2 + X**2)
  psi_rad: psi * PI / 180
  phi_rad: phi_k * PI / 180
  i_peak_calc: i0 - (u_hat / Z) * sin(psi_rad - phi_rad)
axis:
  x: { title: "Time (s)", min: 0, max: 0.25 }
  y: { title: "Current (A)", min: -30, max: 50 }
```

## 2. FM Modulation (Direct Math Sandbox)

Testing direct use of `sin` and `PI` without `Math.` prefix.

```blueprint:plot
title: FM Modulation
equation: sin(2 * PI * f * x + m * sin(2 * PI * fm * x))
steps: 1000
color: rgb(0, 150, 255)
params:
  f: { label: "Carrier Freq", value: 10, min: 1, max: 50, step: 1 }
  fm: { label: "Modulation Freq", value: 1, min: 0.1, max: 5, step: 0.1 }
  m: { label: "Index", value: 5, min: 0, max: 15, step: 0.5 }
axis:
  x: { title: "Time", min: 0, max: 1 }
  y: { title: "Amplitude", min: -1.2, max: 1.2 }
```


rsj

```blueprint:plot
title: Transient Current Response
equation: i_peak_calc * exp(-x / tau_g)
steps: 120
color: rgb(255, 149, 0)

vars:
  Z: sqrt(R**2 + X**2)
  psi_rad: psi * PI / 180
  phi_rad: phi_k * PI / 180
  i_peak_calc: i0 - (u_hat / Z) * sin(psi_rad - phi_rad)
  
params:
  i0: { label: "Initial Current i(0)", value: 10, min: -20, max: 50, step: 0.5 }
  u_hat: { label: "Voltage Amplitude û", value: 100, min: 10, max: 300, step: 5 }
  R: { label: "Resistance R", value: 10, min: 1, max: 50, step: 0.5 }
  X: { label: "Reactance X", value: 15, min: 1, max: 50, step: 0.5 }
  psi: { label: "Phase ψ", value: 30, min: 0, max: 360, step: 5 }
  phi_k: { label: "Imp. Phase φk", value: 45, min: 0, max: 90, step: 5 }
  tau_g: { label: "Time Const τg", value: 0.05, min: 0.01, max: 0.2, step: 0.005 }
  

axis:
  x: { title: "Time (s)", min: 0, max: 0.25 }
  y: { title: "DC Transient Current (A)", min: -35, max: 35 }
```