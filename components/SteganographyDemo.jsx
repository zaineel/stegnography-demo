import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Info, ZoomIn, ZoomOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

const SteganographyDemo = () => {
  const [message, setMessage] = useState("Hello World");
  const [zoom, setZoom] = useState(1);
  const [step, setStep] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isEncoding, setIsEncoding] = useState(false);

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
    setStep(0);
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= message.length * 8) {
          clearInterval(interval);
          setIsEncoding(false);
          return prev;
        }
        return prev + 1;
      });
    }, 200);
  };

  return (
    <Card className='w-full max-w-4xl mx-auto bg-white'>
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
        <div
          className='relative overflow-hidden border rounded-lg bg-white'
          style={{ width: "1024px", height: "1024px", margin: "0 auto" }}>
          <div
            className='relative'
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              transition: "transform 0.3s ease",
            }}>
            <img
              src='daylight-and-trees-2.png'
              alt='Base image for steganography'
              className='w-full h-full'
              style={{ width: "1024px", height: "1024px" }}
            />

            {showOverlay && (
              <div
                className='absolute top-0 left-0 w-full h-full grid'
                style={{
                  gridTemplateColumns: "repeat(32, 1fr)",
                  opacity: 0.8,
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

        <div className='mt-4 p-4 bg-white rounded text-black'>
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
                  3. The yellow highlight shows which pixel is currently being
                  modified
                </li>
                <li>
                  4. Toggle "Show Binary" to see the actual bits being stored
                </li>
              </ol>
            </div>
          </div>

          {isEncoding && (
            <div className='mt-4'>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default SteganographyDemo;
