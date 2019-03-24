import { execSync } from "child_process";

export function getRevisionNum(filePath: string): string {
  try {
    var info = execSync("svn info " + '"' + filePath + '"');
    var array = info.toString().match(/Last Changed Rev: (\d+)/);
    if (array !== null) {
      return String(array[1]);
    }
    return "";
  } catch {
    return "";
  }
}
