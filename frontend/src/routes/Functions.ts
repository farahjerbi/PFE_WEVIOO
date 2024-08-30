export const getValue = (row: any, key: string) => {
    const lcKey = key.toLowerCase();
    for (const k in row) {
      if (k.toLowerCase() === lcKey) {
        return row[k];
      }
    }
    return undefined;
  };

export const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

export const validatePhone = (phone: string): boolean => {
    const regex = /^\d{11}$/;
    return regex.test(phone);
  };
  
const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/;

export  const validateClickTarget = (target:string) => {
    let normalizedTarget = target.trim();
  
    if (!urlPattern.test(normalizedTarget)) {
      return false; 
    }
    return normalizedTarget; 
  };


export  const truncateText = (text:string|undefined, maxLength:number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const isBase64UrlEncoded = (str: string) => {
  try {
      const decodedKey = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
      return decodedKey.length === 65;
  } catch (e) {
      return false;
  }
};
export const isValidUrl = (urlString: string) => {
  try {
      new URL(urlString);
      return true;
  } catch (_) {
      return false;
  }
};