# Documentação

# Como rodar

Para rodar o projeto após baixar o repositório, siga os seguintes passos:

## Dialogflow

Inicialmente <b>crie um agente</b> no Dialogflow e faça a <b>importação</b> do nosso agente que está em <b>formato zip</b> na pasta principal do projeto<br />
<b>Observação:</b> O menu de importação você encontra acessando a engrenagem ao lado do nome do seu bot e depois clicando em <b>export and import</b><br /><br />

Ao terminar a importação, você já terá o nosso agente quase configurado, restando apenas configurar o <b>Fullfillment</b><br /><br />

Para configurar o Fullfillment também é bem fácil, acessa o menu <b>Fullfillment</b> na barra lateral esquerda do Dialogflow<br/>
E onde está escrito URL na parte de Webhook, você vai colocar o link gerado ao executar o comando <b>npm install</b> e depois <b>npm run tunnel</b> na pasta do projeto + /dialogflow, então por exemplo, se o link gerado for https://12345.com, você precisa colocar https://12345.com/dialogflow. Após adicionar o link, salve a alteração no Dialogflow e a parte do Fullfillment está finalizada.<br />
<b>Observação:</b> Caso já tenha instalado o ngrok, basta rodar o comando <b>ngrok http 8080</b>.

## Servidor

O servidor você precisa gerar uma <b>API Token</b> no site <b>https://weatherapi.com</b>, esse processo é relativamente simples, ao criar sua conta no site você já ganha acesso a uma API Token grátis. <br />
Com a API Token em mãos, crie uma cópia do arquivo .env.default e renomeie para .env.<br />
Após ter sua cópia do .env e sua api token, coloca a sua api token dentro do env, por exemplo: WEATHER_API_KEY=SEUTOKENAQUI<br /><br />

Agora com tudo configurado, basta executar o comando npm run dev e terá o projeto em execução, ao acessar a url gerada pelo ngrok, você terá uma mensagem informando que a api está funcionando :)

## Atenção

O Chatbot é dependente do servidor, precisa ter ambos rodando simultaneamente para buscar os dados.

# Documentação da API da WeatherAPI

<b>Mais informações:</b> https://www.weatherapi.com/docs

# Rotas do Servidor

<b>URL:</b> baseURL/<br />
<b>Descrição:</b> Rota princiapl, informa o status do servidor<br />
<b>Método</b>: GET

<b>URL:</b> baseURL/dialogflow<br />
<b>Descrição:</b> Rota que fica escutando o Dialogflow<br />
<b>Método</b>: POST
