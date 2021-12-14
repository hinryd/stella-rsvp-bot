import { Date } from 'sugar'

const printEvent = (desc: string, responses: any[], date: string) => {
  return `${desc}
Date: ${Date(date).full()}

${responses
  .map((res, idx) => `${idx + 1}. ${res.nickname}${res.confirmed ? '' : ' (tbc)'}`)
  .toString()
  .replace(/,/g, '\n')}`
}

export default printEvent
