import * as fs from 'fs';
import * as vscode from 'vscode';

export namespace InsertFile {

	/**
	 * Inspublic ertFileCommand
	 */
	export class InsertFileCommand {
		public constructor(parameters) {
			
		}
		/**
		 * name
		 */
		public showFileDialog() {
			let uri = vscode.Uri.parse('file:///C:/Users/hayamizu/Downloads/');
			//let success = vscode.commands.executeCommand('workbench.action.files.open', uri);
			vscode.commands.executeCommand("Files:Open File", uri);

			 var e = new Date().getTime() + (10000);
      		while (new Date().getTime() <= e);
		}

		public getFileContents(file_path : string) {
			let text : string = "";
			try {
				text =  fs.readFileSync(file_path, "Shift_JIS");
				
			} catch (error) {
				vscode.window.showErrorMessage(error.message);
			}

			return text;
		}

		public getFileAsLink(file_path : string, link_name : string) {
			const link = "(" + link_name +")[" + file_path + "]";
			return link;
		}
  	}
}