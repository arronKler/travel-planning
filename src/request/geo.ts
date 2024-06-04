const AMAP_KEY = "12b358331608403707de87cfd12f5d83"

export async function getGeoCode(keyword: string, city: string) {
  const response = await fetch(
    `https://restapi.amap.com/v3/geocode/geo?address=${keyword}&output=json&key=${AMAP_KEY}`,
    {
      method: "GET",
    }
  )

  console.log("response", keyword, await response.json())
}
