"use strict";
import { readFile } from "fs";
import { relative, join, resolve } from "path";
import { promisify } from "util";
import * as vscode from "vscode";
import * as glob from "glob"

/**
 * InsertFile Command
 */
export class InsertFileCommand {
  /**
   * command configuration
   */
  private _configuration: Configuration = new Configuration();

  /**
   * constructor
   */
  public constructor() {
    const configuration = vscode.workspace.getConfiguration("insert-file");
    const setValue = configuration.get<BufferEncoding>("encoding");
    if (setValue) {
      this._configuration.encoding = setValue;
    }
    const glob = configuration.get<string>("glob");
    if (glob) {
      this._configuration.glob = glob;
    }
    const mode = configuration.get<string>("mode");
    if (mode) {
      this._configuration.mode = mode;
    }
  }

  /**
   * insertFileContents
   * @param fileName
   * @return void
   */
  public async insertFileContents(fileName: string) {
    const text = await this.getFileContents(fileName);
    const contents = `${text}\n`;
    //insert contents
    this.editText(text);
  }

  /**
   * insertFileContentsAsCodeBlock
   * @param fileName
   * @return void
   */
  public async insertAsBlock(fileName: string) {
    const contents = await this.getFileContents(fileName);
    const text = `\`\`\`\n${contents}\n\`\`\`\n`;
    this.editText(text);
  }

  /**
   * insertFileAsLink
   * @param filePath
   * @param linkName
   * @return void
   */
  public insertAsLink(filePath: string, linkName: string) {
    const text = this.getFileAsMarkdownLink(filePath, linkName);
    this.editText(text);
  }

  /**
   * insertFileAsImageLink
   * @param filePath
   * @param linkName
   * @return void
   */
  public insertAsImageLink(filePath: string, linkName: string) {
    const text = `!${this.getFileAsMarkdownLink(filePath, linkName)}`;
    this.editText(text);
  }

  public batch() {
    console.log('execute batch!');
    const root: string = vscode.workspace.rootPath as string;
    const path = join(root, this._configuration.glob)
    console.log(`${root} ${path}`);


    (async () => {
      const collection = glob.sync(path)
      for (let item of collection) {
        const content = await this.getFileContents(item)
        console.log('start')
        await this.editTextASync(content)
        console.log('end')

      }
    })()
  }

  /**
   * get file contents
   * @param filePath
   */
  private async getFileContents(filePath: string) {
    let text = "";
    try {
      const readFileSync = promisify(readFile);
      text = await readFileSync(filePath, this._configuration.encoding);
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
  private getFileAsMarkdownLink(filePath: string, linkName: string) {
    const root: string = vscode.workspace.rootPath as string;
    const relativePath = relative(root, filePath);
    return `[${linkName}](${relativePath})`;
  }

  /**
   * edit editor text
   * @param text
   * @return void
   */
  private editText(text: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const tail: number = editor.document.lineCount
    const position: vscode.Position = new vscode.Position(tail, 0)

    //edit text
    editor.edit((edit) => {

      console.log(`${position.line}`)
      edit.insert(position, `${text}\n`);
    })

    editor.document.save();
  }

  /**
 * edit editor text
 * @param text
 * @return void
 */
  private async editTextASync(text: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    //edit text
    return new Promise((resolve) => {
      editor.edit((edit) => {
        const position = editor.selection.active
        console.log(`${position.line}`)
        text += "\n"
        edit.insert(position, text)

      }).then(result => {
        editor.document.save()
        resolve(result)
      })

    })

  }
}

/**
 * Configuration
 */
export class Configuration {
  /**
   * default file encoding
   */
  private _encoding: BufferEncoding;

  /**
   * constructor
   */
  constructor() {
    this._encoding = "utf-8";
    this._glob = ""
    this._mode = ""
  }

  /**
   * get encoding
   *
   * @type {BufferEncoding}
   * @memberof Configuration
   */
  public get encoding(): BufferEncoding {
    return this._encoding;
  }

  /**
   * set encoding
   *
   * @memberof Configuration
   */
  public set encoding(v: BufferEncoding) {
    this._encoding = v;
  }


  private _glob: string;
  public get glob(): string {
    return this._glob;
  }
  public set glob(v: string) {
    this._glob = v;
  }


  private _mode: string;
  public get mode(): string {
    return this._mode;
  }
  public set mode(v: string) {
    this._mode = v;
  }

}
