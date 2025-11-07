'use client'

import React, { useRef } from "react";
import QRCode from "qrcode";
import { Button } from "./ui/button";

const GenerateQrcode = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
const qrData = `https://common-vision-cooperative.vercel.app/login?qrCode=true` // You can make this a prop or state if you want dynamic URLs
  const logoSrc = "/convex.svg"; // Path to your logo

  const drawPreview = React.useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    await QRCode.toCanvas(canvas, qrData, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 200,
    });
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const logo = new window.Image();
      logo.src = logoSrc;
      logo.onload = () => {
        const qrSize = canvas.width;
        const logoSize = qrSize * 0.18;
        const x = (qrSize - logoSize) / 2;
        const y = (qrSize - logoSize) / 2;
        // Draw white background for logo
        ctx.save();
        ctx.beginPath();
        ctx.arc(qrSize / 2, qrSize / 2, logoSize / 2 + 4, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'rgba(0,0,0,0.10)';
        ctx.shadowBlur = 2;
        ctx.fill();
        ctx.restore();
        // Draw logo
        ctx.drawImage(logo, x, y, logoSize, logoSize);
      };
    }
  }, [qrData, logoSrc]);

  const generateAndDownloadQR = async () => {
    try {
      // Generate QR code on canvas
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, qrData, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 400,
      });

      // Draw logo in the center
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const logo = new window.Image();
        logo.src = logoSrc;
        logo.onload = () => {
          const qrSize = canvas.width;
          const logoSize = qrSize * 0.18; // 18% of QR size
          const x = (qrSize - logoSize) / 2;
          const y = (qrSize - logoSize) / 2;
          // Draw white background for logo
          ctx.save();
          ctx.beginPath();
          ctx.arc(qrSize / 2, qrSize / 2, logoSize / 2 + 6, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'white';
          ctx.shadowColor = 'rgba(0,0,0,0.10)';
          ctx.shadowBlur = 4;
          ctx.fill();
          ctx.restore();
          // Draw logo
          ctx.drawImage(logo, x, y, logoSize, logoSize);

          // Download
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = 'qrcode.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Restore preview
          drawPreview();
        };
      }
    } catch (err) {
      console.error(err);
    }
  };

  // In useEffect, use drawPreview
  React.useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your next computer is one scan away.</h1>
        {/* <p className="text-gray-500 mb-4 text-center">Your next computer is one scan away.!</p> */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          />
        </div>
        <Button
          onClick={generateAndDownloadQR}
          className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 !text-red-500 cursor-pointer font-semibold rounded-lg shadow transition-colors duration-200"
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default GenerateQrcode;
