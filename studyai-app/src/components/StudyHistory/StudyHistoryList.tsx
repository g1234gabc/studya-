import { useEffect, useState } from 'react';
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Button,
  Timeline,
  ScrollArea,
} from '@mantine/core';
import { IconBook2, IconNotes, IconCalendar } from '@tabler/icons-react';
import axios from 'axios';

interface StudySession {
  _id: string;
  subject: string;
  question: string;
  answer: string;
  notes: Note[];
  createdAt: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
}

export function StudyHistoryList() {
  const [history, setHistory] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/study-history', {
        withCredentials: true,
      });
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching study history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Loading study history...</Text>;
  }

  return (
    <Paper shadow="sm" radius="md" p="md">
      <Title order={2} mb="md">
        Study History
      </Title>
      <ScrollArea h={400}>
        <Timeline active={history.length} bulletSize={24} lineWidth={2}>
          {history.map((session) => (
            <Timeline.Item
              key={session._id}
              bullet={<IconBook2 size={12} />}
              title={
                <Group position="apart">
                  <Text weight={500}>{session.subject}</Text>
                  <Badge color="blue" size="sm">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </Badge>
                </Group>
              }
            >
              <Stack spacing="xs" mt="xs">
                <Text size="sm" color="dimmed">
                  Question: {session.question}
                </Text>
                <Text size="sm">Answer: {session.answer}</Text>
                {session.notes.length > 0 && (
                  <Stack spacing={5}>
                    <Text size="sm" weight={500}>
                      Notes:
                    </Text>
                    {session.notes.map((note) => (
                      <Paper
                        key={note._id}
                        withBorder
                        p="xs"
                        radius="sm"
                        bg="gray.0"
                      >
                        <Text size="sm" weight={500}>
                          {note.title}
                        </Text>
                        <Text size="sm">{note.content}</Text>
                        <Group spacing={5} mt={5}>
                          {note.tags.map((tag) => (
                            <Badge
                              key={tag}
                              size="sm"
                              variant="outline"
                              color="gray"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Timeline.Item>
          ))}
        </Timeline>
      </ScrollArea>
    </Paper>
  );
}
