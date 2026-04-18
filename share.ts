import {
  dimensionMeta,
  dimensionOrder,
  shareCopy,
  themeColors,
} from "../data/sbtiData";
import type { MatchResult } from "./scoring";

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
};

const drawRadar = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  normalizedScore: MatchResult["normalizedScore"],
) => {
  const levels = 5;

  for (let level = 1; level <= levels; level += 1) {
    ctx.beginPath();
    dimensionOrder.forEach((key, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / dimensionOrder.length;
      const pointRadius = (radius * level) / levels;
      const x = cx + Math.cos(angle) * pointRadius;
      const y = cy + Math.sin(angle) * pointRadius;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.strokeStyle = "rgba(139, 69, 19, 0.14)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  dimensionOrder.forEach((key, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / dimensionOrder.length;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "rgba(139, 69, 19, 0.18)";
    ctx.stroke();
  });

  ctx.beginPath();
  dimensionOrder.forEach((key, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / dimensionOrder.length;
    const pointRadius = (normalizedScore[key] / 10) * radius;
    const x = cx + Math.cos(angle) * pointRadius;
    const y = cy + Math.sin(angle) * pointRadius;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(164, 74, 63, 0.22)";
  ctx.fill();
  ctx.strokeStyle = "#A44A3F";
  ctx.lineWidth = 3;
  ctx.stroke();

  dimensionOrder.forEach((key, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / dimensionOrder.length;
    const pointRadius = (normalizedScore[key] / 10) * radius;
    const x = cx + Math.cos(angle) * pointRadius;
    const y = cy + Math.sin(angle) * pointRadius;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#8B4513";
    ctx.fill();

    const labelRadius = radius + 28;
    const labelX = cx + Math.cos(angle) * labelRadius;
    const labelY = cy + Math.sin(angle) * labelRadius;

    ctx.fillStyle = "#8B4513";
    ctx.font = "18px 'STZhongsong', 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.fillText(dimensionMeta[key].label, labelX, labelY);
  });
};

export const downloadResultCard = async (result: MatchResult) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  ctx.fillStyle = themeColors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createRadialGradient(180, 160, 0, 180, 160, 520);
  gradient.addColorStop(0, "rgba(255,255,255,0.92)");
  gradient.addColorStop(1, "rgba(245,245,220,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawRoundedRect(ctx, 70, 70, 1060, 1460, 36);
  ctx.fillStyle = "rgba(255, 252, 244, 0.7)";
  ctx.fill();
  ctx.strokeStyle = "rgba(139, 69, 19, 0.15)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = themeColors.foreground;
  ctx.textAlign = "left";
  ctx.font = "28px 'Kaiti SC', 'Noto Serif SC', serif";
  ctx.fillText("甄嬛传职场 ZHBI 测评结果", 120, 155);

  ctx.font = "72px 'STZhongsong', 'Noto Serif SC', serif";
  ctx.fillText(result.profile.name, 120, 255);

  ctx.font = "28px 'Kaiti SC', 'Noto Serif SC', serif";
  ctx.fillStyle = "#A44A3F";
  ctx.fillText("Cute", 120, 330);
  ctx.fillStyle = themeColors.foreground;
  wrapText(ctx, result.profile.cute, 120, 378, 960, 42);

  ctx.fillStyle = "#A44A3F";
  ctx.fillText("Deep", 120, 486);
  ctx.fillStyle = themeColors.foreground;
  wrapText(ctx, result.profile.deep, 120, 534, 960, 42);

  drawRadar(ctx, 600, 930, 240, result.normalizedScore);

  ctx.font = "26px 'Kaiti SC', 'Noto Serif SC', serif";
  ctx.textAlign = "center";
  dimensionOrder.forEach((key, index) => {
    const x = 220 + index * 190;
    drawRoundedRect(ctx, x - 65, 1230, 130, 108, 20);
    ctx.fillStyle = "rgba(139, 69, 19, 0.08)";
    ctx.fill();
    ctx.fillStyle = "#A44A3F";
    ctx.fillText(dimensionMeta[key].label, x, 1276);
    ctx.fillStyle = themeColors.foreground;
    ctx.font = "36px 'STZhongsong', 'Noto Serif SC', serif";
    ctx.fillText(String(result.score[key]), x, 1338);
    ctx.font = "26px 'Kaiti SC', 'Noto Serif SC', serif";
  });

  ctx.fillStyle = themeColors.foreground;
  ctx.font = "32px 'Kaiti SC', 'Noto Serif SC', serif";
  ctx.fillText(shareCopy, 600, 1478);

  const url = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = url;
  link.download = `ZHBI-${result.profile.name}.png`;
  link.click();
};

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) => {
  let line = "";
  let currentY = y;

  for (const char of text) {
    const testLine = `${line}${char}`;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = char;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    ctx.fillText(line, x, currentY);
  }
};
