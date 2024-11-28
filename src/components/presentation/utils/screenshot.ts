import html2canvas from 'html2canvas';

export const captureSlides = async (slides: HTMLElement[]) => {
  const images: string[] = [];
  
  try {
    for (const slide of slides) {
      const canvas = await html2canvas(slide, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const image = canvas.toDataURL('image/png');
      images.push(image);
    }
  } catch (error) {
    console.error('Error capturing slides:', error);
  }
  
  return images;
};

export const downloadImages = async (images: string[]) => {
  try {
    for (let i = 0; i < images.length; i++) {
      const link = document.createElement('a');
      link.href = images[i];
      link.download = `slide-${i + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // 連続ダウンロードの間に少し待機
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.error('Error downloading images:', error);
    throw new Error('Failed to download images');
  }
};