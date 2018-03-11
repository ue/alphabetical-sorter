const vscode = require("vscode");

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.sortIt",
    function() {
      let editor = vscode.window.activeTextEditor;
      let lines = [];
      let selectionLength;

      const selection = editor.selection;
      const startPoint = selection.start.line;
      const endPoint = selection.end.line;
      const isSingleLine = selection.isSingleLine;

      if (isSingleLine) {
        selectionLength = editor.document.getText(selection).length;
        lines = editor.document
          .getText(selection)
          .replace(/\s/g, "")
          .split(",");
      } else {
        selectionLength = editor.document.lineAt(endPoint).text.length;
        for (let i = startPoint; i <= endPoint; i++) {
          lines.push(editor.document.lineAt(i).text);
        }
      }

      lines.sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });

      editor.edit(editBuilder => {
        isSingleLine
          ? editBuilder.replace(selection, lines.join(", "))
          : editBuilder.replace(
              new vscode.Range(startPoint, 0, endPoint, selectionLength),
              lines.join("\n")
            );
      });
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
