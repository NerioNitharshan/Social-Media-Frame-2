import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, Trash2, X, Settings, ZoomIn, ZoomOut, Move } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [frame, setFrame] = useState<string>('frame1');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newFrameName, setNewFrameName] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [zoom, setZoom] = useState(1);
  const [frames, setFrames] = useState({
    frame1: 'https://res.cloudinary.com/dre0vyh15/image/upload/v1737353892/vecteezy_social-media-beautiful-frame-design-with-red-love-and-blue_13473778_g8qerj.png',
    frame2: 'https://res.cloudinary.com/dre0vyh15/image/upload/v1737353892/vecteezy_social-media-beautiful-frame-design-with-red-love-and-blue_13473778_g8qerj.png',
    frame3: 'https://res.cloudinary.com/dre0vyh15/image/upload/v1737353892/vecteezy_social-media-beautiful-frame-design-with-red-love-and-blue_13473778_g8qerj.png'
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frameInputRef = useRef<HTMLInputElement>(null);

  const centerAspectCrop = useCallback(
    (mediaWidth: number, mediaHeight: number) => {
      return centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          1, // Square aspect ratio
          mediaWidth,
          mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
      );
    },
    [],
  );

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
  }, [centerAspectCrop]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && newFrameName) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFrames(prev => ({
          ...prev,
          [newFrameName]: e.target?.result as string
        }));
        setNewFrameName('');
        if (frameInputRef.current) {
          frameInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!canvasRef.current || !image || !completedCrop) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || !imgRef.current) return;

    // Set canvas size to 1080x1080
    canvas.width = 1080;
    canvas.height = 1080;

    // Draw the cropped image
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
// Ensure the base image has crossOrigin set to "anonymous"
    imgRef.current.crossOrigin = "anonymous";
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      1080,
      1080
    );

    // Load and draw the frame
    await new Promise<void>((resolve) => {
      const frameImage = new Image();
      frameImage.crossOrigin = "anonymous";
      frameImage.onload = () => {
        ctx.drawImage(frameImage, 0, 0, 1080, 1080);
        resolve();
      };
      frameImage.src = frames[frame as keyof typeof frames];
    });

    // Create download link
    const link = document.createElement('a');
    link.download = 'st-patricks-175th.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const clearImage = () => {
    setImage(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFrame = (keyToRemove: string) => {
    setFrames(prev => {
      const newFrames = { ...prev };
      delete newFrames[keyToRemove];
      return newFrames;
    });
    
    if (frame === keyToRemove) {
      setFrame(Object.keys(frames)[0]);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev + 0.1 : prev - 0.1;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-bold text-green-800 mb-4">175th Years of Fide et Labore</h1>
          <p className="text-green-600">Celebrate St. Patrick's College's 175th Anniversary with a Special Profile Frame</p>
          <button
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className="absolute right-4 top-0 p-2 text-green-600 hover:text-green-800 transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {isAdminOpen && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-green-800">Admin Panel - Upload Frames</h2>
              <button
                onClick={() => setIsAdminOpen(false)}
                className="text-green-500 hover:text-green-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Frame Name
                </label>
                <input
                  type="text"
                  value={newFrameName}
                  onChange={(e) => setNewFrameName(e.target.value)}
                  placeholder="e.g., Anniversary Frame"
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Upload Frame Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={frameInputRef}
                  onChange={handleFrameUpload}
                  disabled={!newFrameName}
                  className="block w-full text-sm text-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-green-800 mb-3">Available Frames</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(frames).map(([key, url]) => (
                  <div key={key} className="relative group">
                    <img 
                      src={url} 
                      alt={key} 
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => removeFrame(key)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-medium text-green-800 text-center">{key}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Upload Your Image</h2>
              {!image ? (
                <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Upload className="w-12 h-12 text-green-600" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">Upload your image to begin cropping</p>
                      <p>Recommended size: 1080x1080 pixels or larger</p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Choose Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={1}
                      className="rounded-lg"
                    >
                      <img
                        ref={imgRef}
                        src={image}
                        alt="Crop me"
                        onLoad={onImageLoad}
                        style={{ transform: `scale(${zoom})` }}
                        className="max-w-full transition-transform duration-200"
                      />
                    </ReactCrop>
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => handleZoom('out')}
                      className="p-2 text-green-600 hover:text-green-800"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleZoom('in')}
                      className="p-2 text-green-600 hover:text-green-800"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Move className="w-4 h-4" />
                      <span>Drag to reposition</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Choose Frame</h2>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(frames).map(([key, src]) => (
                  <button
                    key={key}
                    onClick={() => setFrame(key)}
                    className={`p-2 rounded-lg border-2 ${
                      frame === key ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={src} alt={key} className="w-full h-24 object-cover rounded" />
                  </button>
                ))}
              </div>
            </div>

            {image && completedCrop && (
              <button
                onClick={handleDownload}
                className="w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Anniversary Frame
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Preview</h2>
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {image && completedCrop ? (
                <>
                  <img
                    src={image}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      objectPosition: `${-completedCrop.x}px ${-completedCrop.y}px`,
                      transform: `scale(${imgRef.current ? imgRef.current.width / completedCrop.width : 1})`,
                    }}
                  />
                  <img
                    src={frames[frame as keyof typeof frames]}
                    alt="Frame"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <ImageIcon className="w-16 h-16" />
                </div>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;