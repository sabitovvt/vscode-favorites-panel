import * as vscode from 'vscode';
import {ERRORS, INFORMATION} from './consts';
import {errors} from './extension';

const {exec} = require('child_process');

// Run program or script
export function runProgram(program: string) {
    exec(program, {shell: true, encoding: 'utf8'}, function (err: any, data: any) {
        console.log(err);
        console.log(data.toString());
    });
}

// Open file
export function openFile(args: any) {
    const projectPath: string = vscode.workspace.rootPath || '';

    let document: string;

    if (args[1] !== 'external' && !!projectPath) {
        document = process.platform === 'win32' ? `${projectPath}\\${args[0]}` : `${projectPath}/${args[0]}`;
    } else {
        document = args[0];
    }

    vscode.workspace.openTextDocument(document).then(
        (doc) => {
            vscode.window.showTextDocument(doc);
        },
        () => {
            vscode.window.showErrorMessage(`${ERRORS.FILE_NOT_FOUND}: ${document}`);
        }
    );
}

// Run VSCode command
export function runCommand(args: any) {
    const [command, ...rest] = args;
    switch (command) {
        case '':
            errors.add(ERRORS.COMMAND_NOT_FOUND);
            break;
        case 'vscode.openFolder':
            if (!rest[0]) {
                errors.add(ERRORS.COMMAND_NOT_FOUND);
            }
            vscode.commands.executeCommand(command, vscode.Uri.file(rest[0]));
            break;
        case 'vscode.open':
            if (!rest[0]) {
                errors.add(ERRORS.COMMAND_NOT_FOUND);
            }
            vscode.commands.executeCommand(command, vscode.Uri.parse(rest[0]));
            break;
        default:
            vscode.commands.executeCommand(command, ...rest);
    }

    errors.show();
}

// Add code to file
export function insertNewCode(args: any) {
    const [file, searchPattern, newCode, action = 'before'] = args;
    const projectPath: string = vscode.workspace.rootPath || '';
    const document: string = `${projectPath}\\${file}`;
    vscode.workspace.openTextDocument(document).then(
        (doc) => {
            vscode.window.showTextDocument(doc).then(() => {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const regexp = action === 'replaceAll' ? new RegExp(searchPattern, 'g') : new RegExp(searchPattern);
                    const fullText = editor.document.getText();
                    const index = fullText.search(regexp);
                    const searchedText = (fullText.match(regexp) || [])[0];
                    const positionStart = editor.document.positionAt(index);
                    const positionEnd = editor.document.positionAt(index + (searchedText?.length || 0));
                    switch (action) {
                        case 'replace':
                            const range = new vscode.Range(positionStart, positionEnd);
                            editor.edit((editBuilder) => {
                                editBuilder.replace(range, newCode);
                            });
                            break;
                        case 'replaceAll':
                            const matchAll = Array.from(fullText.matchAll(regexp));
                            editor.edit((editBuilder) => {
                                matchAll.forEach((item) => {
                                    const searchedText = item[0]?.length;
                                    const positionStart = editor.document.positionAt(Number(item.index));
                                    const positionEnd = editor.document.positionAt(Number(item.index) + searchedText);
                                    const range = new vscode.Range(positionStart, positionEnd);
                                    editBuilder.replace(range, newCode);
                                });
                            });
                            break;
                        case 'after':
                            errors.add(ERRORS.COMMAND_NOT_SUPPORTED_YET);
                            break;
                        case 'before':
                        default:
                            editor.edit((editBuilder) => {
                                editBuilder.insert(positionStart, newCode);
                            });
                    }
                }
            });
        },
        () => {
            errors.add(`${ERRORS.FILE_NOT_FOUND}: ${document}`);
        }
    );

    errors.show();
}

// Open URL
// DEPRECATED
export function openUrl(args: any) {
    if (!args[0]) {
        vscode.window.showErrorMessage('Не найден url!');
        return;
    }
    vscode.window.showInformationMessage(`${INFORMATION.DEPRECATED} \n use the "vscode.open" command`);
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(args[0]));
}
