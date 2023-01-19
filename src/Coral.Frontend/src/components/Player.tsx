import { Paper, Slider, Text, UnstyledButton, Image } from "@mantine/core";
import React, { useState } from "react";
import { OpenAPI, TrackDto, TranscodeService } from "../client";
import {
  IconPlayerSkipForward,
  IconPlayerSkipBack,
  IconPlayerPlay,
  IconPlayerPause,
} from "@tabler/icons";
import { StreamDto } from "../client/models/StreamDto";
import styles from "../styles/Player.module.css";
import { formatSecondsToMinutes } from "../utils";
import { PlayerState, usePlayerStore } from "../store";
import { ShakaPlayer, ShakaPlayerRef } from "../components/ShakaPlayer";
type PlayerProps = {
  tracks: TrackDto[];
};

function Player({ tracks }: PlayerProps) {
  const playState = usePlayerStore((state: PlayerState) => state.playState);
  const selectedTrack = usePlayerStore(
    (state: PlayerState) => state.selectedTrack
  );

  const setPlayState = (value: boolean) =>
    usePlayerStore.setState({ playState: value });
  const setSelectedTrack = (track: TrackDto) =>
    usePlayerStore.setState({ selectedTrack: track });

  const [streamTrack, setStreamTrack] = useState({} as StreamDto);
  // const [duration, setDuration] = useState(0);
  const [secondsPlayed, setSecondsPlayed] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(0);

  const updatePositionState = (timestamp?: number) => {
    if (selectedTrack.durationInSeconds == null) {
      return;
    }
    let state = {
      position: timestamp,
      duration: selectedTrack.durationInSeconds,
      playbackRate: 1,
    };
    navigator.mediaSession.setPositionState(state);
  };

  const announceMediaSession = () => {
    if (selectedTrack == null) {
      return;
    }

    if ("mediaSession" in navigator) {
      let metadata = new MediaMetadata({
        title: selectedTrack.title,
        artist: selectedTrack.artist?.name,
        album: selectedTrack.album?.name,
      });

      if (streamTrack.artworkUrl != null) {
        metadata["artwork"] = [
          {
            src: streamTrack.artworkUrl,
          },
        ];
      }

      // make sure we're not re-setting metadata
      // as that can cause the browser player to stop working
      let existingMetadata = navigator.mediaSession.metadata;
      if (
        existingMetadata?.artist == metadata.artist &&
        existingMetadata?.title == metadata.title &&
        existingMetadata.album == metadata.album
      ) {
        return;
      }

      console.info("Annoucing media session for track: ", metadata);
      navigator.mediaSession.metadata = metadata;
      updatePositionState(playerRef.current?.audioRef()?.currentTime);

      navigator.mediaSession.setActionHandler("play", () => {
        setPlayState(true);
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        setPlayState(false);
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        prevTrack();
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        nextTrack();
      });

      // navigator.mediaSession.setActionHandler("seekbackward", (details) => {
      //   if (playerRef.current?.getCurrentTime() == 0) {
      //     return;
      //   }
      //   let seekTime = Math.floor(
      //     playerRef.current!.getCurrentTime() -
      //     (details.seekOffset != null ? details.seekOffset : 10)
      //   );
      //   if (seekTime < 0) {
      //     return;
      //   }
      //   playerRef.current?.seekTo(seekTime);
      //   setSecondsPlayed(seekTime);
      //   updatePositionState(seekTime);
      // });

      // navigator.mediaSession.setActionHandler("seekforward", (details) => {
      //   if (playerRef.current!.getCurrentTime() == 0) {
      //     return;
      //   }

      //   let seekTime =
      //     playerRef.current!.getCurrentTime() +
      //     (details.seekOffset != null ? details.seekOffset : 10);
      //   if (seekTime > selectedTrack.durationInSeconds) {
      //     return;
      //   }

      //   playerRef.current?.seekTo(seekTime);
      //   setSecondsPlayed(seekTime);
      //   updatePositionState(seekTime);
      // });

      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (playerRef.current!.audioRef()?.currentTime == 0) {
          return;
        }
        if (details.seekTime != null) {
          playerRef.current!.audioRef()!.currentTime = details.seekTime;
          // updatePositionState(details.seekTime);
        }
      });
    }
  };

  React.useEffect(() => {
    if (selectedTrack == null) {
      return;
    }
    let currentTrackIndex = tracks?.indexOf(selectedTrack);
    // selectedTrack was modifed by the player controls
    if (currentTrackIndex === playerPosition) {
      return;
    }

    if (currentTrackIndex < 0) {
      // the track array hasn't fully loaded yet
      return;
    }
    // selectedTrack was modified by the playlist
    setPlayerPosition(currentTrackIndex);
  }, [selectedTrack]);

  React.useEffect(() => {
    const handleTrackChange = async () => {
      console.log("Player position is now: ", playerPosition);
      if (tracks == null) {
        return;
      }

      if (playerPosition !== 0 && !playState) {
        setStreamTrack({} as StreamDto);
        setPlayState(true);
      }

      let track = tracks[playerPosition];
      if (track != null) {
        setSelectedTrack(track);
        let streamTrack = await TranscodeService.transcodeTrack(track.id);
        setStreamTrack(streamTrack);
      }

      // preload next track for faster skipping
      if (track != null && tracks.length > playerPosition + 1) {
        let nextTrack = tracks[playerPosition + 1];
        await TranscodeService.transcodeTrack(nextTrack.id);
      }
    };
    handleTrackChange();
  }, [tracks, playerPosition]);

  const nextTrack = () => {
    if (playerPosition !== tracks.length - 1) {
      setPlayerPosition(playerPosition + 1);
    } else {
      // stop playing when we've reached the end
      setPlayState(false);
    }
  };

  const prevTrack = () => {
    if (playerPosition !== 0) {
      setPlayerPosition(playerPosition - 1);
    }
  };

  const playerRef = React.useRef<ShakaPlayerRef>(null);
  const buttonSize = 32;
  const strokeSize = 1.2;

  return (
    <div className={styles.wrapper}>
      <div className={styles.imageBox}>
        <Image
          src={`${OpenAPI.BASE}/api/repository/albums/${selectedTrack.album?.id}/artwork`}
          withPlaceholder
          width={"70px"}
          height={"70px"}
        ></Image>
      </div>
      <div className={styles.imageText}>
        <Text fz="sm" fw={700} lineClamp={2}>
          {selectedTrack.title}
        </Text>
        <Text fz="xs">{selectedTrack.artist?.name}</Text>
      </div>
      <div className={styles.playerWrapper}>
        <div className={styles.playerButtons}>
          <UnstyledButton onClick={prevTrack}>
            <IconPlayerSkipBack
              size={buttonSize}
              strokeWidth={strokeSize}
            ></IconPlayerSkipBack>
          </UnstyledButton>

          <UnstyledButton onClick={() => setPlayState(!playState)}>
            {playState ? (
              <IconPlayerPause
                size={buttonSize}
                strokeWidth={strokeSize}
              ></IconPlayerPause>
            ) : (
              <IconPlayerPlay
                size={buttonSize}
                strokeWidth={strokeSize}
              ></IconPlayerPlay>
            )}
          </UnstyledButton>

          <UnstyledButton onClick={nextTrack}>
            <IconPlayerSkipForward
              size={buttonSize}
              strokeWidth={strokeSize}
            ></IconPlayerSkipForward>
          </UnstyledButton>
        </div>
        <div className={styles.playerSeekbar}>
          <Text mr={16} fz={"sm"}>
            {formatSecondsToMinutes(secondsPlayed)}
          </Text>
          <Slider
            className={styles.slider}
            size={4}
            value={secondsPlayed}
            max={selectedTrack.durationInSeconds}
            onChange={(value: number) => {
              playerRef.current!.audioRef()!.currentTime = value;
              setSecondsPlayed(value);
              updatePositionState(value);
            }}
            label={(value: number) => formatSecondsToMinutes(value)}
          ></Slider>
          <Text ml={16} fz={"sm"}>
            {formatSecondsToMinutes(selectedTrack.durationInSeconds!)}
          </Text>
        </div>
      </div>
      <ShakaPlayer
        ref={playerRef}
        playState={playState}
        source={streamTrack.link}
        onTimeUpdate={(duration) => {
          if (duration) {
            setSecondsPlayed(duration);
          }
        }}
        onPlay={() => {
          announceMediaSession();
        }}
        onEnd={() => {
          nextTrack();
        }}
      ></ShakaPlayer>
    </div>
  );
}

export default Player;
