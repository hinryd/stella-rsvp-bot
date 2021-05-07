import { DateTime } from 'luxon'

const printEvent = (desc: string, responses: any[], date: string) => {
  return `${desc}
Date: ${DateTime.fromISO(date).toFormat('yyyy-LLL-d (ccc) HH:mm')}

${responses
  .map((res, idx) => `${idx + 1}. ${res.nickname}${res.confirmed ? '' : ' (tbc)'}`)
  .toString()
  .replace(/,/g, '\n')}`
}

export default printEvent
