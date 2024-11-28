import html2canvas from 'html2canvas';

export const captureSlides = async (slides: HTMLElement[]) => {
  const images: string[] = [];
  
  for (const slide of slides) {
    const canvas = await html2canvas(slide, {
      backgroundColor: '#ffffff',
      scale: 2, // より高品質な画像のため
    });
    
    const image = canvas.toDataURL('image/png');
    images.push(image);
  }
  
  return images;
};

export const downloadImages = (images: string[]) => {
  images.forEach((image, index) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `slide-${index + 1}.png`;
    link.click();
  });
};