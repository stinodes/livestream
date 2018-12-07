import { useEffect, useState } from 'react'

export const useLiveVideoStream = () => {
  const constraints = {
    video: {
      width: 1280,
      height: 720,
    },
  }
  const [isCallPending, setCallPending] = useState(false)
  const [isCalling, setCalling] = useState(false)
  const [localMediaStream, setLocalMediaStream] = useState()
  const [remoteMediaStream, setRemoteMediaStream] = useState()

  const [localConnection] = useState(new RTCPeerConnection(null))
  const [remoteConnection, setRemoteConnection] = useState(null)

  const useSetupConnection = (connection, isRemote) =>
    useEffect(
      () => {
        console.log('setting up', connection)
        if (!connection) return

        const handleConnection = async event => {
          const connection = event.target
          const candidate = event.candidate
          if (candidate) {
            const otherConnection =
              connection === remoteConnection
                ? localConnection
                : remoteConnection
            console.log('other connection', otherConnection)
            if (!otherConnection) return
            await otherConnection.addIceCandidate(
              new RTCIceCandidate(candidate),
            )
            console.log('success!')
          }
        }

        const handleTrack = event => {
          console.log('got track')
          setRemoteMediaStream(event.streams[0])
        }

        connection.addEventListener('icecandidate', handleConnection)

        if (isRemote) connection.addEventListener('track', handleTrack)

        return () => {
          connection.removeEventListener('icecandidate', handleConnection)
          connection.removeEventListener('track', handleTrack)
        }
      },
      [connection],
    )

  const useEstablishCall = (localConnection, remoteConnection) => {
    const doExchange = async (localConnection, remoteConnection) => {
      console.log('doing exchange')

      const offerDescription = await localConnection.createOffer({
        offerToReceiveVideo: 1,
      })
      await Promise.all([
        localConnection.setLocalDescription(offerDescription),
        remoteConnection.setRemoteDescription(offerDescription),
      ])

      const answerDescription = await remoteConnection.createAnswer()
      Promise.all([
        remoteConnection.setLocalDescription(answerDescription),
        localConnection.setRemoteDescription(answerDescription),
      ])
      console.log('exchange done', offerDescription, answerDescription)
    }

    const startCallStream = async (localConnection, remoteConnection) => {
      setCallPending(true)
      const webcamStream = await navigator.mediaDevices.getUserMedia(
        constraints,
      )
      setLocalMediaStream(webcamStream)

      if (webcamStream && localConnection) {
        webcamStream
          .getTracks()
          .forEach(track => localConnection.addTrack(track))
        console.log('added tracks')
        await doExchange(localConnection, remoteConnection)
      }
      setCalling(true)
      setCallPending(false)
    }

    useEffect(
      () => {
        console.log(
          'exchange between connections:',
          localConnection,
          remoteConnection,
        )
        if (localConnection && remoteConnection)
          startCallStream(localConnection, remoteConnection)
      },
      [localConnection, remoteConnection],
    )
  }

  useSetupConnection(localConnection)
  useSetupConnection(remoteConnection, true)
  useEstablishCall(localConnection, remoteConnection)

  const call = async () => {
    setRemoteConnection(new RTCPeerConnection(null))
  }

  return { localMediaStream, remoteMediaStream, call, isCalling, isCallPending }
}
