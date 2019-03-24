import * as vscode from "vscode";
import * as svn from "./svnUtil";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.redminelink",
    () => {
      var activeTextEditor = vscode.window.activeTextEditor;
      if (activeTextEditor !== undefined) {
        var fileName = activeTextEditor.document.fileName;
        var revNum = svn.getRevisionNum(fileName);
        if (revNum === "") {
          vscode.window.showErrorMessage("Couldon't get revision number.");
          return;
        }
        var lineNum = (activeTextEditor.selection.active.line + 1).toString();
        var filePath = getSubPath(fileName);
        var texts: string[] = vscode.workspace.getConfiguration("redminelink")
          .baseText;
        var outputChannel = vscode.window.createOutputChannel("redminelink");

        texts.forEach(text => {
          let result: string;
          result = text.replace(/{RN}/, revNum);
          result = result.replace(/{LN}/, lineNum);
          result = result.replace(/{FP}/, filePath);
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

export function deactivate() {}

function getSubPath(fullPath: string): string {
  var startIndex = Math.max(
    fullPath.indexOf("trunk"),
    fullPath.indexOf("branches")
  );
  if (startIndex !== -1) {
    return fullPath.substring(startIndex);
  }
  return "";
}

function replaceSpace(str: string): string {
  return str.replace(/\s/g, "%20");
}
