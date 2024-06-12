import { memo, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import InputItem, { type InputItemProps } from '../../components/InputItem'
import { createStyle, toast } from '@/utils/tools'
import { useSettingValue } from '@/store/setting/hook'
import { useI18n } from '@/lang'
import { updateSetting } from '@/core/common'
import CheckBox from '@/components/common/CheckBox'
import SubTitle from '../../components/SubTitle'
import settingState from '@/store/setting/state'

const MAX_SIZE = 1024 * 1024 * 1024
export default memo(() => {
  const t = useI18n()
  const [playQualityList, setPlayQualityList] = useState<MusicOption[]>([]);
  useEffect(() => {
    setPlayQualityList([
      {
        id: "128k",
        key: "128k",
        name: "标准音质"
      },
      {
        id: "320k",
        key: "320k",
        name: "高品音质"
      },
      {
        id: "flac",
        key: "flac",
        name: "无损音质"
      },
      {
        id: "flac24bit",
        key: "flac24bit",
        name: "Hi-Res音质"
      }
    ]);
  }, [])
  const [selectedQuality, setSelectedQuality] = useState<LX.Quality>(useSettingValue('player.playQuality'));

  const setPlayQuality = (playQuality: LX.Quality) => {
    updateSetting({ 'player.playQuality': playQuality })
    setSelectedQuality(playQuality);
  }

  interface MusicOption {
    id: LX.Quality;
    name: string;
    size?: string | null;
    key?: string
  }

  const useActive = (id: LX.Quality) => {
    const isActive = useMemo(() => selectedQuality == id, [selectedQuality, id])
    return isActive
  }

  const Item = ({ id, name }: {
    id: LX.Quality
    name: string
  }) => {
    const isActive = useActive(id)
    return <CheckBox marginRight={8} check={isActive} label={name} onChange={() => { setPlayQuality(id) }} need />
  }

  return (
    <View style={styles.content} >
      <SubTitle title={t('setting_play_select')}>
        <View style={styles.list}>
          {
            playQualityList.map((item) => <Item name={item.name} id={item.id} key={item.key} />)
          }
        </View>
      </SubTitle>
    </View>
  )
})

const styles = createStyle({
  content: {
    marginTop: 10,
  },
  list: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
})

