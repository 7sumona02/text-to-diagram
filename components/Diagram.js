import { useState } from 'react';
import axios from 'axios';

export default function Diagram() {
  const [diagramText, setDiagramText] = useState(`digraph G {
    Hello->World
  }`);
  const [diagramType, setDiagramType] = useState('graphviz');
  const [outputFormat, setOutputFormat] = useState('svg');
  const [diagramUrl, setDiagramUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateDiagram = async () => {
    setIsLoading(true);
    setError('');
    setDiagramUrl('');
    
    try {
      // First try the GET method with encoded URL
      const encodedDiagram = encodeURIComponent(diagramText);
      const getUrl = `https://kroki.io/${diagramType}/${outputFormat}/${encodedDiagram}`;
      
      // Verify the URL is valid
      await axios.head(getUrl);
      setDiagramUrl(getUrl);
    } catch (getError) {
      try {
        // If GET fails, try POST method
        const postUrl = `https://kroki.io/${diagramType}/${outputFormat}`;
        const response = await axios.post(postUrl, diagramText, {
          headers: {
            'Content-Type': 'text/plain'
          },
          responseType: outputFormat === 'svg' ? 'text' : 'arraybuffer'
        });
        
        if (outputFormat === 'svg') {
          // For SVG, we can use the response directly
          const svgData = response.data;
          setDiagramUrl(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`);
        } else {
          // For PNG, create object URL
          const blob = new Blob([response.data], { type: `image/${outputFormat}` });
          setDiagramUrl(URL.createObjectURL(blob));
        }
      } catch (postError) {
        setError('Failed to generate diagram. Please check your syntax and try again.');
        console.error('Diagram generation error:', postError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderDiagram = () => {
    if (!diagramUrl) return null;
    
    if (outputFormat === 'svg') {
      if (diagramUrl.startsWith('data:')) {
        // Handle the data URL we created from POST response
        return <img src={diagramUrl} alt="Diagram" className="max-w-full" />;
      } else {
        // Handle direct URL from GET request
        return <img src={diagramUrl} alt="Diagram" className="max-w-full" />;
      }
    } else {
      return <img src={diagramUrl} alt="Diagram" className="max-w-full" />;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Kroki Diagram Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Diagram Type:</label>
          <select 
            value={diagramType}
            onChange={(e) => setDiagramType(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="graphviz">GraphViz</option>
            <option value="plantuml">PlantUML</option>
            <option value="mermaid">Mermaid</option>
            <option value="tikz">Tikz</option>
            <option value="vega">Vega</option>
            <option value="wavedrom">Wavedrom</option>
            <option value="d2">D2</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2">Output Format:</label>
          <select 
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="svg">SVG</option>
            <option value="png">PNG</option>
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Diagram Code:</label>
        <textarea
          value={diagramText}
          onChange={(e) => setDiagramText(e.target.value)}
          className="p-2 border rounded w-full h-64 font-mono text-sm"
          spellCheck="false"
        />
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={generateDiagram}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Diagram'}
        </button>
        
        {isLoading && (
          <span className="text-gray-500">Processing...</span>
        )}
      </div>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <p className="mt-2 text-sm">Common issues:</p>
          <ul className="list-disc pl-5 text-sm">
            <li>Syntax errors in your diagram code</li>
            <li>Unsupported features for the selected diagram type</li>
            <li>Special characters that need proper escaping</li>
          </ul>
        </div>
      )}
      
      {diagramUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <div className="border p-4 rounded bg-gray-50 overflow-auto">
            {renderDiagram()}
          </div>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Diagram URL:</h3>
            <a 
              href={diagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 break-all text-sm"
            >
              {diagramUrl.length > 100 ? `${diagramUrl.substring(0, 100)}...` : diagramUrl}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}