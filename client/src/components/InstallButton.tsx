import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Share, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function InstallButton() {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'other'>(() => {
    if (typeof window === 'undefined') return 'other';
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    if (/android/.test(userAgent)) return 'android';
    return 'other';
  });

  const [isInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true;
  });

  if (isInstalled) return null;

  const getInstructions = () => {
    if (deviceType === 'ios') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <Share className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">iPhone/iPad (Safari)</h3>
              <p className="text-sm text-blue-700">Use o botão Compartilhar</p>
            </div>
          </div>
          
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span>Toque no botão <strong>"Compartilhar"</strong> (quadrado com seta para cima) na barra inferior do Safari</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span>Role para baixo até encontrar <strong>"Adicionar à Tela de Início"</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span>Toque em <strong>"Adicionar"</strong> no canto superior direito</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
              <span>Pronto! O ícone do BabyJourney aparecerá na sua tela inicial</span>
            </li>
          </ol>
        </div>
      );
    } else if (deviceType === 'android') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Smartphone className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Android (Chrome)</h3>
              <p className="text-sm text-green-700">Use o menu do navegador</p>
            </div>
          </div>
          
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span>Toque nos <strong>3 pontinhos (⋮)</strong> no canto superior direito do Chrome</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span>Procure por <strong>"Adicionar à tela inicial"</strong> ou <strong>"Instalar app"</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span>Toque em <strong>"Adicionar"</strong> para confirmar</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
              <span>Pronto! O app será instalado na sua tela inicial</span>
            </li>
          </ol>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
          <Download className="w-8 h-8 text-purple-600" />
          <div>
            <h3 className="font-semibold text-purple-900">Outros navegadores</h3>
            <p className="text-sm text-purple-700">Procure no menu do navegador</p>
          </div>
        </div>
        
        <div className="text-sm space-y-2">
          <p>Procure por uma das seguintes opções no menu do seu navegador:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>"Adicionar à tela inicial"</li>
            <li>"Instalar app"</li>
            <li>"Install app"</li>
            <li>"Add to homescreen"</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm border-pink-200 text-pink-600 hover:bg-pink-50 shadow-lg"
        >
          <Download className="w-4 h-4 mr-1" />
          Instalar App
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-pink-500" />
            Instalar BabyJourney
          </DialogTitle>
          <DialogDescription>
            Instale o aplicativo na tela inicial do seu celular para ter acesso rápido e uma experiência completa!
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {getInstructions()}
        </div>
        
        <div className="mt-6 p-4 bg-pink-50 rounded-lg">
          <h4 className="font-medium text-pink-900 mb-2">Vantagens de instalar:</h4>
          <ul className="text-sm text-pink-800 space-y-1">
            <li>• Acesso rápido direto da tela inicial</li>
            <li>• Funciona sem conexão com internet</li>
            <li>• Experiência como app nativo</li>
            <li>• Notificações de lembretes (em breve)</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}