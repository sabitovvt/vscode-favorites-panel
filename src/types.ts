import * as vscode from 'vscode';

export interface IStore {
    commands: TCommand[];
}

export type TCommand = (ICommand | ICommandWithSequence);

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
    icon?: string;
    command: string;
    arguments?: Array<any>;
}

export interface ICommandWithSequence {
    label: string;
    description?: string;
    icon?: string;
    sequence?: Array<ICommand>;
}
