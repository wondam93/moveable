
function Layers({ items }: { items: any; }) {
    return <div className="viewport selecto-area" id="selecto1">
        {items.length > 0 && items.map((item: any, idx: number) => {
            if (item.layerType === "background") {
                const { width, height, left, top } = item.rect;
                const { bgColor } = item.source;
                return <div className="cube" key={idx} style={{ width, height, left, top, backgroundColor: bgColor }} data-id={idx} />;
            } else if (item.layerType === "image") {
                const { width, height, left, top } = item.rect;
                return <img className="cube" key={idx} src={`https://vcatdev.com/${item.source.fileInfo.path}`} style={{ width, height, left, top }} data-id={idx} />;
            } else if (item.layerType === "fixed") {
                return <div className="cube" key={idx} data-id={idx} />;
            } else if (item.layerType === "text") {
                const { width, height, left, top } = item.rect;
                const { textAlign, color, fontSize, letterSpacing, lineHeight, text } = item.source;
                return <div className="cube" key={idx} style={{ width, height, left, top }} data-id={idx}>
                    <p style={{ textAlign }}> <span style={{ color, fontSize, letterSpacing, lineHeight }}>{`${text}`}</span> </p>
                </div>;
            } else if (item.layerType === "logo") {
                const { width, height, left, top } = item.rect;
                return <img className="cube" key={idx} src={`https://vcatdev.com/${item.source.fileInfo.path}`} style={{ width, height, left, top }} data-id={idx} />;
            } else if (item.layerType === "clip") {
                const { clipPath } = item.source;
                return <div style={{ clipPath, position: "absolute", top: 0, bottom: 0, left: 0, right: 0, background: "yellow" }} className="cube">
                    {item.children[0].layerType === "image" &&
                        <img className="cube" key={idx} src={`https://vcatdev.com/${item.children[0].source.fileInfo.path}`} style={{ width: item.children[0].rect.width, height: item.children[0].rect.height, left: item.children[0].rect.left, top: item.children[0].rect.top }} data-id={idx} />}
                </div >;
            }
        })}
    </div>;
};

export default Layers;
