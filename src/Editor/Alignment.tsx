import Moveable from "react-moveable";
import MoveableGroup from "react-moveable/declaration/MoveableGroup";

function Alignment({ moveableRef }: { moveableRef: React.RefObject<Moveable<{}>>; }) {

    const handleAlignmentCenter = (direction: "horizontal" | "vertical") => {
        const moveable = moveableRef.current!;
        if (!moveable.moveable) {
            return;
        }
        const moveables = (moveable.moveable as MoveableGroup).moveables;
        if (moveables) {
            let startElement: HTMLElement | null = null;
            let endElement: HTMLElement | null = null;

            moveables.forEach((moveable) => {
                const element = moveable.state.target! as HTMLElement;
                if (direction === "horizontal") {
                    if (!startElement || element.offsetLeft < startElement.offsetLeft) {
                        startElement = element;
                    }
                    if (!endElement || element.offsetLeft + element.offsetWidth > endElement.offsetLeft + endElement.offsetWidth) {
                        endElement = element;
                    }
                } else {
                    if (!startElement || element.offsetTop < startElement.offsetTop) {
                        startElement = element;
                    }
                    if (!endElement || element.offsetTop + element.offsetHeight > endElement.offsetTop + endElement.offsetHeight) {
                        endElement = element;
                    }
                }
            });

            if (!startElement || !endElement) {
                return;
            }

            const targetPosition = (direction === "horizontal") ? (startElement as HTMLElement).offsetLeft : (startElement as HTMLElement).offsetTop;
            const oppositePosition = (direction === "horizontal")
                ? (endElement as HTMLElement).offsetLeft + (endElement as HTMLElement).offsetWidth
                : (endElement as HTMLElement).offsetTop + (endElement as HTMLElement).offsetHeight;
            const center = (targetPosition + oppositePosition) / 2;
            moveables.forEach((moveable) => {
                const element = moveable.state.target! as HTMLElement;
                const newSize = (direction === "horizontal") ? element.offsetWidth : element.offsetHeight;
                const newPosition = center - newSize / 2;
                if (direction === "horizontal") {
                    element.style.left = `${newPosition}px`;
                } else {
                    element.style.top = `${newPosition}px`;
                }
            });
        } else {
            const boardSize = 1080;
            const element = moveable.moveable.state.target! as HTMLElement;
            if (direction === "horizontal") {
                element.style.left = `${(boardSize - parseFloat(element.style.width)) / 2}px`;
            } else {
                element.style.top = `${(boardSize - parseFloat(element.style.height)) / 2}px`;
            }
        }
        moveable.moveable.updateRect();
    };

    const handleAlignment = (alignment: "left" | "right" | "top" | "bottom") => {
        const moveable = moveableRef.current!;
        if (!moveable.moveable) {
            return;
        }
        const moveables = (moveable.moveable as MoveableGroup).moveables;
        if (moveables) {
            let targetElement: HTMLElement | null = null;
            switch (alignment) {
                case 'left':
                    targetElement = moveables.reduce((leftmostElement: HTMLElement | null, moveable) => {
                        const element = moveable.state.target! as HTMLElement;
                        if (!leftmostElement || element.offsetLeft < leftmostElement.offsetLeft) {
                            return element;
                        }
                        return leftmostElement;
                    }, null);
                    moveables.forEach((moveable) => {
                        const element = moveable.state.target as HTMLElement;
                        if (element !== targetElement) {
                            element.style.left = `${(targetElement as HTMLElement).offsetLeft}px`;
                        }
                    });
                    break;
                case 'right':
                    targetElement = moveables.reduce((rightmostElement: HTMLElement | null, moveable) => {
                        const element = moveable.state.target! as HTMLElement;
                        const elementLeft = element.offsetLeft + element.offsetWidth;
                        if (!rightmostElement || elementLeft > rightmostElement!.offsetLeft + rightmostElement!.offsetWidth) {
                            return element;
                        }
                        return rightmostElement;
                    }, null);
                    moveables.forEach((moveable) => {
                        const element = moveable.state.target as HTMLElement;
                        if (element !== targetElement) {
                            const newLeft = targetElement!.offsetLeft + targetElement!.offsetWidth - element.offsetWidth;
                            element.style.left = `${newLeft}px`;
                        }
                    });
                    break;
                case 'top':
                    targetElement = moveables.reduce((lowestTopElement: HTMLElement | null, moveable) => {
                        const element = moveable.state.target as HTMLElement;
                        if (!lowestTopElement || element.offsetTop < lowestTopElement.offsetTop) {
                            return element;
                        }
                        return lowestTopElement;
                    }, null);
                    moveables.forEach((moveable) => {
                        const element = moveable.state.target as HTMLElement;
                        if (element !== targetElement) {
                            element.style.top = `${targetElement!.offsetTop}px`;
                        }
                    });
                    break;
                case 'bottom':
                    targetElement = moveables.reduce((lowestBottomElement: HTMLElement | null, moveable) => {
                        const element = moveable.state.target! as HTMLElement;
                        const elementBottom = element.offsetTop + element.offsetHeight;
                        if (!lowestBottomElement || elementBottom > lowestBottomElement!.offsetTop + lowestBottomElement!.offsetHeight) {
                            return element;
                        }
                        return lowestBottomElement;
                    }, null);
                    moveables.forEach((moveable) => {
                        const element = moveable.state.target as HTMLElement;
                        if (element !== targetElement) {
                            const newTop = targetElement!.offsetTop + targetElement!.offsetHeight - element.offsetHeight;
                            element.style.top = `${newTop}px`;
                        }
                    });
                    break;
                default:
                    return;
            }
            moveable.updateRect();
        } else {
            const element = moveable.moveable.state.target as HTMLElement;
            switch (alignment) {
                case 'right':
                    element.style.left = `${1080 - parseFloat(element.style.width)}px`;
                    break;
                case 'left':
                    element.style.left = '0px';
                    break;
                case 'top':
                    element.style.top = '0px';
                    break;
                case 'bottom':
                    element.style.top = `${1080 - parseFloat(element.style.height)}px`;
                    break;
                default:
                    return;
            }
            moveable.moveable.updateRect();
        }
    };
    const Alignments = () => {
        return <div>
            <button onClick={() => handleAlignment("right")}>right</button>
            <button onClick={() => handleAlignment("left")}>left</button>
            <button onClick={() => handleAlignmentCenter("vertical")}>v-center</button>
            <button onClick={() => handleAlignmentCenter("horizontal")}>h-center</button>
            <button onClick={() => handleAlignment("top")}>top</button>
            <button onClick={() => handleAlignment("bottom")}>bottom</button>
        </div >;
    };
    return <Alignments />;
};

export default Alignment;
