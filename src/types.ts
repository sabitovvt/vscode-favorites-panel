import * as vscode from 'vscode';

export interface IItem extends vscode.TreeItem {
    collapsibleState: number;
    label: string;
    version: string;
    command?: any;
    iconPath: any;
}

export interface ICommand {
    label: string;
    description?: string;
    command: string;
    arguments?: Array<any>;
}
