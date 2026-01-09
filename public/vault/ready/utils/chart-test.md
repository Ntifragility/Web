---
title: Dynamic Charts
subtitle: Testing Chart.js integration
image: https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070
date: 2026-01-08
category: Features
---

# Chart.js Integration

This is a test of the dynamic chart rendering.

## Bar Chart

```chart
{
    "type": "bar",
    "data": {
        "labels": ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        "datasets": [{
            "label": "# of Votes",
            "data": [12, 19, 3, 5, 2, 3],
            "backgroundColor": [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
            ],
            "borderColor": [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
            ],
            "borderWidth": 1
        }]
    },
    "options": {
        "scales": {
            "y": {
                "beginAtZero": true
            }
        }
    }
}
```

## Line Chart

```chart
{
  "type": "line",
  "data": {
    "labels": ["January", "February", "March", "April", "May", "June", "July"],
    "datasets": [{
      "label": "My First Dataset",
      "data": [65, 59, 80, 81, 56, 55, 40],
      "fill": false,
      "borderColor": "rgb(75, 192, 192)",
      "tension": 0.1
    }]
  }
}
```
