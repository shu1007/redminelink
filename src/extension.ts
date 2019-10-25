import * as vscode from "vscode";
import * as svn from "./svnUtil";

interface BaseURL {
  title: string;
  url: string;
}

let outputChannel = vscode.window.createOutputChannel("redmineLink");
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.redmineLink",
    () => {
      const baseUrls: BaseURL[] = vscode.workspace.getConfiguration(
        "redmineLink"
      ).baseUrl;

      vscode.window
        .showQuickPick(baseUrls.map(bu => bu.title))
        .then(selected => {
          outputChannel.clear();

          const activeTextEditor = vscode.window.activeTextEditor;
          if (activeTextEditor !== undefined) {
            const fileName = activeTextEditor.document.fileName;
            const revNum = svn.getRevisionNum(fileName);
            if (revNum === "") {
              vscode.window.showErrorMessage("Couldn't get revision number.");
              return;
            }
            const lineNum = (
              activeTextEditor.selection.active.line + 1
            ).toString();

            if (selected === undefined) {
              vscode.window.showErrorMessage(
                "The error occurred with QuickPick."
              );
              return;
            }
            const text = baseUrls.filter(url => url.title === selected)[0].url;
            let result = text
              .replace(/{RN}/, revNum)
              .replace(/{LN}/, lineNum)
              .replace(/{FP}/, getSubPath(fileName));
            if (text.indexOf('"') === -1) {
              result = replaceSpace(result);
            }
            outputChannel.appendLine(result);
            outputChannel.show();

            vscode.env.clipboard.writeText(result);
          }
        });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  outputChannel.dispose();
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
