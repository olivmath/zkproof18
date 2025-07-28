'use client';

import React, { useRef, useEffect, useState } from "react";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Header } from "./components/Header";
import { WalletStatus } from "./components/WalletStatus";
import { ActionSelector } from "./components/ActionSelector";
import { GenerateProofCard } from "./components/GenerateProofCard";
import { VerifyProofCard } from "./components/VerifyProofCard";
import { Ticket } from "./components/Ticket";
import { QRCodeBox } from "./components/QRCodeBox";
import { ToastProvider } from "./components/ToastProvider";

function HomeContent() {
  // Game of Life
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    class GameOfLife {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      cellSize = 8;
      cols: number;
      rows: number;
      grid: number[][];
      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.cellSize = 8;
        this.cols = Math.ceil(window.innerWidth / this.cellSize);
        this.rows = Math.ceil(window.innerHeight / this.cellSize);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.grid = this.createGrid();
        this.randomizeGrid();
        this.animate = this.animate.bind(this);
        this.animate();
      }
      createGrid() {
        return Array(this.rows)
          .fill(0)
          .map(() => Array(this.cols).fill(0));
      }
      randomizeGrid() {
        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.cols; col++) {
            this.grid[row][col] = Math.random() > 0.8 ? 1 : 0;
          }
        }
      }
      countNeighbors(grid: number[][], x: number, y: number) {
        let count = 0;
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) continue;
            let row = (x + i + this.rows) % this.rows;
            let col = (y + j + this.cols) % this.cols;
            count += grid[row][col];
          }
        }
        return count;
      }
      nextGeneration() {
        const newGrid = this.createGrid();
        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.cols; col++) {
            const neighbors = this.countNeighbors(this.grid, row, col);
            const current = this.grid[row][col];
            if (current === 1 && (neighbors === 2 || neighbors === 3)) {
              newGrid[row][col] = 1;
            } else if (current === 0 && neighbors === 3) {
              newGrid[row][col] = 1;
            }
          }
        }
        this.grid = newGrid;
      }
      draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#ffffff";
        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.cols; col++) {
            if (this.grid[row][col] === 1) {
              this.ctx.fillRect(
                col * this.cellSize,
                row * this.cellSize,
                this.cellSize - 1,
                this.cellSize - 1
              );
            }
          }
        }
      }
      animate() {
        this.draw();
        this.nextGeneration();
        setTimeout(this.animate, 400); // Mais lento
      }
    }
    if (canvasRef.current) {
      let game = new GameOfLife(canvasRef.current);
      const handleResize = () => {
        game = new GameOfLife(canvasRef.current!);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // App State
  const [currentAction, setCurrentAction] = useState<'generate' | 'verify'>("generate");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showVerifySuccess, setShowVerifySuccess] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);

  // Ton wallet
  const wallet = useTonWallet();
  const walletAddress = wallet?.account?.address ? wallet.account.address : undefined;

  // Geração de prova
  const handleProofSuccess = (data: { wallet: string; date: string; proofUrl: string; txHash: string }) => {
    setTicketData(data);
    setShowSuccess(true);
  };

  // Verificação de prova
  const handleVerifySuccess = (data: { wallet: string; date: string }) => {
    setTicketData(data);
    setShowVerifySuccess(true);
  };

  // Resetar para gerar nova prova
  const handleResetToMain = () => {
    setShowSuccess(false);
    setTicketData(null);
  };

  // Resetar para verificar outra prova
  const handleResetToVerify = () => {
    setShowVerifySuccess(false);
    setTicketData(null);
  };

  // Adicionar ao wallet (mock)
  const [addWalletBtnText, setAddWalletBtnText] = useState("Add to Wallet");
  const [addWalletBtnDisabled, setAddWalletBtnDisabled] = useState(false);
  const handleAddToWallet = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    setAddWalletBtnText("ADDED TO WALLET ✓");
    setAddWalletBtnDisabled(true);
    setTimeout(() => {
      alert(
        isIOS
          ? "Pass would be added to Apple Wallet in production. You would need Apple Developer certificates and a backend to sign the pass."
          : isAndroid
          ? "Pass would be added to Google Wallet in production. Você precisaria de credenciais de serviço Google e JWT signing."
          : "Wallet integration not supported on this device"
      );
    }, 500);
  };

  return (
    <html lang="pt-BR">
      <head>
        <title>ZK Age Proof</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'JetBrains Mono', monospace; background: #000; color: #fff; min-height: 100vh; overflow-x: hidden; position: relative; }
          #gameOfLife { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; opacity: 0.15; }
          .container { position: relative; z-index: 1; max-width: 400px; margin: 0 auto; padding: 20px; min-height: 100vh; display: flex; flex-direction: column; }
          .header { text-align: center; margin-bottom: 40px; padding-top: 40px; }
          .logo { font-size: 24px; font-weight: 700; margin-bottom: 8px; letter-spacing: 3px; }
          .tagline { font-size: 12px; color: #666; letter-spacing: 1px; text-transform: uppercase; }
          .main-content { flex: 1; display: flex; flex-direction: column; gap: 20px; }
          .card { background: #111; border: 1px solid #333; border-radius: 4px; padding: 24px; transition: all 0.2s ease; }
          .card:hover { border-color: #fff; box-shadow: 0 0 20px rgba(255,255,255,0.1); }
          .card-title { font-size: 16px; font-weight: 500; margin-bottom: 12px; }
          .card-description { font-size: 14px; color: #888; line-height: 1.5; margin-bottom: 20px; }
          .btn { width: 100%; background: #fff; color: #000; border: none; border-radius: 4px; padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; text-transform: uppercase; letter-spacing: 1px; }
          .btn:hover { background: #ccc; }
          .btn:disabled { background: #333; color: #666; cursor: not-allowed; }
          .btn-secondary { background: transparent; color: #fff; border: 1px solid #fff; }
          .btn-secondary:hover { background: #fff; color: #000; }
          .input-group { margin-bottom: 20px; }
          .input-label { display: block; font-size: 12px; color: #fff; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
          .input-field { width: 100%; background: #000; border: 1px solid #333; border-radius: 4px; padding: 16px; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 14px; }
          .input-field:focus { outline: none; border-color: #fff; }
          .wallet-status { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding: 12px; background: #000; border: 1px solid #333; border-radius: 4px; }
          .wallet-indicator { width: 8px; height: 8px; background: #fff; border-radius: 50%; animation: pulse 2s infinite; }
          @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
          .wallet-address { font-size: 12px; color: #888; font-family: 'JetBrains Mono', monospace; }
          .action-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
          .action-option { background: #111; border: 1px solid #333; border-radius: 4px; padding: 20px; cursor: pointer; transition: all 0.2s ease; text-align: center; }
          .action-option:hover { border-color: #fff; }
          .action-option.selected { background: #fff; color: #000; border-color: #fff; }
          .action-title { font-size: 14px; font-weight: 500; margin-bottom: 8px; }
          .action-desc { font-size: 12px; color: #888; }
          .action-option.selected .action-desc { color: #666; }
          .progress-container { margin: 20px 0; }
          .progress-bar { width: 100%; height: 2px; background: #333; border-radius: 1px; overflow: hidden; }
          .progress-fill { height: 100%; background: #fff; width: 0%; transition: width 0.5s ease; }
          .progress-text { font-size: 12px; color: #888; margin-top: 8px; text-align: center; }
          .qr-section { text-align: center; padding: 20px 0; }
          .qr-code { width: 200px; height: 200px; background: #fff; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #000; border-radius: 4px; }
          .proof-link { font-size: 12px; color: #888; word-break: break-all; margin-bottom: 20px; }
          .hidden { display: none !important; }
          .ticket { background: #fff; color: #000; border-radius: 8px; padding: 24px; margin: 20px 0; position: relative; overflow: visible; }
          .ticket::before { content: ''; position: absolute; left: -10px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; background: #000; border-radius: 50%; }
          .ticket::after { content: ''; position: absolute; right: -10px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; background: #000; border-radius: 50%; }
          .ticket-border { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: 2px dashed #000; border-radius: 8px; pointer-events: none; }
          .ticket-border::before { content: ''; position: absolute; left: -12px; top: 50%; transform: translateY(-50%); width: 22px; height: 22px; background: #000; border-radius: 50%; }
          .ticket-border::after { content: ''; position: absolute; right: -12px; top: 50%; transform: translateY(-50%); width: 22px; height: 22px; background: #000; border-radius: 50%; }
          .ticket-header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 16px; margin-bottom: 16px; }
          .ticket-title { font-size: 18px; font-weight: 700; letter-spacing: 2px; margin-bottom: 4px; }
          .ticket-subtitle { font-size: 12px; color: #666; letter-spacing: 1px; }
          .ticket-body { display: flex; justify-content: space-between; align-items: center; }
          .ticket-info { flex: 1; }
          .ticket-label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
          .ticket-value { font-size: 14px; font-weight: 500; margin-bottom: 12px; }
          .check-icon { width: 60px; height: 60px; background: #10b981; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; }
          .camera-container { position: relative; margin: 20px 0; }
          .camera-view { width: 100%; height: 200px; background: #111; border: 1px solid #333; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #888; font-size: 14px; }
          .camera-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 150px; height: 150px; border: 2px solid #fff; border-radius: 8px; pointer-events: none; }
          .camera-overlay::before { content: ''; position: absolute; top: -1px; left: -1px; right: -1px; bottom: -1px; border: 2px solid #fff; border-radius: 8px; animation: scanLine 2s infinite; }
          @keyframes scanLine { 0%{border-color:#fff transparent transparent transparent;} 25%{border-color:transparent #fff transparent transparent;} 50%{border-color:transparent transparent #fff transparent;} 75%{border-color:transparent transparent transparent #fff;} 100%{border-color:#fff transparent transparent transparent;} }
          .camera-instructions { text-align: center; font-size: 12px; color: #888; margin-top: 12px; }
          .verify-input { margin-bottom: 20px; }
          .verify-result { padding: 16px; border-radius: 4px; margin-top: 16px; font-size: 14px; }
          .verify-result.success { background: #111; border: 1px solid #fff; color: #fff; }
          .verify-result.error { background: #111; border: 1px solid #666; color: #888; }
        `}</style>
      </head>
      <body>
        <ToastProvider />
        <canvas id="gameOfLife" ref={canvasRef}></canvas>
        <div className="container">
          {/* Always show wallet header if connected */}
          {walletAddress && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="wallet-indicator"></div>
                <div>
                  <div style={{ fontSize: 12 }}>TON WALLET CONNECTED</div>
                  <div className="wallet-address">{walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4)}</div>
                </div>
              </div>
              <TonConnectButton />
            </div>
          )}
          <Header />
          {/* Login Screen */}
          {!walletAddress && (
            <div className="main-content">
              <div className="card">
                <div className="card-title">Connect TON Wallet</div>
                <div className="card-description">
                  Connect your TON wallet to generate or verify zero-knowledge age proofs. Your private keys never leave your device.
                </div>
                <TonConnectButton />
              </div>
            </div>
          )}
          {/* Main App */}
          {walletAddress && !showSuccess && !showVerifySuccess && (
            <div className="main-content">
              <ActionSelector currentAction={currentAction} onSelect={setCurrentAction} />
              {currentAction === 'generate' && (
                <GenerateProofCard onSuccess={handleProofSuccess} walletAddress={walletAddress} />
              )}
              {currentAction === 'verify' && (
                <VerifyProofCard onSuccess={handleVerifySuccess} walletAddress={walletAddress} />
              )}
            </div>
          )}
          {/* Success Section */}
          {showSuccess && ticketData && (
            <div id="successSection">
              <div className="card">
                <Ticket wallet={ticketData.wallet} date={ticketData.date} />
                <QRCodeBox proofUrl={ticketData.proofUrl} />
                <button className="btn btn-secondary" onClick={handleAddToWallet} disabled={addWalletBtnDisabled}>{addWalletBtnText}</button>
                <button className="btn" onClick={handleResetToMain} style={{ marginTop: 12 }}>Generate Another Proof</button>
              </div>
            </div>
          )}
          {/* Verify Success Section */}
          {showVerifySuccess && ticketData && (
            <div id="verifySuccessSection">
              <div className="card">
                <Ticket wallet={ticketData.wallet} date={ticketData.date} />
                <button className="btn" onClick={handleResetToVerify}>Verify Another Proof</button>
              </div>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}

export default function Home() {
  return (
    <TonConnectUIProvider manifestUrl="https://yellow-accused-earwig-831.mypinata.cloud/ipfs/bafkreia7xookhxwowo5pizgjoaj3rc4tziijgu3sf62gfgule24qo47hvy">
      <HomeContent />
    </TonConnectUIProvider>
  );
}
