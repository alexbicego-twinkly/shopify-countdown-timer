// server.js - App Node.js per Shopify
const express = require('express');
const { createCanvas } = require('canvas');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurazione Black Friday (modifica questa data)
const BLACK_FRIDAY_DATE = new Date('2025-11-28T00:00:00');

// Endpoint per generare l'immagine del countdown
app.get('/countdown.png', (req, res) => {
  try {
    // Calcola il tempo rimanente
    const now = new Date();
    const difference = BLACK_FRIDAY_DATE - now;
    
    // Se il countdown è finito
    if (difference <= 0) {
      return generateExpiredImage(res);
    }
    
    // Calcola giorni, ore, minuti, secondi
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    // Genera l'immagine
    generateCountdownImage(res, days, hours, minutes, seconds);
    
  } catch (error) {
    console.error('Errore:', error);
    res.status(500).send('Errore nella generazione dell\'immagine');
  }
});

function generateCountdownImage(res, days, hours, minutes, seconds) {
  // Crea canvas
  const width = 600;
  const height = 200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Sfondo gradiente
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#FF6B6B');
  gradient.addColorStop(1, '#FF8E53');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Testo principale
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🔥 BLACK FRIDAY INIZIA TRA 🔥', width / 2, 50);
  
  // Box per il countdown
  const boxWidth = 120;
  const boxHeight = 80;
  const startX = (width - (boxWidth * 4 + 30)) / 2;
  const boxY = 80;
  
  const timeUnits = [
    { value: days, label: 'GIORNI' },
    { value: hours, label: 'ORE' },
    { value: minutes, label: 'MIN' },
    { value: seconds, label: 'SEC' }
  ];
  
  timeUnits.forEach((unit, index) => {
    const x = startX + (boxWidth + 10) * index;
    
    // Box bianco semi-trasparente
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x, boxY, boxWidth, boxHeight);
    
    // Numero
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(String(unit.value).padStart(2, '0'), x + boxWidth / 2, boxY + 45);
    
    // Label
    ctx.font = '12px Arial';
    ctx.fillText(unit.label, x + boxWidth / 2, boxY + 65);
  });
  
  // Invia l'immagine
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  canvas.createPNGStream().pipe(res);
}

function generateExpiredImage(res) {
  const width = 600;
  const height = 200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Sfondo
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#4CAF50');
  gradient.addColorStop(1, '#45B7D1');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Testo
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🎉 BLACK FRIDAY È INIZIATO! 🎉', width / 2, height / 2);
  ctx.font = 'bold 24px Arial';
  ctx.fillText('APPROFITTA SUBITO DELLE OFFERTE', width / 2, height / 2 + 40);
  
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  canvas.createPNGStream().pipe(res);
}

// Endpoint SVG alternativo (più leggero)
app.get('/countdown.svg', (req, res) => {
  const now = new Date();
  const difference = BLACK_FRIDAY_DATE - now;
  
  if (difference <= 0) {
    return res.send(generateExpiredSVG());
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(generateCountdownSVG(days, hours, minutes, seconds));
});

function generateCountdownSVG(days, hours, minutes, seconds) {
  return `
<svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF8E53;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="600" height="200" fill="url(#grad)"/>
  
  <text x="300" y="50" font-family="Arial" font-size="28" font-weight="bold" fill="white" text-anchor="middle">
    🔥 BLACK FRIDAY INIZIA TRA 🔥
  </text>
  
  <g transform="translate(75, 80)">
    <rect width="120" height="80" fill="rgba(255,255,255,0.2)" rx="5"/>
    <text x="60" y="45" font-family="Arial" font-size="36" font-weight="bold" fill="white" text-anchor="middle">${String(days).padStart(2, '0')}</text>
    <text x="60" y="65" font-family="Arial" font-size="12" fill="white" text-anchor="middle">GIORNI</text>
  </g>
  
  <g transform="translate(205, 80)">
    <rect width="120" height="80" fill="rgba(255,255,255,0.2)" rx="5"/>
    <text x="60" y="45" font-family="Arial" font-size="36" font-weight="bold" fill="white" text-anchor="middle">${String(hours).padStart(2, '0')}</text>
    <text x="60" y="65" font-family="Arial" font-size="12" fill="white" text-anchor="middle">ORE</text>
  </g>
  
  <g transform="translate(335, 80)">
    <rect width="120" height="80" fill="rgba(255,255,255,0.2)" rx="5"/>
    <text x="60" y="45" font-family="Arial" font-size="36" font-weight="bold" fill="white" text-anchor="middle">${String(minutes).padStart(2, '0')}</text>
    <text x="60" y="65" font-family="Arial" font-size="12" fill="white" text-anchor="middle">MIN</text>
  </g>
  
  <g transform="translate(465, 80)">
    <rect width="120" height="80" fill="rgba(255,255,255,0.2)" rx="5"/>
    <text x="60" y="45" font-family="Arial" font-size="36" font-weight="bold" fill="white" text-anchor="middle">${String(seconds).padStart(2, '0')}</text>
    <text x="60" y="65" font-family="Arial" font-size="12" fill="white" text-anchor="middle">SEC</text>
  </g>
</svg>`;
}

function generateExpiredSVG() {
  return `
<svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#45B7D1;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="600" height="200" fill="url(#grad)"/>
  <text x="300" y="90" font-family="Arial" font-size="36" font-weight="bold" fill="white" text-anchor="middle">🎉 BLACK FRIDAY È INIZIATO! 🎉</text>
  <text x="300" y="130" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">APPROFITTA SUBITO DELLE OFFERTE</text>
</svg>`;
}

app.listen(PORT, () => {
  console.log(`Server countdown in esecuzione su porta ${PORT}`);
  console.log(`Immagine PNG: http://localhost:${PORT}/countdown.png`);
  console.log(`Immagine SVG: http://localhost:${PORT}/countdown.svg`);
});
