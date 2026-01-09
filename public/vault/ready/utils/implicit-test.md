# Implicit Plotting Verification

Testing the new "Marching Squares" engine for equations that cannot be solved for $y$.

## 1. Complex Implicit Equation ($y^3$)

$$y^3 + 2^y = \cos(2\pi x^2) + x$$

```blueprint:plot
title: Implicit Curve Y3
equation: y**3 + 2**y = cos(2 * PI * x**2) + x
color: rgb(0, 255, 128)
axis:
  x: { title: "X Axis", min: -2, max: 2 }
  y: { title: "Y Axis", min: -2, max: 2 }
```

## 2. Square Implicit Equation ($y^2$)

$$y^2 + 2^y = \cos(2\pi x^2) + x$$

```blueprint:plot
title: Implicit Curve Y2
equation: y**2 + 2**y = cos(2 * PI * x**2) + x
color: rgb(0, 128, 255)
axis:
  x: { title: "X Axis", min: -2, max: 2 }
  y: { title: "Y Axis", min: -2, max: 2 }
```

## 3. Circle (Standard Verification)

$$x^2 + y^2 = 1.5^2$$

```blueprint:plot
title: Perfect Circle
equation: x**2 + y**2 = 1.5**2
color: rgb(255, 80, 80)
axis:
  x: { title: "X", min: -2, max: 2 }
  y: { title: "Y", min: -2, max: 2 }
```
