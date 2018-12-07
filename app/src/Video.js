import React, { useEffect, useRef } from 'react'

const MediaVideo = ({ video, ...props }) => {
  const vidElement = useRef(null)
  useEffect(
    () => {
      if (vidElement.current) vidElement.current.srcObject = video
    },
    [vidElement.current],
  )
  return <video ref={vidElement} autoPlay playsInline {...props} />
}

export { MediaVideo }
