import {
  Slider,
  Text,
  UnstyledButton,
  Image,
  useMantineTheme,
  Menu,
  Switch,
  Select,
  Loader,
} from "@mantine/core";
import React, { useState } from "react";
import { TrackDto } from "../client/schemas";
import {
  IconPlayerSkipForward,
  IconPlayerSkipBack,
  IconPlayerPlay,
  IconPlayerPause,
  IconSettings,
} from "@tabler/icons";
import { StreamDto } from "../client/schemas";
import styles from "../styles/Player.module.css";
import { formatSecondsToMinutes } from "../utils";
import { PlayerState, usePlayerStore } from "../store";
import { ShakaPlayer, ShakaPlayerRef } from "../components/ShakaPlayer";
import axios from "axios";
import Head from "next/head";
import getConfig from "next/config";
import { fetchStreamTrack, useStreamTrack } from "../client/components";
type PlayerProps = {
  tracks?: TrackDto[];
};

function Player({ tracks }: PlayerProps) {
  if (tracks == null) {
    return <p>Unable to load tracks.</p>;
  }

  const theme = useMantineTheme();

  const playState = usePlayerStore((state: PlayerState) => state.playState);

  const [streamTrack, setStreamTrack] = useState({} as StreamDto);
  const [mimeType, setMimeType] = useState<string | undefined>();

  const [secondsPlayed, setSecondsPlayed] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [buffering, setBuffering] = useState(false);

  const selectedTrack = usePlayerStore(
    (state: PlayerState) => state.selectedTrack
  );

  const setPlayState = (value: boolean) =>
    usePlayerStore.setState({ playState: value });

  const [transcodeTrack, setTranscodeTrack] = useState(false);
  const [bitrate, setBitrate] = useState<string | null>("192");

  const titleText =
    selectedTrack.artist != null
      ? `${selectedTrack.artist.name} - ${selectedTrack.title} | Coral`
      : "Coral";

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
            src: `${
              getConfig().publicRuntimeConfig.apiBaseUrl
            }/api/repository/albums/${selectedTrack.album?.id}/artwork`,
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
      if (playerPosition !== 0 && !playState) {
        setStreamTrack({} as StreamDto);
        setPlayState(true);
      }

      let track = tracks[playerPosition];
      usePlayerStore.setState({ selectedTrack: track });

      const data = await fetchStreamTrack({
        pathParams: {
          trackId: track.id,
        },
        queryParams: {
          bitrate: +bitrate!,
          transcodeTrack: transcodeTrack,
        },
      });

      // let streamTrack = await RepositoryService.streamTrack(
      //   track.id,
      //   // parse as int and claim value is not null
      //   +bitrate!,
      //   transcodeTrack
      // );
      let resp = await fetch(data.link, { method: "HEAD" });
      // because Shaka doesn't automatically detect the correct content-type
      // we need to set it ourselves
      let contentType = resp.headers.get("content-type");
      setMimeType(contentType!);
      setStreamTrack(data!);

      // preload next track for faster skipping
      if (transcodeTrack && tracks.length > playerPosition + 1) {
        let nextTrack = tracks[playerPosition + 1];
        await fetchStreamTrack({
          pathParams: {
            trackId: nextTrack.id,
          },
          queryParams: {
            bitrate: +bitrate!,
            transcodeTrack: transcodeTrack,
          },
        });
      }
    };
    handleTrackChange();
  }, [tracks, playerPosition, transcodeTrack, bitrate]);

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

  const playButton = (
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
  );

  const loading = <Loader size={30} />;

  return (
    <div
      className={styles.wrapper}
      style={{
        background: theme.colors.dark[7],
      }}
    >
      <Head>
        <title>{titleText}</title>
      </Head>
      <div className={styles.imageBox}>
        <Image
          src={`${
            getConfig().publicRuntimeConfig.apiBaseUrl
          }/api/repository/albums/${selectedTrack.album?.id}/artwork`}
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
          {!buffering || !playState ? playButton : loading}
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
        mimeType={mimeType}
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
        onBuffer={(value) => {
          setBuffering(value);
        }}
      ></ShakaPlayer>
      <div className={styles.settings}>
        <Menu shadow="md" width={200} closeOnItemClick={false}>
          <Menu.Target>
            <UnstyledButton>
              <IconSettings></IconSettings>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Playback</Menu.Label>
            <Menu.Item
              rightSection={
                <Switch
                  checked={transcodeTrack}
                  onChange={(ev) => setTranscodeTrack(ev.currentTarget.checked)}
                ></Switch>
              }
            >
              Transcode audio
            </Menu.Item>
            <Menu.Item
              disabled={!transcodeTrack}
              rightSection={
                <Select
                  style={{
                    marginLeft: "auto",
                    maxWidth: "65%",
                    alignSelf: "end",
                  }}
                  data={["128", "192", "256", "320"]}
                  value={bitrate}
                  onChange={setBitrate}
                ></Select>
              }
            >
              Bitrate
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
}

export default Player;
