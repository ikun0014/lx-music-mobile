import { removeListMusics, updateListMusicPosition, updateListMusics } from '@/core/list'
import { playList, playNext } from '@/core/player/player'
import { addTempPlayList } from '@/core/player/tempPlayList'
import settingState from '@/store/setting/state'
import { similar, sortInsert } from '@/utils'
import { confirmDialog, requestStoragePermission, shareMusic, toast } from '@/utils/tools'
import { addDislikeInfo, hasDislike } from '@/core/dislikeList'
import playerState from '@/store/player/state'

import RNFetchBlob from 'rn-fetch-blob'
import type { SelectInfo } from './ListMenu'
import { type Metadata } from '@/components/MetadataEditModal'
import { getMusicUrl } from '@/core/music'
import log from '@/plugins/sync/log'
import { setStatusText } from '@/core/player/playStatus'

export const handlePlay = (listId: SelectInfo['listId'], index: SelectInfo['index']) => {
  void playList(listId, index)
}
export const handlePlayLater = (listId: SelectInfo['listId'], musicInfo: SelectInfo['musicInfo'], selectedList: SelectInfo['selectedList'], onCancelSelect: () => void) => {
  if (selectedList.length) {
    addTempPlayList(selectedList.map(s => ({ listId, musicInfo: s })))
    onCancelSelect()
  } else {
    addTempPlayList([{ listId, musicInfo }])
  }
}

export function getFileExtension(url: string) {
  // 使用正则表达式匹配URL中的文件扩展名
  const match = url.match(/\.([0-9a-z]+)(?=[?#]|$)/i);

  // 如果匹配到扩展名，则返回该扩展名，否则返回默认值'mp3'
  return match ? match[1] : 'mp3';
}

/**
 * 检查音乐信息是否已更改
 */
const diffCurrentMusicInfo = (curMusicInfo: LX.Music.MusicInfo | LX.Download.ListItem): boolean => {
  // return curMusicInfo !== playerState.playMusicInfo.musicInfo || playerState.isPlay
  return curMusicInfo.id != global.lx.gettingUrlId || curMusicInfo.id != playerState.playMusicInfo.musicInfo?.id || playerState.isPlay
}

// export const handelDownload = (musicInfo: LX.Music.MusicInfoOnline) => {
export const handelDownload = (musicInfo: any, quality: LX.Quality) => {
  return requestStoragePermission().then(async () => {
    console.log(quality);
    try {
      getMusicUrl({
        musicInfo, quality, isRefresh: true, onToggleSource(mInfo) {
          if (diffCurrentMusicInfo(musicInfo)) return
          setStatusText(global.i18n.t('toggle_source_try'))
        },
      }).then(url => {
        console.log(url);
        const extension = getFileExtension(url);
        const fileName = musicInfo.name;
        const downloadDir = RNFetchBlob.fs.dirs.DownloadDir + "/lx.music";
        const path = `${downloadDir}/${fileName}.${extension}`
        const config = {
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: path,
            description: '正在下载文件...',
          },
        };
        RNFetchBlob.config(config)
          .fetch('GET', url)
          .then((res) => {
            console.log('文件下载成功！路径：', res.path());
            toast("文件下载成功!", 'long')
          })
          .catch((error) => {
            console.log('文件下载失败：', error);
          });
      }).catch(e => {
        console.log('getMusicUrl e：', e);
      });
    } catch (e) {
      console.log('文件下载e：', e);
    }
  }).catch((e) => {
    return Promise.reject(e ?? "权限获取失败")
  })


}

export const handleRemove = (listId: SelectInfo['listId'], musicInfo: SelectInfo['musicInfo'], selectedList: SelectInfo['selectedList'], onCancelSelect: () => void) => {
  if (selectedList.length) {
    void confirmDialog({
      message: global.i18n.t('list_remove_music_multi_tip', { num: selectedList.length }),
      confirmButtonText: global.i18n.t('list_remove_tip_button'),
    }).then(isRemove => {
      if (!isRemove) return
      void removeListMusics(listId, selectedList.map(s => s.id))
      onCancelSelect()
    })
  } else {
    void removeListMusics(listId, [musicInfo.id])
  }
}

export const handleUpdateMusicPosition = (position: number, listId: SelectInfo['listId'], musicInfo: SelectInfo['musicInfo'], selectedList: SelectInfo['selectedList'], onCancelSelect: () => void) => {
  if (selectedList.length) {
    void updateListMusicPosition(listId, position, selectedList.map(s => s.id))
    onCancelSelect()
  } else {
    // console.log(listId, position, [musicInfo.id])
    void updateListMusicPosition(listId, position, [musicInfo.id])
  }
}

export const handleUpdateMusicInfo = (listId: SelectInfo['listId'], musicInfo: LX.Music.MusicInfoLocal, newInfo: Metadata) => {
  void updateListMusics([
    {
      id: listId,
      musicInfo: {
        ...musicInfo,
        name: newInfo.name,
        singer: newInfo.singer,
        meta: {
          ...musicInfo.meta,
          albumName: newInfo.albumName,
        },
      },
    },
  ])
}


export const handleShare = (musicInfo: SelectInfo['musicInfo']) => {
  shareMusic(settingState.setting['common.shareType'], settingState.setting['download.fileName'], musicInfo)
}


export const searchListMusic = (list: LX.Music.MusicInfo[], text: string) => {
  let result: LX.Music.MusicInfo[] = []
  let rxp = new RegExp(text.split('').map(s => s.replace(/[.*+?^${}()|[\]\\]/, '\\$&')).join('.*') + '.*', 'i')
  for (const mInfo of list) {
    const str = `${mInfo.name}${mInfo.singer}${mInfo.meta.albumName ? mInfo.meta.albumName : ''}`
    if (rxp.test(str)) result.push(mInfo)
  }

  const sortedList: Array<{ num: number, data: LX.Music.MusicInfo }> = []

  for (const mInfo of result) {
    sortInsert(sortedList, {
      num: similar(text, `${mInfo.name}${mInfo.singer}${mInfo.meta.albumName ? mInfo.meta.albumName : ''}`),
      data: mInfo,
    })
  }
  return sortedList.map(item => item.data).reverse()
}

export const handleDislikeMusic = async (musicInfo: SelectInfo['musicInfo']) => {
  const confirm = await confirmDialog({
    message: global.i18n.t('lists_dislike_music_tip', { name: musicInfo.name }),
    cancelButtonText: global.i18n.t('cancel_button_text_2'),
    confirmButtonText: global.i18n.t('confirm_button_text'),
    bgClose: false,
  })
  if (!confirm) return
  await addDislikeInfo([{ name: musicInfo.name, singer: musicInfo.singer }])
  toast(global.i18n.t('lists_dislike_music_add_tip'))
  if (hasDislike(playerState.playMusicInfo.musicInfo)) {
    void playNext(true)
  }
}
