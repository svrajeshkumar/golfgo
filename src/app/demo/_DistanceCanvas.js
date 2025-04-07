"use client";
import { useState, useEffect, useRef } from "react";
import { Stage, Layer, Circle, Line, Text } from "react-konva";

const DistanceCanvas = () => {
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [distances, setDistances] = useState([]);
  const divRef = useRef(null);
  const [stateDimensions, setStageDimensions] = useState({
    height: 0,
    width: 0,
  });

  // Calculate distance between two points
  const calculateDistance = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Update distances when points change
  useEffect(() => {
    if (points.length < 2) return;

    const newDistances = [];
    for (let i = 0; i < points.length - 1; i++) {
      const dist = calculateDistance(points[i], points[i + 1]);
      newDistances.push({
        from: i,
        to: i + 1,
        distance: dist.toFixed(2),
      });
    }
    setDistances(newDistances);
  }, [points]);

  // Handle canvas click to add new points
  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      setPoints([
        ...points,
        {
          x: pointerPosition.x,
          y: pointerPosition.y,
          id: Date.now(),
        },
      ]);
    }
  };

  // Handle drag movement of points
  const handleDragMove = (e, index) => {
    const newPoints = [...points];
    newPoints[index] = {
      ...newPoints[index],
      x: e.target.x(),
      y: e.target.y(),
    };
    setPoints(newPoints);
  };

  useEffect(() => {
    if (divRef?.current) {
      setStageDimensions({
        height: divRef?.current?.clientHeight,
        width: divRef?.current?.clientWidth,
      });
      setPoints([
        {
          x: 200.0,
          y: 800.0,
          id: Date.now(),
        },
        {
          x: 170.0,
          y: 450.0,
          id: Date.now(),
        },
        {
          x: 215.0,
          y: 100.0,
          id: Date.now(),
        },
        // {
        //   x: 300.0,
        //   y: 400.0,
        //   id: Date.now(),
        // },
        // {
        //   x: 400.0,
        //   y: 700.0,
        //   id: Date.now(),
        // },
      ]);
    }
  }, [divRef]);

  return (
    <div
      ref={divRef}
      style={{
        width: "100%",
        height: "100dvh",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundImage:
          "url(https://s3-alpha-sig.figma.com/img/6eb0/0430/381f745255ba91ad7852dc7802a6995f?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=pyEsl3ZQv~~HJGvc-d-Y0lLw5wAnDa3yYvdX83UMDaT4XbBA60XauFZYNS38msWYCf~GDkkhSVg59c7QXDougLZ5ZNNbfB50v0WIrHdgU~1qHEFfRH9QH5-b8Qn2VBnjOU9Y6rRv09Nj8D9R7~zU67wIOOjich2SRQZaujGGSRxQgWybQdqKnxma5pWZ~b028CwKbPMgF6YW8Lm2qFWp1C~IJXaA5dZWlSHmRVbptfzSXZz16QrhlGKf93~fufhY~JqvyBHusmQ-Mp8M6XmDw7N2Zdo6MRIPwiwp7WBAV9em7BbnXB8bkPnVL9h4JwXrAIinRyXJABJtOOJxDMHVfg__)",
      }}
    >
      <Stage
        width={stateDimensions?.width}
        height={stateDimensions?.height}
        // onClick={handleCanvasClick}
        style={{
          border: "1px solid #ccc",
        }}
      >
        <Layer>
          {/* Draw lines between points */}
          {points.length > 1 &&
            points.map((point, i) => {
              if (i < points.length - 1) {
                return (
                  <Line
                    key={`line-${i}`}
                    points={[
                      point.x,
                      point.y,
                      points[i + 1].x,
                      points[i + 1].y,
                    ]}
                    stroke="#333"
                    strokeWidth={2}
                  />
                );
              }
              return null;
            })}

          {/* Draw points */}
          {points.map((point, i) => (
            <Circle
              key={point.id}
              x={point.x}
              y={point.y}
              radius={5}
              fill={i === 0 ? "#e74c3c" : i === 2 ? "#27ae60" : "#3498db"}
              stroke="#2980b9"
              strokeWidth={2}
              draggable
              onClick={(e) => {
                alert("Clicked Pointer");
              }}
              onDragMove={(e) => handleDragMove(e, i)}
              onMouseEnter={(e) => {
                e.target.scale({ x: 1.2, y: 1.2 });
                document.body.style.cursor = "pointer";
              }}
              onMouseLeave={(e) => {
                e.target.scale({ x: 1, y: 1 });
                document.body.style.cursor = "default";
              }}
            />
          ))}

          {/* Display distances */}
          {distances.map((dist, i) => {
            const p1 = points[dist.from];
            const p2 = points[dist.to];
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            return (
              <Text
                key={`dist-${i}`}
                x={midX}
                y={midY}
                text={`${dist.distance}Yards`}
                fontSize={16}
                fill="#e67e22"
                offset={{ x: 0, y: -10 }}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default DistanceCanvas;
