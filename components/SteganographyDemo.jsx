import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Info, ZoomIn, ZoomOut, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SteganographyDemo = () => {
  const [message, setMessage] = useState("Hello World");
  const [zoom, setZoom] = useState(1);
  const [step, setStep] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isEncoding, setIsEncoding] = useState(false);
  const [encodingComplete, setEncodingComplete] = useState(false);
  const [comparisonMode, setComparisonMode] = useState("side-by-side");
  const [sliderPosition, setSliderPosition] = useState(50);

  // Use your actual image paths here - for now using placeholder with correct dimensions
  const originalImageSrc = "Yb_V-eN7_GsCC_1024.png"; // Your original image
  const [modifiedImageSrc, setModifiedImageSrc] = useState(
    "Yb_V-eN7_GsCC_1024.png"
  ); // Will be updated with modified version

  // Convert text to binary
  const textToBinary = (text) => {
    return text
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("");
  };

  const handleZoom = (direction) => {
    setZoom((prev) =>
      direction === "in" ? Math.min(prev + 0.5, 4) : Math.max(prev - 0.5, 1)
    );
  };

  const handleEncode = () => {
    setIsEncoding(true);
    setEncodingComplete(false);
    setStep(0);
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= message.length * 8) {
          clearInterval(interval);
          setIsEncoding(false);
          setEncodingComplete(true);
          // In a real implementation, this would be where we update the modified image
          // For demo purposes, we'll just use the same image for now
          setModifiedImageSrc("Yb_V-eN7_GsCC_1024.png");
          return prev;
        }
        return prev + 1;
      });
    }, 200);
  };

  // Reset the demo
  const handleReset = () => {
    setStep(0);
    setIsEncoding(false);
    setEncodingComplete(false);
    setShowOverlay(false);
  };

  return (
    <Card className='w-full max-w-6xl mx-auto bg-white'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold mb-4 text-center text-black'>
          Interactive Steganography Demonstration
        </CardTitle>
        <div className='flex flex-col space-y-4'>
          <div className='flex items-center space-x-4 justify-center'>
            <Input
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Enter secret message'
              className='w-64 bg-white text-black'
              disabled={isEncoding}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleEncode}
                    disabled={isEncoding}
                    className='bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white'>
                    {isEncoding ? "Encoding..." : "Hide Message"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to start encoding your message into the image.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowOverlay(!showOverlay)}
                    className='bg-purple-500 hover:bg-purple-600 transition-colors duration-300 text-white'>
                    {showOverlay ? "Hide Binary" : "Show Binary"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle to show/hide the binary overlay.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {encodingComplete && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleReset}
                      className='bg-gray-500 hover:bg-gray-600 transition-colors duration-300 text-white'>
                      Reset Demo
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset the demo to start again.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className='flex items-center space-x-4 justify-center'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => handleZoom("out")} className='p-2'>
                    <ZoomOut className='h-4 w-4 text-black' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Slider
              value={[zoom]}
              min={1}
              max={4}
              step={0.5}
              className='w-32'
              onValueChange={(value) => setZoom(value[0])}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => handleZoom("in")} className='p-2'>
                    <ZoomIn className='h-4 w-4 text-black' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom in</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Encoding visualization area */}
        {!encodingComplete && (
          <div
            className='relative overflow-hidden border rounded-lg bg-white mb-6'
            style={{ maxWidth: "100%", height: "auto", margin: "0 auto" }}>
            <div
              className='relative'
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                transition: "transform 0.3s ease",
                overflow: "auto",
                width: "100%",
                height: "100%",
              }}>
              <img
                src={originalImageSrc}
                alt='Base image for steganography'
                style={{ width: "1024px", height: "1024px" }}
              />

              {showOverlay && (
                <div
                  className='absolute top-0 left-0 w-full h-full grid'
                  style={{
                    gridTemplateColumns: "repeat(32, 1fr)",
                    opacity: 0.8,
                    width: "1024px",
                    height: "1024px",
                  }}>
                  {Array(1024)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className={`text-xs flex items-center justify-center ${
                          i < step ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                        style={{ height: "32px" }}>
                        {i < textToBinary(message).length
                          ? textToBinary(message)[i]
                          : "0"}
                      </div>
                    ))}
                </div>
              )}

              {isEncoding && (
                <div
                  className='absolute bg-yellow-500 opacity-50'
                  style={{
                    left: `${(step % 32) * 32}px`,
                    top: `${Math.floor(step / 32) * 32}px`,
                    width: "32px",
                    height: "32px",
                    transition: "all 0.2s ease",
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Comparison view (only shown after encoding is complete) */}
        {encodingComplete && (
          <div className='mb-6'>
            <div className='flex justify-center mb-4'>
              <Tabs defaultValue='side-by-side' className='w-full'>
                <TabsList className='grid w-full max-w-md grid-cols-3'>
                  <TabsTrigger
                    value='side-by-side'
                    onClick={() => setComparisonMode("side-by-side")}>
                    Side by Side
                  </TabsTrigger>
                  <TabsTrigger
                    value='slider'
                    onClick={() => setComparisonMode("slider")}>
                    Slider View
                  </TabsTrigger>
                  <TabsTrigger
                    value='toggle'
                    onClick={() => setComparisonMode("toggle")}>
                    Toggle View
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {comparisonMode === "side-by-side" && (
              <div className='flex flex-col md:flex-row gap-4 justify-center'>
                <div className='flex-1 border rounded-lg overflow-hidden'>
                  <div className='bg-gray-100 p-2 text-center font-medium'>
                    Original Image
                  </div>
                  <div className='p-2 overflow-hidden'>
                    <img
                      src={originalImageSrc}
                      alt='Original Image'
                      className='w-full max-w-full'
                      style={{
                        maxWidth: "512px",
                        height: "auto",
                        margin: "0 auto",
                      }}
                    />
                  </div>
                </div>
                <div className='flex-1 border rounded-lg overflow-hidden'>
                  <div className='bg-gray-100 p-2 text-center font-medium'>
                    Steganographic Image
                  </div>
                  <div className='p-2 overflow-hidden'>
                    <img
                      src={modifiedImageSrc}
                      alt='Modified Image with Hidden Message'
                      className='w-full max-w-full'
                      style={{
                        maxWidth: "512px",
                        height: "auto",
                        margin: "0 auto",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {comparisonMode === "slider" && (
              <div className='border rounded-lg overflow-hidden max-w-3xl mx-auto'>
                <div className='bg-gray-100 p-2 text-center font-medium'>
                  Drag to Compare
                </div>
                <div
                  className='relative'
                  style={{
                    width: "100%",
                    maxWidth: "1024px",
                    height: "auto",
                    margin: "0 auto",
                  }}>
                  <img
                    src={originalImageSrc}
                    alt='Original Image'
                    style={{
                      width: "100%",
                      maxWidth: "1024px",
                      height: "auto",
                    }}
                  />
                  <div
                    className='absolute top-0 left-0 h-full overflow-hidden'
                    style={{ width: `${sliderPosition}%` }}>
                    <img
                      src={modifiedImageSrc}
                      alt='Modified Image'
                      className='absolute top-0 left-0'
                      style={{
                        width: `${(100 / sliderPosition) * 100}%`,
                        maxWidth: "none",
                        height: "100%",
                      }}
                    />
                  </div>
                  <div
                    className='absolute top-0 bottom-0'
                    style={{
                      left: `calc(${sliderPosition}% - 2px)`,
                      width: "4px",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      cursor: "ew-resize",
                    }}
                  />
                  <div
                    className='absolute top-0 left-0 w-full h-full cursor-ew-resize'
                    onMouseMove={(e) => {
                      if (e.buttons === 1) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = Math.max(
                          0,
                          Math.min(100, (x / rect.width) * 100)
                        );
                        setSliderPosition(percentage);
                      }
                    }}
                    onTouchMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.touches[0].clientX - rect.left;
                      const percentage = Math.max(
                        0,
                        Math.min(100, (x / rect.width) * 100)
                      );
                      setSliderPosition(percentage);
                    }}
                  />
                  <div className='absolute top-0 left-0 p-2 bg-white bg-opacity-70 text-sm'>
                    Original
                  </div>
                  <div className='absolute top-0 right-0 p-2 bg-white bg-opacity-70 text-sm'>
                    With Message
                  </div>
                </div>
              </div>
            )}

            {comparisonMode === "toggle" && (
              <div className='border rounded-lg overflow-hidden max-w-3xl mx-auto'>
                <div className='bg-gray-100 p-2 text-center font-medium'>
                  <Button
                    onClick={() => {
                      const currentToggle =
                        document.getElementById("comparison-toggle");
                      currentToggle.checked = !currentToggle.checked;
                    }}
                    className='bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white mx-1'>
                    <ArrowLeft className='h-4 w-4 mr-2' />
                    Toggle View
                    <ArrowRight className='h-4 w-4 ml-2' />
                  </Button>
                  <div className='text-sm mt-1'>
                    Click to switch between images
                  </div>
                </div>
                <div
                  className='relative'
                  style={{
                    width: "100%",
                    maxWidth: "1024px",
                    margin: "0 auto",
                  }}>
                  <input
                    type='checkbox'
                    id='comparison-toggle'
                    className='sr-only peer'
                  />
                  <img
                    src={originalImageSrc}
                    alt='Original Image'
                    className='w-full peer-checked:hidden'
                    style={{ maxWidth: "1024px", height: "auto" }}
                  />
                  <img
                    src={modifiedImageSrc}
                    alt='Modified Image'
                    className='w-full hidden peer-checked:block absolute top-0 left-0'
                    style={{ maxWidth: "1024px", height: "auto" }}
                  />
                  <div className='absolute bottom-0 left-0 p-2 bg-white bg-opacity-70 text-sm peer-checked:hidden'>
                    Original Image
                  </div>
                  <div className='absolute bottom-0 left-0 p-2 bg-white bg-opacity-70 text-sm hidden peer-checked:block'>
                    Image with Hidden Message
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Encoding progress indicator */}
        {isEncoding && (
          <div className='mt-4 p-4 bg-gray-100 rounded'>
            <p>
              Encoding progress:{" "}
              {Math.round((step / (message.length * 8)) * 100)}%
            </p>
            <Progress
              value={(step / (message.length * 8)) * 100}
              className='h-2 mt-2'
            />
            <p className='mt-2'>
              Currently encoding character:{" "}
              <span className='font-semibold'>
                {message[Math.floor(step / 8)] || ""}
              </span>
            </p>
          </div>
        )}

        {/* Info section */}
        <div className='mt-4 p-4 bg-white rounded border text-black'>
          <div className='flex items-start space-x-2'>
            <Info className='h-5 w-5 text-blue-500 mt-1' />
            <div>
              <p className='font-medium'>How it works:</p>
              <ol className='mt-2 space-y-2'>
                <li>
                  1. Each character in your message is converted to its 8-bit
                  binary representation
                </li>
                <li>
                  2. The least significant bit of each pixel's color channels is
                  modified to store these bits
                </li>
                <li>
                  3. The changes are visually imperceptible but contain your
                  hidden message
                </li>
                <li>
                  4. After encoding completes, you can compare the original and
                  modified images using different view modes
                </li>
              </ol>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SteganographyDemo;
