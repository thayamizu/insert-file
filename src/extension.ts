'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {InsertFile} from './InsertFile';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "insert-file" is now active!');

    let command = new InsertFile.InsertFileCommand();
    command.initialize();

    const inputBoxOption = {placeHolder:"Please input file path.", prompt:""};

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let insertFile = vscode.commands.registerCommand('extension.insertFile', () => {
        // The code you place here will be executed every time your command is executed
        let thenable = vscode.window.showInputBox(inputBoxOption);
        thenable.then((path)=>{
                if (path == undefined) {
                    return;
                }
                command.insertFileContents(path);
        });
 
    });

    let insertLink = vscode.commands.registerCommand('extension.insertAsLink', () => {
        let thenable = vscode.window.showInputBox(inputBoxOption);
        thenable.then((path)=>{
            let linkThenable = vscode.window.showInputBox(inputBoxOption);
            linkThenable.then(link=> {
                command.insertFileAsLink(path, link);
            });
        });
    });


    context.subscriptions.push(insertFile);
    context.subscriptions.push(insertLink);
}

// this method is called when your extension is deactivated
export function deactivate() {
}