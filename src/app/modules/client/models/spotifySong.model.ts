export interface SpotifySong {
  context: any,
  is_playing: boolean,
  item: {
      album: {
          id: string,
          images: { url: string, height: number, width: number }[],
          name: string,
          uri: string,
      }
      artists: { id: string, name: string, uri: string }[],
      duration_ms: number,
      id: string,
      name: string,
      track_number: number,
      uri: string,
  }
  progress_ms: number,
  shuffle_state: boolean,
}