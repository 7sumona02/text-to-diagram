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
    
    try {
      // Encode the diagram text for URL
      const encodedDiagram = encodeURIComponent(diagramText);
      
      // Construct the Kroki API URL
      const url = `https://kroki.io/${diagramType}/${outputFormat}/${encodedDiagram}`;
      
      // Verify the URL is valid (optional)
      await axios.head(url);
      
      setDiagramUrl(url);
    } catch (err) {
      setError('Failed to generate diagram. Please check your input.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Kroki Diagram Generator</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Diagram Type:</label>
        <select 
          value={diagramType}
          onChange={(e) => setDiagramType(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="graphviz">GraphViz</option>
          <option value="plantuml">PlantUML</option>
          <option value="mermaid">Mermaid</option>
          <option value="d2">D2</option>
        </select>
      </div>
      
      <div className="mb-4">
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
      
      <div className="mb-4">
        <label className="block mb-2">Diagram Code:</label>
        <textarea
          value={diagramText}
          onChange={(e) => setDiagramText(e.target.value)}
          className="p-2 border rounded w-full h-64 font-mono"
          spellCheck="false"
        />
      </div>
      
      <button
        onClick={generateDiagram}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Generate Diagram'}
      </button>
      
      {error && <div className="mt-4 text-red-500">{error}</div>}
      
      {diagramUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <div className="border p-4 rounded bg-gray-50">
            {outputFormat === 'svg' ? (
              <div 
                dangerouslySetInnerHTML={{ __html: `<img src="${diagramUrl}" alt="Diagram" />` }}
              />
            ) : (
              <img src={diagramUrl} alt="Diagram" className="max-w-full" />
            )}
          </div>
          
          <div className="mt-4">
            <h3 className="font-semibold">Direct URL:</h3>
            <a 
              href={diagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 break-all"
            >
              {diagramUrl}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}