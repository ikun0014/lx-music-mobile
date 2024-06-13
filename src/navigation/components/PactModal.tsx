import { useMemo, useState, useEffect } from 'react'
import { View, ScrollView, Alert } from 'react-native'
import { Navigation } from 'react-native-navigation'

import Button from '@/components/common/Button'
import { createStyle, openUrl } from '@/utils/tools'
import { useSettingValue } from '@/store/setting/hook'
import { useTheme } from '@/store/theme/hook'
import Text from '@/components/common/Text'
import ModalContent from './ModalContent'
import { exitApp } from '@/utils/nativeModules/utils'
import { updateSetting } from '@/core/common'
import { checkUpdate } from '@/core/version'

const Content = () => {
  const theme = useTheme()

  const openHomePage = () => {
    void openUrl('https://github.com/ikun0014/lx-music-mobile-mod#readme')
  }
  const openLicensePage = () => {
    void openUrl('http://www.apache.org/licenses/LICENSE-2.0')
  }

  const textLinkStyle = {
    ...styles.text,
    textDecorationLine: 'underline',
    color: theme['c-primary-font'],
    // fontSize: 15,
  } as const

  return (
    <View style={styles.main}>
      <Text style={styles.title} size={18} >许可协议</Text>
      <ScrollView style={styles.content} keyboardShouldPersistTaps={'always'}>
        <Text selectable style={styles.text} >本项目（软件）基于 <Text onPress={openLicensePage} style={textLinkStyle}>Apache License 2.0</Text> 许可证发行，在使用本软件前，你（使用者）需签署本协议才可继续使用，以下协议是对于 Apache License 2.0 的补充，如有冲突，以以下协议为准。{'\n'}</Text>
        <Text selectable style={styles.bold} >一、版权保护</Text>
        <Text selectable style={styles.text} >1.1 音乐平台不易，请尊重版权，支持正版。{'\n'}</Text>
        <Text selectable style={styles.bold} >二、非商业性质</Text>
        <Text selectable style={styles.text} >2.1 本项目仅用于对技术可行性的探索及研究，不接受任何商业（包括但不限于广告等）合作及捐赠。{'\n'}</Text>
        <Text selectable style={styles.bold} >三、警告</Text>
        <Text selectable style={styles.text} >3.1 本项目未经作者许可禁止发布于国内的公开平台，如果你发现了请联系ikun0014@qq.com。{'\n'}</Text>
        <Text selectable style={styles.bold} >三、接受协议</Text>
        <Text selectable style={styles.text} >4.1 若你使用了本项目，将代表你接受本协议。{'\n'}</Text>
        <Text selectable style={styles.text} >* 若协议更新，恕不另行通知，可到<Text onPress={openHomePage} style={textLinkStyle}>开源地址</Text>查看。</Text>
      </ScrollView>
    </View>
  )
}

const Footer = ({ componentId }: { componentId: string }) => {
  const theme = useTheme()
  const isAgreePact = useSettingValue('common.isAgreePact')
  // const checkUpdate = useDispatch('common', 'checkUpdate')
  const [time, setTime] = useState(5)

  const handleRejct = () => {
    exitApp()
    // Navigation.dismissOverlay(componentId)
  }

  const handleConfirm = () => {
    let _isAgreePact = isAgreePact
    if (!isAgreePact) updateSetting({ 'common.isAgreePact': true })
    void Navigation.dismissOverlay(componentId)
    if (!_isAgreePact) {
      setTimeout(() => {
        Alert.alert(
          '',
          Buffer.from('e69cace8bdafe4bbb6e5ae8ce585a8e5858de8b4b9e4b894e5bc80e6ba90efbc8ce5a682e69e9ce4bda0e698afe88ab1e992b1e8b4ade4b9b0e79a84efbc8ce8afb7e79bb4e68ea5e7bb99e5b7aee8af84efbc810a0a5468697320736f667477617265206973206672656520616e64206f70656e20736f757263652e', 'hex').toString(),
          [{
            text: Buffer.from('e5a5bde79a8420284f4b29', 'hex').toString(),
            onPress: () => {
              void checkUpdate()
            },
          }],
        )
      }, 2e3)
    }
  }


  const confirmBtn = useMemo(() => {
    if (isAgreePact) return { disabled: false, text: '关闭' }
    return time ? { disabled: true, text: `同意（${time}）` } : { disabled: false, text: '同意' }
  }, [isAgreePact, time])

  useEffect(() => {
    if (isAgreePact) return
    const timeoutTools = {
      timeout: null as NodeJS.Timeout | null,
      start() {
        this.timeout = setTimeout(() => {
          setTime(time => {
            time--
            if (time > 0) this.start()
            return time
          })
        }, 1000)
      },
      clear() {
        if (!this.timeout) return
        clearTimeout(this.timeout)
      },
    }
    timeoutTools.start()
    return () => {
      timeoutTools.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {
        isAgreePact
          ? null
          : (
            <Text selectable style={styles.tip} size={13}>若你（使用者）接受以上协议，请点击下面的“接受”按钮签署本协议，若不接受，请点击“不接受”后退出软件并清除本软件的所有数据。</Text>
          )
      }
      <View style={styles.btns}>
        {
          isAgreePact
            ? null
            : (
              <Button style={{ ...styles.btn, backgroundColor: theme['c-button-background'] }} onPress={handleRejct}>
                <Text color={theme['c-button-font']}>不同意</Text>
              </Button>
            )
        }
        <Button disabled={confirmBtn.disabled} style={{ ...styles.btn, backgroundColor: theme['c-button-background'] }} onPress={handleConfirm}>
          <Text color={theme['c-button-font']}>{confirmBtn.text}</Text>
        </Button>
      </View>
    </>
  )
}

const PactModal = ({ componentId }: { componentId: string }) => {
  return (
    <ModalContent>
      <Content />
      <Footer componentId={componentId} />
    </ModalContent>
  )
}

const styles = createStyle({
  main: {
    // flexGrow: 0,
    flexShrink: 1,
    marginTop: 15,
    marginBottom: 10,
  },
  content: {
    flexGrow: 0,
    marginLeft: 5,
    marginRight: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 15,
  },
  part: {
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    textAlignVertical: 'bottom',
    marginBottom: 5,
  },
  bold: {
    fontSize: 14,
    textAlignVertical: 'bottom',
    fontWeight: 'bold',
  },
  tip: {
    textAlignVertical: 'bottom',
    fontWeight: 'bold',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 15,
    paddingLeft: 15,
    // paddingRight: 15,
  },
  btn: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    borderRadius: 4,
    marginRight: 15,
  },
})

export default PactModal

