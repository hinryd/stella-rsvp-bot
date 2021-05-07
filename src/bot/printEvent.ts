const printEvent = (desc: string, responses: any[], date: Date) => {
  return `${desc}
${date}

${responses
  .map((res, idx) => `${idx + 1}. ${res.nickname}${res.confirmed ? '' : ' (tbc)'}`)
  .toString()
  .replace(/,/g, '\n')}`
}

export default printEvent
