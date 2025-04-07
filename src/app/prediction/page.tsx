"use client";
import * as React from "react";
import StakerLines from "@/components/prediction/StakerLines";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const predictionPage = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <StakerLines/>
    </DndProvider>
  );
};

export default predictionPage;
