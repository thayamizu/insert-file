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
		private _configuration : Configuration = new Configuration();

		/**
		 * constructor
		 */
		public constructor() {
			
		}

		/**
		 * initialize
		 */
		public initialize() {
			const configuration = vscode.workspace.getConfiguration("insert-file");
			const setValue = configuration.get<BufferEncoding>("encoding");
			if (setValue) {
				this._configuration.encoding = setValue;
			}

		}

		/**
		 * insertFileContents
		 */
		public insertFileContents(fileName : string) {
			let text = this.getFileContents(fileName);
			
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
		private getFileAsMarkdownLink(filePath : string, linkName: string) {
			const link = `[${linkName}](${filePath})`;
			return link;
		}

		/**
		 * editText
		 */
		private editText(text : string ) {
			let editor = vscode.window.activeTextEditor;
			if (!editor) {
				return
			}

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
		private _encoding : BufferEncoding;

		/**
		 *
		 */
		constructor() {
			this._encoding = "utf-8"
			
		}
		public get encoding() : BufferEncoding {
			return this._encoding;
		}
		public set encoding(v : BufferEncoding) {
			this._encoding = v;
		}		
	}
}