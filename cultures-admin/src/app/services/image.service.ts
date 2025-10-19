import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private supabase: SupabaseService) {}

  async optimizeImage(file: File): Promise<{blob: Blob, dataUrl: string}> {
    try {
      // 1. Charger l'image
      const img = await this.loadImage(file);
      
      // 2. Crop carré centré 600x600
      const croppedCanvas = this.cropCenter(img, 600, 600);
      
      // 3. Convertir en WebP et compresser
      const webpBlob = await this.convertToWebP(croppedCanvas, 0.85);
      
      // 4. Vérifier la taille et recompresser si nécessaire
      const finalBlob = await this.ensureSize(croppedCanvas, webpBlob, 400 * 1024);
      
      // 5. Créer Data URL pour affichage temporaire
      const dataUrl = await this.blobToDataUrl(finalBlob);
      
      return { blob: finalBlob, dataUrl };
    } catch (error) {
      console.error('Erreur optimisation image:', error);
      throw error;
    }
  }

  async uploadOptimizedImage(blob: Blob, questionId: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${questionId}_${timestamp}.webp`;
      const url = await this.uploadToSupabase(blob, fileName);
      return url;
    } catch (error) {
      console.error('Erreur upload image:', error);
      throw error;
    }
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private cropCenter(img: HTMLImageElement, targetWidth: number, targetHeight: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d')!;
    
    // Calculer le crop centré
    const sourceSize = Math.min(img.width, img.height);
    const sourceX = (img.width - sourceSize) / 2;
    const sourceY = (img.height - sourceSize) / 2;
    
    ctx.drawImage(
      img,
      sourceX, sourceY, sourceSize, sourceSize,
      0, 0, targetWidth, targetHeight
    );
    
    return canvas;
  }

  private convertToWebP(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Conversion WebP échouée'));
        },
        'image/webp',
        quality
      );
    });
  }

  private async ensureSize(canvas: HTMLCanvasElement, blob: Blob, maxSize: number): Promise<Blob> {
    if (blob.size <= maxSize) return blob;
    
    // Réduire la qualité progressivement
    let quality = 0.8;
    let result = blob;
    
    while (result.size > maxSize && quality > 0.3) {
      quality -= 0.1;
      result = await this.convertToWebP(canvas, quality);
    }
    
    return result;
  }

  private async uploadToSupabase(blob: Blob, fileName: string): Promise<string> {
    const { data, error } = await this.supabase.client.storage
      .from('cultures-app')
      .upload(`maps/${fileName}`, blob, {
        contentType: 'image/webp',
        upsert: false
      });

    if (error) throw error;

    // Obtenir l'URL publique
    const { data: urlData } = this.supabase.client.storage
      .from('cultures-app')
      .getPublicUrl(`maps/${fileName}`);

    return urlData.publicUrl;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extraire le chemin du fichier depuis l'URL
      const path = imageUrl.split('/').slice(-2).join('/');
      
      const { error } = await this.supabase.client.storage
        .from('cultures-app')
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur suppression image:', error);
    }
  }
}

