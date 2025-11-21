// server.js - Real-time Animated Countdown Timer
const express = require('express');
const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');

const app = express();
const PORT = process.env.PORT || 3000;

// Black Friday date configuration
const BLACK_FRIDAY_DATE = new Date('2025-11-28T00:00:00');

// Endpoint for animated GIF countdown with real seconds counting down
app.get('/countdown.gif', (req, res) => {
  try {
    const now = new Date();
    const difference = BLACK_FRIDAY_DATE - now;
    
    if (difference <= 0) {
      return generateExpiredGIF(res);
    }
    
    // Calculate initial time
    let totalSeconds = Math.floor(difference / 1000);
    
    generateAnimatedCountdown(res, totalSeconds);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error generating image');
  }
});

function generateAnimatedCountdown(res, startSeconds) {
  const width = 600;
  const height = 150;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  const encoder = new GIFEncoder(width, height);
  encoder.createReadStream().pipe(res);
  encoder.start();
  encoder.setRepeat(0); // Loop forever
  encoder.setDelay(1000); // 1 second per frame
  encoder.setQuality(10);
  
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Generate 60 frames (60 seconds of countdown)
  for (let frame = 0; frame < 60; frame++) {
    const currentSeconds = startSeconds - frame;
    
    const days = Math.floor(currentSeconds / (60 * 60 * 24));
    const hours = Math.floor((currentSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((currentSeconds % (60 * 60)) / 60);
    const seconds = currentSeconds % 60;
    
    ctx.clearRect(0, 0, width, height);
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(1, '#FF8E53');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
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
      
      // Box with subtle shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;
      
      // Semi-transparent white box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(x, boxY, boxWidth, boxHeight);
      
      ctx.shadowColor = 'transparent';
      
      // Number
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 48px Arial';
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
  encoder.setDelay(500);
  encoder.setQuality(10);
  
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  // Generate simple pulsing effect for "LIVE NOW"
  for (let frame = 0; frame < 10; frame++) {
    ctx.clearRect(0, 0, width, height);
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#45B7D1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Subtle scale effect
    const scale = frame % 2 === 0 ? 1 : 1.05;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.floor(42 * scale)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('🎉 BLACK FRIDAY IS LIVE! 🎉', width / 2, height / 2 + 5);
    
    encoder.addFrame(ctx);
  }
  
  encoder.finish();
}

// Static PNG endpoint (fallback for email clients that don't support GIF)
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
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x, boxY, boxWidth, boxHeight);
    
    ctx.shadowColor = 'transparent';
    
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
  console.log(`Animated GIF (60s countdown): http://localhost:${PORT}/countdown.gif`);
  console.log(`Static PNG (real-time): http://localhost:${PORT}/countdown.png`);
});
