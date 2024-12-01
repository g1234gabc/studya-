import { useState } from 'react';
import { 
  Container, 
  Title, 
  Button, 
  Text, 
  Paper, 
  Stack,
  Select,
  Textarea,
  Box,
  Loader,
  Alert,
  TypographyStylesProvider,
  Grid,
  Collapse,
  Group
} from '@mantine/core';
import { IconBrain, IconSend, IconBook2, IconAlertCircle, IconNote } from '@tabler/icons-react';
import { askQuestion } from '../services/api';
import { NoteEditor } from './Notes/NoteEditor';

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Literature',
  'Computer Science',
  'General'
];

export function StudyAI() {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('General');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState<string>();
  const [showNoteEditor, setShowNoteEditor] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await askQuestion(subject, question);
      setAnswer(response.answer);
      setSessionId(response.sessionId);
      setShowNoteEditor(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAnswer('');
      setSessionId(undefined);
    }
    setLoading(false);
  };

  return (
    <Container size="lg" py="xl">
      <Stack spacing="xl">
        <Title
          order={1}
          size="h1"
          sx={(theme) => ({
            fontFamily: theme.fontFamily,
            color: theme.colors.blue[6]
          })}
          align="center"
        >
          <IconBrain size={40} style={{ marginRight: 10 }} />
          StudyAI Assistant
        </Title>

        <Paper shadow="sm" radius="md" p="md">
          <Stack spacing="md">
            <Select
              label="Select Subject"
              placeholder="Choose the subject"
              data={subjects}
              value={subject}
              onChange={(value) => setSubject(value || 'General')}
              icon={<IconBook2 size={16} />}
            />

            <Textarea
              placeholder="Enter your question or homework problem here..."
              label="Your Question"
              value={question}
              onChange={(e) => setQuestion(e.currentTarget.value)}
              minRows={3}
              autosize
            />

            <Button
              onClick={handleSubmit}
              leftIcon={<IconSend size={16} />}
              loading={loading}
              disabled={!question.trim()}
              fullWidth
            >
              Get Help
            </Button>
          </Stack>
        </Paper>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>
        )}

        {(answer || loading) && (
          <Grid>
            <Grid.Col span={showNoteEditor ? 8 : 12}>
              <Paper shadow="sm" radius="md" p="md">
                <Stack spacing="md">
                  <Group position="apart">
                    <Text size="sm" weight={500} color="dimmed">
                      Answer:
                    </Text>
                    {answer && (
                      <Button
                        variant="light"
                        size="xs"
                        leftIcon={<IconNote size={14} />}
                        onClick={() => setShowNoteEditor(!showNoteEditor)}
                      >
                        {showNoteEditor ? 'Hide Notes' : 'Take Notes'}
                      </Button>
                    )}
                  </Group>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                      <Loader />
                    </Box>
                  ) : (
                    <TypographyStylesProvider>
                      <div dangerouslySetInnerHTML={{ __html: answer.replace(/\n/g, '<br/>') }} />
                    </TypographyStylesProvider>
                  )}
                </Stack>
              </Paper>
            </Grid.Col>

            {answer && (
              <Grid.Col span={showNoteEditor ? 4 : 0}>
                <Collapse in={showNoteEditor}>
                  <NoteEditor
                    studySessionId={sessionId}
                    onNoteSaved={() => setShowNoteEditor(false)}
                  />
                </Collapse>
              </Grid.Col>
            )}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
