/**
 * Generated by @openapi-codegen
 *
 * @version v1
 */
import * as reactQuery from "@tanstack/react-query";
import { useContext, Context } from "./context";
import type * as Fetcher from "./fetcher";
import { fetch } from "./fetcher";
import type * as Schemas from "./schemas";

export type ArtworkFromIdPathParams = {
  /**
   * @format int32
   */
  artworkId: number;
};

export type ArtworkFromIdError = Fetcher.ErrorWrapper<undefined>;

export type ArtworkFromIdVariables = {
  pathParams: ArtworkFromIdPathParams;
} & Context["fetcherOptions"];

export const fetchArtworkFromId = (
  variables: ArtworkFromIdVariables,
  signal?: AbortSignal
) =>
  fetch<
    undefined,
    ArtworkFromIdError,
    undefined,
    {},
    {},
    ArtworkFromIdPathParams
  >({ url: "/api/Artwork/{artworkId}", method: "get", ...variables, signal });

export const useArtworkFromId = <TData = undefined>(
  variables: ArtworkFromIdVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<undefined, ArtworkFromIdError, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useContext(options);
  return reactQuery.useQuery<undefined, ArtworkFromIdError, TData>(
    queryKeyFn({
      path: "/api/Artwork/{artworkId}",
      operationId: "artworkFromId",
      variables,
    }),
    ({ signal }) =>
      fetchArtworkFromId({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type AlbumArtworkPathParams = {
  /**
   * @format int32
   */
  albumId: number;
};

export type AlbumArtworkError = Fetcher.ErrorWrapper<undefined>;

export type AlbumArtworkVariables = {
  pathParams: AlbumArtworkPathParams;
} & Context["fetcherOptions"];

export const fetchAlbumArtwork = (
  variables: AlbumArtworkVariables,
  signal?: AbortSignal
) =>
  fetch<
    Schemas.ArtworkDto,
    AlbumArtworkError,
    undefined,
    {},
    {},
    AlbumArtworkPathParams
  >({
    url: "/api/Artwork/albums/{albumId}",
    method: "get",
    ...variables,
    signal,
  });

export const useAlbumArtwork = <TData = Schemas.ArtworkDto>(
  variables: AlbumArtworkVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.ArtworkDto, AlbumArtworkError, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useContext(options);
  return reactQuery.useQuery<Schemas.ArtworkDto, AlbumArtworkError, TData>(
    queryKeyFn({
      path: "/api/Artwork/albums/{albumId}",
      operationId: "albumArtwork",
      variables,
    }),
    ({ signal }) =>
      fetchAlbumArtwork({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type RunIndexerError = Fetcher.ErrorWrapper<undefined>;

export type RunIndexerVariables = Context["fetcherOptions"];

export const fetchRunIndexer = (
  variables: RunIndexerVariables,
  signal?: AbortSignal
) =>
  fetch<undefined, RunIndexerError, undefined, {}, {}, {}>({
    url: "/api/Library/scan",
    method: "post",
    ...variables,
    signal,
  });

export const useRunIndexer = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      undefined,
      RunIndexerError,
      RunIndexerVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useContext();
  return reactQuery.useMutation<
    undefined,
    RunIndexerError,
    RunIndexerVariables
  >(
    (variables: RunIndexerVariables) =>
      fetchRunIndexer({ ...fetcherOptions, ...variables }),
    options
  );
};

export type SearchQueryParams = {
  query?: string;
};

export type SearchError = Fetcher.ErrorWrapper<undefined>;

export type SearchVariables = {
  queryParams?: SearchQueryParams;
} & Context["fetcherOptions"];

export const fetchSearch = (variables: SearchVariables, signal?: AbortSignal) =>
  fetch<
    Schemas.SearchResult,
    SearchError,
    undefined,
    {},
    SearchQueryParams,
    {}
  >({ url: "/api/Library/search", method: "get", ...variables, signal });

export const useSearch = <TData = Schemas.SearchResult>(
  variables: SearchVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.SearchResult, SearchError, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useContext(options);
  return reactQuery.useQuery<Schemas.SearchResult, SearchError, TData>(
    queryKeyFn({
      path: "/api/Library/search",
      operationId: "search",
      variables,
    }),
    ({ signal }) => fetchSearch({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type FileFromLibraryPathParams = {
  /**
   * @format int32
   */
  trackId: number;
};

export type FileFromLibraryError = Fetcher.ErrorWrapper<undefined>;

export type FileFromLibraryVariables = {
  pathParams: FileFromLibraryPathParams;
} & Context["fetcherOptions"];

export const fetchFileFromLibrary = (
  variables: FileFromLibraryVariables,
  signal?: AbortSignal
) =>
  fetch<
    undefined,
    FileFromLibraryError,
    undefined,
    {},
    {},
    FileFromLibraryPathParams
  >({
    url: "/api/Library/tracks/{trackId}/original",
    method: "get",
    ...variables,
    signal,
  });

export const useFileFromLibrary = <TData = undefined>(
  variables: FileFromLibraryVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<undefined, FileFromLibraryError, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useContext(options);
  return reactQuery.useQuery<undefined, FileFromLibraryError, TData>(
    queryKeyFn({
      path: "/api/Library/tracks/{trackId}/original",
      operationId: "fileFromLibrary",
      variables,
    }),
    ({ signal }) =>
      fetchFileFromLibrary({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type TranscodeTrackPathParams = {
  /**
   * @format int32
   */
  trackId: number;
};

export type TranscodeTrackQueryParams = {
  /**
   * @format int32
   */
  bitrate?: number;
};

export type TranscodeTrackError = Fetcher.ErrorWrapper<undefined>;

export type TranscodeTrackVariables = {
  pathParams: TranscodeTrackPathParams;
  queryParams?: TranscodeTrackQueryParams;
} & Context["fetcherOptions"];

export const fetchTranscodeTrack = (
  variables: TranscodeTrackVariables,
  signal?: AbortSignal
) =>
  fetch<
    Schemas.StreamDto,
    TranscodeTrackError,
    undefined,
    {},
    TranscodeTrackQueryParams,
    TranscodeTrackPathParams
  >({
    url: "/api/Library/tracks/{trackId}/transcode",
    method: "get",
    ...variables,
    signal,
  });

export const useTranscodeTrack = <TData = Schemas.StreamDto>(
  variables: TranscodeTrackVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.StreamDto, TranscodeTrackError, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useContext(options);
  return reactQuery.useQuery<Schemas.StreamDto, TranscodeTrackError, TData>(
    queryKeyFn({
      path: "/api/Library/tracks/{trackId}/transcode",
      operationId: "transcodeTrack",
      variables,
    }),
    ({ signal }) =>
      fetchTranscodeTrack({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type StreamTrackPathParams = {
  /**
   * @format int32
   */
  trackId: number;
};

export type StreamTrackQueryParams = {
  /**
   * @format int32
   * @default 192
   */
  bitrate?: number;
  /**
   * @default true
   */
  transcodeTrack?: boolean;
};

export type StreamTrackError = Fetcher.ErrorWrapper<undefined>;

export type StreamTrackVariables = {
  pathParams: StreamTrackPathParams;
  queryParams?: StreamTrackQueryParams;
} & Context["fetcherOptions"];

export const fetchStreamTrack = (
  variables: StreamTrackVariables,
  signal?: AbortSignal
) =>
  fetch<
    Schemas.StreamDto,
    StreamTrackError,
    undefined,
    {},
    StreamTrackQueryParams,
    StreamTrackPathParams
  >({
    url: "/api/Library/tracks/{trackId}/stream",
    method: "get",
    ...variables,
    signal,
  });

export const useStreamTrack = <TData = Schemas.StreamDto>(
  variables: StreamTrackVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.StreamDto, StreamTrackError, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useContext(options);
  return reactQuery.useQuery<Schemas.StreamDto, StreamTrackError, TData>(
    queryKeyFn({
      path: "/api/Library/tracks/{trackId}/stream",
      operationId: "streamTrack",
      variables,
    }),
    ({ signal }) =>
      fetchStreamTrack({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type TracksError = Fetcher.ErrorWrapper<undefined>;

export type TracksResponse = Schemas.TrackDto[];

export type TracksVariables = Context["fetcherOptions"];

export const fetchTracks = (variables: TracksVariables, signal?: AbortSignal) =>
  fetch<TracksResponse, TracksError, undefined, {}, {}, {}>({
    url: "/api/Library/tracks",
    method: "get",
    ...variables,
    signal,
  });

export const useTracks = <TData = TracksResponse>(
  variables: TracksVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<TracksResponse, TracksError, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useContext(options);
  return reactQuery.useQuery<TracksResponse, TracksError, TData>(
    queryKeyFn({
      path: "/api/Library/tracks",
      operationId: "tracks",
      variables,
    }),
    ({ signal }) => fetchTracks({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type AlbumsError = Fetcher.ErrorWrapper<undefined>;

export type AlbumsResponse = Schemas.SimpleAlbumDto[];

export type AlbumsVariables = Context["fetcherOptions"];

export const fetchAlbums = (variables: AlbumsVariables, signal?: AbortSignal) =>
  fetch<AlbumsResponse, AlbumsError, undefined, {}, {}, {}>({
    url: "/api/Library/albums",
    method: "get",
    ...variables,
    signal,
  });

export const useAlbums = <TData = AlbumsResponse>(
  variables: AlbumsVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<AlbumsResponse, AlbumsError, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useContext(options);
  return reactQuery.useQuery<AlbumsResponse, AlbumsError, TData>(
    queryKeyFn({
      path: "/api/Library/albums",
      operationId: "albums",
      variables,
    }),
    ({ signal }) => fetchAlbums({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type PaginatedAlbumsQueryParams = {
  /**
   * @format int32
   * @default 10
   */
  limit?: number;
  /**
   * @format int32
   * @default 0
   */
  offset?: number;
};

export type PaginatedAlbumsError = Fetcher.ErrorWrapper<undefined>;

export type PaginatedAlbumsVariables = {
  queryParams?: PaginatedAlbumsQueryParams;
} & Context["fetcherOptions"];

export const fetchPaginatedAlbums = (
  variables: PaginatedAlbumsVariables,
  signal?: AbortSignal
) =>
  fetch<
    undefined,
    PaginatedAlbumsError,
    undefined,
    {},
    PaginatedAlbumsQueryParams,
    {}
  >({
    url: "/api/Library/albums/paginated",
    method: "get",
    ...variables,
    signal,
  });

export const usePaginatedAlbums = <TData = undefined>(
  variables: PaginatedAlbumsVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<undefined, PaginatedAlbumsError, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useContext(options);
  return reactQuery.useQuery<undefined, PaginatedAlbumsError, TData>(
    queryKeyFn({
      path: "/api/Library/albums/paginated",
      operationId: "paginatedAlbums",
      variables,
    }),
    ({ signal }) =>
      fetchPaginatedAlbums({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type AlbumPathParams = {
  /**
   * @format int32
   */
  albumId: number;
};

export type AlbumError = Fetcher.ErrorWrapper<undefined>;

export type AlbumVariables = {
  pathParams: AlbumPathParams;
} & Context["fetcherOptions"];

export const fetchAlbum = (variables: AlbumVariables, signal?: AbortSignal) =>
  fetch<Schemas.AlbumDto, AlbumError, undefined, {}, {}, AlbumPathParams>({
    url: "/api/Library/albums/{albumId}",
    method: "get",
    ...variables,
    signal,
  });

export const useAlbum = <TData = Schemas.AlbumDto>(
  variables: AlbumVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.AlbumDto, AlbumError, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useContext(options);
  return reactQuery.useQuery<Schemas.AlbumDto, AlbumError, TData>(
    queryKeyFn({
      path: "/api/Library/albums/{albumId}",
      operationId: "album",
      variables,
    }),
    ({ signal }) => fetchAlbum({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type QueryOperation =
  | {
      path: "/api/Artwork/{artworkId}";
      operationId: "artworkFromId";
      variables: ArtworkFromIdVariables;
    }
  | {
      path: "/api/Artwork/albums/{albumId}";
      operationId: "albumArtwork";
      variables: AlbumArtworkVariables;
    }
  | {
      path: "/api/Library/search";
      operationId: "search";
      variables: SearchVariables;
    }
  | {
      path: "/api/Library/tracks/{trackId}/original";
      operationId: "fileFromLibrary";
      variables: FileFromLibraryVariables;
    }
  | {
      path: "/api/Library/tracks/{trackId}/transcode";
      operationId: "transcodeTrack";
      variables: TranscodeTrackVariables;
    }
  | {
      path: "/api/Library/tracks/{trackId}/stream";
      operationId: "streamTrack";
      variables: StreamTrackVariables;
    }
  | {
      path: "/api/Library/tracks";
      operationId: "tracks";
      variables: TracksVariables;
    }
  | {
      path: "/api/Library/albums";
      operationId: "albums";
      variables: AlbumsVariables;
    }
  | {
      path: "/api/Library/albums/paginated";
      operationId: "paginatedAlbums";
      variables: PaginatedAlbumsVariables;
    }
  | {
      path: "/api/Library/albums/{albumId}";
      operationId: "album";
      variables: AlbumVariables;
    };
