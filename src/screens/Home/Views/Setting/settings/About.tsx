import { memo } from 'react'
import { View, TouchableOpacity } from 'react-native'

import Section from '../components/Section'
// import Button from './components/Button'

import { createStyle, openUrl } from '@/utils/tools'
// import { showPactModal } from '@/navigation'
import { useTheme } from '@/store/theme/hook'
import { useI18n } from '@/lang'
import Text from '@/components/common/Text'
import { showPactModal } from '@/core/common'

const qqGroupUrl = 'mqqopensdkapi://bizAgent/qm/qr?url=http%3A%2F%2Fqm.qq.com%2Fcgi-bin%2Fqm%2Fqr%3Ffrom%3Dapp%26p%3Dandroid%26jump_from%3Dwebapi%26k%3DnL2jqhBaKl8h1olD5hrgx1wdDP2brLEv'
const qqGroupWebUrl = 'https://qm.qq.com/cgi-bin/qm/qr?k=sekyDEt2VSucn7zvo4CPcivupTSdMkyE&jump_from=webapi&authKey=6EDklJtxxHNGIpGsYWlk2GeeUNFqm6/GnoW22cZyAcldleABuMkk6osjwYTslRHT'

export default memo(() => {
  const theme = useTheme()
  const t = useI18n()
  const openHomePage = () => {
    void openUrl('https://github.com/ikun0014/lx-music-mobile-mod#readme')
  }
  const openNetdiskPage = () => {
    void openUrl('https://ikunruku.lanzouo.com/b007so8e7a')
  }
  const openFAQPage = () => {
    void openUrl('https://lyswhut.github.io/lx-music-doc/mobile/faq')
  }

  const goToQQGroup = () => {
    openUrl(qqGroupUrl).catch(() => {
      void openUrl(qqGroupWebUrl)
    })
  }

  const textLinkStyle = {
    ...styles.text,
    textDecorationLine: 'underline',
    color: theme['c-primary-font'],
    // fontSize: 14,
  } as const


  return (
    <Section title={t('setting_about')}>
      <View style={styles.part}>
        <Text style={styles.text} >本软件完全免费，代码已开源，开源地址：</Text>
        <TouchableOpacity onPress={openHomePage}>
          <Text style={textLinkStyle}>https://github.com/ikun0014/lx-music-mobile-mod</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.part}>
        <Text style={styles.text} >最新版网盘下载地址：</Text>
        <TouchableOpacity onPress={openNetdiskPage}>
          <Text style={textLinkStyle}>网盘地址（密码：lxmusicmod）</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.part}>
        <Text style={styles.text} >软件的常见问题可转至：</Text>
        <TouchableOpacity onPress={openFAQPage}>
          <Text style={textLinkStyle}>常见问题</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.part}>
        <Text style={styles.text}><Text style={styles.boldText}>本软件没有客服</Text>，但我们整理了一些常见的使用问题，<Text style={styles.boldText} >仔细 仔细 仔细 </Text>地阅读常见问题后，</Text>
        <Text style={styles.text}>仍有问题可加企鹅群 </Text>
        <TouchableOpacity onPress={goToQQGroup}><Text style={textLinkStyle}>690309707</Text></TouchableOpacity>
        <Text style={styles.text}> 反馈。</Text>
      </View>
      <View style={styles.part}>
        <Text style={styles.text}>目前本修改版本的原始发布地址只有<Text style={styles.boldText}>GitHub</Text>及<Text style={styles.boldText}>蓝奏网盘</Text>，其他渠道均为第三方转载发布，可信度请自行鉴别。</Text>
        <Text style={styles.text}>本项目无微信公众号之类的官方账号，也未在小米、华为、vivo等应用商店发布同名应用，谨防被骗。</Text>
        <Text style={styles.text}>本项目是对LX Music Mod的官方版本进行了修改，以提升用户的体验</Text>
      </View>
      <View style={styles.part}>
        <Text style={styles.text}>By：</Text>
        <Text style={styles.text}>ikun0014</Text>
      </View>
    </Section>
  )
})

const styles = createStyle({
  part: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 14,
    textAlignVertical: 'bottom',
  },
  boldText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlignVertical: 'bottom',
  },
  throughText: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    textAlignVertical: 'bottom',
  },
  btn: {
    flexDirection: 'row',
  },
})
