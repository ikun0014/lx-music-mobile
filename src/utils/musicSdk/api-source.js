import apiSourceInfo from './api-source-info'

import ikun_api_kg from './kg/api-ikun'
import ikun_api_kw from './kw/api-ikun'
import ikun_api_tx from './tx/api-ikun'
import ikun_api_wy from './wy/api-ikun'
import ikun_api_mg from './mg/api-ikun'

import settingState from '@/store/setting/state'


const apiList = {
  ikun_api_kg,
  ikun_api_kw,
  ikun_api_tx,
  ikun_api_wy,
  ikun_api_mg,
}
const supportQuality = {}

for (const api of apiSourceInfo) {
  supportQuality[api.id] = api.supportQualitys
}

const getAPI = source => apiList[`${settingState.setting['common.apiSource']}_api_${source}`]

const apis = source => {
  if (/^user_api/.test(settingState.setting['common.apiSource'])) return global.lx.apis[source]
  const api = getAPI(source)
  if (api) return api
  throw new Error('Api is not found')
}

export { apis, supportQuality }
