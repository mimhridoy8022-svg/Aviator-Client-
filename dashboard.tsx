import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, Radio, Wifi, ShieldCheck, Terminal, Crosshair, Zap, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [serverStatus, setServerStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [totalScans, setTotalScans] = useState(() => {
    return parseInt(localStorage.getItem('total_scans') || '1248');
  });

  // Simulation effect
  useEffect(() => {
    addLog("System initialized. Version 2.4.1-BETA");
    addLog("Connecting to secure servers...");
    setTimeout(() => {
      addLog("Connection established. Encrypted channel active.");
    }, 1500);
  }, []);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 50));
  };

  const startAnalysis = () => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    setPrediction(null);
    setConfidence(0);
    addLog("Initiating analysis sequence...");
    addLog("Scanning recent game hashes...");

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;
      setConfidence(progress);

      if (progress === 100) {
        clearInterval(interval);
        const result = (Math.random() * 5 + 1.1).toFixed(2);
        setPrediction(result);
        setIsAnalyzing(false);
        addLog(`Analysis complete. Prediction: ${result}x`);
        addLog("Waiting for next round...");
        
        // Increment scans
        const newTotal = totalScans + 1;
        setTotalScans(newTotal);
        localStorage.setItem('total_scans', newTotal.toString());
      }
    }, 300);
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-mono relative overflow-hidden flex flex-col items-center">
      {/* Background Elements */}
      <div className="scanline absolute inset-0 pointer-events-none"></div>
      
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-12 relative z-10 border-b border-primary/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="w-8 h-8 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full"></div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display tracking-wider text-primary neon-text">
              AVIATOR<span className="text-white">BOT</span>
            </h1>
            <p className="text-xs text-muted-foreground font-tech tracking-[0.2em]">PREDICTION SYSTEM V2.4</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`bg-black/50 border-primary/50 text-primary ${serverStatus === 'connected' ? 'animate-pulse' : ''}`}>
            <Wifi className="w-3 h-3 mr-2" />
            {serverStatus === 'connected' ? 'ONLINE' : 'OFFLINE'}
          </Badge>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* Left Column: Prediction Display */}
        <div className="space-y-6">
          <Card className="bg-black/40 border-primary/30 backdrop-blur-md p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
            
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-display text-muted-foreground flex items-center gap-2">
                <Crosshair className="w-4 h-4" />
                SIGNAL PREDICTION
              </h2>
              <ShieldCheck className="w-5 h-5 text-primary/50" />
            </div>

            <div className="flex flex-col items-center justify-center py-8 relative">
              <AnimatePresence mode="wait">
                {prediction ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    className="text-7xl md:text-8xl font-black font-display text-primary neon-text tracking-tighter"
                  >
                    {prediction}x
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-6xl md:text-7xl font-bold text-muted-foreground/20 font-display animate-pulse"
                  >
                    --.--x
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="mt-4 text-xs font-tech text-primary/70 uppercase tracking-widest">
                {isAnalyzing ? "CALCULATING PROBABILITY..." : prediction ? "SIGNAL CONFIRMED" : "READY TO SCAN"}
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground font-tech">
                <span>CONFIDENCE INTERVAL</span>
                <span>{confidence.toFixed(1)}%</span>
              </div>
              <Progress value={confidence} className="h-1 bg-primary/10" />
            </div>
          </Card>

          <Button 
            onClick={startAnalysis}
            disabled={isAnalyzing}
            className="w-full h-16 text-xl font-bold font-display bg-primary/10 hover:bg-primary/20 border border-primary/50 text-primary hover:text-white transition-all duration-300 neon-border group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              {isAnalyzing ? (
                <>
                  <RotateCcw className="w-6 h-6 animate-spin" />
                  ANALYZING DATA...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  GENERATE SIGNAL
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Button>
        </div>

        {/* Right Column: Terminal & Stats */}
        <div className="space-y-6">
          <Card className="bg-black/60 border-muted p-4 h-[300px] flex flex-col font-mono text-xs md:text-sm relative overflow-hidden">
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            </div>
            <div className="flex items-center gap-2 mb-3 text-muted-foreground border-b border-white/10 pb-2">
              <Terminal className="w-4 h-4" />
              <span>SYSTEM LOGS</span>
            </div>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-primary/80 font-tech"
                  >
                    <span className="text-primary/40 mr-2">{'>'}</span>
                    {log}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-black/40 border-primary/20 p-4">
              <div className="text-xs text-muted-foreground font-tech mb-1">ACCURACY</div>
              <div className="text-2xl font-display text-white">100%</div>
            </Card>
            <Card className="bg-black/40 border-primary/20 p-4">
              <div className="text-xs text-muted-foreground font-tech mb-1">TOTAL SCANS</div>
              <div className="text-2xl font-display text-white">{totalScans.toLocaleString()}</div>
            </Card>
            <Card className="bg-black/40 border-primary/20 p-4 col-span-2">
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground font-tech">SERVER LATENCY</div>
                <div className="text-green-500 font-mono text-sm">24ms</div>
              </div>
              <div className="w-full bg-primary/10 h-8 mt-2 rounded-sm relative overflow-hidden">
                 <div className="absolute inset-y-0 left-0 bg-primary/20 w-[30%] animate-[pulse_2s_infinite]"></div>
                 <div className="flex items-center justify-center h-full text-[10px] text-primary tracking-widest">
                    LOW LATENCY OPTIMIZED
                 </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-[10px] text-muted-foreground font-tech opacity-50 relative z-10">
        <p>DISCLAIMER: THIS TOOL IS FOR EDUCATIONAL PURPOSES ONLY.</p>
        <p>SYSTEM ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
      </footer>
    </div>
  );
}
