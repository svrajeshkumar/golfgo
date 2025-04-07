'use client'
import React from 'react'
import DistanceCanvas from './_DistanceCanvas'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const DemoPage = () => {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <DistanceCanvas />
      </DndProvider>
    </div>
  )
}

export default DemoPage