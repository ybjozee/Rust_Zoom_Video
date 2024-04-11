import ZoomVideo from "@zoom/videosdk";
import { useEffect, useState } from "react";

const useZoom = (
  selfContainerID,
  otherParticipantsCanvasID,
  showVideo,
  isMuted
) => {
  const [stream, setStream] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (stream) {
      if (showVideo) {
        stream.startVideo({
          videoElement: document.getElementById(selfContainerID),
        });
      } else {
        stream.stopVideo();
      }
    }
  }, [showVideo, stream]);

  useEffect(() => {
    if (stream) {
      if (!isMuted) {
        stream.startAudio();
      } else {
        stream.muteAudio();
      }
    }
  }, [stream, isMuted]);

  useEffect(() => {
    if (participants.length > 0) {
      participants.forEach((participant) => {
        if (participant.bVideoOn) {
          const coordinates = { x: 0, y: 0 };
          renderParticipant(participant, coordinates);
        } else {
          stream.stopRenderVideo(
            document.getElementById(otherParticipantsCanvasID),
            participant.userId
          );
        }
      });
    }
  }, [participants, stream]);

  const renderParticipant = (participant, coordinates) => {
    stream.renderVideo(
      document.getElementById(otherParticipantsCanvasID),
      participant.userId,
      240,
      135,
      coordinates.x,
      coordinates.y,
      2
    );
  };

  const filterParticipants = (participants) =>
    participants.filter(({ userId }) => userId !== currentUserId);

  const join = async (token, roomName, userIdentity) => {
    const client = ZoomVideo.createClient();
    await client.init("en-US", "Global", { patchJsMedia: true });
    await client.join(roomName, token, userIdentity);

    setStream(client.getMediaStream());
    setCurrentUserId(client.getCurrentUserInfo().userId);
    setParticipants(filterParticipants(client.getAllUser()));

    client.on("peer-video-state-change", () => {
      setParticipants(filterParticipants(client.getAllUser()));
    });
  };

  const leave = async () => {
    if (stream) {
      stream.stopVideo();
      stream.stopAudio();
    }
    await ZoomVideo.createClient().leave();
  };

  return [join, leave];
};

export default useZoom;
