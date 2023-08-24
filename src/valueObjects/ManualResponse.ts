export interface IManualResponse {
    isSuccess: boolean,
    code: number,
    result?: object,
}

export default class ManualResponse implements IManualResponse {
    isSuccess: boolean
    code: number
    result?: object

    constructor(isSuccess: boolean, code: number, result?: object) {
      this.isSuccess = isSuccess
      this.code = code
      this.result = result
    }
}