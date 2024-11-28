import html2canvas from 'html2canvas';

export const captureSlides = async (slides: HTMLElement[]) => {
  const images: string[] = [];
  
  try {
    for (const slide of slides) {
      console.log('Capturing slide:', slide);
      const canvas = await html2canvas(slide, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
        onclone: (document, element) => {
          console.log('Cloned element:', element);
        },
        onrendered: (canvas) => {
          console.log('Rendered canvas:', canvas);
        }
      });
      
      console.log('Canvas created successfully');
      const image = canvas.toDataURL('image/png');
      console.log('Image data URL created');
      images.push(image);
    }
  } catch (error) {
    console.error('Error capturing slides:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
  
  return images;
};

export const downloadImages = async (images: string[]) => {
  try {
    console.log('Starting download of', images.length, 'images');
    for (let i = 0; i < images.length; i++) {
      console.log('Downloading image', i + 1);
      const link = document.createElement('a');
      link.href = images[i];
      link.download = `slide-${i + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log('All images downloaded successfully');
  } catch (error) {
    console.error('Error downloading images:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw new Error('Failed to download images');
  }
};