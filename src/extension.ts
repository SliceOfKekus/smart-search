import { ExtensionContext } from 'vscode';
import { Uri } from 'vscode';

import { commands } from 'vscode';
import { window } from 'vscode';
import { env } from 'vscode';

function isLetter (str: string) {
	/* 
	*	Проверяет, явлется ли символ буквой
	*
	* 		Входные параметры:
	* 			str (string): текст для проверки
	* 
	* 		Возвращаемое значение:
	* 			(bool): результат проверки на соответствие букве
	*/
	return (/[a-zA-Z]/).test(str);
}

function toASCII (symbol: string) {
	/* 
	*	Переводит символ в ASCII и конвертирует его в 16-ую строку
	*
	* 		Входные параметры:
	* 			str (string): символ для конвертации
	* 
	* 		Возвращаемое значение:
	* 			(string): ASCII-представление символа в виде 16-ой строки
	*/
	return symbol.charCodeAt(0).toString(16).toUpperCase();
}

export function activate(context: ExtensionContext) {
	/* 
	*	Входная точка при первом запуске расширения. Выставляет все необходимые команды для правильной работы расширения
	*
	* 		Входные параметры:
	* 			context (ExtensionContext): контекст расширения
	* 
	* 		Возвращаемое значение:
	* 
	*/
	let searchCommand = commands.registerCommand('tagged-search.stackoverflowSearch', async () => {
		const query = await window.showInputBox({
			title: "Tagged Stackoverflow Search",
			prompt: "prompt",
			placeHolder: "You next query is here"
		});

		if (!query) {
			return;
		}

	let parsed_tags = "";
	let tag = await window.showInputBox({
		title: "Tagged Stackoverflow Search",
		prompt: "If you willing to clarify query a bit better, add some tags",
		placeHolder: "This tags only yours"
	});

	while (tag) {
		let tag_ = tag.toString();
		let add_tag = "%5B";

		for (let index = 0; index < tag_.length; index++) {
			if (isLetter(tag_[index])) {
				add_tag += tag_[index];
				continue;
			}
			else {
				add_tag += "%" + toASCII(tag_[index]);
			}
		}

		add_tag += "%5D";
		console.log(add_tag);
		parsed_tags += add_tag;
		tag = await window.showInputBox({
			title: "Tagged Stackoverflow Search",
			prompt: "If you willing to clarify query a bit better, add some tags",
			placeHolder: "This tags only yours"
		});
	}

	const path = "https://stackoverflow.com/search?q=" + parsed_tags + query;

	let uri = Uri.parse(path);

	console.log(uri.toString());

	env.openExternal(uri);
	});

	context.subscriptions.push(searchCommand);

	let quickSearchCommand = commands.registerCommand('tagged-search.stackoverflowFastSearch', () => {
		let editor = window.activeTextEditor;

		if (!editor) {
			return;
		}

		const selection = editor.selection;

		if (selection.isEmpty) {
			return;
		}
		
		const query = editor.document.getText(selection);
		const tag = "%5B" + editor.document.languageId + "%5D";
		const path = "https://stackoverflow.com/search?q=" + tag + query;

		env.openExternal(Uri.parse(path));
	});

	context.subscriptions.push(quickSearchCommand);
}

export function deactivate() {
	/* 
	*	Выходная точка расширения. Вызывается в момент отключения или удаления расширения
	*
	* 		Входные параметры:
	* 
	* 		Возвращаемое значение:
	* 
	*/
}
