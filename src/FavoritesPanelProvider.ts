import * as vscode from 'vscode';
import {getCommandsForTree} from './extension';
import {TreeItem} from './TreeItem';

// Tree View
export class FavoritesPanelProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | void> = new vscode.EventEmitter<TreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | void> = this._onDidChangeTreeData.event;
    constructor(private commands: any) {}

    refresh(): void {
        this.commands = getCommandsForTree();
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<TreeItem> {
        return element;
    }

    getChildren(element?: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
        if (!this.commands) {
            vscode.window.showInformationMessage('Commands not found');
            return Promise.resolve([]);
        }

        if (element === undefined) {
            return this.commands;
        }
        return element.children;
    }
}
