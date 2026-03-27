import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import InputNode from '../components/nodes/InputNode';
import ResultNode from '../components/nodes/ResultNode';

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'inputNode',
    position: { x: 300, y: 150 },
    data: { value: '' },
  },
  {
    id: '2',
    type: 'resultNode',
    position: { x: 270, y: 400 },
    data: { response: '', isLoading: false, error: null },
  },
];

const initialEdges = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    animated: true, 
    style: { stroke: 'var(--color-cyber-green)', strokeWidth: 2 } 
  },
];

export default function Canvas({ user }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(() => {
    const saved = localStorage.getItem(`nodeai_nodes_${user?.id || 'guest'}`);
    return saved ? JSON.parse(saved) : initialNodes;
  });
  
  const [edges, setEdges, onEdgesChange] = useEdgesState(() => {
    const saved = localStorage.getItem(`nodeai_edges_${user?.id || 'guest'}`);
    return saved ? JSON.parse(saved) : initialEdges;
  });

  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  // Persist state to localStorage on changes
  useEffect(() => {
    localStorage.setItem(`nodeai_nodes_${user?.id || 'guest'}`, JSON.stringify(nodes));
  }, [nodes, user?.id]);

  useEffect(() => {
    localStorage.setItem(`nodeai_edges_${user?.id || 'guest'}`, JSON.stringify(edges));
  }, [edges, user?.id]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: 'var(--color-cyber-green)', strokeWidth: 2 } }, eds)),
    [setEdges],
  );

  const handlePromptChange = useCallback((id, newValue) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, value: newValue };
        }
        return node;
      })
    );
  }, [setNodes]);

  const nodesWithHandlers = nodes.map((node) => {
    if (node.type === 'inputNode') {
      return {
        ...node,
        data: {
          ...node.data,
          onChange: (newValue) => handlePromptChange(node.id, newValue),
          onRun: handleRunFlow, // Pass run flow to input node
        },
      };
    }
    if (node.type === 'resultNode') {
      return {
        ...node,
        data: {
          ...node.data,
          onSave: handleSavePrompt, // Pass save logic to result node
        },
      };
    }
    return node;
  });

  async function handleSavePrompt() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/savePrompt`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return data.success;
    } catch (e) {
      console.error("Save failed", e);
      return false;
    }
  }

  async function handleRunFlow() {
    if (!user) {
      alert("Please log in to run AI flows.");
      navigate('/login');
      return;
    }

    if (isFetching) return;
    setIsFetching(true);

    const inputNode = nodes.find((n) => n.id === '1');
    const promptValue = inputNode?.data?.value || '';

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '2') {
          return { ...node, data: { ...node.data, isLoading: true, error: null } };
        }
        return node;
      })
    );

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/askAi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ prompt: promptValue }),
      });

      const result = await response.json();

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === '2') {
            if (result.success) {
              return { ...node, data: { ...node.data, isLoading: false, response: result.data, error: null } };
            } else {
              return { ...node, data: { ...node.data, isLoading: false, error: result.message || 'API Error' } };
            }
          }
          return node;
        })
      );
      
    } catch {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === '2') {
            return { ...node, data: { ...node.data, isLoading: false, error: 'Network Connection Error' } };
          }
          return node;
        })
      );
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', paddingTop: '4rem', overflow: 'hidden', background: 'transparent' }} className="relative">
      <ReactFlow
        nodes={nodesWithHandlers}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        colorMode="dark"
        fitView
        style={{ background: 'transparent' }}
      >
        <Controls />
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'inputNode') return 'var(--color-cyber-green)';
            if (n.type === 'resultNode') return 'var(--color-light-ash)';
            return 'var(--color-dark-charcoal)';
          }} 
          maskColor="rgba(17, 17, 17, 0.8)"
        />
      </ReactFlow>

      <button 
        onClick={handleRunFlow}
        disabled={isFetching}
        className={`absolute top-24 right-8 flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all z-10
        ${isFetching ? 'bg-gray-600 text-gray-400 cursor-not-allowed text-sm' : 'bg-[var(--color-cyber-green)] text-[var(--color-carbon-black)] hover:bg-[#0ea5e9] hover:-translate-y-1 shadow-[var(--color-cyber-green)]/20 hover:shadow-[var(--color-cyber-green)]/40'}`}
      >
        <Play size={20} className={isFetching ? '' : 'text-[var(--color-carbon-black)]'} />
        {isFetching ? 'Running...' : 'Run Flow'}
      </button>
    </div>
  );
}
