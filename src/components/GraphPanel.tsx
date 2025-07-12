// En src/components/GraphPanel.tsx
import React, { useEffect } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  MarkerType,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useAppContainer } from '../context/KnowledgeGraphContext';
import { termTypeStyles } from '../logic/styles';
import type { EnrichedTerm } from '../types';

const GraphPanel: React.FC = () => {
    const { activeTermId, termsMap, setActiveTermId } = useAppContainer();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (!activeTermId || !termsMap.has(activeTermId)) {
            setNodes([]);
            setEdges([]);
            return;
        }

        const activeTerm = termsMap.get(activeTermId)!;
        
        // ---- LA CORRECCIÓN ESTÁ AQUÍ ----
        const newNodes: Node<any>[] = [];
        const newEdges: Edge<any>[] = [];
        // ---------------------------------

        const addedNodeIds = new Set<string>();

        const addNode = (term: EnrichedTerm, x: number, y: number) => {
            if (!addedNodeIds.has(term.id)) {
                newNodes.push({
                    id: term.id,
                    position: { x, y },
                    data: { label: term.displayName },
                    style: {
                        backgroundColor: termTypeStyles[term.type]?.split(' ')[0].replace('bg-', '#'),
                        color: termTypeStyles[term.type]?.includes('text-white') ? 'white' : '#191817',
                        border: `2px solid ${activeTerm.id === term.id ? '#D4AF37' : 'transparent'}`,
                        padding: '10px 15px',
                        borderRadius: '8px',
                        fontSize: 12,
                    }
                });
                addedNodeIds.add(term.id);
            }
        };

        addNode(activeTerm, 0, 0);

        activeTerm.used_terms.forEach((id, i) => {
            const term = termsMap.get(id);
            if (term) {
                addNode(term, -350, i * 120 - (activeTerm.used_terms.length - 1) * 60);
                newEdges.push({
                    id: `e-${id}-${activeTerm.id}`,
                    source: id,
                    target: activeTerm.id,
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#3A5A40' },
                });
            }
        });

        activeTerm.used_by.forEach((id, i) => {
            const term = termsMap.get(id);
            if (term) {
                addNode(term, 350, i * 120 - (activeTerm.used_by.length - 1) * 60);
                newEdges.push({
                    id: `e-${activeTerm.id}-${id}`,
                    source: activeTerm.id,
                    target: id,
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#588157' },
                    style: { strokeDasharray: '5 5' }
                });
            }
        });

        setNodes(newNodes);
        setEdges(newEdges);

    }, [activeTermId, termsMap, setNodes, setEdges]);
    
    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_, node) => setActiveTermId(node.id)}
            fitView
            className="bg-gray-100/80"
        >
            <Controls />
            <MiniMap 
                nodeStrokeWidth={3} 
                zoomable 
                pannable 
                nodeColor={(node: Node) => {
                    const term = termsMap.get(node.id);
                    const styleClass = term ? termTypeStyles[term.type] : null;
                    return styleClass ? styleClass.split(' ')[0].replace('bg-', '#') : '#cccccc';
                }}
            />
            <Background />
        </ReactFlow>
    );
};

export default GraphPanel;