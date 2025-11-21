// server.js - Animated GIF Countdown Timer
const express = require('express');
const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');

const app = express();
const PORT = process.env.PORT || 3000;

// Black Friday date configuration
const BLACK_FRIDAY_DATE = new Date('2025-11-28T00:00:00');

// Endpoint for animated GIF countdown
app.get('/countdown.gif', (req, res) => {
  try {
    const now = new Date();
    const difference = BLACK_FRIDAY_DATE - now;
    
    if (difference <= 0) {
      return generateExpiredGIF(res);
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    generateAnimatedCountdown(res, days, hours, minutes, seconds);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error generating image');
  }
});

function generateAnimatedCountdown(res, days, hours, minutes, seconds) {
  const width = 600;
  const height = 150;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  const encoder = new GIFEncoder(width, height);
  encoder.createReadStream().pipe(res);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(100); // 100ms between frames = 10fps
  encoder.setQuality(10);
  
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Generate 30 frames (3 seconds of animation looping)
  for (let frame = 0; frame < 30; frame++) {
    ctx.clearRect(0, 0, width, height);
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(1, '#FF8E53');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Pulsing effect
    const pulse = Math.sin(frame / 5) * 0.05 + 1;
    
    // Countdown boxes
    const boxWidth = 120;
    const boxHeight = 100;
    const startX = (width - (boxWidth * 4 + 30)) / 2;
    const boxY = 25;
    
    const timeUnits = [
      { value: days, label: 'DAYS' },
      { value: hours, label: 'HOURS' },
      { value: minutes, label: 'MINUTES' },
      { value: seconds, label: 'SECONDS' }
    ];
    
    timeUnits.forEach((unit, index) => {
      const x = startX + (boxWidth + 10) * index;
      
      // Box with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      
      // Semi-transparent white box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(x, boxY, boxWidth, boxHeight);
      
      ctx.shadowColor = 'transparent';
      
      // Number with pulse effect
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.floor(48 * pulse)}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(String(unit.value).padStart(2, '0'), x + boxWidth / 2, boxY + 60);
      
      // Label
      ctx.font = 'bold 14px Arial';
      ctx.fillText(unit.label, x + boxWidth / 2, boxY + 85);
    });
    
    encoder.addFrame(ctx);
  }
  
  encoder.finish();
}

function generateExpiredGIF(res) {
  const width = 600;
  const height = 150;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  const encoder = new GIFEncoder(width, height);
  encoder.createReadStream().pipe(res);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(100);
  encoder.setQuality(10);
  
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  // Generate animated "LIVE NOW" effect
  for (let frame = 0; frame < 20; frame++) {
    ctx.clearRect(0, 0, width, height);
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#45B7D1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Pulsing text
    const scale = Math.sin(frame / 3) * 0.1 + 1;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.floor(42 * scale)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('🎉 BLACK FRIDAY IS LIVE! 🎉', width / 2, height / 2 + 5);
    
    encoder.addFrame(ctx);
  }
  
  encoder.finish();
}

// Static PNG endpoint (fallback)
app.get('/countdown.png', (req, res) => {
  const now = new Date();
  const difference = BLACK_FRIDAY_DATE - now;
  
  if (difference <= 0) {
    return generateExpiredPNG(res);
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
  generateStaticPNG(res, days, hours, minutes, seconds);
});

function generateStaticPNG(res, days, hours, minutes, seconds) {
  const width = 600;
  const height = 150;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#FF6B6B');
  gradient.addColorStop(1, '#FF8E53');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  const boxWidth = 120;
  const boxHeight = 100;
  const startX = (width - (boxWidth * 4 + 30)) / 2;
  const boxY = 25;
  
  const timeUnits = [
    { value: days, label: 'DAYS' },
    { value: hours, label: 'HOURS' },
    { value: minutes, label: 'MINUTES' },
    { value: seconds, label: 'SECONDS' }
  ];
  
  timeUnits.forEach((unit, index) => {
    const x = startX + (boxWidth + 10) * index;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x, boxY, boxWidth, boxHeight);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(String(unit.value).padStart(2, '0'), x + boxWidth / 2, boxY + 60);
    
    ctx.font = 'bold 14px Arial';
    ctx.fillText(unit.label, x + boxWidth / 2, boxY + 85);
  });
  
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  canvas.createPNGStream().pipe(res);
}

function generateExpiredPNG(res) {
  const width = 600;
  const height = 150;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#4CAF50');
  gradient.addColorStop(1, '#45B7D1');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🎉 BLACK FRIDAY IS LIVE! 🎉', width / 2, height / 2 + 5);
  
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache');
  canvas.createPNGStream().pipe(res);
}

app.listen(PORT, () => {
  console.log(`Countdown server running on port ${PORT}`);
  console.log(`Animated GIF: http://localhost:${PORT}/countdown.gif`);
  console.log(`Static PNG: http://localhost:${PORT}/countdown.png`);
});
