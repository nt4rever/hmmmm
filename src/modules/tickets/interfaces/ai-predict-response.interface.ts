export type ImagePredictResponse = Array<{
  label: string;
  score: number;
}>;

export type AiPredictResponse = Array<ImagePredictResponse>;
