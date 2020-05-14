"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { InsertFileCommand } from "./InsertFile";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "insert-file" is now active!');

  const command = new InsertFileCommand();

  const dialogOptions: vscode.OpenDialogOptions = {
    canSelectMany: false,
  };

  const inputBoxOptions: vscode.InputBoxOptions = {
    placeHolder: "Please input alternative name.",
    prompt: "",
  };

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let insertFile = vscode.commands.registerCommand(
    "extension.insertFile",
    async () => {
      // The code you place here will be executed every time your command is executed
      const entries = await vscode.window.showOpenDialog(dialogOptions);
      if (!entries) {
        return;
      }

      const uri = entries[0];
      command.insertFileContents(uri.path);
    }
  );

  let insertLink = vscode.commands.registerCommand(
    "extension.insertAsLink",
    async () => {
      const entries = await vscode.window.showOpenDialog(dialogOptions);
      if (!entries) {
        return;
      }
      const linkName = await vscode.window.showInputBox(inputBoxOptions);
      if (linkName == undefined || linkName == null) {
        return;
      }

      const uri = entries[0];
      command.insertFileAsLink(uri.path, linkName);
    }
  );

  context.subscriptions.push(insertFile);
  context.subscriptions.push(insertLink);
}

// this method is called when your extension is deactivated
export function deactivate() {}
