import { Request, Response } from 'express';
import dialogflow from '@google-cloud/dialogflow';

// Instantiates a session client
const sessionClient = new dialogflow.SessionsClient();

async function detectIntent(
  projectId: string,
  sessionId: string,
  query: string,
  languageCode: string,
  contexts: any
) {
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode,
      },
    },
    queryParams: {},
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts,
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

async function executeQueries(req: Request, res: Response) {
  const projectId: string = 'zeca-ativ';
  const sessionId: string = '123456789';
  const { query, user } = req.body;
  const languageCode: string = 'pt-br';

  let context;
  let intentResponse;
  try {
    intentResponse = await detectIntent(
      projectId,
      sessionId,
      query,
      languageCode,
      context
    );

    context = intentResponse.queryResult?.outputContexts;

    if (
      intentResponse.queryResult?.outputContexts &&
      intentResponse.queryResult?.outputContexts.length > 0 &&
      intentResponse.queryResult?.outputContexts[0].parameters?.fields?.city
    ) {
      const {
        city: { stringValue: city },
        day: { stringValue: day },
      } = intentResponse.queryResult?.outputContexts[0].parameters?.fields;

      if (city && !day) {
        return res.json({
          user,
          response:
            'Escolha dentre esses dias: Hoje, Amanhã ou Depois de Amanhã',
        });
      }

      if ((!city && day) || (!city && !day)) {
        return res.json({
          user,
          response:
            'Escolha dentre essas cidades: Rio de Janeiro, São Paulo ou Curitiba',
        });
      }
    }

    const messages = intentResponse.queryResult?.fulfillmentMessages;

    if (messages) {
      if (messages[4]) {
        return res.json({
          user,
          response: messages[4].text?.text,
        });
      }

      return res.json({
        user,
        response: 'Zeca: Desculpa, mas não consegui entender.',
      });
    }
  } catch (error) {
    return res.json({ error });
  }
}

export default executeQueries;
