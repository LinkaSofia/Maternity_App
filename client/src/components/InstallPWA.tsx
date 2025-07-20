import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType('ios');
    } else if (/android/.test(userAgent)) {
      setDeviceType('android');
    }

    // Show install prompt after 3 seconds if not already dismissed
    const timer = setTimeout(() => {
      if (!localStorage.getItem('pwa-install-dismissed') && !isInstalled) {
        setIsVisible(true);
      }
    }, 3000);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const installed = (e: Event) => {
      setIsInstalled(true);
      setIsVisible(false);
    };

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installed);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installed);
      clearTimeout(timer);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        
        setDeferredPrompt(null);
        setIsVisible(false);
      } catch (error) {
        console.error('Error during installation:', error);
        setShowManualInstructions(true);
      }
    } else {
      setShowManualInstructions(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setShowManualInstructions(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const getManualInstructions = () => {
    if (deviceType === 'ios') {
      return (
        <div className="text-sm space-y-2">
          <p className="font-medium flex items-center gap-2">
            <Share className="w-4 h-4" />
            Como instalar no iPhone/iPad:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-xs opacity-90">
            <li>Toque no botão "Compartilhar" (quadrado com seta para cima)</li>
            <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
            <li>Toque em "Adicionar" no canto superior direito</li>
          </ol>
        </div>
      );
    } else if (deviceType === 'android') {
      return (
        <div className="text-sm space-y-2">
          <p className="font-medium flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Como instalar no Android:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-xs opacity-90">
            <li>Toque nos 3 pontinhos (⋮) no canto superior direito do Chrome</li>
            <li>Toque em "Adicionar à tela inicial" ou "Instalar app"</li>
            <li>Toque em "Adicionar" para confirmar</li>
          </ol>
        </div>
      );
    }
    return (
      <div className="text-sm space-y-2">
        <p className="font-medium">Como instalar:</p>
        <p className="text-xs opacity-90">
          Procure por "Adicionar à tela inicial" ou "Instalar app" no menu do seu navegador
        </p>
      </div>
    );
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show if dismissed and not showing manual instructions
  if (!isVisible && !showManualInstructions) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-xl shadow-lg z-50 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {showManualInstructions ? (
            getManualInstructions()
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Download className="w-5 h-5" />
                <h3 className="font-semibold">Instalar BabyJourney</h3>
              </div>
              <p className="text-sm opacity-90">
                Instale o app na tela inicial do seu celular para uma experiência completa!
              </p>
            </>
          )}
        </div>
        <button 
          onClick={handleDismiss}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex gap-2 mt-4">
        {!showManualInstructions ? (
          <>
            <Button 
              onClick={handleInstall}
              variant="secondary"
              size="sm"
              className="bg-white text-pink-600 hover:bg-white/90"
            >
              Instalar App
            </Button>
            <Button 
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              Agora não
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleDismiss}
            variant="secondary"
            size="sm"
            className="bg-white text-pink-600 hover:bg-white/90"
          >
            Entendi!
          </Button>
        )}
      </div>
    </div>
  );
}