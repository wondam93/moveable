import { useEffect, useState } from "react";
import Selecto from "react-selecto";

function SelectControl({ viewerRef, selectoRef, moveableRef, targets, setTargets }: { viewerRef: any, selectoRef: any, moveableRef: any, targets: any, setTargets: any; }) {
    const [scrollOptions, setScrollOptions] = useState<any>({});

    useEffect(() => {
        setScrollOptions({
            container: viewerRef.current?.getElement(),
            getScrollPosition: () => {
                return [
                    viewerRef.current?.getScrollLeft(),
                    viewerRef.current?.getScrollTop(),
                ];
            },
            throttleTime: 0,
            threshold: 0,
        });
        viewerRef.current?.setZoom(0.5);
    }, []);
    return <Selecto
        ref={selectoRef}
        dragContainer={".elements"}
        selectableTargets={[".cube"]}
        hitRate={0}
        selectByClick={true}
        selectFromInside={true}
        toggleContinueSelect={["shift"]}
        ratio={0}
        scrollOptions={scrollOptions}
        onDragStart={e => {
            const moveable = moveableRef.current;
            const target = e.inputEvent.target;
            if (moveable!.isMoveableElement(target) || targets.some(t => t === target || t.contains(target))) {
                e.stop();
            }
        }}
        onSelectEnd={e => {
            const moveable = moveableRef.current;
            setTargets(e.selected);
            if (e.isDragStart) {
                e.inputEvent.preventDefault();
                setTimeout(() => {
                    moveable!.dragStart(e.inputEvent);
                });
            }
        }}
        onScroll={e => {
            viewerRef.current!.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
        }}
    />;
};

export default SelectControl;
