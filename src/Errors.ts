import * as vscode from 'vscode';

// Error management
export class Errors {
    errors: string[];

    constructor() {
        this.errors = [];
    }

    add(error: string): void {
        this.errors.push(error);
    }

    show() {
        if (this.errors.length > 0) {
            this.errors.forEach((error) => vscode.window.showErrorMessage(error));
            this.errors.length = 0;
        }
    }
}
