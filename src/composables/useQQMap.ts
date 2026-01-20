import QQMapWX from '@/common/qqmap-wx-jssdk.js'

interface ReverseGeocoderSuccess {
  result: {
    ad_info: {
      location: { lat: number, lng: number }
    }
    formatted_addresses: {
      standard_address: string
    }
    location: { lat: number, lng: number }
  }
}

const qqMap = new QQMapWX({
  key: 'KINBZ-35F6L-YQIP4-MN3DQ-M64QJ-BXBIX',
})

export function useQQMap() {
  const reverseGeocoder = (location?: { latitude: number | string, longitude: number | string }) => {
    return new Promise<ReverseGeocoderSuccess>((resolve, reject) => {
      const options: any = {
        success: (data: ReverseGeocoderSuccess) => {
          resolve(data)
        },
        fail: reject,
      }
      if (location) {
        options.location = location
      }
      qqMap.reverseGeocoder(options)
    })
  }

  return {
    reverseGeocoder,
  }
}
