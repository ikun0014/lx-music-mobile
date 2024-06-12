// Support qualitys: 128k 320k flac wav

const sources: Array<{
  id: string
  name: string
  disabled: boolean
  supportQualitys: Partial<Record<LX.OnlineSource, LX.Quality[]>>
}> = [
    {
      id: 'ikun',
      name: 'ikun公益音源',
      disabled: false,
      supportQualitys: {
        kg: ['128k', '320k', 'flac', 'flac24bit'],
        tx: ['128k', '320k', 'flac', 'flac24bit'],
        wy: ['128k', '320k', 'flac', 'flac24bit'],
        mg: ['128k', '320k', 'flac', 'flac24bit'],
        kw: ['128k', '320k', 'flac', 'flac24bit'],
      },
    }
  ]

export default sources