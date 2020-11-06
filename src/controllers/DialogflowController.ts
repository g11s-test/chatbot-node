import { Request, Response } from 'express';
import { WebhookClient, Suggestion, Image } from 'dialogflow-fulfillment';
import { weatherService, transformData } from '../services/WeatherService';

interface ContextParameters {
  city?: string;
  day?: number;
}

export const messageAgent = (request: Request, response: Response) => {
  const agent = new WebhookClient({ request, response });

  const opcoesCidade = () => {
    const { city }: ContextParameters = agent.contexts[0].parameters;

    if (city) {
      return opcoesDia();
    }

    agent.add(`Zeca: Hmmm, está preocupado com o tempo!
    Diga-me o nome da cidade que deseja saber, por favor? 
    Busco ela num instante!`);

    agent.add(new Suggestion('Rio de Janeiro'));
    agent.add(new Suggestion('São Paulo'));
    agent.add(new Suggestion('Curitiba'));
  };

  const opcoesDia = () => {
    const { city, day }: ContextParameters = agent.contexts[0].parameters;

    if (day) {
      return consultaAPI();
    }

    switch (city) {
      case 'São Paulo':
        agent.add('São Paulo');
        agent.add(
          new Image(
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/ColinaPenhaSP.jpg/240px-ColinaPenhaSP.jpg'
          )
        );
        agent.add(
          `Zeca: As coisas estão se normalizando. Acabei de receber uma ligação de 
          São Paulo.`
        );
        break;
      case 'Curitiba':
        agent.add('Curitiba');
        agent.add(
          new Image(
            'https://thumbnails.trvl-media.com/tVgU7_QO23E75yDzbzvdxGDfPoE=/360x224/smart/filters:no_upscale():quality(80)/mediaim.expedia.com/destination/1/f21e52db943db3f3b8140ea975e11428.jpg'
          )
        );
        agent.add(`Zeca: Se você achava o coração da morena um gelo, 
        experimenta conhecer Curitiba`);
        break;
      case 'Rio de Janeiro':
      default:
        agent.add('Rio de Janeiro');
        agent.add(
          new Image(
            'https://journication.de/aii/width=866/wp-content/uploads/sites/110/2020/04/rio-de-janeiro-brasilien-brazil-corcovado-view-point-aussicht-panorama-city-bay-ocean-botafogo-sugar-loaf-zuckerhut-pao-de-acucar-120x120.jpg.webp'
          )
        );
        agent.add(
          `Zeca: No Carnaval do Rio de Janeiro esse ano vão gritar que tiro foi esse 
          e muita gente não vai saber se dança ou se corre.`
        );
        break;
    }

    agent.add('Agora diga pro Zeca, de qual dia deseja saber?');
    agent.add(new Suggestion('Hoje'));
    agent.add(new Suggestion('Amanhã'));
    agent.add(new Suggestion('Depois de amanhã'));
  };

  const consultaAPI = async () => {
    const { city, day }: ContextParameters = agent.contexts[0].parameters;

    try {
      const responseWeather = await weatherService(city, day);

      const {
        condictionsIcon,
        initialMessage,
        tempMessage,
        condictionsMessage,
        rainMessage,
      } = transformData(responseWeather, day);

      agent.add(new Image(condictionsIcon));
      agent.add(initialMessage);
      agent.add(tempMessage);
      agent.add(condictionsMessage);
      agent.add(rainMessage);
    } catch (error) {
      if (error.trait) {
        return agent.add(error.trait);
      }

      agent.add('Zeca: Não consegui identificar como está o tempo!');
    }
  };

  const intentMap = new Map();
  intentMap.set('tempo.cidade', opcoesCidade);
  intentMap.set('tempo.cidade - escolha-cidade', opcoesDia);
  intentMap.set('tempo.cidade - escolha-dia', consultaAPI);
  agent.handleRequest(intentMap);
};
