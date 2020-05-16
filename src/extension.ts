"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ExtensionCommandNames } from "./CommandNames";
import { Controllers } from "./Controllers";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "insert-file" is now active!');

  const insertFile = vscode.commands.registerCommand(
    ExtensionCommandNames.InsertFile,
    Controllers.insertFile
  );
  const insertFileAsBlock = vscode.commands.registerCommand(
    ExtensionCommandNames.InsertFileAsBlock,
    Controllers.InsertAsBlock
  );
  const insertLink = vscode.commands.registerCommand(
    ExtensionCommandNames.InsertAsLink,
    Controllers.InsertAsLink
  );
  const insertLinkAsImage = vscode.commands.registerCommand(
    ExtensionCommandNames.InsertAsImageLink,
    Controllers.InsertAsImageLink
  );

  context.subscriptions.push(insertFile);
  context.subscriptions.push(insertFileAsBlock);
  context.subscriptions.push(insertLink);
  context.subscriptions.push(insertLinkAsImage);
}

// this method is called when your extension is deactivated
export function deactivate() {}
