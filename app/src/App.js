import React from 'react'
import { css } from 'emotion'
import { MediaVideo } from './Video'
import { useLiveVideoStream } from './useLiveVideoStream'

const videoStyle = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 1280,
  height: 720,
  backgroundColor: '#324357',
  borderRadius: 4,
  marginBottom: 8,
})
const buttonStyle = css({
  padding: '8px 16px',
  fontSize: 24,
  color: '#e5eff6',
  backgroundColor: '#275DAD',
  border: 'none',
  outline: 'none',
  borderRadius: 4,
  fontWeight: 'bold',
  transition: 'background-color .2s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#073D8D',
  },
})

const NoCall = ({ children }) => (
  <div className={videoStyle}>
    <p
      className={css({
        color: '#e5eff6',
        fontSize: 32,
        fontFamily: 'sans-serif',
      })}>
      {children}
    </p>
  </div>
)
const App = props => {
  const {
    remoteMediaStream,
    call,
    isCallPending,
    isCalling,
  } = useLiveVideoStream()
  return (
    <div
      className={css({
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      })}>
      {!isCallPending && !isCalling && (
        <NoCall>Press "Call" to start a video call with yourself!</NoCall>
      )}
      {isCallPending && !isCalling && (
        <NoCall>Establishing connection with yourself...</NoCall>
      )}
      {isCalling && (
        <MediaVideo
          video={remoteMediaStream}
          className={videoStyle}
          style={{ transform: 'scaleX(-1)' }}
        />
      )}
      <button onClick={call} className={buttonStyle}>
        call
      </button>
    </div>
  )
}

export default App
