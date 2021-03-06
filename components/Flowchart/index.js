import React, { useState, useEffect, useCallback, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ReactFlow, {
  removeElements,
  addEdge,
  useZoomPanHelper,
  Controls,
} from 'react-flow-renderer';
import { FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
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
import ACRSelectForm from '../ACRSelectForm';
import SelectSignal from '../SelectSignal';
import SiEdge from './Edges/SiEdge';
import AcrEdge from './Edges/ACREdge';
import SignedEdge from './Edges/SignedEdge';
import ImpactsForm from '../ImpactsForm';
import SystemView from '../SystemView';
import ActorView from '../ActorView';
import VerticeView from '../VerticeView';
import { MarkerDefinition } from '../MarkerDefinition';
import { toast } from 'react-toastify';
import Help from '../Help';

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

const SaveRestore = ({ _project, systems, actors, vertices, criteriaUX, criteriaISO }) => {
    const classes = useStyles();
    const [project, setProject ] = useState(_project);
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

    const [viewingItem, setViewingItem] = useState(false);

    const [impactsChange, setImpactsChange] = useState(false);
    const [help, setHelp] = useState(false);

    const handleOpenHelp = () => {
        setHelp(true);
    }

    const handleCloseHelp = () => {
        setHelp(false);
    }

    const descriptionElementRef = React.useRef(null);

    const notify = () => {
        toast.success('Flow saved!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

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
            description: 'Structural'
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
            description: 'Immediate'
        }
    ]);

    const handleCloseImpactChanges = () => {
        handleCloseModal();
        setImpactsChange(false);
    }

    const handleImpactsChange = async (field, value) => {
        let impactList = [...impacts];
        impactList[impatcSelected][field] = value;
        await setImpacts([...impactList]);
    }

    const handleViewItem = (node) => {
        currentNode = node;
        handleOpenModal();
        setViewingItem(true);
    }

    const handleCloseViewItem = () => {
        handleCloseModal();
    }

    const handleUpdateSystem = (system) => {
        let systems = projectSystems.map(item => {
            if (system.pk == item.id) {
                return system;
            } else {
                return item;
            }
        });

        setProjectSystems(systems);
        
        currentNode.data = {
            title: `${system.nome}`,
            item: system,
            handleViewItem: handleViewItem,
        };

        setElements((els) => {
            return els.map(el => {
                if ((el.id == currentNode.id)) {
                    currentNode['position'] = el.position;
                    return currentNode;
                } else {
                    return el;
                }
            })
        });

        onSave();
    }

    const handleUpdateActor = (actor) => {
        let actors = projectActors.map(item => {
            if (actor.pk == item.id) {
                return actor;
            } else {
                return item;
            }
        });

        setProjectActors(actors);
        
        currentNode.data = {
            title: `${actor.nome}`,
            item: actor,
            handleViewItem: handleViewItem,
        };

        setElements((els) => {
            return els.map(el => {
                if ((el.id == currentNode.id)) {
                    currentNode['position'] = el.position;
                    return currentNode;
                } else {
                    return el;
                }
            })
        });

        onSave();
    }

    const handleUpdateVertice = (vertice) => {
        let vertices = projectVertices.map(item => {
            if (vertice.pk == item.id) {
                return vertice;
            } else {
                return item;
            }
        });

        setProjectVertices(vertices);
        
        currentNode.data = {
            title: `${vertice.descricao}`,
            item: vertice,
            handleViewItem: handleViewItem,
        };

        setElements((els) => {
            return els.map(el => {
                if ((el.id == currentNode.id)) {
                    currentNode['position'] = el.position;
                    return currentNode;
                } else {
                    return el;
                }
            })
        });

        onSave();
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

        if (viewingItem) {
            setViewingItem(false);
        }

        if (help) {
            setHelp(false);
        }
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
                        item: system,
                        handleViewItem: handleViewItem,
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
                        item: actor,
                        handleViewItem: handleViewItem,
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
                        item: vertice,
                        handleViewItem: handleViewItem,
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
                        title: `${criteria.indicador}`,
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

    const onSave = useCallback(async () => {
        if (rfInstance) {
            const flow = await rfInstance.toObject();

            setTimeout(() => {

                // submit to the server
                const requestOptions = {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({diagram: {
                    'flow': flow,
                    'nodesId': id,
                    'impacts': impacts,
                  }}),
                };
          
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos/${project.pk}/`, requestOptions)
                  .then((response) => response.json())
                  .then((data) => {
                    setProject(data);
                    notify();
                  });
              }, 1000);
        }
    }, [project, rfInstance, impacts]);

    const onRestore = useCallback(() => {
        const handleViewItem = (node) => {
            currentNode = node;
            handleOpenModal();
            setViewingItem(true);
        }

        const restoreFlow = async () => {
            if (project.diagram) {
                const flow = await project.diagram.flow;
                id = await project.diagram.nodesId;
                setImpacts(project.diagram.impacts)

                const elements = await flow.elements.map(element => {
                    if ((element.type == 'SiNode') || (element.type == 'ActorNode') || (element.type == 'VRNode')) {
                        element.data.handleViewItem = handleViewItem;
                    }

                    return element;
                });

                if (flow) {
                    const [x = 0, y = 0] = flow.position;
                    setElements(elements || []);
                    transform({ x, y, zoom: flow.zoom || 0 });
                }
            }
        };

        restoreFlow();
    }, [ project, setElements, transform]);

    const switchModalTitle = () => {
        const type = currentNode?.type;

        switch(type) {
            case 'SiNode':
                if (viewingItem) {
                    return <h2>Manage Information System Properties</h2>
                } else {
                    return <h2>Manage Information System</h2>;
                }
            case 'ActorNode':
                if (viewingItem) {
                    return <h2>Manage Actor Properties</h2>
                } else {
                    return <h2>Manage Actor</h2>;
                }
            case 'VRNode':
                if (viewingItem) {
                    return <h2>Manage Responsibility Vertex Properties</h2>
                } else {
                    return <h2>Manage Responsibility Vertex</h2>;
                }
            case 'TextNode':
                return <h2>Manage Text</h2>;
            case 'ACRNode':
                return <h2>Manage Accountability Criteria</h2>;
            default:
                return <></>;
        }
    }

    const switchNodeForm = () => {
        const type = currentNode?.type;

        switch(type) {
            case 'SiNode':
                return (
                    newItem ? <SIForm key='systemForm' projeto={project.pk} handleNewSystem={handleNewSystem} /> 
                    : <SelectForm 
                        options={ projectSystems.map(system => {
                            return {name: system?.nome, value: system.pk};
                        }) } 
                        type={type} 
                        handleSelectItem={handleSelectItem} 
                        handleCloseModal={handleCloseModal} />
                );
            case 'ActorNode':
                return (
                    newItem ? <ActorForm key='actorForm' projeto={project.pk} handleNewActor={handleNewActor} />
                    : <SelectForm 
                        options={ projectActors.map(actor => {
                            return {name: actor?.nome, value: actor.pk};
                        }) } 
                        type={type} 
                        handleSelectItem={handleSelectItem}
                        handleCloseModal={handleCloseModal} />
                );
            case 'VRNode':
                return (
                    newItem ? <VRForm key='vrForm' projeto={project.pk} handleNewVR={handleNewVR} />
                    : <SelectForm options={ projectVertices.map(vertice => {
                        return {name: vertice?.descricao, value: vertice.pk};
                    }) } type={type} handleSelectItem={handleSelectItem} handleCloseModal={handleCloseModal} />
                );
            case 'TextNode':
                return (
                    <TextForm handleNewText={handleNewText} handleCloseModal={handleCloseModal} />
                );
            case 'ACRNode':
                return (
                    newItem ? 
                        (criteriaType 
                            ? <ACRForm key='ux' criteriaType={criteriaType} handleNewCriteria={handleNewCriteria} />
                            : <ACRForm key='iso' criteriaType={criteriaType} handleNewCriteria={handleNewCriteria} />)
                    : (
                        criteriaType ? 
                            <ACRSelectForm 
                                key='selectUX' 
                                options={ criteriaux.map(criteria => {
                                    return {
                                        name: criteria?.indicador, 
                                        value: criteria.pk,
                                        criterio_accountability: criteria.criterio_accountability,
                                        description: criteria.descricao
                                    };
                                }) } 
                                type={type} 
                                handleSelectItem={handleSelectItem} 
                                handleCloseModal={handleCloseModal} />
                        : <ACRSelectForm 
                            key='selectISO' 
                            options={ criteriaiso.map(criteria => {
                                return {
                                    name: criteria?.indicador, 
                                    value: criteria.pk, 
                                    criterio_accountability: criteria.criterio_accountability,
                                    description: criteria.descricao
                                };
                            }) } 
                            type={type} 
                            handleSelectItem={handleSelectItem} 
                            handleCloseModal={handleCloseModal} />
                    )
                );
            default:
                return <></>;
        }
    }

    const switchItemView = () => {
        switch (currentNode.type) {
            case 'SiNode':
                return (
                    <SystemView 
                        _system={currentNode?.data?.item}
                        handleUpdateSystem={handleUpdateSystem}
                        handleCloseView={handleCloseViewItem} />
                );
                break;
            case 'ActorNode':
                return (
                    <ActorView 
                        _actor={currentNode?.data?.item}
                        handleUpdateActor={handleUpdateActor}
                        handleCloseView={handleCloseViewItem} />
                );
                break;
            case 'VRNode':
                return (
                    <VerticeView 
                        _vertice={currentNode?.data?.item}
                        handleUpdateVertice={handleUpdateVertice}
                        handleCloseView={handleCloseViewItem} />
                );
                break;
        
            default:
                break;
        }
    }

    useEffect(() => {
        onRestore();
        if (help) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
              descriptionElement.focus();
            }
          }
    }, [help, onRestore]);

    return (
        <div style={{ width: '100%', height: '100%', background: 'transparent' }} ref={reactFlowWrapper}>
            <div style={{
                maxWidth: '100%',
                width: '100%', 
                height: '100%',
                position: 'absolute',
                left: 0,
                top: 140,
                zIndex: -1
            }}>
                <div style={{
                    position: 'relative',
                    maxWidth: '100%',
                    width: impacts[0].width,
                    height: impacts[0].height,
                    backgroundColor: impacts[0].backgroundColor,
                    color: impacts[0].color,
                }}><p style={{ padding: 15 }}>{impacts[0].description}</p></div>
                <div style={{
                    position: 'relative',
                    width: impacts[1].width,
                    height: impacts[1].height,
                    backgroundColor: impacts[1].backgroundColor,
                    color: impacts[1].color,
                }}><p style={{ padding: 15 }}>{impacts[1].description}</p></div>
                <div style={{
                    position: 'relative',
                    width: impacts[2].width,
                    height: impacts[2].height,
                    backgroundColor: impacts[2].backgroundColor,
                    color: impacts[2].color,
                }}><p style={{ padding: 15 }}>{impacts[2].description}</p></div>
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
                <MarkerDefinition id="edge-marker-red" color="red" />
                <MarkerDefinition id="edge-marker-blue" color="blue" />
                <MarkerDefinition id="edge-marker-default" color="gray" />
                <Controls />
            </ReactFlow>
            <Toobar
                onSave={onSave} 
                onRestore={onRestore}
                openHelp={handleOpenHelp}
                handleOpenImpactsChange={handleOpenImpactsChange} 
                projectId={project.pk} />
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
                        { viewingItem ? switchModalTitle() : <></> }
                        { (!addLine && !impactsChange && !viewingItem) ? switchModalTitle() : <></> }
                        {((currentNode?.type != 'TextNode') && !addLine && !impactsChange && !viewingItem && !help) ? <FormControl component="fieldset">
                                <RadioGroup aria-label="donationType" name="donationType1" style={{ display: 'flex', flexDirection: 'row' }}>
                                    <FormControlLabel 
                                        value="0" 
                                        onChange={ event => setNewItem(false) } 
                                        checked={!newItem} control={<Radio />} 
                                        label="Select" />
                                    <FormControlLabel 
                                        value="1" 
                                        onChange={ event => setNewItem(true) } 
                                        checked={newItem} 
                                        control={<Radio />} 
                                        label="Add" />
                                </RadioGroup>
                            </FormControl> : <></>
                        }
                        {((currentNode?.type == 'ACRNode') && !addLine && !impactsChange && !viewingItem) ? <FormControl component="fieldset">
                                <RadioGroup aria-label="donationType" name="donationType1" style={{ display: 'flex', flexDirection: 'row' }}>
                                    <FormControlLabel
                                        value="ux"
                                        onChange={ event => setCriteriaType(true) }
                                        checked={criteriaType}
                                        control={<Radio />}
                                        label="UX" />
                                    <FormControlLabel
                                        value="iso"
                                        onChange={ event => setCriteriaType(false) }
                                        checked={!criteriaType}
                                        control={<Radio />}
                                        label="Standard" />
                                </RadioGroup>
                            </FormControl> : <></>
                        }
                        { (!addLine && !impactsChange && !viewingItem) ? switchNodeForm() : <></> }
                        {addLine ? <SelectSignal handleSelectItem={handleSignedLine} /> : <></>}
                        { impactsChange ? <div>
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="impacts" name="impacts" style={{ display: 'flex', flexDirection: 'row' }}>
                                    <FormControlLabel
                                        value="0"
                                        onChange={ event => setImpatcSelected(0) }
                                        checked={(impatcSelected == 0)}
                                        control={<Radio />}
                                        label="Impact 1" />
                                    <FormControlLabel
                                        value="1"
                                        onChange={ event => setImpatcSelected(1) }
                                        checked={(impatcSelected == 1)}
                                        control={<Radio />}
                                        label="Impact 2" />
                                    <FormControlLabel 
                                        value="2"
                                        onChange={ event => setImpatcSelected(2) }
                                        checked={(impatcSelected == 2)}
                                        control={<Radio />}
                                        label="Impact 3" />
                                </RadioGroup>
                            </FormControl>
                            <ImpactsForm 
                                impact={impacts[impatcSelected]} 
                                handleImpactsChange={handleImpactsChange} 
                                handleCloseImpactChanges={handleCloseImpactChanges} />
                        </div> : <></> }
                        { viewingItem ? switchItemView() : <></> }
                    </div>
                </Fade>
            </Modal>

            <Dialog
                open={help}
                onClose={handleCloseHelp}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Help</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <Help />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseHelp} color="primary">
                    Close
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SaveRestore;