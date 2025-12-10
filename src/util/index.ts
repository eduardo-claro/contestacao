/* eslint-disable @typescript-eslint/no-explicit-any */
import CryptoJS from 'crypto-js';
import type { ParamProps } from '../types';

export function formataDecriptografa(infoCriptografada: string): string {
	const key = '2e35f242a46d67eeb74aabc37d5e5d06';
	const iv = 'b74aabc37d5e5d052e35f242a46d67ef';

	const parsedKey = CryptoJS.enc.Base64.parse(key);
	const parsedIv = CryptoJS.enc.Base64.parse(iv);

	const decoded = atob(decodeURIComponent(infoCriptografada));

	const decrypted = CryptoJS.AES.decrypt(decoded, parsedKey, {
		iv: parsedIv,
	});

	const result = decrypted.toString(CryptoJS.enc.Utf8);
	return JSON.parse(result);
}

export function formataCriptografa(info: unknown): string {
	const key = '2e35f242a46d67eeb74aabc37d5e5d06';
	const iv = 'b74aabc37d5e5d052e35f242a46d67ef';

	const parsedKey = CryptoJS.enc.Base64.parse(key);
	const parsedIv = CryptoJS.enc.Base64.parse(iv);

	// Transforma o objeto em string antes de criptografar
	const json = JSON.stringify(info);

	const encrypted = CryptoJS.AES.encrypt(json, parsedKey, {
		iv: parsedIv,
	});

	// AES.encrypt retorna um objeto — precisamos pegar o ciphertext em Base64
	const base64 = encrypted.toString();

	// Mesma "ida inversa" que você usa no decrypt
	const encoded = encodeURIComponent(btoa(base64));

	return encoded;
}

export const parseToObject = (json: string): ParamProps => {
	return JSON.parse(json);
};

export const sendToNice = (data: ParamProps): void => {
	console.log('Dados: ', data);

	const p1 = data.nome;
	const p2 = data.email;
	const p3 = data.telefone;
	const p4 = data.cpf;
	const p5 = data.origem;
	const p6 = data.layout;
	const p7 = data.token;
	const p8 = data.segmento;

	createDFOChatSession(p1, p2, p3, p4, p5, p6, p7, p8, data);
};

/**
 * Declaring the global window object to dfo chat
 */
declare global {
	interface Window {
		cxone: (...args: any[]) => void;
	}
}
/**
 * Declaring the function to dfo chat
 *
 * @param args
 */
declare function cxone(...args: any[]): void;
export {};

/**
 *  Create a chat session using the dfo chat client
 *
 * @param p1 parameter 1 - fullName
 * @param p2 parameter 2 - email
 * @param p3 parameter 3 - phone
 * @param p4 parameter 4 - passportNumber
 * @param data form fields
 */
const createDFOChatSession = (
	p1: string,
	p2: string,
	p3: string,
	p4: string,
	p5: string,
	p6: string,
	p7: string,
	p8: string,
	data: ParamProps
) => {
	cxone('init', '5290');
	cxone('chat', 'init', 5290, 'chat_947dc39f-8c5b-471f-9110-cdf79737789e');
	cxone('chat', 'hidePreSurvey');
	cxone('chat', 'setCaseCustomField', 'p1', p1);
	cxone('chat', 'setCaseCustomField', 'p2', p2);
	cxone('chat', 'setCaseCustomField', 'p3', p3);
	cxone('chat', 'setCaseCustomField', 'p4', p4);
	cxone('chat', 'setCaseCustomField', 'p5', p5);
	cxone('chat', 'setCaseCustomField', 'p6', p6);
	cxone('chat', 'setCaseCustomField', 'p7', p7);
	cxone('chat', 'setCaseCustomField', 'p8', p8);
	cxone('chat', 'setCustomerName', data.nome);

	// Abre em tela cheia
	cxone('chat', 'setFullDisplay');

	// Custom CSS
	const customCss = `[data-selector="WINDOW"] {left: -15px;padding-left: 15px;} [data-selector="HEADER"] {background: #da291c;} [data-selector="HEADER"] span {height: 60px; overflow: hidden; position: absolute; width: 300px; clip: unset; color: white;} h1 {visibility: hidden;  position: relative;} h1::after { content: url("https://ctigateway.c2x.com.br/ClaroChatV2/img/claro.svg");  visibility: visible;  position: absolute;  left: 0;  top: -8px;} [data-cy="header-minimize-window"] {display: none;} [data-selector="SEND_BUTTON"] {background: #da291c; color: white} [data-selector="TEXTAREA"] {} [data-selector="AGENT_MESSAGE_BUBBLE"] {color: black;} [data-selector="CUSTOMER_MESSAGE_BUBBLE"] {background-color: #da291c !important; color: white !important;}`;

	cxone('chat', 'setCustomCss', customCss);

	// Mostrar botão de enviar
	cxone('chat', 'showSendButton');
	//abre janela do chat
	cxone('chat', 'openChatWindow');

	localStorage.clear();

	cxone(
		'chat',
		'sendFirstMessageAutomatically',
		'Olá, meu nome é ' + data.nome
	);
	cxone('chat', 'hideFirstSentMessage', true);

	cxone(
		'chat',
		'onPushUpdate',
		['CaseStatusChanged'],
		(pushUpdatePayload: any) => {
			if (
				typeof pushUpdatePayload === 'undefined' ||
				typeof pushUpdatePayload.data === 'undefined'
			) {
				return;
			}

			const { status } = pushUpdatePayload.data.case || {};
			console.log('status', status);

			if (typeof status === 'undefined') {
				console.log('status undefined');
				return;
			}
			// When a previous case has been closed, this will set the custom fields again.
			if (status === 'closed') {
				console.log('status closed');
				localStorage.clear();
				localStorage.removeItem('cxone:5290:_BECustomerId');

				// TODO: encontrar melhor maneira de finalizar o chat
				alert(
					`Agradecemos o contato. Em breve voltaremos para o formulário principal.`
				);
			}
		}
	);

	//Sessão automatica
	cxone('chat', 'autoStartSession');
};
