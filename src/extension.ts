import * as vscode from "vscode";
import * as svn from "./svnUtil";
import * as open from "open";

interface BaseURL {
  name: string;
  url: string;
  openBrowser: boolean;
}

const outputChannel = vscode.window.createOutputChannel("redmineLink");
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.redmineLink",
    () => {
      const baseUrls: BaseURL[] = vscode.workspace.getConfiguration(
        "redmineLink"
      ).baseUrl;

      vscode.window
        .showQuickPick(baseUrls.map(url => url.name))
        .then(selected => {
          if (selected === undefined) {
            vscode.window.showErrorMessage(
              "The error occurred with QuickPick."
            );
            return;
          }

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

            const baseUrl = baseUrls.filter(url => url.name === selected)[0];
            const url = baseUrl.url;
            let result = url
              .replace(/{RN}/, revNum)
              .replace(/{LN}/, lineNum)
              .replace(/{FP}/, getSubPath(fileName));
            if (url.indexOf('"') === -1) {
              result = encodeURI(result);
            }
            outputChannel.appendLine(result);
            outputChannel.show();

            vscode.env.clipboard.writeText(result);
            if (baseUrl.openBrowser) {
              open(result);
            }
          }
        });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  outputChannel.dispose();
}

const getSubPath = function(fullPath: string): string {
  const targetArray = ["trunk", "branches"].filter(t =>
    new RegExp(t).test(fullPath)
  );

  if (targetArray.length === 1) {
    const target = targetArray[0];
    return fullPath
      .substring(fullPath.indexOf(target))
      .replace(/\\/g, "/")
      .replace(new RegExp(`${target}.*?/`), `${target}/`);
  }
  return "";
};
