import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Grid,
  Loader,
  Text,
  Title,
} from '@mantine/core';
import { AudioRecorder } from 'react-audio-voice-recorder';
import {
  IconAlertCircle,
  IconFlower,
  IconMicrophone,
  IconRefresh,
  IconRobot,
  IconUser,
  IconBrandSuperhuman,
} from '@tabler/icons';
import TextSlider from './api/slider.jsx';

interface MessageSchema {
  role: 'assistant' | 'user' | 'system';
  content: string;
}

const lastSentence: string =
  'Check-in was successful! 🎉\n Have a great day!\n\n\n*******************************\n\nReservation Number: XXXXXXXXXX \n\n Schedule: \n Check-in: March 23, 2023, 13:00 - 23:00 \n\n Check-out: March 24, 2023, by 10:00 \n\n Plan: Private Sauna and Open-Air Bath Plan \n\n Room: Private Sauna and Open-Air Bath Plan ';
// roles
const botRolePairProgrammer =
  'You are an expert pair programmer helping build an AI bot application with the OpenAI ChatGPT and Whisper APIs. The software is a web application built with NextJS with serverless functions, React functional components using TypeScript.';
const hotelChatBot = `You are an AI chatbot that assists with the check-in/check-out process at a hotel called Hik@ri's Inn. 
You act as a member of the hotel staff, providing hospitable service to guests.  
Your main responsibility is to ensure that guests have a smooth and comfortable stay.
You must only ask the guest for their reservation number and name.
Your task is to ask for the reservation number and, if successful, the guest's name. 
After obtaining these two pieces of information, you are to return specific data.
Please include appropriate line breaks (\n) in the specific data returned in the response. 
The specific data is as follows: ${lastSentence} `;

// personalities
const quirky =
  'You are quirky with a sense of humor. You crack jokes frequently in your responses.';
const drugDealer =
  'You are a snarky black market drug dealer from the streets of Los Angeles. Sometimes you are rude and disrespectful. You often curse in your responses.';
const straightLaced =
  'You are a straight laced corporate executive and only provide concise and accurate information.';
const gentleHotelMan =
  'You provide gentle, warm, and sincere service like a top-notch hotel staff. However, when it comes to important information regarding reservations, you act like a straight-laced corporate executive, providing only concise and accurate information.';

// brevities
const briefBrevity = 'Your responses are always 1 to 2 sentences.';
const longBrevity = 'Your responses are always 3 to 4 sentences.';
const whimsicalBrevity = 'Your responses are always 5 to 6 sentences.';

// dials
const role = hotelChatBot;
const personality = gentleHotelMan;
const brevity = briefBrevity;

// FULL BOT CONTEXT
const botContext = `${role} ${personality} ${brevity}`;

