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