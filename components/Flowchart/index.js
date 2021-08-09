import React, { useState, useEffect, useCallback, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import ReactFlow, {
  removeElements,
  addEdge,
  useZoomPanHelper,
  MiniMap,
  Controls,
  Background,
} from 'react-flow-renderer';
import CustomEdge from './CustomEdge';
import SiNode from './Nodes/SiNode';
import ActorNode from './Nodes/ActorNode';
import ACRNode from './Nodes/ACRNode';
import TextNode from './Nodes/TextNode';
import VRNode from './Nodes/VRNode';
import SIForm from '../SIForm';
import ActorForm from '../ActorForm';
import VRForm from '../VRForm';
import TextForm from '../TextForm';
import ACRForm from '../ACRForm';
import Toobar from '../Toobar';
import localforage from 'localforage';
import SelectForm from '../SelectForm';
import { FormControl, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      display: 'flex',
      flexDirection: 'column'
    },
  }));

localforage.config({
  name: 'react-flow-docs',
  storeName: 'flows',
});

const nodeTypes = {
    SiNode: SiNode,
    ActorNode: ActorNode,
    ACRNode: ACRNode,
    VRNode: VRNode,
    TextNode: TextNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

const flowKey = 'app-unirio';

let id = 0;
const getId = () => `node_${id++}`;
let data = [];
let currentNode = null;

const SaveRestore = ({ project, systems, actors, vertices, criteriaUX, criteriaISO }) => {
    const classes = useStyles();

    const [projectSystems, setProjectSystems ] = useState(systems);
    const [projectActors, setProjectActors ] = useState(actors);
    const [projectVertices, setProjectVertices ] = useState(vertices);
    const [criteriaux, setCriteriaux ] = useState(criteriaUX);
    const [criteriaiso, setCriteriaiso ] = useState(criteriaISO);
    const [criteriaList, setCriteriaList ] = useState([].concat(...criteriaUX));

    const reactFlowWrapper = useRef(null);
    const [rfInstance, setRfInstance] = useState(null);
    const [elements, setElements] = useState([]);
    const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
    const onConnect = (params) => setElements((els) => addEdge(params, els));

    const [openModal, setOpenModal] = useState(false);
    const [newItem, setNewItem] = useState(false);
    const [criteriaType, setCriteriaType] = useState(true);

    const handleOpenModal = () => {
        setOpenModal( true );
    }
    
    const handleCloseModal = () => {
        setOpenModal( false );
    }

    const handleSelectItem = (itemId, type) => {
        switch(type) {
            case 'SiNode': {
                let system = projectSystems.filter(system => {
                    if (system.pk == itemId) {
                        return system;
                    }
                })[0];
        
                if (system) {
                    currentNode.data = { 
                        title: `${system.nome}`,
                        item: system
                    };
            
                    setElements((es) => es.concat(currentNode));
                    handleCloseModal();
                }
            }
            case 'ActorNode': {
                let actor = projectActors.filter(actor => {
                    if (actor.pk == itemId) {
                        return actor;
                    }
                })[0];
        
                if (actor) {
                    currentNode.data = { 
                        title: `${actor.nome}`,
                        item: actor
                    };
            
                    setElements((es) => es.concat(currentNode));
                    handleCloseModal();
                }
            }
                
            case 'VRNode': {
                let vertice = projectVertices.filter(vertice => {
                    if (vertice.pk == itemId) {
                        return vertice;
                    }
                })[0];
        
                if (vertice) {
                    currentNode.data = { 
                        title: `${vertice.descricao}`,
                        item: vertice
                    };
            
                    setElements((es) => es.concat(currentNode));
                    handleCloseModal();
                }
            }   
            case 'ACRNode': {
                let criteria = (criteriaType) ? criteriaux.filter(criteria => {
                    if (criteria.pk == itemId) {
                        return criteria;
                    }
                })[0] : criteriaiso.filter(criteria => {
                    if (criteria.pk == itemId) {
                        return criteria;
                    }
                })[0];
        
                if (criteria) {
                    currentNode.data = { 
                        title: `${criteria.descricao}`,
                        item: criteria
                    };
            
                    setElements((es) => es.concat(currentNode));
                    handleCloseModal();
                }
            }
                
            default:
                return <></>;
        }
    }

    const handleNewSystem = (system) => {
        setProjectSystems([system].concat(...projectSystems));
    }

    const handleNewActor = (actor) => {
        setProjectActors([actor].concat(...projectActors));
    }

    const handleNewVR = (vertice) => {
        setProjectVertices([vertice].concat(...projectVertices));
    }

    const handleNewText = (text) => {
        currentNode.data = { 
            title: `${text}`,
        };

        setElements((es) => es.concat(currentNode));
        handleCloseModal();
    }

    const handleNewCriteria = (criteria) => {
        if (criteriaType) {
            setCriteriaux([criteria].concat(...criteriaux));
        } else {
            setCriteriaiso([criteria].concat(...criteriaiso));
        }
    }

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (event) => {
        event.preventDefault();

        setOpenModal(true);

        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');
        const position = rfInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });
        
        currentNode = {
            id: getId(),
            type,
            position,
        };
    };

    const { transform } = useZoomPanHelper();

    const onSave = useCallback(() => {
        alert('Flow saved');

        if (rfInstance) {
            const flow = rfInstance.toObject();
            localforage.setItem(flowKey, flow);
            localforage.setItem('nodesId', id);
        }
    }, [rfInstance]);

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            const flow = await localforage.getItem(flowKey);
            id = await localforage.getItem('nodesId');

            if (flow) {
                const [x = 0, y = 0] = flow.position;
                setElements(flow.elements || []);
                transform({ x, y, zoom: flow.zoom || 0 });
            }
        };

        restoreFlow();
    }, [setElements, transform]);

    function switchForm() {
        const type = currentNode?.type;

        switch(type) {
            case 'SiNode':
                return (
                    newItem ? <SIForm projeto={project.pk} handleNewSystem={handleNewSystem} /> 
                    : <SelectForm options={ projectSystems.map(system => {
                        return {name: system?.nome, value: system.pk};
                    }) } type={type} handleSelectItem={handleSelectItem} />
                );
            case 'ActorNode':
                return (
                    newItem ? <ActorForm projeto={project.pk} handleNewActor={handleNewActor} />
                    : <SelectForm options={ projectActors.map(actor => {
                        return {name: actor?.nome, value: actor.pk};
                    }) } type={type} handleSelectItem={handleSelectItem} />
                );
            case 'VRNode':
                return (
                    newItem ? <VRForm projeto={project.pk} handleNewVR={handleNewVR} />
                    : <SelectForm options={ projectVertices.map(vertice => {
                        return {name: vertice?.descricao, value: vertice.pk};
                    }) } type={type} handleSelectItem={handleSelectItem} />
                );
            case 'TextNode':
                return (
                    <TextForm handleNewText={handleNewText} />
                );
            case 'ACRNode':
                return (
                    newItem ? 
                        (criteriaType 
                            ? <ACRForm key='ux' criteriaType={criteriaType} handleNewCriteria={handleNewCriteria} />
                            : <ACRForm key='iso' criteriaType={criteriaType} handleNewCriteria={handleNewCriteria} />)
                    : (
                        criteriaType ? <SelectForm key='selectUX' options={ criteriaux.map(criteria => {
                            return {name: criteria?.descricao, value: criteria.pk};
                        }) } type={type} handleSelectItem={handleSelectItem} />
                        : <SelectForm key='selectISO' options={ criteriaiso.map(criteria => {
                            return {name: criteria?.descricao, value: criteria.pk};
                        }) } type={type} handleSelectItem={handleSelectItem} />
                    )
                );
            default:
                return <></>;
        }
    }

    return (
        <div style={{ width: '100%', height: '100%' }} ref={reactFlowWrapper}>
            <ReactFlow
                elements={elements}
                onElementsRemove={onElementsRemove}
                onConnect={onConnect}
                onLoad={setRfInstance}
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
                snapToGrid={true}
                snapGrid={[15, 15]}
                onDrop={onDrop}
                onDragOver={onDragOver}
            >
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
            <Toobar onSave={onSave} onRestore={onRestore} />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openModal}>
                <div className={classes.paper}>
                    {currentNode?.type != 'TextNode' ? <FormControl component="fieldset">
                            <RadioGroup aria-label="donationType" name="donationType1" style={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel value="0" onChange={ event => setNewItem(false) } checked={!newItem} control={<Radio />} label="Selecionar" />
                                <FormControlLabel value="1" onChange={ event => setNewItem(true) } checked={newItem} control={<Radio />} label="Adicionar" />
                            </RadioGroup>
                        </FormControl> : <></>
                    }
                    {currentNode?.type == 'ACRNode' ? <FormControl component="fieldset">
                            <RadioGroup aria-label="donationType" name="donationType1" style={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel value="ux" onChange={ event => setCriteriaType(true) } checked={criteriaType} control={<Radio />} label="UX" />
                                <FormControlLabel value="iso" onChange={ event => setCriteriaType(false) } checked={!criteriaType} control={<Radio />} label="ISO" />
                            </RadioGroup>
                        </FormControl> : <></>
                    }
                    { switchForm() }
                </div>
                </Fade>
            </Modal>
        </div>
    );
};

export default SaveRestore;