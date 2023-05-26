import { useEffect, useRef, useState } from "react";
import InfiniteViewer from "react-infinite-viewer";
import Moveable from "react-moveable";
import board from "../public/board.json";
// import board from "../public/board_clip.json";
import './App.css';
import Alignment from "./Editor/Alignment";
import KeyManager from "./Editor/KeyManager/keyManager";
import Layers from "./Editor/Layers";
import SelectControl from "./Editor/SelectControl";

function App() {
    const [targets, setTargets] = useState<(HTMLElement | SVGElement)[]>([]);
    const moveableRef = useRef<Moveable>(null);
    const selectoRef = useRef<any>(null);
    const viewerRef = useRef<InfiniteViewer>(null);
    const keyManager = new KeyManager();
    let cubes: any = board.items;

    useEffect(() => {
        if (moveableRef.current) {
            keyManager.keydown(["left"], (e) => {
                moveableRef.current?.request("draggable", { deltaX: -1, deltaY: 0 }, true);
                e.inputEvent.preventDefault();
            }, "Move Left");
            keyManager.keydown(["shift", "left"], (e) => {
                moveableRef.current?.request("draggable", { deltaX: -10, deltaY: 0 }, true);
                e.inputEvent.preventDefault();
            }, "Move Left");
            keyManager.keydown(["right"], (e) => {
                moveableRef.current?.request("draggable", { deltaX: 1, deltaY: 0 }, true);
                e.inputEvent.preventDefault();
            }, "Move Right");
            keyManager.keydown(["shift", "right"], (e) => {
                moveableRef.current?.request("draggable", { deltaX: 10, deltaY: 0 }, true);
                e.inputEvent.preventDefault();
            }, "Move Right");
            keyManager.keydown(["up"], (e) => {
                moveableRef.current?.request("draggable", { deltaX: 0, deltaY: -1 }, true);
                e.inputEvent.preventDefault();
            }, "Move Right");
            keyManager.keydown(["shift", "up"], (e) => {
                moveableRef.current?.request("draggable", { deltaX: 0, deltaY: -10 }, true);
                e.inputEvent.preventDefault();
            }, "Move Right");
            keyManager.keydown(["down"], (e) => {
                moveableRef.current?.request("draggable", { deltaX: 0, deltaY: 1 }, true);
                e.inputEvent.preventDefault();
            });
            keyManager.keydown(["shift", "down"], (e) => {
                moveableRef.current?.request("draggable", { deltaX: 0, deltaY: 10 }, true);
                e.inputEvent.preventDefault();
            });
        }
    }, [moveableRef.current]);
    // useEffect(() => {
    //     setTimeout(() => {
    //         viewerRef.current!.scrollCenter();
    //     }, 100);
    // }, []);
    return <div className="moveable app">
        <div className="container">
            <Alignment moveableRef={moveableRef} />
            <Moveable
                ref={moveableRef}
                // origin={false}
                originDraggable={true}
                draggable={true}
                resizable={true}
                scalable={true}
                // clippable={true}
                rotatable={true}
                warpable={true}
                pinchable={true}
                snappable={true}
                snapDirections={{ "top": true, "left": true, "bottom": true, "right": true }}
                snapThreshold={5}
                verticalGuidelines={[50, 150, 250, 450, 550]}
                horizontalGuidelines={[0, 100, 200, 400, 500]}
                target={targets}
                onClickGroup={e => {
                    selectoRef.current.clickTarget(e.inputEvent, e.inputTarget);
                }}
                onDragStart={({ set }) => {
                    set([0, 0]);
                }}
                onDrag={e => {
                    e.target.style.transform = e.transform;
                }}
                onDragOrigin={e => {
                    e.target.style.transformOrigin = e.transformOrigin;
                    e.target.style.transform = e.drag.transform;
                }}
                onDragEnd={(e) => { // single
                    if (e.lastEvent) {
                        let { target, top, left, width, height, transform } = e.lastEvent; // board 기준 left, top, width , height
                        transform = transform.replace(/translate\([^)]+\)/, '').trim();
                        target.style.transform = transform || 'none';
                        let rect = { top, left, bottom: top + height, right: left + width, width, height };
                        target.style.top = top + "px";
                        target.style.left = left + "px";
                    }
                }}
                onRender={e => {
                    e.target.style.cssText += e.cssText;
                }}
                onResizeStart={({ setOrigin, dragStart }) => {
                    setOrigin(["%", "%"]);
                    dragStart && dragStart.set([0, 0]);
                }}
                onResize={e => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;
                    e.target.style.transform = e.drag.transform;
                }}
                onResizeEnd={e => {
                    if (e.lastEvent) {
                        let { width, height, drag } = e.lastEvent;
                        let { left, top } = drag;
                        left = Math.round(left), top = Math.round(top);
                        width = Math.round(width), height = Math.round(height);
                        let rect = {
                            top, left, bottom: top + height, right: left + width, width, height,
                        };
                        // transform = transform.replace(/translate\([^)]+\)/, '').trim();
                        // target.style.transform = buildTransform(item?.rotate, item?.scale);
                    }
                }}
                onRotate={e => {
                    e.target.style.transform = e.drag.transform;
                }}
                onRotateEnd={e => {
                    if (e.lastEvent) {
                        let { target } = e.lastEvent;
                        const rotate = Math.round(e.lastEvent.rotate) % 360;
                        // execute((draft) => { draft.rotate = Math.round(lastEvent.rotate) % 360; }, true);
                        // const currentTransform = target.style.transform.replace(/rotate\(.*?\)/g);
                        // target.style.transform = currentTransform + 'rotate(' + rotate + 'deg)';
                    }
                }}
                onWarp={e => {
                    e.target.style.transform = e.transform;
                }}
                onClip={e => {
                    e.target.style.clipPath = e.clipStyle;
                }}
                onDragGroup={({ events }) => {
                    events.forEach(ev => {
                        ev.target.style.transform = ev.transform;
                    });
                }}
                onResizeGroupStart={({ setMin, setMax }) => {
                    setMin([0, 0]);
                    setMax([0, 0]);
                }}
                onResizeGroup={({ events }) => {
                    events.forEach(ev => {
                        ev.target.style.width = `${ev.width}px`;
                        ev.target.style.height = `${ev.height}px`;
                        ev.target.style.transform = ev.drag.transform;
                    });
                }}
                onRotateGroup={({ events }) => {
                    events.forEach(ev => {
                        ev.target.style.transform = ev.drag.transform;
                    });
                }}
                onScroll={({ direction }) => {
                    console.log(direction);
                    viewerRef.current!.scrollBy(direction[0] * 10, direction[1] * 10);
                }}
            />
            <SelectControl viewerRef={viewerRef} selectoRef={selectoRef} moveableRef={moveableRef} targets={targets} setTargets={setTargets} />
            <InfiniteViewer zoomBy={0.5} className="elements infinite-viewer" ref={viewerRef} onScroll={() => {
                if (moveableRef.current) {
                    moveableRef.current.updateRect();
                }
                selectoRef.current!.checkScroll();
            }}
            >
                <Layers items={cubes} />
            </InfiniteViewer>
            <div className="empty elements"></div>
        </div>
    </div>;
};

export default App;
