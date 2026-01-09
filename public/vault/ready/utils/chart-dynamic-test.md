---
title: Interactive Transient Current
subtitle: Testing Dynamic Chart.js with Sliders
image: https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070
date: 2026-01-08
category: Engineering
---

# Transient Current Response

This is a dynamic simulation using the interactive Chart.js parser. You can adjust the parameters on the right to see the transient response update in real-time.

```chart:dynamic
return {
    parameters: {
        i0: { label: "Initial Current i(0)", value: 10, min: -20, max: 50, step: 0.5 },
        u_hat: { label: "Voltage Amplitude û", value: 100, min: 10, max: 300, step: 5 },
        R: { label: "Resistance R", value: 10, min: 1, max: 50, step: 0.5 },
        X: { label: "Reactance X", value: 15, min: 1, max: 50, step: 0.5 },
        psi: { label: "Phase ψ", value: 30, min: 0, max: 360, step: 5 },
        phi_k: { label: "Imp. Phase φk", value: 45, min: 0, max: 90, step: 5 },
        tau_g: { label: "Time Const τg", value: 0.05, min: 0.01, max: 0.2, step: 0.005 }
    },

    init: (params) => {
        const data = [];
        const tMax = 5 * params.tau_g;
        const steps = 100;

        const Z = Math.sqrt(params.R ** 2 + params.X ** 2);
        const psi_rad = params.psi * Math.PI / 180;
        const phi_rad = params.phi_k * Math.PI / 180;
        const i_peak_calc = params.i0 - (params.u_hat / Z) * Math.sin(psi_rad - phi_rad);

        for (let i = 0; i <= steps; i++) {
            const t = (tMax * i) / steps;
            const current = i_peak_calc * Math.exp(-t / params.tau_g);
            data.push({ x: t.toFixed(4), y: current });
        }

        return {
            type: 'line',
            data: {
                labels: data.map(d => d.x),
                datasets: [{
                    label: 'i(t)ₖ₋ [A]',
                    data: data.map(d => d.y),
                    borderColor: 'rgb(255, 149, 0)',
                    backgroundColor: 'rgba(255, 149, 0, 0.1)',
                    borderWidth: 3,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Time (s)', color: '#a0a0a0' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    y: {
                        title: { display: true, text: 'Current (A)', color: '#a0a0a0' },
                        min: -30,
                        max: 50,
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    }
                }
            }
        };
    },

    update: (chart, params) => {
        const tMax = 5 * params.tau_g;
        const steps = 100;
        const Z = Math.sqrt(params.R ** 2 + params.X ** 2);
        const psi_rad = params.psi * Math.PI / 180;
        const phi_rad = params.phi_k * Math.PI / 180;
        const i_peak_calc = params.i0 - (params.u_hat / Z) * Math.sin(psi_rad - phi_rad);

        const newData = [];
        const newLabels = [];

        for (let i = 0; i <= steps; i++) {
            const t = (tMax * i) / steps;
            const current = i_peak_calc * Math.exp(-t / params.tau_g);
            newData.push(current);
            newLabels.push(t.toFixed(4));
        }

        chart.data.labels = newLabels;
        chart.data.datasets[0].data = newData;
        chart.update('none');
    }
}
```

sdb<sddfbd<fb


