import { Spinner } from 'mondrian-react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import type { ParamProps } from './types';
import { sendToNice } from './util';

function App() {
	const [searchParams] = useSearchParams();
	const parameter = searchParams.get('p');

	useEffect(() => {
		if (!parameter) {
			toast.error(
				'Nenhum dado encontrado, por favor verifique a URL e tente novamente.',
				{
					duration: 10000,
				}
			);
			return;
		}

		const obj = Object.fromEntries(
			new URLSearchParams(atob(parameter)).entries()
		) as ParamProps;

		sendToNice(obj);

		// const convertToObject = (json: string): void => {
		// 	if (!json) {
		// 		return;
		// 	}
		// 	const obj: ParamProps = parseToObject(json);
		// 	sendToNice(obj);
		// };

		// try {
		// const json = formataDecriptografa(parameter!);
		// convertToObject(json);
		// } catch (error) {
		// toast.error(`Erro ao descriptografar o dado. ${error}`, {
		// duration: 10000,
		// });
		// }
		// }

		// const convertToObject = (json: string): void => {
		// 	if (!json) {
		// 		return;
		// 	}
		// 	const obj: ParamProps = parseToObject(json);
		// 	sendToNice(obj);
		// };

		// try {
		// const json = formataDecriptografa(parameter!);
		// convertToObject(json);
		// } catch (error) {
		// toast.error(`Erro ao descriptografar o dado. ${error}`, {
		// duration: 10000,
		// });
		// }
	}, [parameter]);

	return <Spinner inverse isLoading />;
}

export default App;
