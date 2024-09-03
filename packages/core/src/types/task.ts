import type { UnOnProgress } from "./common";

export interface UnTask
  extends Partial<UniApp.RequestTask>,
    Partial<Omit<UniApp.DownloadTask, "onProgressUpdate">>,
    Partial<Omit<UniApp.UploadTask, "onProgressUpdate">> {
  onProgressUpdate?: (callback: UnOnProgress) => void;
  [key: string]: any;
}
