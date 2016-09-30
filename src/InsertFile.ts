'use strict'
import * as fs from 'fs';
import * as vscode from 'vscode';

export namespace InsertFile {

	/**
	 * InsertFile Command
	 */
	export class InsertFileCommand {
		/**
		 * command configuration
		 */
		private _configuration : Configuration;

		/**
		 * constructor
		 */
		public constructor() {
			let result = true;
			try {
				this._configuration = new Configuration();
			} catch (error) {
				vscode.window.showErrorMessage('extension initialization is failed.');
			}
		}

		/**
		 * initialize
		 */
		public initialize() {
			let configuration = vscode.workspace.getConfiguration("insert-file");
			let setValue = configuration.get<string>("encoding");
			if (setValue == "") {
				setValue = "utf-8";
			}

			this._configuration.encoding = setValue;
		}

		/**
		 * insertFileContents
		 */
		public insertFileContents(fileName : string) {
			//check rootPath 
            let rootPath = vscode.workspace.rootPath;
			if (rootPath == "") {
				vscode.window.showErrorMessage("Please Open Folder...");
				return;
			}

			//check filePath
            let filePath = `${rootPath}/${fileName}`;
            let text = this.getFileContents(filePath);
			
			//inser contents
			this.editText(text);
		}

		/**
		 * insertFileAsLink
		 */
		public insertFileAsLink(filePath : string, linkName : string) {
            let text = this.getFileAsMarkdownLink(filePath, linkName);
            this.editText(text);
		}

		/**
		 * get file contents
		 * param filePath : string
		 */
		private getFileContents(filePath : string) {
			let text : string = "";
			try {
				text =  fs.readFileSync(filePath, this._configuration.encoding);
			} catch (error) {
				vscode.window.showErrorMessage(error.message);
			}

			return text;
		}

		/**
		 * get file as link for markdown
		 */
		private getFileAsMarkdownLink(filePath : string, linkName) {
			const link = `[${linkName}](${filePath})`;
			return link;
		}

		/**
		 * editText
		 */
		private editText(text : string ) {
			let editor = vscode.window.activeTextEditor;
			let insertPosition : vscode.Position = editor.selection.active;

			//edit text
			editor.edit(edit => {
				edit.insert(insertPosition, text);
			});		
		}
  	}

	/**
	 * Configuration
	 */
	export class Configuration
	{
		/**
		 * default file encoding
		 */
		private _encoding : string;
		public get encoding() : string {
			return this._encoding;
		}
		public set encoding(v : string) {
			this._encoding = v;
		}		
	}
}