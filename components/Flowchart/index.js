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
import { FormControl, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
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
import SelectSignal from '../SelectSignal';
import SiEdge from './Edges/SiEdge';
import AcrEdge from './Edges/ACREdge';
import SignedEdge from './Edges/SignedEdge';
import ImpactsForm from '../ImpactsForm';

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
    SiEdge: SiEdge,
    AcrEdge: AcrEdge,
    SignedEdge: SignedEdge
};

const flowKey = 'app-unirio';

let id = 0;
const getId = () => `node_${id++}`;
let data = [];
let currentNode = null;
let currentLine = [];

const SaveRestore = ({ project, systems, actors, vertices, criteriaUX, criteriaISO }) => {
    const classes = useStyles();

    const [projectSystems, setProjectSystems ] = useState(systems);
    const [projectActors, setProjectActors ] = useState(actors);
    const [projectVertices, setProjectVertices ] = useState(vertices);
    const [criteriaux, setCriteriaux ] = useState(criteriaUX);
    const [criteriaiso, setCriteriaiso ] = useState(criteriaISO);

    const reactFlowWrapper = useRef(null);
    const [rfInstance, setRfInstance] = useState(null);
    const [elements, setElements] = useState([]);
    const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
    const onConnect = (params) => setElements((els) => handleConnect(params, els));

    const [openModal, setOpenModal] = useState(false);
    const [newItem, setNewItem] = useState(false);
    const [criteriaType, setCriteriaType] = useState(true);
    const [addLine, setAddLine] = useState(false);

    const [impactsChange, setImpactsChange] = useState(false);
    const handleOpenImpactsChange = () => {
        setImpactsChange(true);
        handleOpenModal();
    }

    const [impatcSelected, setImpatcSelected] = useState(0);
    const [impacts, setImpacts] = useState([
        {
            height: 200, 
            width: '70%', 
            color: '#000000', 
            backgroundColor: '#bfbfbf', 
            description: 'Estrutural'
        },
        {
            height: 200, 
            width: '70%', 
            color: '#000000', 
            backgroundColor: '#d9d9d9', 
            description: 'Gradual'
        },
        {
            height: 200,
            width: '70%',
            color: '#000000',
            backgroundColor: '#f2f2f2',
            description: 'Imediato'
        }
    ]);

    const handleCloseImpactChanges = () => {
        handleCloseModal();
        setImpactsChange(false);
    }

    const handleImpactsChange = (field, value) => {
        let impactList = [...impacts];
        impactList[impatcSelected][field] = value;

        setImpacts(impactList);
    }

    const handleConnect = (params, els) => {
        let source = els.filter(element => {
            if (element.id == params.source) {
                return element;
            }
        })[0];

        let target = els.filter(element => {
            if (element.id == params.target) {
                return element;
            }
        })[0];

        switch (source.type) {
            case 'ACRNode': {
                params['type'] = 'AcrEdge';
                break;
            }
            case 'SiNode': {
                if (source.type == target.type) {
                    params['type'] = 'SiEdge';
                } else {
                    params['type'] = 'SignedEdge';
                    setAddLine(true);
                    handleOpenModal();
                    currentLine['params'] = params;
                    currentLine['els'] = els;
                    setElements(() => els);
                    return;
                }
                break;
            }
            default:
            {
                params['type'] = 'SignedEdge';
                setAddLine(true);
                handleOpenModal();
                currentLine['params'] = params;
                currentLine['els'] = els;
                setElements(() => els);
                return;
            };
        }

        setElements(() => addEdge(params, els));
    }

    const handleSignedLine = (sign) => {
        let params = currentLine['params'];
        let els = currentLine['els'];
        params['data'] = { 'signal': sign };

        setElements(() => addEdge(params, els));

        setAddLine(false);
        handleCloseModal();
    }

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

                break;
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

                break;
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

                break;
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

                break;
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
                    newItem ? <SIForm key='systemForm' projeto={project.pk} handleNewSystem={handleNewSystem} /> 
                    : <SelectForm options={ projectSystems.map(system => {
                        return {name: system?.nome, value: system.pk};
                    }) } type={type} handleSelectItem={handleSelectItem} />
                );
            case 'ActorNode':
                return (
                    newItem ? <ActorForm key='actorForm' projeto={project.pk} handleNewActor={handleNewActor} />
                    : <SelectForm options={ projectActors.map(actor => {
                        return {name: actor?.nome, value: actor.pk};
                    }) } type={type} handleSelectItem={handleSelectItem} />
                );
            case 'VRNode':
                return (
                    newItem ? <VRForm key='vrForm' projeto={project.pk} handleNewVR={handleNewVR} />
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
        <div style={{ width: '100%', height: '100%', background: 'transparent' }} ref={reactFlowWrapper}>
            <div style={{
                width: '100%', 
                height: '100%',
                position: 'absolute',
                left: 0,
                top: 140,
                zIndex: -1
            }}>
                <div style={{
                    position: 'relative',
                    width: impacts[0].width,
                    height: impacts[0].height,
                    backgroundColor: impacts[0].backgroundColor,
                    color: impacts[0].color,
                    padding: 15,
                }}>{impacts[0].description}</div>
                <div style={{
                    position: 'relative',
                    width: impacts[1].width,
                    height: impacts[1].height,
                    backgroundColor: impacts[1].backgroundColor,
                    color: impacts[1].color,
                    padding: 15,
                }}>{impacts[1].description}</div>
                <div style={{
                    position: 'relative',
                    width: impacts[2].width,
                    height: impacts[2].height,
                    backgroundColor: impacts[2].backgroundColor,
                    color: impacts[2].color,
                    padding: 15,
                }}>{impacts[2].description}</div>
            </div>
            <ReactFlow
                elements={elements}
                onElementsRemove={onElementsRemove}
                onConnect={onConnect}
                connectionLineComponent={SignedEdge}
                onLoad={setRfInstance}
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
                snapToGrid={true}
                snapGrid={[15, 15]}
                onDrop={onDrop}
                onDragOver={onDragOver}
            >
                <Controls />
                {/* <Background gap={16} /> */}
            </ReactFlow>
            <Toobar onSave={onSave} onRestore={onRestore} handleOpenImpactsChange={handleOpenImpactsChange} />
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
                        {((currentNode?.type != 'TextNode') && !addLine && !impactsChange) ? <FormControl component="fieldset">
                                <RadioGroup aria-label="donationType" name="donationType1" style={{ display: 'flex', flexDirection: 'row' }}>
                                    <FormControlLabel value="0" onChange={ event => setNewItem(false) } checked={!newItem} control={<Radio />} label="Selecionar" />
                                    <FormControlLabel value="1" onChange={ event => setNewItem(true) } checked={newItem} control={<Radio />} label="Adicionar" />
                                </RadioGroup>
                            </FormControl> : <></>
                        }
                        {((currentNode?.type == 'ACRNode') && !addLine && !impactsChange) ? <FormControl component="fieldset">
                                <RadioGroup aria-label="donationType" name="donationType1" style={{ display: 'flex', flexDirection: 'row' }}>
                                    <FormControlLabel value="ux" onChange={ event => setCriteriaType(true) } checked={criteriaType} control={<Radio />} label="UX" />
                                    <FormControlLabel value="iso" onChange={ event => setCriteriaType(false) } checked={!criteriaType} control={<Radio />} label="ISO" />
                                </RadioGroup>
                            </FormControl> : <></>
                        }
                        { (!addLine && !impactsChange) ? switchForm() : <></> }
                        {(addLine && !impactsChange) ? <SelectSignal handleSelectItem={handleSignedLine} /> : <></>}
                        { impactsChange ? <div>
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="impacts" name="impacts" style={{ display: 'flex', flexDirection: 'row' }}>
                                    <FormControlLabel value="0" onChange={ event => setImpatcSelected(0) } checked={(impatcSelected == 0)} control={<Radio />} label="Impact 1" />
                                    <FormControlLabel value="1" onChange={ event => setImpatcSelected(1) } checked={(impatcSelected == 1)} control={<Radio />} label="Impact 2" />
                                    <FormControlLabel value="2" onChange={ event => setImpatcSelected(2) } checked={(impatcSelected == 2)} control={<Radio />} label="Impact 3" />
                                </RadioGroup>
                            </FormControl>
                            <ImpactsForm 
                                impact={impacts[impatcSelected]} 
                                handleImpactsChange={handleImpactsChange} 
                                handleCloseImpactChanges={handleCloseImpactChanges} />
                        </div> : <></> }
                    </div>
                </Fade>
            </Modal>
        </div>
    );
};

export default SaveRestore;