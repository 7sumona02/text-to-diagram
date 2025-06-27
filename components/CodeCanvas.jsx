import { saveAs } from 'file-saver';
import React, { useState } from 'react';
import axios from 'axios';
import LetterSwapForward from './letter-swap-forward-anim';
import Link from 'next/link';
import { SelectDiagram } from './SelectDiag';
import { Button } from './ui/button';
import { CodeEditor } from './CodeEditor';
import { ScrollArea } from './ui/scroll-area';
import { PhotoType } from './PhotoType';
import { motion, spring } from 'motion/react'

const CodeCanvas = () => {
  const [diagramText, setDiagramText] = useState(`digraph G {
    Hello->World
  }`);
  const [diagramType, setDiagramType] = useState('graphviz');
  const [outputFormat, setOutputFormat] = useState('svg');
  const [diagramUrl, setDiagramUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(false);

  // Default examples for each diagram type
  const examples = {
    graphviz: `digraph G {
  Hello->World
}`,
    plantuml: `@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response
@enduml`,
    mermaid: `graph TD
A[Christmas] -->|Get money| B(Go shopping)
B --> C{Let me think}
C -->|One| D[Laptop]
C -->|Two| E[iPhone]
C -->|Three| F[Car]`,
    d2: `x -> y`,
    c4plantuml: `@startuml
!include C4_Context.puml
Person(user, "User")
System(system, "System")
Rel(user, system, "Uses")
@enduml`
  };

  const saveDiagram = async () => {
  if (!diagramUrl) return;

  try {
    let blob;
    
    if (outputFormat === 'svg') {
      if (diagramUrl.startsWith('data:')) {
        // Extract SVG from data URL
        const svgData = decodeURIComponent(diagramUrl.split(',')[1]);
        blob = new Blob([svgData], { type: 'image/svg+xml' });
      } else {
        // Download SVG from URL
        const response = await axios.get(diagramUrl, { responseType: 'text' });
        blob = new Blob([response.data], { type: 'image/svg+xml' });
      }
    } else {
      // For PNG, we already have a blob URL or can fetch it
      if (diagramUrl.startsWith('blob:')) {
        // Convert blob URL to actual blob
        const response = await fetch(diagramUrl);
        blob = await response.blob();
      } else {
        // Download PNG from URL
        const response = await axios.get(diagramUrl, { responseType: 'blob' });
        blob = response.data;
      }
    }

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `diagram-${timestamp}.${outputFormat}`;
    
    // Save the file
    saveAs(blob, filename);
  } catch (error) {
    setError('Failed to save diagram. Please try again.');
    console.error('Save error:', error);
  }
};

  const generateDiagram = async () => {
    setIsLoading(true);
    setError('');
    setDiagramUrl('');
    
    try {
      // For certain diagram types, we need to use POST exclusively
      const requiresPost = ['mermaid', 'd2', 'c4plantuml'].includes(diagramType);
      
      if (!requiresPost) {
        try {
          // First try GET method for compatible diagram types
          const encodedDiagram = encodeURIComponent(diagramText);
          const getUrl = `https://kroki.io/${diagramType}/${outputFormat}/${encodedDiagram}`;
          
          // Verify the URL is valid
          await axios.head(getUrl);
          setDiagramUrl(getUrl);
          return;
        } catch (getError) {
          console.log('GET method failed, falling back to POST');
        }
      }

      // Use POST method as fallback or for specific diagram types
      const postUrl = `https://kroki.io/${diagramType}/${outputFormat}`;
      const response = await axios.post(postUrl, diagramText, {
        headers: {
          'Content-Type': 'text/plain'
        },
        responseType: outputFormat === 'svg' ? 'text' : 'arraybuffer'
      });
      
      if (outputFormat === 'svg') {
        const svgData = response.data;
        setDiagramUrl(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`);
      } else {
        const blob = new Blob([response.data], { type: `image/${outputFormat}` });
        setDiagramUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      let errorMessage = 'Failed to generate diagram. Please check your syntax.';
      
      // Provide more specific error messages for common issues
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Invalid diagram syntax. Please check the documentation for this diagram type.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. The diagram might be too complex or contain unsupported features.';
        }
      }
      
      setError(errorMessage);
      console.error('Diagram generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update diagram text when diagram type changes
  const handleDiagramTypeChange = (type) => {
    setDiagramType(type);
    setDiagramText(examples[type] || examples.graphviz);
  };

  const renderDiagram = () => {
    if (!diagramUrl) return (
      <div className="flex items-center justify-center min-h-[25rem] text-neutral-300 text-xs font-semibold">
        {isLoading ? 'Generating diagram...' : 'Diagram will appear here'}
      </div>
    );
    
    return (
      <img 
        src={diagramUrl} 
        alt="Diagram" 
        className="max-w-full" 
        onError={() => setError('Failed to load diagram. Try a different output format.')}
      />
    );
  };

  return (
    <div className='min-h-screen w-full bg-[#ededed]'>
      <div className='container max-w-7xl mx-auto md:px-0 px-5'>
        {/* navbar */}
        <div className='py-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
            <motion.div
        onClick={() => setIsActive(!isActive)}
        animate={{
          rotate: isActive ? 180 : 0
        }}
        transition={{
          type: spring,
          damping: 10
        }}
        className='rounded-full text-black font-semibold items-center justify-center cursor-pointer'>{`</>`}</motion.div>
          <div className='bg-black text-white max-w-fit py-1 px-2 font-semibold tracking-tighter cursor-pointer text-sm'>
            <LetterSwapForward label="code canvas" staggerDuration={0} reverse={false} />
          </div>
        </div>
          <div className='flex items-center gap-3'>
            <div className='text-[0.6rem] bg-neutral-300 font-semibold py-1 px-2 text-neutral-900 rounded-lg cursor-pointer'>
              <LetterSwapForward label="HOW TO USE" staggerDuration={0} reverse={false} />
            </div>
            <Link target='_blank' href='https://portfolio.sumona.tech/' className='text-black font-semibold uppercase text-xs tracking-tighter'>
              Say hey 👋
            </Link>
          </div>
        </div>

        {/* select & generate */}
        <div className='flex items-center gap-2 py-4'>
          <SelectDiagram value={diagramType} onValueChange={handleDiagramTypeChange} />
          <Button 
            onClick={generateDiagram}
            className='text-sm rounded-[0.2rem] cursor-pointer px-8'
            disabled={isLoading}
          >
            {isLoading ? <div className='flex items-center gap-2'>Generating<span className="animate-spin inline-block size-4 border-2 border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
            </span></div>
            : 'Generate'}
          </Button>
        </div>

        {/* error message */}
        {error && (
          <div className="text-red-500 text-sm py-2">
            {error}
          </div>
        )}

        {/* code editor */}
        <div className='max-w-8xl mx-auto py-4'>
          <div className='grid md:grid-cols-2 grid-cols-1 gap-10'>
            <div>
              <div className='pb-2 text-black font-semibold uppercase text-xs tracking-tighter'>
                Code here 💻
              </div>
              <ScrollArea className="h-[37rem] rounded-[0.2rem]">
                <CodeEditor code={diagramText} setCode={setDiagramText} />
              </ScrollArea>
            </div>
            <div>
              <div className='pb-2 text-black font-semibold uppercase text-xs tracking-tighter'>
                DIAGRAM 📝
              </div>
              <ScrollArea className="min-h-[25rem] mx-auto bg-white p-2 rounded-[0.2rem]">
                {renderDiagram()}
              </ScrollArea>
              <div className='w-full flex items-center justify-end gap-2 py-4'>
                <PhotoType value={outputFormat} onValueChange={setOutputFormat} />
                <Button 
                  className='text-sm rounded-[0.2rem] cursor-pointer px-8 w-[12rem]'
                  disabled={!diagramUrl || isLoading}
                  onClick={saveDiagram}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeCanvas;