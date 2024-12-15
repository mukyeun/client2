export interface IElectronAPI {
  loadUbioData: () => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
} 