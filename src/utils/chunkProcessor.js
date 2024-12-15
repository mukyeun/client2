// src/utils/chunkProcessor.js
export class ChunkProcessor {
    static async processLargeFile(file, chunkSize = 1024 * 1024) {
      const chunks = [];
      let offset = 0;
      
      while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        chunks.push(await this.processChunk(chunk));
        offset += chunkSize;
      }
      
      return chunks;
    }
  
    static async processChunk(chunk) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsArrayBuffer(chunk);
      });
    }
  }