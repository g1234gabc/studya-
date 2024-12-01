import { useState } from 'react';
import {
  Paper,
  TextInput,
  Textarea,
  Button,
  Stack,
  MultiSelect,
  Group,
} from '@mantine/core';
import { IconNote, IconTags } from '@tabler/icons-react';
import axios from 'axios';

interface NoteEditorProps {
  studySessionId?: string;
  onNoteSaved?: () => void;
}

export function NoteEditor({ studySessionId, onNoteSaved }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3000/api/notes',
        {
          title,
          content,
          tags,
          studySessionId,
        },
        { withCredentials: true }
      );
      setTitle('');
      setContent('');
      setTags([]);
      onNoteSaved?.();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <Paper shadow="sm" radius="md" p="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <TextInput
            label="Title"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            icon={<IconNote size={14} />}
            required
          />

          <Textarea
            label="Content"
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
            minRows={4}
            autosize
            required
          />

          <MultiSelect
            label="Tags"
            placeholder="Add tags"
            data={[...customTags, ...tags]}
            value={tags}
            onChange={setTags}
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              setCustomTags((current) => [...current, query]);
              return query;
            }}
            icon={<IconTags size={14} />}
          />

          <Group position="right">
            <Button type="submit">Save Note</Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
