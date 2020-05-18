"use strict";
import * as vscode from "vscode";
import { InsertFileCommand } from "./Command";

export namespace Controllers {
  const command = new InsertFileCommand();

  const dialogOptions: vscode.OpenDialogOptions = {
    canSelectMany: false,
  };

  const inputBoxOptions: vscode.InputBoxOptions = {
    placeHolder: "Please input link name.",
    prompt: "",
  };

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  export const insertFile = async () => {
    // The code you place here will be executed every time your command is executed
    const entries = await vscode.window.showOpenDialog(dialogOptions);
    if (!entries) {
      return;
    }

    entries.forEach(async (uri: vscode.Uri) => {
      command.insertFileContents(uri.fsPath);
    });
  };

  export const InsertAsBlock = async () => {
    // The code you place here will be executed every time your command is executed
    const entries = await vscode.window.showOpenDialog(dialogOptions);
    if (!entries) {
      return;
    }

    entries.forEach(async (uri: vscode.Uri) => {
      command.insertAsBlock(uri.fsPath);
    });
  };

  export const InsertAsLink = async () => {
    const entries = await vscode.window.showOpenDialog(dialogOptions);
    if (!entries) {
      return;
    }

    entries.forEach(async (uri: vscode.Uri) => {
      const linkName = await vscode.window.showInputBox(inputBoxOptions);
      if (linkName == undefined || linkName == null) {
        return;
      }

      command.insertAsLink(uri.fsPath, linkName);
    });
  };

  export const InsertAsImageLink = async () => {
    const entries = await vscode.window.showOpenDialog(dialogOptions);
    if (!entries) {
      return;
    }
    entries.forEach(async (uri: vscode.Uri) => {
      const linkName = await vscode.window.showInputBox(inputBoxOptions);
      if (linkName == undefined || linkName == null) {
        return;
      }

      command.insertAsImageLink(uri.fsPath, linkName);
    });
  };
}
