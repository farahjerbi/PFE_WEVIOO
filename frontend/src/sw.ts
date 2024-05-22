// sw.ts
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration> => {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '' });
        console.log('ServiceWorker registration successful with scope: ', reg.scope);
        return reg;
      } catch (error) {
        console.error('ServiceWorker registration failed: ', error);
        throw error; // Rethrow the error to handle it outside
      }
    } else {
      console.log('Service workers aren\'t supported in this browser.');
      throw new Error('Service workers aren\'t supported in this browser.');
    }
  };
  