import * as vscode from "vscode";
import * as svn from "./svnUtil";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.redmineLink",
    () => {
      var activeTextEditor = vscode.window.activeTextEditor;
      if (activeTextEditor !== undefined) {
        var fileName = activeTextEditor.document.fileName;
        var revNum = svn.getRevisionNum(fileName);
        if (revNum === "") {
          vscode.window.showErrorMessage("Couldn't get revision number.");
          return;
        }
        var lineNum = (activeTextEditor.selection.active.line + 1).toString();
        var texts: string[] = vscode.workspace.getConfiguration("redmineLink")
          .baseUrl;
        var outputChannel = vscode.window.createOutputChannel("redmineLink");

        texts.forEach(text => {
          let result = text
            .replace(/{RN}/, revNum)
            .replace(/{LN}/, lineNum)
            .replace(/{FP}/, getSubPath(fileName));
          if (text.indexOf('"') === -1) {
            result = replaceSpace(result);
          }
          outputChannel.appendLine(result);
        });

        outputChannel.show();
      }
    }
  );

  context.subscriptions.push(disposable);
}

function getSubPath(fullPath: string): string {
  var startIndex = Math.max(
    fullPath.indexOf("trunk"),
    fullPath.indexOf("branches")
  );
  if (startIndex !== -1) {
    return fullPath.substring(startIndex).replace(/\\/g, "/");
  }
  return "";
}

function replaceSpace(str: string): string {
  return str.replace(/\s/g, "%20");
}
