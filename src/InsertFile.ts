'use strict'
import { readFile } from 'fs';
import { promisify } from 'util'
import * as vscode from 'vscode';

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
			const configuration = vscode.workspace.getConfiguration("insert-file");
			const setValue = configuration.get<BufferEncoding>("encoding");
			if (setValue) {
				this._configuration.encoding = setValue;
			}
		}

		/**
		 * insertFileContents
		 * @param fileName
		 * @return void
		 */
		public async insertFileContents(fileName : string) {
			let text = await this.getFileContents(fileName);
			
			//inser contents
			this.editText(text);
		}

		/**
		 * insertFileAsLink
		 * @param filePath
		 * @param linkName
		 * @return void
		 */
		public insertFileAsLink(filePath : string, linkName : string) {
            let text = this.getFileAsMarkdownLink(filePath, linkName);
            this.editText(text);
		}

		/**
		 * get file contents
		 * @param filePath
		 */
		private async getFileContents(filePath : string) {

			let text = ""
			try {
				const readFileSync = promisify(readFile)
				text = await readFileSync(filePath, this._configuration.encoding)
			} catch (error) {
				vscode.window.showErrorMessage(error.message);
			}

			return text;
		}

		/**
		 * get file as link for markdown
		 * @param filePath
		 * @param linkName
		 */
		private getFileAsMarkdownLink(filePath : string, linkName: string) {
			return `[${linkName}](${filePath})`;
		}

		/**
		 * edit editor text
		 * @param text
		 * @return void
		 */
		private editText(text : string ) {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return
			}

			//edit text
			editor.edit(edit => {
			    const insertPosition : vscode.Position = editor.selection.active;
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
		 * constructor
		 */
		constructor() {
			this._encoding = "utf-8"
			
		}

		/**
		 * get encoding
		 *
		 * @type {BufferEncoding}
		 * @memberof Configuration
		 */
		public get encoding() : BufferEncoding {
			return this._encoding;
		}

		/**
		 * set encoding
		 *
		 * @memberof Configuration
		 */
		public set encoding(v : BufferEncoding) {
			this._encoding = v;
		}		
	}