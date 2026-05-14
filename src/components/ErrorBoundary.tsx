import { Component, type ErrorInfo, type ReactNode } from 'react';
import { SAVE_KEY } from '../lib/saveLoad';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] Render hatası:', error, info);
  }

  handleRestart = (): void => {
    window.location.reload();
  };

  handleResetSave = (): void => {
    const confirmed = window.confirm(
      'Kayıt silinecek ve oyun sıfırdan başlayacak. Devam edilsin mi?'
    );
    if (!confirmed) return;
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.error('[ErrorBoundary] Kayıt silinemedi:', e);
    }
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const message = this.state.error?.message ?? 'Bilinmeyen bir hata oluştu.';

    return (
      <div
        role="alert"
        style={{
          minHeight: '100dvh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background:
            'radial-gradient(circle at 50% 0%, #0c1f35 0%, #06182c 70%)',
          color: '#f4f8ff',
          fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            background:
              'linear-gradient(180deg, rgba(15,58,92,0.85) 0%, rgba(12,42,71,0.65) 100%)',
            border: '1px solid rgba(94,234,248,0.25)',
            borderRadius: '18px',
            padding: '24px',
            boxShadow:
              '0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(94,234,248,0.06) inset',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '44px',
              marginBottom: '12px',
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            ⚓
          </div>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 600,
              margin: '0 0 8px',
              color: '#5eeaf8',
            }}
          >
            Beklenmedik bir hata oluştu
          </h1>
          <p
            style={{
              fontSize: '14px',
              margin: '0 0 20px',
              color: '#9bbecf',
              lineHeight: 1.5,
            }}
          >
            Oyun yeniden başlatılabilir. Sorun devam ederse kaydı sıfırlayıp
            baştan başlayabilirsin.
          </p>
          <details
            style={{
              fontSize: '12px',
              color: '#5e7a8e',
              textAlign: 'left',
              marginBottom: '20px',
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '10px',
              padding: '10px 12px',
            }}
          >
            <summary style={{ cursor: 'pointer' }}>Teknik detay</summary>
            <code
              style={{
                display: 'block',
                marginTop: '8px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'ui-monospace, Consolas, monospace',
              }}
            >
              {message}
            </code>
          </details>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <button
              type="button"
              onClick={this.handleRestart}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#f4f8ff',
                background:
                  'linear-gradient(135deg, #0d3d5e 0%, #0a5878 100%)',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                boxShadow:
                  '0 0 0 1px rgba(94,234,248,0.45) inset, 0 4px 24px rgba(94,234,248,0.25)',
                touchAction: 'manipulation',
              }}
            >
              Yeniden Başlat
            </button>
            <button
              type="button"
              onClick={this.handleResetSave}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#9bbecf',
                background: 'transparent',
                border: '1px solid rgba(155,190,207,0.25)',
                borderRadius: '14px',
                cursor: 'pointer',
                touchAction: 'manipulation',
              }}
            >
              Kaydı Sıfırla ve Baştan Başla
            </button>
          </div>
        </div>
      </div>
    );
  }
}
