export interface AnalysisMessage {
    code: number
    type: "Error" | "Warning"
    message: string
}
