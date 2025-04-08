"use client";
import { useState, useEffect, useRef } from "react";
import { Stage, Layer, Circle, Line, Text } from "react-konva";
import { Box, styled, Grid2 } from "@mui/material";
import { useSearchParams } from "next/navigation";
import {
  useLazyGetHolesDetailsQuery,
  useGetAiPredictionMutation,
  useSaveGolfSessionMutation,
  useSaveGolfSessionShotMutation,
} from "../../../lib/redux/golfCourseApi/golfCourseApi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { predictedDistance } from "../../../utils/calculations";
import { useForm } from "react-hook-form";

const StyledStakerLinesContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100vh",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 100%",
  position: "relative",
  "& .section-header": {
    position: "absolute",
    width: "100%",
    top: "10px",
  },
  "& .predicted-distance": {
    width: 100,
    position: "absolute",
    padding: 10,
    top: "50%",
    right: 10,
  },
}));

const StakerLines = () => {
  const [holeIndex, setHoleIndex] = useState(0);
  const [points, setPoints] = useState([]);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [_predictedDistance, setPredictedDistance] = useState(null);
  const [confirmedStart, setConfirmedStart] = useState(false);
  const [showShotPopup, setShowShotPopup] = useState(false);
  const [showTeeShotForm, setShowTeeShotForm] = useState(false);
  const searchParam = useSearchParams();
  const latitude = Number(searchParam.get("latitude"));
  const longitude = Number(searchParam.get("longitude"));
  const placeId = searchParam.get("place_Id");
  const club_name = searchParam.get("club_name");
  const { register, handleSubmit } = useForm();

  const [showInfoPopup, setShowInfoPopup] = useState(false);
  // Redux API
  const [saveGolfSessionShot, { isLoading: isLoadingSaveGolfSessionShot }] =
    useSaveGolfSessionShotMutation();
  const [
    getHolesDetails,
    { isLoading: isisLoadingGetHolesDetails, data: dataGetHolesDetails },
  ] = useLazyGetHolesDetailsQuery();

  const [
    saveGolfSession,
    { isLoading: isLoadingSaveGolfSession, data: dataSaveGolfSession },
  ] = useSaveGolfSessionMutation();

  const divRef = useRef(null);
  const stateRef = useRef(null);

  const [distances, setDistances] = useState([]);
  const [getAiPrediction, { data: dataAiPrediction }] =
    useGetAiPredictionMutation();
  const [stateDimensions, setStageDimensions] = useState({
    height: 0,
    width: 0,
  });

  const formatWindDirection = (degree) => {
    if (degree === undefined) return "Unknown";
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  };

  const handleConfirmYes = () => {
    setPoints([
      ...points,
      {
        x: 170.0,
        y: 450.0,
        id: Date.now(),
      },
      {
        x: 200.0,
        y: 70.0,
        id: Date.now(),
      },
    ]);
    setShowConfirmPopup(false);
    setShowConfirmPopup(false);
  };
  const handleShotYes = () => {
    setShowShotPopup(false);
    setTimeout(() => {
      setShowTeeShotForm(true);
    }, 100);
    // Add logic for what happens after confirming the shot
  };
  const handleShotNo = () => {
    setShowShotPopup(false);
  };

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
    if (points.length <= 0) {
      if (e.target === e.currentTarget) {
        setShowConfirmPopup(true);
        const stage = e.target.getStage();
        const pointerPosition = stage.getPointerPosition();
        setPoints([
          {
            x: pointerPosition.x,
            y: pointerPosition.y,
            id: Date.now(),
          },
        ]);
      }
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
    }
  }, [divRef]);

  // Create Golf Session
  useEffect(() => {
    if (placeId) {
      getHolesDetails({
        placeId: placeId,
      });
    }
  }, [placeId]);

  useEffect(() => {
    if (dataGetHolesDetails?.data?.length > 0) {
      const storedUser = localStorage.getItem("user_info");
    const user =storedUser ?JSON.parse(storedUser):null;
    const userId= user?._id;
      const payload = {
        userId:userId,
        golfCourseCoordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        sessionType: "PRACTICE",
        courseName: dataGetHolesDetails?.data[holeIndex]?.clubName,
        par: 72,
        yards: 413,
        placeId: placeId,
        holeId: dataGetHolesDetails?.data[holeIndex]?._id,
      };
      saveGolfSession(payload)
        .then((response) => {})
        .catch((error) => {
          alert("Something went to wrong please try again...");
        });
    }
  }, [dataGetHolesDetails, holeIndex]);

  useEffect(() => {
    if (dataSaveGolfSession?.data) {
      getAiPrediction({
        golfSessionId: dataSaveGolfSession?.data?._id,
      });
    }
  }, [dataSaveGolfSession]);

  const onSubmit = (data) => {
    const payload = {
      shotType: "TEE4", //or TEE1, TEE2, TEE3, APPROACH, CHIP, PUTT
      image: {
        filename: "new.jpg",
        fileKey: "/images/new.jpg",
      },
      clubType: "DRIVER", // OR WOOD, HYBRID, WEDGE , IRON, PUTTER
      distance: Number(data?.distance) || 0,
      proximity: 270,
      notes: data?.notes,
      coordinates: {
        latitude: latitude,
        longitude: longitude,
      },
      startPointCoordinates: {
        x: points[0].x,
        y: points[0].y,
      },
      endPointCoordinates: {
        x: points[1].x,
        y: points[1].y,
      },
      estimatedDistance: 160.21,
      placeId: placeId,
    };
    saveGolfSessionShot({
      sessionId: dataSaveGolfSession?.data?._id,
      payload,
    })
      .then((response) => {
        alert(response?.data.message);
        setShowTeeShotForm(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <StyledStakerLinesContainer
      ref={divRef}
      component="div"
      style={{
        backgroundImage: `url(${dataGetHolesDetails?.data?.[holeIndex]?.holeMapUrl})`,
      }}
    >
      {!showInfoPopup && (
        <Box pl={1} pr={1} component="div" className="section-header z-50">
          <Grid2 container justifyContent="flex-end">
            <Grid2>
              <div
                onClick={() => {
                  setShowInfoPopup(!showInfoPopup);
                }}
                className="flex flex-col items-center justify-center  bg-white border border-gray-400  top-5 right-5 w-[30px] h-[30px]  z-60 rounded-full"
              >
                <IoIosArrowDown size={20} />
              </div>
            </Grid2>
          </Grid2>
        </Box>
      )}
      {showInfoPopup && (
        <Box pl={1} pr={1} component="div" className="section-header z-50">
          <Grid2 container spacing={0.5} alignItems="stretch">
            <Grid2 size={{ xs: 6 }}>
              <div className="bg-black text-white rounded-lg p-3 w-full h-full shadow-lg border border-red-500">
                <h3 className="text-sm font-semibold">
                  {club_name || "Unknown Course"}
                </h3>
              </div>
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <div className="bg-black h-full text-white rounded-lg p-3 w-full shadow-lg flex items-center justify-between border border-blue-500">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Hole</p>
                  <p className="text-lg font-semibold">{holeIndex + 1}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Par</p>
                  <p className="text-lg font-semibold">4</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Yds</p>
                  <p className="text-lg font-semibold">
                    {dataSaveGolfSession?.data?.yards}
                  </p>
                </div>
              </div>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <div className="bg-black relative text-white rounded-lg pb-1 shadow-lg flex-2 border border-green-500">
                <>
                  {isLoadingSaveGolfSession && !dataSaveGolfSession && (
                    <Box p={3}>
                      <p className="text-xl text-start pt-4">Loading...</p>
                    </Box>
                  )}
                  {!isLoadingSaveGolfSession && dataSaveGolfSession && (
                    <div className="flex gap-6">
                      <img src="/images/weather.png" />
                      <p className="text-xl text-start pt-4">
                        Temp:{" "}
                        {dataSaveGolfSession?.data?.weatherData?.apparentTemperature?.toFixed(
                          1
                        )}
                        °F
                      </p>
                    </div>
                  )}
                </>

                <div className="flex gap-5 pl-2 pb-2">
                  <p>
                    <span style={{ color: "#f7d794" }}>W Direction:</span>
                    <span className="bg-gray-700 text-white px-2 py-1 rounded-md">
                      {formatWindDirection(
                        dataSaveGolfSession?.data?.weatherData?.windDirection
                      )}
                    </span>
                  </p>
                  <p>
                    <span style={{ color: "#f7d794" }}>W Speed :</span>
                    <span className="bg-gray-700 text-white px-2 py-1 rounded-md">
                      {dataSaveGolfSession?.data?.weatherData?.windSpeed?.toFixed(
                        1
                      )}
                      mph
                    </span>
                  </p>
                </div>
                {/* {dataAiPrediction?.data?.map((item) => (
                  <div className="px-3">
                    <h1 className="text-2xl pb-1">{item?.heading}</h1>
                    <p>{item?.content}</p>
                  </div>
                ))} */}
                {dataAiPrediction?.data?.map((item, index) => (
                  <div key={index} className="px-3">
                    <h1 className="text-2xl pb-1">{item?.heading}</h1>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: item?.content
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **text** to <strong>text</strong>
                          .replace(/- /g, "<br>• "), // Convert "- " to a new line with a bullet point
                      }}
                    />
                  </div>
                ))}

                <div className="absolute bottom-[-20px] right-0.5">
                  <div
                    className="bg-black"
                    onClick={() => {
                      setShowInfoPopup(!showInfoPopup);
                    }}
                  >
                    <IoIosArrowUp size={20} />
                  </div>
                </div>
              </div>
            </Grid2>
          </Grid2>
        </Box>
      )}

      {_predictedDistance && (
        <Box
          component="div"
          className="predicted-distance bg-white border shadow-xs border-gray-300 rounded z-50"
        >
          <p className="text-xs">Predicted Distance</p>
          <p>{_predictedDistance.toFixed(2)}</p>
        </Box>
      )}
      <Stage
        ref={stateRef}
        width={stateDimensions?.width}
        height={stateDimensions?.height}
        onClick={handleCanvasClick}
        style={{
          border: "1px solid #ccc",
        }}
      >
        <Layer>
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
              onDragEnd={() => {
                setTimeout(() => {
                  setShowShotPopup(true);
                }, 5000);
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
                fill="#ffffff"
                offset={{ x: 0, y: -10 }}
                sceneFunc={(context, shape) => {
                  context.fillStyle = "#34495e";
                  context.fillRect(0, 0, shape.width(), shape.height());
                  shape._sceneFunc(context);
                }}
              />
            );
          })}
        </Layer>
      </Stage>

      {showConfirmPopup && !confirmedStart && (
        <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 w-[70%] max-w-lg bg-black text-white p-4 rounded-lg shadow-lg text-center">
          <p>Confirm marked location as start point?</p>
          <div className="flex justify-center gap-4 mt-2">
            <button
              className="bg-green-500 px-4 py-2 rounded"
              onClick={handleConfirmYes}
            >
              Yes
            </button>
            <button
              className="bg-red-500 px-4 py-2 rounded"
              onClick={() => {
                setPoints([]);
                setShowConfirmPopup(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      )}

      {showShotPopup && (
        <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 w-[70%] max-w-lg bg-black text-white p-4 rounded-lg shadow-lg text-center">
          <p>Have you hit the driver shot?</p>
          <div className="flex justify-center gap-4 mt-2">
            <button
              className="bg-green-500 px-4 py-2 rounded"
              onClick={handleShotYes}
            >
              Yes
            </button>
            <button
              className="bg-red-500 px-4 py-2 rounded"
              onClick={handleShotNo}
            >
              No
            </button>
          </div>
        </div>
      )}
      {showTeeShotForm && (
        <div className="absolute bottom-22 left-1/2 transform -translate-x-1/2 w-[70%] max-w-lg bg-black text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Tee-shot Details</h2>
          <p className="text-sm text-gray-400">
            Tap on the fields to change the value
          </p>

          <input
            {...register("distance")}
            type="text"
            placeholder="Distance (yds)"
            className="w-full bg-gray-800 text-white p-2 rounded mt-3"
          />
          <input
            {...register("clubType")}
            type="text"
            placeholder="Club Used"
            className="w-full bg-gray-800 text-white p-2 rounded mt-3"
          />
          <input
            {...register("wind")}
            type="text"
            placeholder="Wind (MPH)"
            className="w-full bg-gray-800 text-white p-2 rounded mt-3"
          />
          <textarea
            {...register("notes")}
            placeholder="Adjustment Notes"
            className="w-full bg-gray-800 text-white p-2 rounded mt-3 h-20"
          ></textarea>

          <button
            disabled={isLoadingSaveGolfSessionShot}
            className="w-full bg-blue-600 text-white py-2 rounded mt-4"
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </button>
        </div>
      )}
      {/* Club Selection */}
      <div className="absolute bottom-5 right-5 bg-black text-white rounded-2xl p-2 shadow-lg border border-purple-500">
        <p className="text-left text-lg">Select Holes </p>
        <div className="flex mt-2 mb-2">
          <select
            value={holeIndex}
            onChange={(e) => {
              setHoleIndex(Number(e.target.value));
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded-full"
          >
            <option value={0}>hole 1</option>
            <option value={1}>hole 2</option>
            <option value={2}>hole 3</option>
            <option value={3}>hole 4</option>
            <option value={4}>hole 5</option>

          </select>
        </div>
      </div>
    </StyledStakerLinesContainer>
  );
};

export default StakerLines;