export default function Home() {
  const defaultContextSchema: MessageSchema = {
    role: 'assistant',
    content: botContext,
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messagesArray, setMessagesArray] = useState([defaultContextSchema]);

  useEffect(() => {
    if (
      messagesArray.length > 1 &&
      messagesArray[messagesArray.length - 1].role !== 'system'
    ) {
      gptRequest();
    }
  }, [messagesArray]);

  // gpt request
  const gptRequest = async () => {
    // await gptRequestInOrg();
    // 翻訳した文を入れる、不発だった↓
    const gptResponse = await gptRequestInOrg();
    // const gptResponseObj = gptResponse.json();
    // console.log('gptResponseObj: ' + gptResponseObj);
    console.log('gptResponse', typeof gptResponse);
    console.log('messagesArray', messagesArray[messagesArray.length - 1]);

    if (gptResponse) {
      getTranslatedSentence(gptResponse);
    }
  };

  // レスポンスを取ってくる
  const gptRequestInOrg = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('messagesArray in gptRequest fn', messagesArray);
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messagesArray,
        }),
      });

      const gptResponse = await response.json();
      setLoading(false);
      if (gptResponse.content) {
        setMessagesArray((prevState) => [...prevState, gptResponse]);
        const res = gptResponse;
        return res;
      } else {
        setError('No response returned from server.');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //get translation in JP
  const getTranslatedSentence = async (input: any) => {
    setLoading(true);
    setError(null);
    const contentString = input.content;
    // const sentense = `Translate "${contentString}" in Japanese.`;
    try {
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Translate the following English text to Japanese:',
            },
            { role: 'system', content: contentString },
          ],
        }),
      });

      const gptResponse = await response.json();
      setLoading(false);
      if (gptResponse.content) {
        setMessagesArray((prevState) => [...prevState, gptResponse]);
      } else {
        setError('No response returned from server.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateMessagesArray = (newMessage: string) => {
    const newMessageSchema: MessageSchema = {
      role: 'user',
      content: newMessage,
    };
    console.log({ messagesArray });
    setMessagesArray((prevState) => [...prevState, newMessageSchema]);
  };

  // whisper request
  const whisperRequest = async (audioFile: Blob) => {
    setError(null);
    setLoading(true);
    const formData = new FormData();
    formData.append('file', audioFile, 'audio.wav');
    try {
      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });
      const { text, error } = await response.json();
      if (response.ok) {
        updateMessagesArray(text);
      } else {
        setLoading(false);
        setError(error.message);
      }
    } catch (error) {
      console.log({ error });
      setLoading(false);
      if (typeof error === 'string') {
        setError(error);
      }
      if (error instanceof Error) {
        setError(error.message);
      }
      console.log('Error:', error);
    }
  };

  //聞きたい情報が取れたかどうか

  const hasReservationID: boolean = false;
  const hasName: boolean = false;

  return (
    <>
      <Head>
        <title>CheckMate</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container size="sm" mt={25}>
        <Center>
          {/* <IconUser size={30} color="teal" /> */}
          <Text
            size={30}
            weight={900}
            pl={5}
            variant="gradient"
            gradient={{ from: 'blue', to: 'teal' }}
          >
            👬 CheckMate
          </Text>
        </Center>

        {error && (
          <Alert
            icon={<IconAlertCircle />}
            title="Bummer!"
            color="red"
            variant="outline"
          >
            {error}
          </Alert>
        )}

        {messagesArray.length === 1 && (
          <Box fz="l" maw={900} mx="auto" mt={200}>
            <TextSlider />
          </Box>
        )}

        {/* {!loading && <div>{gptResponse}</div>} */}
        {messagesArray.length > 1 && (
          <Box fz="l" maw={520} mx="auto">
            {messagesArray.map((message, index) => (
              <>
                {message.role === 'user' && (
                  <Grid mt={35}>
                    <Grid.Col span={1}>
                      <IconMicrophone size={25} />
                    </Grid.Col>
                    <Grid.Col span={11}>
                      <Text fw={700}>{message.content}</Text>
                    </Grid.Col>
                  </Grid>
                )}
                {message.role === 'system' && (
                  <Grid>
                    <Grid.Col span={1}>
                      <IconRobot size={25} />
                    </Grid.Col>
                    <Grid.Col span={11}>
                      <Text>{message.content}</Text>
                    </Grid.Col>
                  </Grid>
                )}
              </>
            ))}
          </Box>
        )}
      </Container>
      <Container size="sm">
        <Center style={{ height: 200 }}>
          {!loading && (
            <AudioRecorder
              onRecordingComplete={(audioBlob) => whisperRequest(audioBlob)}
            />
          )}
          {loading && <Loader />}
          {!loading && messagesArray.length > 1 && (
            <Button
              variant="gradient"
              radius={100}
              w={40}
              m={20}
              p={0}
              style={{ position: 'absolute', marginLeft: '140px' }}
              disabled={loading}
              loading={loading}
              gradient={{ from: 'indigo', to: 'cyan' }}
              onClick={() => {
                setMessagesArray([defaultContextSchema]);
              }}
              title="Start Over"
            >
              <IconRefresh size={25} />
            </Button>
          )}
        </Center>
      </Container>
    </>
  );
}
