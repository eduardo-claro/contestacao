import { Heading, Spinner, Text } from 'mondrian-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
	formataDecriptografa,
	parseToObject,
	reloadWithoutParam,
	sendToNice,
} from './util';

function App() {
	const [searchParams] = useSearchParams();
	const parameter = searchParams.get('p');
	const [loading, setLoading] = useState<boolean>(true);

	const [mensagem] = useState<string>('Agradecemos o contato.');
	const [showSubMessage, setShowSubMessage] = useState<boolean>(false);
	const [subMessage] = useState<string>(
		'Nenhum dado encontrado, por favor verifique a URL e tente novamente.',
	);
	const [closeWindowMessage] = useState<string>(
		'Você já pode fechar esta janela.',
	);

	const hasProcessed = useRef(false);

	useEffect(() => {
		const processarEnvio = async () => {
			// 1. Caso não tenha parâmetro
			if (!parameter) {
				if (!hasProcessed.current) {
					toast.error(
						'Nenhum dado encontrado, por favor verifique a URL e tente novamente.',
						{
							duration: 10000,
						},
					);
					setShowSubMessage(true);
					setLoading(false);
				}
				return;
			}

			// 2. Evita re-processamento se o parâmetro mudar por algum motivo
			if (hasProcessed.current) return;
			hasProcessed.current = true;

			try {
				const dados = formataDecriptografa(parameter);
				const obj = parseToObject(dados);

				// Executa a função de envio (Nice/DFO)
				await sendToNice(obj);

				// Remove o parâmetro da URL
				reloadWithoutParam();
			} catch (error) {
				toast.error(`Erro ao descriptografar: ${error}`);
			} finally {
				setLoading(false);
			}
		};

		processarEnvio();
	}, [parameter]);

	return (
		<>
			{loading ? (
				<Spinner inverse isLoading />
			) : (
				<div className='w-full h-screen flex items-center justify-center bg-(--theme-color-bg-content-brandPrimary-bg) text-white'>
					<div className='text-center'>
						<Heading inverse sm>
							{mensagem}
						</Heading>
						{showSubMessage && (
							<Text inverse sm>
								{subMessage}
							</Text>
						)}
						<Text inverse sm>
							{closeWindowMessage}
						</Text>
					</div>
				</div>
			)}
		</>
	);
}

export default App;
